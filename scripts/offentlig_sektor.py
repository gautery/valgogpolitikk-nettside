"""
Lager datafila til siden /offentlig-sektor.

Kilder (begge hentes automatisk):
  - SSB statistikkbanken:
      tabell 14669  Offentlig forvaltnings utgifter etter art og formål
      tabell 14668  Offentlig forvaltnings inntekter og utgifter etter art (kontantstønader, brukerbetalinger)
      tabell 09189  Makroøkonomiske hovedstørrelser (BNP for Fastlands-Norge)
  - Eurostat:
      nama_10_gdp   Offentlig individuelt konsum (P31_S13), husholdningenes konsum (P31_S14_S15),
                    offentlig kollektivt konsum (P32_S13) og BNP (B1GQ)
      gov_10a_main  Kontantytelser fra det offentlige (D62PAY), prosent av BNP

Gruppering av offentlige utgifter (tabell 14669, stat og kommune samlet):
  - Overføringer       = stønader i kontanter til husholdningene (art B6), alle formål
  - Velferdstjenester  = helse (07), utdanning (09) og sosial beskyttelse (10), minus B6 i disse formålene
  - Fellesgoder        = alminnelig tjenesteyting (01, uten bistand 012 og renter 017), forsvar (02, uten
                         Ukraina-støtten 023), orden og trygghet (03), næring og samferdsel (04), miljø (05),
                         bolig og nærmiljø (06), kultur (08, minus B6)
  - Annet              = bistand (012), støtte til Ukraina (023) og renter (017)

Offentlig betalt andel av husholdningenes faktiske forbruk (Eurostat, «actual individual consumption»):
  P31_S13 / (P31_S13 + P31_S14_S15). Målet påvirkes ikke av oljen i BNP.

Kjør:  python3 scripts/offentlig_sektor.py
"""

from __future__ import annotations

import datetime as dt
import itertools
import json
import urllib.request
from pathlib import Path

ROT = Path(__file__).resolve().parent.parent
UT = ROT / "public" / "data" / "offentlig-sektor" / "offentlig-sektor.json"

AAR = "2025"
SSB = "https://data.ssb.no/api/v0/no/table/"
EUROSTAT = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/"

LAND = {
    "NO": "Norge", "SE": "Sverige", "DK": "Danmark", "FI": "Finland", "NL": "Nederland", "IE": "Irland",
    "BE": "Belgia", "FR": "Frankrike", "AT": "Østerrike", "DE": "Tyskland", "PL": "Polen", "ES": "Spania",
    "IT": "Italia", "EU27_2020": "EU-snitt",
}
NORDEN = {"NO", "SE", "DK", "FI"}


def jsonstat(raw: dict) -> dict[tuple, float]:
    """Gjør JSON-stat 2.0 om til {(kategori, kategori, …): verdi}."""
    ids = raw["id"]
    kat = []
    for k in ids:
        idx = raw["dimension"][k]["category"]["index"]
        kat.append(sorted(idx, key=lambda c: idx[c]) if isinstance(idx, dict) else idx)
    verdier = raw["value"]
    ut = {}
    for i, kombo in enumerate(itertools.product(*kat)):
        v = verdier.get(str(i)) if isinstance(verdier, dict) else verdier[i]
        if v is not None:
            ut[kombo] = v
    return ut


