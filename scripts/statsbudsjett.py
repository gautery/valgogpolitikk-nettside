"""
Lager datafilene til siden /statsbudsjett.

Kilder:
  - DFØ, bevilgningshistorikk (statsregnskapet.no): vedtatt (saldert) budsjett
    på kapittel- og postnivå for hvert år fra 2014. Lastes ned automatisk.
  - Finansdepartementet, tallgrunnlag for Gul bok: regjeringens forslag.
    Last ned Excel-filen fra regjeringen.no/no/statsbudsjett/<år>/ («Tallgrunnlag
    (Gul bok)») og legg den i data/statsbudsjett/raa/<år>-gulbok.xlsx.

Regnemåte (samme som Finansdepartementet bruker for «statsbudsjettet utenom
petroleumsvirksomheten og lånetransaksjoner»):
  - Utgifter: kapittel 1–2999, uten post 90–99 (lån, aksjer),
    uten kap. 2440 (statens petroleumsvirksomhet) og kap. 2800 (overføring til oljefondet).
  - Inntekter: kapittel 3000–5999, uten post 90–99, uten petroleumsinntektene
    (kap. 5440, 5507, 5508, 5509, 5685) og uten kap. 5800 (overføring fra oljefondet).
  - Overføringen fra oljefondet = utgiftene minus inntektene. For vedtatte budsjett
    kontrolleres den mot kap. 5800 post 50.

Kjør:  python3 scripts/statsbudsjett.py
"""

from __future__ import annotations

import csv
import io
import json
import re
import sys
import urllib.request
import zipfile
from collections import defaultdict
from pathlib import Path

ROT = Path(__file__).resolve().parent.parent
RAA = ROT / "data" / "statsbudsjett" / "raa"
UT = ROT / "public" / "data" / "statsbudsjett"
DFO_URL = "https://statsregnskapet.dfo.no/nedlasting/bevilgninger_full_historikk.zip"

PETROLEUM_UTGIFT = {2440, 2800}
PETROLEUM_INNTEKT = {5440, 5507, 5508, 5509, 5685, 5800}

# Grupper for inntektssiden (kapittelnummer -> gruppe). Resten havner i «Andre inntekter».
def inntektsgruppe(kap: int) -> str:
    if kap in (5501, 5502):
        return "Skatt på inntekt og formue"
    if kap == 5700:
        return "Trygdeavgift og arbeidsgiveravgift"
    if kap == 5521:
        return "Merverdiavgift"
    if 5503 <= kap <= 5599:
        return "Andre avgifter og toll"
    if 5600 <= kap <= 5699:
        return "Renter og utbytte"
    return "Andre inntekter"


def tall(s: str) -> float:
    s = (s or "").strip().replace(" ", "")
    if not s:
        return 0.0
    return float(s.replace(",", "."))


def hent_dfo() -> list[dict]:
    fil = RAA / "bevilgninger_full_historikk.zip"
    RAA.mkdir(parents=True, exist_ok=True)
    if "--ny" in sys.argv or not fil.exists():
        print("Laster ned bevilgningshistorikk fra DFØ …")
        req = urllib.request.Request(DFO_URL, headers={"User-Agent": "valgogpolitikk.no"})
        fil.write_bytes(urllib.request.urlopen(req, timeout=120).read())
    with zipfile.ZipFile(fil) as z:
        navn = [n for n in z.namelist() if n.endswith(".csv")][0]
        tekst = z.read(navn).decode("cp1252")
    return list(csv.DictReader(io.StringIO(tekst), delimiter=";"))


def post_fra_dfo(r: dict) -> dict:
    return {
        "kap": int(r["Kapittel_id"]),
        "post": int(r["Post_id"][-2:]),
        "kap_navn": r["Kapittel"].strip(),
        "post_navn": r["Post"].strip(),
        "omr_id": r["Programområde_id"],
        "omr": r["Programområde"].strip(),
        "kat_id": r["Programkategori_id"],
        "kat": r["Programkategori"].strip(),
        "dep": r["Fagdepartement"].strip(),
    }


