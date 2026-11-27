"""Lønnsmottakeren med skatt, matmoms, bensin og fagforeningsfradrag.
Skriver public/data/typetilfeller/<år>.json, som siden /statsbudsjett/partiene/lonnsmottaker leser.
Kjør fra denne mappa: python3 bygg.py [år]. Uten år brukes 2027."""
import json, sys
from pathlib import Path
from regn import skatt_lonn, regler_for

AAR, LONN = (int(sys.argv[1]) if len(sys.argv) > 1 else 2027), 600_000
r = json.load(open(f"regler{AAR}.json", encoding="utf-8"))
a = json.load(open(f"avgifter{AAR}.json", encoding="utf-8"))
w = json.load(open(f"velferd{AAR}.json", encoding="utf-8"))
wg = w["grunnlag"]
SATS = r["grunnlag"]["alminnelig_sats"]
f, g = a["forbruk"], a["grunnlag"]
liter = f["bil_km"] / 10 * f["bil_liter_per_mil"]
base = skatt_lonn(LONN, regler_for(r))

def moms(belop, fra, til):  # prisendring når momsen går fra «fra» til «til» og hele endringen havner i prisen
    return belop * ((1 + til) / (1 + fra) - 1)

def barnehagepris(mnd_pris, antall):
    """Det husholdningen betaler i året. Barn nummer to får søskenmoderasjon."""
    aar = mnd_pris * wg["barnehage_maaneder"]
    return aar * (1 if antall >= 1 else 0) + aar * (1 - wg["soskenmoderasjon_barn2"]) * (1 if antall >= 2 else 0)

def foreldrefradrag(regel, utgifter, barn):
    if barn == 0 or regel == "ingen": return 0.0
    if "uten_krav_barn_1_og_2" in regel:
        return regel["uten_krav_barn_1_og_2"] * min(barn, 2) + regel["uten_krav_fra_barn_3"] * max(0, barn - 2)
    return min(utgifter, regel["forste"] + regel["neste"] * (barn - 1))

def barn_og_tannlege(wp, av):
    """Gevinst i kroner per år (pluss = bedre råd) for hver kombinasjon av barn og alder."""
    ut = {"barn": [], "tannlege": {}}
    for bhg in (0, 1, 2):
        rad = []
        for sfo in (0, 1):
            barn = bhg + sfo
            u0 = barnehagepris(wg["barnehage_makspris_mnd"], bhg) + wg["sfo_4_klasse_aar"] * sfo
            u1 = barnehagepris(wp.get("barnehage_makspris_mnd", wg["barnehage_makspris_mnd"]), bhg) + wp.get("sfo_4_klasse_aar", wg["sfo_4_klasse_aar"]) * sfo
            f0 = foreldrefradrag(wg["foreldrefradrag"], u0, barn)
            f1 = foreldrefradrag(wp.get("foreldrefradrag", wg["foreldrefradrag"]), u1, barn)
            rad.append({
                "barnehage": round(barnehagepris(wg["barnehage_makspris_mnd"], bhg) - barnehagepris(wp.get("barnehage_makspris_mnd", wg["barnehage_makspris_mnd"]), bhg)),
                "sfo": round((wg["sfo_4_klasse_aar"] - wp.get("sfo_4_klasse_aar", wg["sfo_4_klasse_aar"])) * sfo),
                "barnetrygd": round(wp.get("barnetrygd_aar", 0) * barn),
                "utbetaling": round(av.get("utbetaling_per_barn", 0) * barn),
                "foreldrefradrag": round((f1 - f0) * SATS),
            })
        ut["barn"].append(rad)
    pris = wg["tannlege_full_pris"]
    ut["tannlege"] = {
        "21-28": round((wg["tannlege_egenandel_21_28"] - wp.get("tannlege_egenandel_21_28", wg["tannlege_egenandel_21_28"])) * pris),
        "29-30": round(wp.get("tannlege_rabatt_29_30", 0) * pris),
        "31+": 0,
    }
    return ut

