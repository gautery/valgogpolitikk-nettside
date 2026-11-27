"""Lønnsmottakeren med skatt, matmoms, bensin og fagforeningsfradrag.
Skriver public/data/typetilfeller/<år>.json, som siden /statsbudsjett/partiene/lonnsmottaker leser.
Kjør fra denne mappa: python3 bygg.py"""
import json
from pathlib import Path
from regn import skatt_lonn, regler_for

AAR, LONN = 2026, 600_000
r = json.load(open(f"regler{AAR}.json", encoding="utf-8"))
a = json.load(open(f"avgifter{AAR}.json", encoding="utf-8"))
f, g = a["forbruk"], a["grunnlag"]
liter = f["bil_km"] / 10 * f["bil_liter_per_mil"]
base = skatt_lonn(LONN, regler_for(r))

def moms(belop, fra, til):  # prisendring når momsen går fra «fra» til «til» og hele endringen havner i prisen
    return belop * ((1 + til) / (1 + fra) - 1)

partier = []
for pid, p in r["partier"].items():
    av = a["partier"].get(pid, {})
    skatt = skatt_lonn(LONN, regler_for(r, pid)) - base
    mat = 0.0
    if "matmoms_alle" in av: mat += moms(f["mat_og_drikke"], g["matmoms"], av["matmoms_alle"])
    for k in av.get("matmoms_0", []): mat += moms(f[k], g["matmoms"], 0.0)
    for k in av.get("matmoms_25", []): mat += moms(f[k], g["matmoms"], 0.25)
    bil = av.get("bensin_kr_per_liter", 0) * liter
    fag = (g["fagforeningsfradrag"] - av["fagforeningsfradrag"]) * r["grunnlag"]["alminnelig_sats"] if "fagforeningsfradrag" in av else 0.0
    partier.append({
        "id": pid, "navn": p["navn"],
        "skatt": round(skatt),
        "mat": round(mat), "mat_anslag": av.get("mat_sikkerhet") == "anslag",
        "utbetaling": av.get("utbetaling", 0),
        "bil": round(bil), "bil_anslag": av.get("bensin_sikkerhet") == "anslag",
        "fagforening": round(fag),
        "merknader": [m for m in (p.get("merknad"), av.get("merknad")) if m],
        "kilder": [k for k in dict.fromkeys([p.get("kilde"), av.get("kilde")]) if k],
    })
ut = {
    "aar": AAR, "lonn": LONN, "skatt_regjeringen": round(base),
    "forutsetninger": {"mat": f["mat_og_drikke"], "km": f["bil_km"], "liter": round(liter), "fagforeningsfradrag": g["fagforeningsfradrag"]},
    "kilder": [r["grunnlag"]["kilde"], f["kilde"], g["kilde"]],
    "partier": partier,
    "mangler": [{"navn": "Rødt", "tekst": r["mangler"]["rodt"]}],
}
mappe = Path(__file__).resolve().parents[2] / "public" / "data" / "typetilfeller"
mappe.mkdir(parents=True, exist_ok=True)
(mappe / f"{AAR}.json").write_text(json.dumps(ut, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")

def vis(tittel, bil, fag):
    print(f"\n{tittel}")
    rader = sorted(((p["skatt"] + p["mat"] + p["utbetaling"] + (p["bil"] if bil else 0) + (p["fagforening"] if fag else 0), p) for p in partier), key=lambda x: x[0])
    for s, p in rader:
        print(f"  {p['navn']:8s} {s:>+8,d}   (skatt {p['skatt']:+,d}, mat {p['mat']:+,d}, utbetaling {p['utbetaling']:+,d}" + (f", bil {p['bil']:+,d}" if bil else "") + (f", fagforening {p['fagforening']:+,d}" if fag else "") + ")")
print(f"Lønn {LONN:,} kr. Skatt med regjeringens forslag: {base:,.0f} kr. Bil: {liter:.0f} liter bensin i året.")
vis("Uten bil, ikke fagorganisert", False, False); vis("Med bil, ikke fagorganisert", True, False); vis("Uten bil, fagorganisert", False, True); vis("Med bil og fagorganisert", True, True)