def lag_budsjett(poster: list[dict], meta: dict) -> dict:
    """poster: [{kap, post, ..., belop}] der belop er positivt for både utgifter og inntekter."""
    utgifter, inntekter = [], []
    for p in poster:
        if p["post"] >= 90 or abs(p["belop"]) < 1:
            continue
        if p["kap"] < 3000:
            if p["kap"] in PETROLEUM_UTGIFT:
                continue
            utgifter.append(p)
        else:
            if p["kap"] in PETROLEUM_INNTEKT:
                continue
            inntekter.append({**p, "gruppe": inntektsgruppe(p["kap"])})

    sum_ut = sum(p["belop"] for p in utgifter)
    sum_inn = sum(p["belop"] for p in inntekter)
    fra_fondet = sum_ut - sum_inn

    def rund(liste):
        return [
            {**{k: v for k, v in p.items() if k != "belop"}, "b": round(p["belop"] / 1e6, 1)}
            for p in sorted(liste, key=lambda x: (x["kap"], x["post"]))
        ]

    return {
        **meta,
        "enhet": "mill. kr",
        "sum_utgifter": round(sum_ut / 1e6, 1),
        "sum_inntekter": round(sum_inn / 1e6, 1),
        "fra_oljefondet": round(fra_fondet / 1e6, 1),
        "utgifter": rund(utgifter),
        "inntekter": rund(inntekter),
    }


def vedtatte(rader: list[dict]) -> dict[int, list[dict]]:
    per_aar: dict[int, dict[tuple, dict]] = defaultdict(dict)
    for r in rader:
        if not re.search(r"Saldert budsjett", r["Bevilgning"]):
            continue
        aar = int(r["År"])
        p = post_fra_dfo(r)
        nokkel = (p["kap"], p["post"])
        belop = tall(r["Bevilgning_beløp"])
        belop = -belop if p["kap"] >= 3000 else belop  # inntekter er negative hos DFØ
        if nokkel in per_aar[aar]:
            per_aar[aar][nokkel]["belop"] += belop
        else:
            per_aar[aar][nokkel] = {**p, "belop": belop}
    return {aar: list(d.values()) for aar, d in per_aar.items()}


def les_gulbok(aar: int, katalog: dict) -> list[dict] | None:
    """Leser Gul bok-tallgrunnlaget (Excel, arket «Data»). Beløp er i kroner."""
    fil = RAA / f"{aar}-gulbok.xlsx"
    if not fil.exists():
        return None
    import openpyxl  # pip install openpyxl

    wb = openpyxl.load_workbook(fil, read_only=True, data_only=True)
    ws = wb["Data"] if "Data" in wb.sheetnames else wb.worksheets[-1]
    rader = ws.iter_rows(values_only=True)
    hode = [str(c).strip().lower() for c in next(rader)]
    belop_kol = next(k for k in hode if k.startswith("bel"))
    poster: dict[tuple, dict] = {}
    for rad in rader:
        d = dict(zip(hode, rad))
        if d.get("kap_nr") in (None, "") or d.get("post_nr") in (None, ""):
            continue
        kap, post = int(d["kap_nr"]), int(d["post_nr"])
        belop = float(d.get(belop_kol) or 0)
        tekst = lambda k: str(d.get(k) or "").strip()
        if d.get("omr_nr") not in (None, ""):
            omr_id = f"{int(d['omr_nr']):02d}"
            kat_id = f"{int(d['omr_nr']):02d}{int(d['kat_nr'] or 0):02d}"
            omr, kat = tekst("omr_navn"), tekst("kat_navn")
        else:
            kjent = katalog.get(kap, {})
            omr_id, omr = kjent.get("omr_id", "99"), kjent.get("omr", "Annet")
            kat_id, kat = kjent.get("kat_id", "9999"), kjent.get("kat", "Annet")
        nokkel = (kap, post)
        if nokkel in poster:
            poster[nokkel]["belop"] += belop
            continue
        poster[nokkel] = {
            "kap": kap,
            "post": post,
            "kap_navn": tekst("kap_navn"),
            "post_navn": tekst("post_navn"),
            "omr_id": omr_id,
            "omr": omr,
            "kat_id": kat_id,
            "kat": kat,
            "dep": tekst("fdep_navn") or tekst("gdep_navn"),
            "belop": belop,
        }
    return list(poster.values()) or None


