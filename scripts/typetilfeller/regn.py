"""Typetilfeller: skatt med regjeringens forslag og med hvert partis alternative budsjett.
Regler og kilder ligger i regler<år>.json. Kjør: python3 regn.py regler2026.json"""
import json, sys, copy

def trinnskatt(inntekt, trinn):
    s = 0.0
    for i, (grense, sats) in enumerate(trinn):
        neste = trinn[i + 1][0] if i + 1 < len(trinn) else float("inf")
        if inntekt > grense:
            s += (min(inntekt, neste) - grense) * sats
    return s

def skatt_lonn(lonn, r):
    mf = min(lonn * r["minstefradrag_lonn"]["sats"], r["minstefradrag_lonn"]["maks"])
    alm = max(0.0, lonn - mf - r["personfradrag"]) * r["alminnelig_sats"]
    return max(0.0, alm + trinnskatt(lonn, r["trinnskatt"]) + lonn * r["trygdeavgift_lonn"] - r["skattefradrag_arbeid"])

def skatt_pensjon(p, r):
    mf = min(p * r["minstefradrag_pensjon"]["sats"], r["minstefradrag_pensjon"]["maks"])
    alm = max(0.0, p - mf - r["personfradrag"]) * r["alminnelig_sats"]
    brutto = alm + trinnskatt(p, r["trinnskatt"]) + p * r["trygdeavgift_pensjon"]
    f = r["pensjonsfradrag"]
    fradrag = f["maks"] - max(0.0, min(p, f["trinn2"][0]) - f["trinn1"][0]) * f["trinn1"][1] - max(0.0, p - f["trinn2"][0]) * f["trinn2"][1]
    return max(0.0, brutto - max(0.0, fradrag) - r["skattefradrag_pensjon"])

def formuesskatt(aksjer, r, annet=0.0):
    f = r["formue"]
    return trinnskatt(aksjer * f["aksjer_verdsettelse"] + annet, f["trinn"])

def regler_for(d, parti=None):
    r = copy.deepcopy(d["grunnlag"])
    if parti: r.update(copy.deepcopy(d["partier"][parti]["endringer"]))
    return r

if __name__ == "__main__":
    d = json.load(open(sys.argv[1], encoding="utf-8"))
    g = regler_for(d)
    tilfeller = [("Lønnsmottaker, 600 000 kr i lønn", lambda r: skatt_lonn(600_000, r)),
                 ("Pensjonist, 350 000 kr i alderspensjon", lambda r: skatt_pensjon(350_000, r)),
                 ("Eier, 100 mill. kr i aksjer (formuesskatt)", lambda r: formuesskatt(100_000_000, r))]
    ut = {"aar": d["aar"], "tilfeller": []}
    for navn, f in tilfeller:
        base = f(g); rad = {"navn": navn, "regjeringen": round(base), "partier": {}}
        print(f"\n{navn}\n  Regjeringens forslag: {base:>12,.0f} kr".replace(",", " "))
        for pid, p in d["partier"].items():
            v = f(regler_for(d, pid)); rad["partier"][pid] = {"skatt": round(v), "endring": round(v - base)}
            print(f"  {p['navn']:8s} {v:>12,.0f} kr   endring {v - base:>+12,.0f} kr".replace(",", " "))
        ut["tilfeller"].append(rad)
    json.dump(ut, open("resultat%d.json" % d["aar"], "w"), ensure_ascii=False, indent=1)
