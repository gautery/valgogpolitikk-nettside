"""Lager tallene til «Trappa til toppen» (public/data/trappa/trappa.json).

To kilder:

1. SSBs skattestatistikk (offisiell statistikk), siste år:
   - tabell 06655: bruttoinntekt etter intervaller og alder (vi bruker 25 år og eldre)
   - tabell 07006: bruttoinntekt etter fine intervaller helt opp til «7,5 mill. og over»
     med gjennomsnitt i hvert intervall. Brukes til å dele opp toppen.
   Herfra regner vi ut hvor grensene går (median, topp 10, 1, 0,1 og 0,01 prosent),
   og hvor stor andel som tjener mindre enn et gitt beløp (kalkulatoren).

2. Vestad (2024), «Utviklingen i inntektsulikhet i perioden 2016–2022», SSB Rapporter 2024/32,
   laget på oppdrag fra Finansdepartementet. Vedlegg C, figur C.1 og C.2: personlig bruttoinntekt
   for personer 25 år og eldre, med og uten eiernes andel av tilbakeholdt overskudd i aksjeselskaper.
   Rapporten har ikke tabeller, så tallene er lest ut av vektorgrafikken i PDF-en (punktenes
   koordinater mot akseinndelingen). Samme metode på figur 3.2 gir nøyaktig tallene
   Finansdepartementet selv oppgir i Nasjonalbudsjettet 2027, figur 6.18 (topp 1 prosent av
   markedsinntekt: 9,5/20,1 i 2016 og 9,9/23,0 i 2022), så avlesningen er kontrollert.

Kjør:  python3 scripts/trappa.py
"""

import json
import math
import os
import urllib.request

AAR = "2024"
UT = os.path.join(os.path.dirname(__file__), "..", "public", "data", "trappa", "trappa.json")
API = "https://data.ssb.no/api/v0/no/table/"


def hent(tabell, query):
    body = json.dumps({"query": query, "response": {"format": "json-stat2"}}).encode()
    req = urllib.request.Request(API + tabell, data=body, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=60) as r:
        d = json.load(r)
    import itertools

    dims = d["id"]
    cats = [list(d["dimension"][k]["category"]["index"].keys()) for k in dims]
    return {combo: d["value"][i] for i, combo in enumerate(itertools.product(*cats))}


# ── 1. Offisiell statistikk ─────────────────────────────────────

t06655 = hent(
    "06655",
    [
        {"code": "BruttoInn", "selection": {"filter": "item", "values": ["01", "60", "61", "62", "08", "09", "70", "71", "72", "73"]}},
        {"code": "Alder", "selection": {"filter": "item", "values": ["999D", "17-24"]}},
        {"code": "Kjonn", "selection": {"filter": "item", "values": ["0"]}},
        {"code": "Tid", "selection": {"filter": "item", "values": [AAR]}},
    ],
)
def p25(kode, var):
    """Personer 25 år og eldre = alle aldre minus 17–24 år."""
    return t06655[(kode, "999D", "0", var, AAR)] - t06655[(kode, "17-24", "0", var, AAR)]


# Intervaller fra 06655 (25+): (nedre, øvre, kode)
GROVE = [(0, 100e3, "60"), (100e3, 200e3, "61"), (200e3, 300e3, "62"), (300e3, 400e3, "08"),
         (400e3, 500e3, "09"), (500e3, 750e3, "70"), (750e3, 1e6, "71")]
intervaller = []
for a, b, k in GROVE:
    n = p25(k, "Personar")
    snitt = p25(k, "BruttoInntekt") * 1e6 / n
    intervaller.append([a, b, n, snitt])

# Over 1 mill.: fordel 25+-tallene fra 06655 etter de fine intervallene i 07006 (17+).
# Intervallgrensene leses fra etikettene i metadataene.
with urllib.request.urlopen("https://data.ssb.no/api/v0/no/table/07006", timeout=60) as r:
    meta = json.load(r)
spes = next(v for v in meta["variables"] if v["code"] == "BruttoSpes")
kode_etikett = dict(zip(spes["values"], spes["valueTexts"]))
fin_koder = [k for k in spes["values"] if k not in ("000", "100", "101", "102", "103", "104")]
tf = hent(
    "07006",
    [
        {"code": "BruttoSpes", "selection": {"filter": "item", "values": fin_koder}},
        {"code": "Kjonn", "selection": {"filter": "item", "values": ["0"]}},
        {"code": "Tid", "selection": {"filter": "item", "values": [AAR]}},
    ],
)


def grenser_fra_etikett(t):
    tall = [float(x.replace(" ", "")) for x in t.replace("kr", "").replace("og over", "").split("-")]
    return (tall[0], tall[1] + 1) if len(tall) == 2 else (tall[0], math.inf)


fine = []
for k in fin_koder:
    a, b = grenser_fra_etikett(kode_etikett[k])
    fine.append([a, b, tf[(k, "0", "Personar", AAR)], tf[(k, "0", "Brutto", AAR)]])

