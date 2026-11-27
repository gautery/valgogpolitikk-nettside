"""Kontroll av regnemotoren mot partienes egne tall (budsjettene for 2027). Kjør: python3 kontroll2027.py"""
import json
from regn import skatt_lonn, regler_for
d = json.load(open("regler2027.json", encoding="utf-8")); g = regler_for(d)
def endring(parti, lonn, **over):
    r = regler_for(d, parti); r.update(over); return skatt_lonn(lonn, r) - skatt_lonn(lonn, g)

print("1) MDGs tabell «Endringer i inntektsskatten på lønnsinntekt» (alt. budsjett s. 76). Tabellen gjelder trinnskatten alene,")
print("   så vi holder trygdeavgiften som i regjeringens forslag.")
mdg = [(300000,-259),(400000,-728),(500000,-1228),(600000,-1728),(700000,-2228),(800000,-2177),(900000,-1477),(1000000,-777),
       (1100000,246),(1200000,1346),(1300000,2446),(1400000,3546),(1500000,4646),(1600000,6561),(1700000,8761),(1800000,10961),(1900000,13161),(2000000,15361)]
avvik = []
for lonn, fasit in mdg:
    v = endring("mdg", lonn, trygdeavgift_lonn=g["trygdeavgift_lonn"]); avvik.append(abs(v - fasit))
    print(f"   {lonn:>9,}  MDG: {fasit:>7,}   vår: {v:>8,.0f}   avvik {v - fasit:>+5,.0f}".replace(",", " "))
print(f"   Største avvik: {max(avvik):.0f} kr.\n")

print("2) Rødts eksempler (alt. budsjett s. 11–12): redusert inntektsskatt.")
for lonn, fasit in [(450000, -5000), (600000, -5800), (650000, -5800)]:
    print(f"   {lonn:>9,}  Rødt: {fasit:>7,}   vår: {endring('rodt', lonn):>8,.0f}".replace(",", " "))
print("   Rødts tabell 2 (snitt, inkludert regjeringens forslag): 400–600 000: −6 300, 600–800 000: −7 000 (uten utbytteskatt).")
print("   Regjeringens egen lettelse er om lag 1 440 kr ved 600 000 kr, så vårt tall for en ren lønnsmottaker tilsvarer −7 100 der.\n")

print("3) SVs tabell (alt. budsjett s. 86): snitt for 550–600 000 kr er −4 012 kr, herav formuesskatt +845 kr.")
print(f"   Uten formuesskatt: −4 857. Vår, ren lønn 575 000: {endring('sv', 575000):,.0f}\n".replace(",", " "))

print("4) FrP (alt. budsjett s. 10): en gjennomsnittlig skattebetaler får 5 800 kr. NTB oppga inntekten til minst 705 000 kr.")
print(f"   Vår, ren lønn 705 000: {endring('frp', 705000):,.0f}\n".replace(",", " "))

print("5) Høyre, KrF og Venstre oppgir skatteletten i kroner. Kontroll mot provenyet (om lag 2,75 mill. personer i arbeid):")
for navn, mill, kr in [("Høyre", 21200, 7700), ("KrF", 7545, 2794), ("Venstre", 13730, 5000)]:
    print(f"   {navn:8s} {mill:>6,} mill. kr / {kr:,} kr = {mill/kr*1000:,.0f} tusen personer".replace(",", " "))
print(f"\n6) Skatt med regjeringens forslag ved 600 000 kr: {skatt_lonn(600000, g):,.0f} kr. Trinnskatt 12 388 og trygdeavgift 44 400 stemmer med andre kalkulatorer.".replace(",", " "))
print("   Regjeringens egen lettelse (trygdeavgift 7,6 → 7,4 og personfradrag utover lønnsvekst):", round(skatt_lonn(600000, {**g, **{k: v for k, v in d['uten_regjeringens_lettelse'].items() if k != 'forklaring'}}) - skatt_lonn(600000, g)), "kr")
