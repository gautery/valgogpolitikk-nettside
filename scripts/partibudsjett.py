"""Partienes forslag til statsbudsjett, område for område.

Leser tabellen «Oversikt over partienes forslag til rammevedtak» (kap. 3.2) i finansinnstillingen
(Innst. 2 S) og skriver public/data/partibudsjett/<år>.json. Alle beløp er i 1 000 kroner, som i kilden.

Bruk:
  pip install pymupdf
  python3 scripts/partibudsjett.py <innstilling.pdf> <budsjettår> <første side> <siste side> <lenke til kilden>

Skriptet stopper hvis tallene ikke stemmer med seg selv: ramme minus Gul bok skal være lik avviket i hver
celle, og summen av områdene skal være lik sumlinja for hvert parti.
"""
import json
import re
import sys
from pathlib import Path

import pymupdf

pdf, aar, s1, s2, lenke = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]), sys.argv[5]

# Kolonnenavn i kilden -> id, kortnavn og fullt navn. «A, Sp og R» er flertallets innstilling, ikke ett parti.
PARTIER = {
    "FrP": ("frp", "FrP", "Fremskrittspartiet"),
    "H": ("hoyre", "Høyre", "Høyre"),
    "SV": ("sv", "SV", "Sosialistisk Venstreparti"),
    "R": ("rodt", "Rødt", "Rødt"),
    "MDG": ("mdg", "MDG", "Miljøpartiet De Grønne"),
    "KrF": ("krf", "KrF", "Kristelig Folkeparti"),
    "V": ("venstre", "Venstre", "Venstre"),
    "Sp": ("sp", "Sp", "Senterpartiet"),
}
# Korte navn og hva området i hovedsak dekker. «retning» sier hvordan avviket skal leses:
#   utgift:  pluss = partiet vil bruke mer enn regjeringen
#   skatt:   pluss i kilden = lavere skatter og avgifter (mindre inntekt)
#   inntekt: pluss i kilden = mindre inntekt
#   netto:   området har både store utgifter og inntekter
OMRADER = {
    1: ("statsforvaltning", "Statsforvaltning", "", "utgift"),
    2: ("familie", "Familie, forbruker, kirke og trossamfunn", "", "utgift"),
    3: ("kultur", "Kultur og likestilling", "", "utgift"),
    4: ("utenriks", "Utenriks", "bistand og utenrikstjeneste", "utgift"),
    5: ("justis", "Justis", "", "utgift"),
    6: ("innvandring-distrikt-bolig", "Innvandring, regional utvikling og bolig", "", "utgift"),
    7: ("arbeid-og-sosial", "Arbeid og sosial", "trygd, pensjon og Nav", "utgift"),
    8: ("forsvar", "Forsvar", "", "utgift"),
    9: ("naering", "Næring", "", "utgift"),
    10: ("fiskeri", "Fiskeri", "", "utgift"),
    11: ("landbruk", "Landbruk", "", "utgift"),
    12: ("olje-og-energi", "Olje og energi", "", "netto"),
    13: ("miljo", "Miljø", "", "utgift"),
    14: ("kontroll-og-konstitusjon", "Kontroll og konstitusjon", "", "utgift"),
    15: ("helse", "Helse", "", "utgift"),
    16: ("utdanning-og-forskning", "Utdanning og forskning", "", "utgift"),
    17: ("transport", "Transport og kommunikasjon", "", "utgift"),
    18: ("kommunene", "Kommunene", "rammeoverføringer til kommuner og fylker", "utgift"),
    19: ("tilfeldige-utgifter", "Tilfeldige utgifter og inntekter", "reserve for uforutsette utgifter", "netto"),
    20: ("stortinget-og-finans", "Stortinget og finansadministrasjon", "", "utgift"),
    21: ("skatter-og-avgifter", "Skatter og avgifter", "", "skatt"),
    22: ("utbytte", "Utbytte fra statens selskaper", "", "inntekt"),
}

d = pymupdf.open(pdf)
linjer = []
for p in range(s1 - 1, s2):
    linjer += [l.strip() for l in d[p].get_text().split("\n")]
