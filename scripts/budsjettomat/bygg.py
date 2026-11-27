"""Lager datafila til budsjettomaten: public/data/budsjettomat/<år>.json.
Tar bare med spørsmål med status «ferdig», og sjekker at hvert av dem har en plassering for alle partiene.
Kjør fra denne mappa: python3 bygg.py"""
import json, sys
AAR = int(sys.argv[1]) if len(sys.argv) > 1 else 2027
d = json.load(open(f"saker{AAR}.json", encoding="utf-8"))
ider = [p["id"] for p in d["partier"]]
ferdige = [s for s in d["sporsmal"] if s["status"] == "ferdig"]
for s in ferdige:
    verdier = {v["verdi"] for v in s["valg"]}
    assert 0 in verdier, (s["id"], "mangler valget «som regjeringen»")
    assert set(s["partier"]) <= set(ider), (s["id"], set(s["partier"]) - set(ider))
    for i in ider:
        p = s["partier"].setdefault(i, {"verdi": None, "tekst": ""})
        assert p["verdi"] is None or -1 <= p["verdi"] <= 1, (s["id"], i)
        assert p["verdi"] in (0, None) or p["tekst"], (s["id"], i, "mangler tekst")
    del s["status"]
ut = {"aar": AAR, "innbyggere_mill": d["innbyggere_mill"], "partier": d["partier"], "kilder": d["kilder"], "sporsmal": ferdige,
      "ikke_med": [s["tittel"] for s in d["sporsmal"] if s.get("status") == "delvis"]}
json.dump(ut, open(f"../../public/data/budsjettomat/{AAR}.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(f"{len(ferdige)} spørsmål ferdige, {len(ut['ikke_med'])} gjenstår:", ", ".join(ut["ikke_med"]))