def ssb(tabell: str, utvalg: dict[str, list[str]]) -> dict[tuple, float]:
    sporring = {
        "query": [{"code": k, "selection": {"filter": "item", "values": v}} for k, v in utvalg.items()],
        "response": {"format": "json-stat2"},
    }
    req = urllib.request.Request(
        SSB + tabell, data=json.dumps(sporring).encode(), headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        return jsonstat(json.load(r))


def eurostat(datasett: str, parametre: str) -> dict[tuple, float]:
    with urllib.request.urlopen(f"{EUROSTAT}{datasett}?{parametre}", timeout=60) as r:
        return jsonstat(json.load(r))


# Noen av SSBs navn er gjort enklere eller rettet. Alle andre navn er SSBs egne.
NAVN = {
    "Arbeidsløshetsstønader": "Dagpenger",
    "FoU Ffritid, kultur og religion": "FoU fritid, kultur og religion",
}


def mrd(mill: float) -> float:
    return round(mill / 1000, 1)


def main() -> None:
    # ── SSB: utgifter etter art og formål ─────────────────────────
    meta14669 = json.load(urllib.request.urlopen(SSB + "14669", timeout=60))
    fvar = next(v for v in meta14669["variables"] if v["code"] == "Formaal")
    formaalnavn = dict(zip(fvar["values"], fvar["valueTexts"]))
    u = ssb("14669", {"Sektor": ["C_OFF"], "Art": ["E", "B6", "B7"], "Formaal": fvar["values"], "Tid": [AAR]})

    def g(art: str, f: str) -> float:
        return u.get(("C_OFF", art, f, "Belop", AAR), 0.0)

    totalt = g("E", "0")
    overforinger = g("B6", "0")
    helse = g("E", "07") - g("B6", "07")
    utdanning = g("E", "09") - g("B6", "09")
    sosial = g("E", "10") - g("B6", "10")
    forvaltning = g("E", "01") - g("E", "012") - g("E", "017")
    forsvar = g("E", "02") - g("E", "023")
    orden = g("E", "03")
    naering = g("E", "04")
    miljo_bolig = g("E", "05") + g("E", "06")
    kultur = g("E", "08") - g("B6", "08")
    annet = g("E", "012") + g("E", "023") + g("E", "017")
    velferd = helse + utdanning + sosial
    fellesgoder = forvaltning + forsvar + orden + naering + miljo_bolig + kultur
    assert abs(overforinger + velferd + fellesgoder + annet - totalt) < 5, "Gruppene summerer ikke til totalen"

    def under(*foreldre: str, minus: tuple[str, ...] = (), uten_kontanter: bool = False) -> list[dict]:
        """Underformål (ett siffer mer) med SSBs navn, sortert etter størrelse."""
        ut = []
        for f, navn in formaalnavn.items():
            if f[:-1] in foreldre and len(f) == len(foreldre[0]) + 1 and f not in minus:
                v = g("E", f) - (g("B6", f) if uten_kontanter else 0)
                if v >= 50:  # under 50 mill. kr vises ikke
                    ut.append({"navn": NAVN.get(navn, navn), "mrd": mrd(v), "kode": f})
        return sorted(ut, key=lambda p: -p["mrd"])

    # ── SSB: kontantstønader, brukerbetalinger og kommunenes inntekter ─
    m14668 = json.load(urllib.request.urlopen(SSB + "14668", timeout=60))
    avar = next(v for v in m14668["variables"] if v["code"] == "Art")
    artnavn = dict(zip(avar["values"], avar["valueTexts"]))
    arter = ["B611", "B612", "B613", "B62", "B621", "B622", "B623", "B624", "B625", "B629", "B63", "B631", "B632",
             "B633", "B64", "B65", "B651", "B652", "B655", "B656", "B659", "B66", "A611"]
    k = ssb("14668", {"Art": arter, "Sektor": ["C_OFF"], "Tid": [AAR]})
    kk = {a: k.get((a, "C_OFF", "Belop", AAR), 0.0) for a in arter}

    def arter_under(*koder: str) -> list[dict]:
        ut = [{"navn": NAVN.get(artnavn[a], artnavn[a]), "mrd": mrd(kk[a]), "kode": a} for a in koder if kk[a] >= 50]
        return sorted(ut, key=lambda p: -p["mrd"])

    kom_arter = ["A", "A1", "A27", "A5", "A611", "A612", "A62", "A711"]
    km = ssb("14668", {"Art": kom_arter, "Sektor": ["6500"], "Tid": [AAR]})
    kom = {a: km.get((a, "6500", "Belop", AAR), 0.0) for a in kom_arter}

    # ── SSB: BNP for Fastlands-Norge ──────────────────────────────
    b = ssb("09189", {"Makrost": ["bnpb.nr23_9fn"], "ContentsCode": ["Priser"], "Tid": [AAR]})
    fbnp = b[("bnpb.nr23_9fn", "Priser", AAR)]

    # ── Eurostat ──────────────────────────────────────────────────
    geo = "&".join(f"geo={c}" for c in LAND)
    n = eurostat("nama_10_gdp", f"unit=CP_MEUR&na_item=P31_S13&na_item=P32_S13&na_item=P31_S14_S15&na_item=B1GQ&{geo}&time={AAR}")
    gv = eurostat("gov_10a_main", f"unit=PC_GDP&sector=S13&na_item=D62PAY&{geo}&time={AAR}")
    land = []
    for kode, navn in LAND.items():
        ind = n[("A", "CP_MEUR", "P31_S13", kode, AAR)]
        hush = n[("A", "CP_MEUR", "P31_S14_S15", kode, AAR)]
        bnp = n[("A", "CP_MEUR", "B1GQ", kode, AAR)]
        kol = n[("A", "CP_MEUR", "P32_S13", kode, AAR)]
        land.append({
            "kode": kode,
            "navn": navn,
            "norden": kode in NORDEN,
            "offentlig_betalt_andel": round(ind / (ind + hush) * 100, 1),
            "fellesgoder_pst_bnp": round(kol / bnp * 100, 1),
            "kontantytelser_pst_bnp": gv.get(("A", "PC_GDP", "S13", "D62PAY", kode, AAR)),
        })
    eu = next(l for l in land if l["kode"] == "EU27_2020")
    land = sorted((l for l in land if l["kode"] != "EU27_2020"), key=lambda l: -l["offentlig_betalt_andel"])

    data = {
        "aar": int(AAR),
        "hentet": dt.date.today().isoformat(),
        "totalt_mrd": mrd(totalt),
        "fastlands_bnp_mrd": mrd(fbnp),
        "andel_av_fastlands_bnp": round(totalt / fbnp * 100, 1),
        "typer": [
            {"id": "overforinger", "navn": "Overføringer", "mrd": mrd(overforinger)},
            {"id": "velferd", "navn": "Velferdstjenester", "mrd": mrd(velferd)},
            {"id": "fellesgoder", "navn": "Fellesgoder", "mrd": mrd(fellesgoder)},
            {"id": "annet", "navn": "Annet", "mrd": mrd(annet)},
        ],
        "overforinger": [
            {"navn": "Alderspensjon", "mrd": mrd(kk["B611"])},
            # SSB kaller posten «Uførepensjoner». Den er for det meste uføretrygd fra folketrygden,
            # pluss uførepensjon fra offentlige tjenestepensjonsordninger.
            {"navn": "Uføretrygd", "mrd": mrd(kk["B612"])},
            {"navn": "Sykepenger, AAP, dagpenger og foreldrepenger", "mrd": mrd(kk["B62"]),
             "deler": arter_under("B621", "B622", "B623", "B624", "B625", "B629")},
            {"navn": "Barnetrygd og kontantstøtte", "mrd": mrd(kk["B63"]), "deler": arter_under("B631", "B632", "B633")},
            {"navn": "Sosialhjelp, bostøtte mv.", "mrd": mrd(kk["B65"]),
             "deler": arter_under("B651", "B652", "B655", "B656", "B659")},
            {"navn": "Utdanningsstipend", "mrd": mrd(kk["B64"])},
            {"navn": "Andre pensjoner og stønader", "mrd": mrd(kk["B613"] + kk["B66"])},
        ],
        "velferd": [
            {"navn": "Helse", "mrd": mrd(helse), "deler": under("07", uten_kontanter=True)},
            {"navn": "Utdanning", "mrd": mrd(utdanning), "deler": under("09", uten_kontanter=True)},
            {"navn": "Omsorg, barnehage og andre sosiale tjenester", "mrd": mrd(sosial),
             "deler": under("10", uten_kontanter=True)},
        ],
        "brukerbetalinger_mrd": mrd(kk["A611"]),
        "fellesgoder": [
            {"navn": "Næring og samferdsel", "mrd": mrd(naering), "deler": under("04")},
            {"navn": "Sentral og lokal forvaltning", "mrd": mrd(forvaltning), "deler": under("01", minus=("012", "017"))},
            {"navn": "Forsvar (uten Ukraina-støtten)", "mrd": mrd(forsvar), "deler": under("02", minus=("023",))},
            {"navn": "Kultur og fritid", "mrd": mrd(kultur), "deler": under("08", uten_kontanter=True)},
            {"navn": "Politi, domstoler, fengsler og brannvesen", "mrd": mrd(orden), "deler": under("03")},
            {"navn": "Miljø, bolig og nærmiljø", "mrd": mrd(miljo_bolig), "deler": under("05", "06")},
        ],
        "kommunene": {
            "inntekter_mrd": mrd(kom["A"]),
            "fra_staten_mrd": mrd(kom["A711"]),
            "egne_mrd": mrd(kom["A"] - kom["A711"]),
            "poster": sorted([
                {"navn": "Inntekts- og formuesskatt", "mrd": mrd(kom["A1"])},
                {"navn": "Salgsinntekter", "mrd": mrd(kom["A62"])},
                {"navn": "Gebyrer (vann, avløp, renovasjon mv.)", "mrd": mrd(kom["A612"])},
                {"navn": "Utbytte og renter", "mrd": mrd(kom["A5"])},
                {"navn": "Eiendomsskatt", "mrd": mrd(kom["A27"])},
                {"navn": "Brukerbetaling", "mrd": mrd(kom["A611"])},
            ], key=lambda p: -p["mrd"]) + [
                {"navn": "Annet", "mrd": mrd(kom["A"] - kom["A711"] - kom["A1"] - kom["A62"] - kom["A612"] - kom["A5"]
                                             - kom["A27"] - kom["A611"])},
            ],
        },
        "naeringsstotte_mrd": mrd(g("B7", "04")),
        "land": land,
        "eu": eu,
        "kilder": [
            {"navn": "SSB tabell 14669: Offentlig forvaltnings utgifter etter art og formål", "lenke": "https://www.ssb.no/statbank/table/14669"},
            {"navn": "SSB tabell 14668: Offentlig forvaltnings inntekter og utgifter", "lenke": "https://www.ssb.no/statbank/table/14668"},
            {"navn": "SSB tabell 09189: Makroøkonomiske hovedstørrelser", "lenke": "https://www.ssb.no/statbank/table/09189"},
            {"navn": "Eurostat nama_10_gdp: BNP og konsum", "lenke": "https://ec.europa.eu/eurostat/databrowser/view/nama_10_gdp/default/table"},
            {"navn": "Eurostat gov_10a_main: Offentlige inntekter og utgifter", "lenke": "https://ec.europa.eu/eurostat/databrowser/view/gov_10a_main/default/table"},
            {"navn": "Eurostat: Actual individual consumption (ordforklaring)", "lenke": "https://ec.europa.eu/eurostat/statistics-explained/index.php?title=Glossary:Actual_individual_consumption_(AIC)"},
        ],
    }
    UT.parent.mkdir(parents=True, exist_ok=True)
    UT.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Skrev {UT.relative_to(ROT)}: totalt {data['totalt_mrd']} mrd., {data['andel_av_fastlands_bnp']} % av fastlands-BNP")
    for t in data["typer"]:
        print(f"  {t['navn']}: {t['mrd']} mrd.")


if __name__ == "__main__":
    main()