def main() -> int:
    UT.mkdir(parents=True, exist_ok=True)
    rader = hent_dfo()
    vedtatt = vedtatte(rader)

    # Kapittel -> formål, fra nyeste år (brukes for Gul bok, som mangler formål).
    katalog: dict[int, dict] = {}
    for aar in sorted(vedtatt):
        for p in vedtatt[aar]:
            katalog[p["kap"]] = {k: p[k] for k in ("omr_id", "omr", "kat_id", "kat", "dep")}

    oversikt = []
    kontroll = []
    for aar, poster in sorted(vedtatt.items()):
        b = lag_budsjett(
            poster,
            {
                "id": f"{aar}-vedtatt",
                "aar": aar,
                "versjon": "vedtatt",
                "tittel": f"Vedtatt budsjett {aar}",
                "kilde": "DFØ, bevilgningshistorikk (saldert budsjett)",
                "kilde_lenke": "https://statsregnskapet.dfo.no/last-ned",
            },
        )
        kap5800 = sum(p["belop"] for p in poster if p["kap"] == 5800 and p["post"] == 50) / 1e6
        kontroll.append((aar, b["fra_oljefondet"], round(kap5800, 1)))
        (UT / f"{b['id']}.json").write_text(json.dumps(b, ensure_ascii=False, separators=(",", ":")))
        oversikt.append({k: b[k] for k in ("id", "aar", "versjon", "tittel", "sum_utgifter", "sum_inntekter", "fra_oljefondet")})

    for aar in range(2024, 2040):
        gb = les_gulbok(aar, katalog)
        if not gb:
            continue
        b = lag_budsjett(
            gb,
            {
                "id": f"{aar}-forslag",
                "aar": aar,
                "versjon": "forslag",
                "tittel": f"Regjeringens forslag {aar}",
                "kilde": "Finansdepartementet, tallgrunnlag for Gul bok",
                "kilde_lenke": f"https://www.regjeringen.no/no/statsbudsjett/{aar}/",
            },
        )
        (UT / f"{b['id']}.json").write_text(json.dumps(b, ensure_ascii=False, separators=(",", ":")))
        oversikt.append({k: b[k] for k in ("id", "aar", "versjon", "tittel", "sum_utgifter", "sum_inntekter", "fra_oljefondet")})

    # Historikk per formål og kapittel, til sammenligning mellom år.
    historikk: dict = {"formal": {}, "kapittel": {}}
    for o in oversikt:
        b = json.loads((UT / f"{o['id']}.json").read_text())
        nokkel = o["id"]
        for p in b["utgifter"]:
            historikk["formal"].setdefault(p["omr_id"], {"navn": p["omr"], "verdier": {}})
            v = historikk["formal"][p["omr_id"]]["verdier"]
            v[nokkel] = round(v.get(nokkel, 0) + p["b"], 1)
            historikk["kapittel"].setdefault(str(p["kap"]), {"navn": p["kap_navn"], "verdier": {}})
            v = historikk["kapittel"][str(p["kap"])]["verdier"]
            v[nokkel] = round(v.get(nokkel, 0) + p["b"], 1)

    oversikt.sort(key=lambda o: (o["aar"], o["versjon"] != "forslag"))
    (UT / "oversikt.json").write_text(json.dumps(oversikt, ensure_ascii=False, indent=1))
    (UT / "historikk.json").write_text(json.dumps(historikk, ensure_ascii=False, separators=(",", ":")))

    print("Kontroll: overføring fra oljefondet, utregnet mot kap. 5800 post 50 (mill. kr)")
    for aar, utregnet, vedtatt5800 in kontroll:
        avvik = utregnet - vedtatt5800
        print(f"  {aar}: {utregnet:>12,.1f}  {vedtatt5800:>12,.1f}  avvik {avvik:,.1f}")
    print(f"Skrev {len(oversikt)} budsjetter til {UT}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