for (lo, hi, kode) in [(1e6, 2e6, "72"), (2e6, math.inf, "73")]:
    deler = [f for f in fine if f[0] >= lo and f[1] <= hi]
    skala = p25(kode, "Personar") / sum(f[2] for f in deler)
    for a, b, n, snitt in deler:
        intervaller.append([a, b, n * skala, snitt])

intervaller.sort()
N = sum(i[2] for i in intervaller)
assert abs(N - p25("01", "Personar")) < 5, (N, p25("01", "Personar"))


# Fordeling innen hvert intervall:
#  - lukket intervall: lineær tetthet tilpasset gjennomsnittet (k = helning, begrenset så tettheten ikke blir negativ)
#  - åpent toppintervall: Pareto-fordeling, alfa = snitt / (snitt − nedre grense)
def param(a, b, snitt):
    if math.isinf(b):
        return {"a": a, "b": None, "alfa": snitt / (snitt - a)}
    t = (snitt - a) / (b - a)
    k = max(-2.0, min(2.0, 12 * (t - 0.5)))
    return {"a": a, "b": b, "k": k}


def andel_under_i(p, x):
    if p["b"] is None:
        return 1 - (x / p["a"]) ** (-p["alfa"])
    u = (x - p["a"]) / (p["b"] - p["a"])
    return u + p["k"] * (u * u - u) / 2


tabell = []
for a, b, n, snitt in intervaller:
    p = param(a, b, snitt)
    p["n"] = round(n)
    tabell.append(p)


def andel_under(x):
    under = 0.0
    for p in tabell:
        if p["b"] is not None and x >= p["b"]:
            under += p["n"]
        elif x >= p["a"]:
            under += p["n"] * andel_under_i(p, x)
    return under / N


def grense(topp):
    """Inntekten du må over for å være blant de øverste `topp` (andel, f.eks. 0.01)."""
    lo, hi = 0.0, 1e10
    for _ in range(200):
        mid = (lo + hi) / 2
        if 1 - andel_under(mid) > topp:
            lo = mid
        else:
            hi = mid
    return lo


# ── 2. Forskningen (Vestad 2024, figur C.1 og C.2, år 2022, 25 år og eldre) ──

FORSKNINGSAAR = 2022
SNITT = {"offisiell": 609_160, "med_overskudd": 665_470}  # figur C.1a, 2022-kroner
ANDEL = {  # figur C.2, prosent av all bruttoinntekt
    "topp10": {"offisiell": 27.5, "med_overskudd": 37.1},
    "topp1": {"offisiell": 7.8, "med_overskudd": 18.2},
    "topp01": {"offisiell": 2.6, "med_overskudd": 11.1},
}

trinn = []
for id_, topp, navn in [("median", 0.5, "Halvparten"), ("topp10", 0.10, "De 10 prosent"),
                        ("topp1", 0.01, "Den ene prosenten"), ("topp01", 0.001, "De 0,1 prosent"),
                        ("topp001", 0.0001, "De 0,01 prosent")]:
    g = grense(topp)
    t = {
        "id": id_,
        "topp": topp,
        "navn": navn,
        "grense": round(g, -3) if g < 5e6 else round(g, -5),
        "antall": round(N * topp),
        "anslag": topp < 0.001,  # over toppintervallets nedre grense: Pareto-anslag
    }
    if id_ in ANDEL:
        for m in ("offisiell", "med_overskudd"):
            a = ANDEL[id_][m]
            t[m] = {"andel": a, "snittinntekt": round(a / 100 / topp * SNITT[m], -4)}
    trinn.append(t)

# Medianinntekt 2022 (figur C.1b, 2022-kroner), for veggen.
MEDIAN_2022 = {"offisiell": 513_500, "med_overskudd": 510_800}


# ── 3. Ring, Seim og Zucman (2026), NBER WP 35534 ──────────────
# Tallene er lest ut av vektorgrafikken i PDF-en, samme metode som over.
# Kontroll: de tre delgruppene i figur 9d summerer seg til topp 1 prosent i figur 9b hvert år.

# Figur 9d: andel av «economic income» (inkl. alt overskudd i selskapene), Norge.
RSZ_ANDELER = {  # år: (P99–99,9, P99,9–99,99, topp 0,01)
    2018: (7.55, 4.68, 4.54), 2019: (7.74, 4.99, 5.02), 2020: (8.04, 5.09, 6.46),
}
s_mid = sum(v[1] for v in RSZ_ANDELER.values()) / 3
s_001 = sum(v[2] for v in RSZ_ANDELER.values()) / 3
# Snittet i topp 0,01 delt på snittet i topp 0,1 (gjennomsnitt 2018–2020)
forhold_001 = (s_001 / 0.0001) / ((s_mid + s_001) / 0.001)
topp01 = next(t for t in trinn if t["id"] == "topp01")
snitt_001 = round(topp01["med_overskudd"]["snittinntekt"] * forhold_001, -7)

# Offisiell snittinntekt over grensa for topp 0,01 (Pareto, skattestatistikken for AAR)
topp_iv = next(p for p in tabell if p["b"] is None)
g001 = next(t for t in trinn if t["id"] == "topp001")["grense"]
snitt_001_off = round(g001 * topp_iv["alfa"] / (topp_iv["alfa"] - 1), -6)