slutt = next((k for k, l in enumerate(linjer) if l.startswith("3.3 ")), len(linjer))
linjer = linjer[:slutt]

i0 = linjer.index("Gul bok")
kol = []
for l in linjer[i0 + 1:]:
    if re.match(r"^\d{1,2} \D", l) or "komiteen" in l or l.endswith("-") or "Kommunal" in l:
        break
    kol.append(l)

TALL = re.compile(r"^-?\d[\d ]*$")
AVVIK = re.compile(r"^\(([+-]?[\d ]+)\)$")
tall = lambda s: int(s.replace(" ", ""))

rader, i = [], 0
while i < len(linjer):
    l = linjer[i]
    m = re.match(r"^(\d{1,2}) (\D.*)$", l)
    if m or l.startswith("Sum før lånetransaksjoner"):
        nr = int(m.group(1)) if m else 0
        navn = m.group(2) if m else l
        i += 1
        while not TALL.match(linjer[i]):
            navn = (navn[:-1] if navn.endswith("-") else navn + " ") + linjer[i]
            i += 1
        gul = tall(linjer[i]); i += 1
        celler = []
        while len(celler) < len(kol):
            a = AVVIK.match(linjer[i + 1])
            assert a, f"Fant ikke avvik for {navn}: {linjer[i:i + 2]}"
            celler.append((tall(linjer[i]), tall(a.group(1)))); i += 2
        rader.append((nr, re.sub(r"\s+", " ", navn).strip(), gul, celler))
        continue
    i += 1

sumrad = next(r for r in rader if r[0] == 0)
omr = [r for r in rader if r[0] > 0]
assert [r[0] for r in omr] == list(range(1, len(omr) + 1)), "Mangler et rammeområde"
for nr, navn, gul, celler in rader:
    for k, (ramme, avvik) in zip(kol, celler):
        assert ramme - gul == avvik, f"Ramme minus Gul bok er ikke lik avviket: {nr} {navn} {k}"
assert sum(r[2] for r in omr) == sumrad[2], "Gul bok summerer seg ikke"
for j, k in enumerate(kol):
    assert sum(r[3][j][1] for r in omr) == sumrad[3][j][1], f"Avvikene summerer seg ikke for {k}"

partikol = [k for k in kol if k in PARTIER]
flertall = [k for k in kol if k not in PARTIER]
assert len(flertall) <= 1, f"Ukjente kolonner: {flertall}"
ut = {
    "aar": aar,
    "kilde": f"Innst. 2 S ({aar - 1}–{aar}), kapittel 3.2",
    "kilde_lenke": lenke,
    "enhet": "1000 kroner",
    "flertall": flertall[0] if flertall else None,
    "partier": [dict(id=PARTIER[k][0], kort=PARTIER[k][1], navn=PARTIER[k][2]) for k in partikol],
    "omrader": [],
    "sum": {
        "gul_bok": sumrad[2],
        "avvik": {PARTIER[k][0]: sumrad[3][kol.index(k)][1] for k in partikol},
        "flertall": sumrad[3][kol.index(flertall[0])][1] if flertall else None,
    },
}
for nr, navn, gul, celler in omr:
    slug, kort, dekker, retning = OMRADER[nr]
    ut["omrader"].append({
        "nr": nr, "slug": slug, "navn": kort, "navn_kilde": navn, "dekker": dekker, "retning": retning,
        "gul_bok": gul,
        "avvik": {PARTIER[k][0]: celler[kol.index(k)][1] for k in partikol},
        "flertall": celler[kol.index(flertall[0])][1] if flertall else None,
    })
mappe = Path(__file__).resolve().parent.parent / "public" / "data" / "partibudsjett"
mappe.mkdir(parents=True, exist_ok=True)
(mappe / f"{aar}.json").write_text(json.dumps(ut, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
print(f"Skrev {aar}.json: {len(omr)} områder, {len(partikol)} partier. Alle summer stemmer med kilden.")