partier = []
for pid, p in r["partier"].items():
    av = a["partier"].get(pid, {})
    skatt = skatt_lonn(LONN, regler_for(r, pid)) - base
    mat = 0.0
    if "matmoms_alle" in av: mat += moms(f["mat_og_drikke"], g["matmoms"], av["matmoms_alle"])
    for k in av.get("matmoms_0", []): mat += moms(f[k], g["matmoms"], 0.0)
    for k in av.get("matmoms_25", []): mat += moms(f[k], g["matmoms"], 0.25)
    mat += av.get("mat_tillegg_kr", 0)  # særavgifter på mat og drikke, anslått i kroner per person
    bil = av.get("bensin_kr_per_liter", 0) * liter
    fag = (g["fagforeningsfradrag"] - av["fagforeningsfradrag"]) * r["grunnlag"]["alminnelig_sats"] if "fagforeningsfradrag" in av else 0.0
    wp = w["partier"].get(pid, {})
    bt = barn_og_tannlege(wp, av)
    # Alle tall er gevinst for husholdningen i kroner per år: pluss betyr bedre råd.
    partier.append({
        "id": pid, "navn": p["navn"],
        "skatt": -round(skatt), "skatt_anslag": p.get("sikkerhet") == "anslag",
        "mat": -round(mat), "mat_anslag": av.get("mat_sikkerhet") == "anslag",
        "utbetaling": av.get("utbetaling", 0) if AAR >= 2027 else -av.get("utbetaling", 0),
        "utbetaling_navn": av.get("utbetaling_navn", "Utbetaling"), "utbetaling_anslag": AAR < 2027,
        "bil": -round(bil), "bil_anslag": av.get("bensin_sikkerhet") == "anslag",
        "fagforening": -round(fag),
        "barn": bt["barn"], "barnetrygd_anslag": bool(wp.get("barnetrygd_anslag")),
        "tannlege": bt["tannlege"],
        "merknader": [m for m in (p.get("merknad"), av.get("merknad"), wp.get("merknad")) if m],
        "kilder": [k for k in dict.fromkeys([p.get("kilde"), av.get("kilde"), wp.get("kilde")]) if k],
    })
ut = {
    "aar": AAR, "lonn": LONN, "skatt_regjeringen": round(base),
    "forutsetninger": {"mat": f["mat_og_drikke"], "km": f["bil_km"], "liter": round(liter), "fagforeningsfradrag": g["fagforeningsfradrag"],
                       "barnehage_mnd": wg["barnehage_makspris_mnd"], "barnehage_aar": wg["barnehage_makspris_mnd"] * wg["barnehage_maaneder"],
                       "soskenmoderasjon": wg["soskenmoderasjon_barn2"], "sfo_aar": wg["sfo_4_klasse_aar"], "barnetrygd_mnd": wg["barnetrygd_mnd"],
                       "tannlege": wg["tannlege_full_pris"], "tannlege_egenandel_21_28": wg["tannlege_egenandel_21_28"]},
    "kilder": [r["grunnlag"]["kilde"], f["kilde"], g["kilde"], wg["kilde"]],
    "partier": partier,
    "merk": r.get("merk") or [{"tittel": "Rødt mangler.", "tekst": r["mangler"]["rodt"]}],
}
mappe = Path(__file__).resolve().parents[2] / "public" / "data" / "typetilfeller"
mappe.mkdir(parents=True, exist_ok=True)
(mappe / f"{AAR}.json").write_text(json.dumps(ut, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")

def sum_for(p, bil=False, fag=False, bhg=0, sfo=0, alder="31+"):
    b = p["barn"][bhg][sfo]
    return (p["skatt"] + p["mat"] + p["utbetaling"] + (p["bil"] if bil else 0) + (p["fagforening"] if fag else 0)
            + b["barnehage"] + b["sfo"] + b["barnetrygd"] + b["utbetaling"] + b["foreldrefradrag"] + p["tannlege"][alder])

def vis(tittel, **valg):
    print(f"\n{tittel}")
    for s_, p in sorted(((sum_for(p, **valg), p) for p in partier), key=lambda x: -x[0]):
        b = p["barn"][valg.get("bhg", 0)][valg.get("sfo", 0)]
        print(f"  {p['navn']:8s} {s_:>+8,d}   barnehage {b['barnehage']:+,d}, SFO {b['sfo']:+,d}, barnetrygd {b['barnetrygd']:+,d}, foreldrefradrag {b['foreldrefradrag']:+,d}, tannlege {p['tannlege'][valg.get('alder','31+')]:+,d}".replace(",", " "))

if __name__ == "__main__":
    print(f"{AAR}. Lønn {LONN} kr, skatt med regjeringens forslag {base:,.0f} kr. Pluss betyr bedre råd enn med regjeringens forslag.".replace(",", " "))
    for p in partier: print(f"  {p['navn']:8s} skatt {p['skatt']:+6d}  mat {p['mat']:+6d}  utbetaling {p['utbetaling']:+6d}  bil {p['bil']:+6d}  fagforening {p['fagforening']:+6d}")
    vis("Bensinbil og fagorganisert, ingen barn", bil=True, fag=True)
    vis("Ingen barn, 31 år eller eldre")
    vis("Ett barn i barnehage", bhg=1)
    vis("To barn i barnehage og ett i 4. klasse på SFO", bhg=2, sfo=1)
    vis("Ingen barn, 21–28 år", alder="21-28")
    vis("Ingen barn, 29–30 år", alder="29-30")