# Figur 5a og 5b (Norge, snitt 2018–2020): samlet skattesats og skattbar andel av inntekten.
# Figur 2b: andel av inntekten som blir liggende i selskapene.
FINGRUPPER = [
    # id, navn, omtrent antall personer, skattbar andel, samlet skattesats, holdt igjen i selskaper
    ("p50", "Midt på (50–60 %)", None, 90.7, 47.4, 0.0),
    ("p90", "90–95 %", None, 86.6, 54.4, 1.4),
    ("p95", "95–99 %", None, 82.1, 55.9, 6.7),
    ("p99", "Topp 1–0,1 %", 37_000, 53.6, 46.7, 40.5),
    ("p999", "Topp 0,1–0,01 %", 3_700, 18.5, 32.3, 80.0),
    ("p9999", "Topp 0,01–0,001 %", 370, 7.0, 23.6, 92.6),
    ("p99999", "Topp 0,001–0,0005 %", 20, 4.7, 24.6, 94.7),
    ("p999995", "Topp 0,0005 %", 20, 1.9, 22.2, 97.6),
]

# Figur A12c/d: topp 100-familiene i Kapital 400, 2020.
TOPP100_2020 = {"skatt_av_inntekt": 15.6, "personlig_inntektsskatt": 2.6, "skatt_av_formue": 1.37}
# Figur A17: skattbar formue (skattelistene) som andel av Kapitals anslag, median per familie, 2023.
SKATTBAR_FORMUE_ANDEL = 0.29

# ── 4. Kapital 400 (2026), slik NTB gjenga lista ──────────────
KAPITAL = {"aar": 2026, "samlet_mrd": 2699, "milliardaerer": 518, "rikeste_mrd": 325, "fra_utlandet_andel": 0.6}

data = {
    "aar": int(AAR),
    "forskningsaar": FORSKNINGSAAR,
    "antall": round(N),
    "intervaller": tabell,
    "trinn": trinn,
    "snitt": SNITT,
    "vegg": {
        "median": MEDIAN_2022,
        "topp001": {"med_overskudd": snitt_001, "offisiell": snitt_001_off, "forhold": round(forhold_001, 2)},
    },
    "fingrupper": [
        {"id": i, "navn": n, "antall": a, "skattbar": s, "skattesats": r, "i_selskaper": h}
        for i, n, a, s, r, h in FINGRUPPER
    ],
    "topp100": TOPP100_2020,
    "skattbar_formue_andel": SKATTBAR_FORMUE_ANDEL,
    "kapital": KAPITAL,
    "kilder": [
        {"navn": f"SSB, tabell 06655 og 07006: Bruttoinntekt etter intervaller ({AAR})",
         "lenke": "https://www.ssb.no/statbank/table/07006/"},
        {"navn": "Vestad (2024): Utviklingen i inntektsulikhet i perioden 2016–2022. SSB Rapporter 2024/32",
         "lenke": "https://www.ssb.no/inntekt-og-forbruk/inntekt-og-formue/artikler/utviklingen-i-inntektsulikhet-i-perioden-20162022"},
        {"navn": "Aaberge, Modalsli og Vestad (2020): Ulikheten – betydelig større enn statistikken viser. SSB analyse 2020/13",
         "lenke": "https://www.ssb.no/inntekt-og-forbruk/artikler-og-publikasjoner/ulikheten-betydelig-storre-enn-statistikken-viser"},
        {"navn": "Ring, Seim og Zucman (2026): Personal Holding Companies, Tax Progressivity, and Inequality. NBER Working Paper 35534",
         "lenke": "https://www.nber.org/papers/w35534"},
        {"navn": "Kapital 400 (2026), gjengitt av NTB",
         "lenke": "https://www.tu.no/nyhetsstudio/john-fredriksen-fortsatt-norges-rikeste-formuen-oekte-med-63-milliarder/131999"},
    ],
}

os.makedirs(os.path.dirname(UT), exist_ok=True)
with open(UT, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=1)

print(f"Personer 25+ ({AAR}): {N:,.0f}")
for t in trinn:
    ekstra = ""
    if "offisiell" in t:
        ekstra = (f"  andel {t['offisiell']['andel']} → {t['med_overskudd']['andel']} %"
                  f"  snitt {t['offisiell']['snittinntekt']:,.0f} → {t['med_overskudd']['snittinntekt']:,.0f}")
    print(f"{t['navn']:20s} grense {t['grense']:>12,.0f}  antall {t['antall']:>9,}{' (anslag)' if t['anslag'] else ''}{ekstra}")
for x in (300e3, 500e3, 750e3, 1e6, 2e6, 5e6):
    print(f"  {x:>10,.0f} kr: tjener mer enn {100*andel_under(x):.1f} %")
print(f"Topp 0,01 %: snitt med overskudd ≈ {snitt_001:,.0f} (forhold {forhold_001:.2f} × topp 0,1), offisielt anslag ≈ {snitt_001_off:,.0f}")
