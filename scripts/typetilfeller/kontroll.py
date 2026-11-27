"""Kontroll av regnemotoren mot partienes egne tabeller (budsjettene for 2026)."""
import json, copy
from regn import skatt_lonn, formuesskatt, trinnskatt, regler_for
d = json.load(open("regler2026.json", encoding="utf-8")); g = regler_for(d)

print("1) FrPs tabell «Gjennomsnittlig endring i skatt» (alt. budsjett s. 9). Vi regner en ren lønnsmottaker midt i intervallet.")
frp_tabell = [(200000,249999,-600),(250000,299999,-1800),(300000,349999,-3800),(350000,399999,-4400),(400000,449999,-5000),
              (450000,499999,-5200),(500000,549999,-5400),(550000,599999,-5800),(600000,699999,-6200),(700000,799999,-6600),
              (800000,999999,-6600),(1000000,1999999,-6600),(2000000,2999999,-6600)]
frp = regler_for(d, "frp"); avvik = []
for a, b, fasit in frp_tabell:
    m = (a + b + 1) / 2; v = skatt_lonn(m, frp) - skatt_lonn(m, g); avvik.append(abs(v - fasit))
    print(f"   {a:>9,}–{b:>9,}  FrP: {fasit:>7,}   vår: {v:>8,.0f}   avvik {v - fasit:>+6,.0f}".replace(",", " "))
print(f"   Største avvik: {max(avvik):.0f} kr, snitt {sum(avvik)/len(avvik):.0f} kr. FrP runder til nærmeste 200.\n")

print("2) Venstres eksempler på formuesskatt (alt. budsjett tabell 27, s. 80).")
def venstre_metode(formue, bunn, sats1, tillegg2):
    # Venstres eksempler legger bunnfradraget oppå innslagspunktet for trinn 2
    return max(0, formue - bunn) * sats1 + max(0, formue - 21_500_000 - bunn) * tillegg2
eks = [("Eks. 1: bolig 15 mill. + hytte", lambda aks: 10e6*0.25 + 5e6*0.70 + 300000*0.30, 34560, -7340),
       ("Eks. 2: bolig 10, bank 2, aksjer 3 mill.", lambda aks: 10e6*0.25 + 2e6 + 3e6*aks, 39150, -10850),
       ("Eks. 3: aksjer 50 mill.", lambda aks: 50e6*aks, 317250, -80350),
       ("Eks. 4: aksjer 250 mill.", lambda aks: 250e6*aks, 1857250, -300350),
       ("Eks. 5: sekundærbolig 100 mill., aksjer 1 mrd., bank 100 mill.", lambda aks: 100e6 + 1000e6*aks + 100e6, 9609500, -1160000)]
for navn, f, sum_v, endr_v in eks:
    for0 = venstre_metode(f(0.80), 1_900_000, 0.010, 0.001); etter = venstre_metode(f(0.70), 2_250_000, 0.009, 0.002)
    print(f"   {navn:58s} Venstre: {sum_v:>10,} ({endr_v:>+10,})   vår: {etter:>10,.0f} ({etter-for0:>+10,.0f})".replace(",", " "))
print("   Treffer når vi bruker Venstres forutsetninger: bunnfradrag 2,25 mill. og trinn 2 fra 21,5 mill. over bunnfradraget.")
lov = trinnskatt(50e6*0.8, g["formue"]["trinn"]); print(f"   Etter skattevedtaket § 2-1 blir skatten i dag for eks. 3 {lov:,.0f} kr, mot Venstres {317250+80350:,} kr.\n".replace(",", " "))

print("3) SVs tabell (alt. budsjett s. 75): endring i inntekts- og formuesskatt, og herav formuesskatt.")
sv_tabell = [(300000,349999,-4800,200),(350000,399999,-5600,200),(400000,449999,-5600,400),(450000,499999,-5400,400),
             (500000,549999,-5400,400),(550000,599999,-5200,800),(600000,699999,-5400,600),(700000,799999,-5000,800),(800000,999999,-1400,1400)]
sv = regler_for(d, "sv")
for a, b, tot, formue in sv_tabell:
    m = (a + b + 1) / 2; v = skatt_lonn(m, sv) - skatt_lonn(m, g)
    print(f"   {a:>9,}–{b:>9,}  SV uten formuesskatt: {tot - formue:>7,}   vår (ren lønn): {v:>8,.0f}".replace(",", " "))
print("   SVs tall er snitt for alle i gruppa, også dem med utbytte, pensjon og blandet inntekt. Vår gjelder en ren lønnsmottaker.")
