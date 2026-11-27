# Overlevering: Grunnkurs i ulikhet

Skrevet 27. november 2026. Tillegg til `docs/overlevering.md`, som har arbeidsreglene og det tekniske oppsettet.
Dette notatet dekker bare grunnkurset, feiringssiden og Datawrapper-grafene.

## Arbeidsregler som gjelder kurset

- **Gautes egen tekst skal stå ordrett.** Han skriver om leksjonene med sin egen stemme. Rett bare åpenbare feil
  (skrivefeil, tall som ikke stemmer med kilden), og si fra om alt annet som forslag.
- **De beste tallene med en gang.** Bruk tall der overskudd som blir stående i selskapene er regnet med, så langt
  de finnes. Ikke oppgi offisielle tall først for så å rette dem. Merk hvilke tall som er med og uten.
- **Offisiell statistikk** omtales bare i én notis nederst på siden, ikke gjennomgående.
- **Ingen internasjonal sammenligning** utenom skatt (leksjon 7). Hold det enkelt.
- **Les hele fila før du sier at noe mangler.** Sjekk med `git show <commit>` hva en lagring fra Pages CMS faktisk endret.

## Oppbygging

Alle sidene ligger i `content/sider/` og har `utkast: true`.

| Nr. | Fil | Graf | Status på teksten |
|---|---|---|---|
| Oversikt | `grunnkurs-i-ulikhet.md` | | Gautes egen innledning |
| 1 | `inntektsfordelingen-i-norge.md` | `69Erh` | Skrevet om av Gaute |
| 2 | `har-inntektsulikheten-okt.md` | `krafw` | Delvis skrevet om av Gaute |
| 3 | `formuesfordelingen-i-norge.md` | `YpzU3` | Claudes utkast |
| 4 | `har-formuesulikheten-okt.md` | `kbfVb` | Claudes utkast |
| 5 | `hvor-mye-skatt-vil-nordmenn-at-de-rike-skal-betale.md` | `Xplnc`, `Oo9nN` | Gautes egen tekst |
| 6 | `skatt-etter-inntekt-i-norge.md` | `dFq7w` | Gautes egen tekst |
| 7 | `skatt-pa-de-rike-i-andre-land.md` | `2obCo` | Claudes utkast |
| 8 | `hva-koster-lav-skatt-pa-de-rikeste.md` | | Claudes utkast |
| Feiring | `grunnkurset-fullfort.md` | | Ferdig, se under |
| Påbygging 1 | `holdingselskap-og-utsatt-skatt.md` | `ulURW` | Claudes utkast |
| Påbygging 2 | `privat-forbruk-i-selskaper.md` | | Bare stikkord. På vent, minn Gaute på den |

Grafene ligger som feltet «Graf fra Datawrapper» inne i en tekstseksjon (`graf:` og `grafBeskrivelse:`), ikke som
egne seksjoner. Gaute vet hvor feltet er. Grafen `zGyMB` (2002–2020) er ikke lenger i bruk.

## Kilder og tall

Studiene ligger på Gautes PC i `C:\Users\Samsung\Prosjekter\valgogpolitikk-kilder\`.

- **Inntekt, lang serie 1875–2000:** SSB Discussion Papers 928 (Aaberge, Atkinson og Modalsli). Uten overskudd i
  selskapene. Tallene i grafen `krafw` er lest av figur A10 som snittet av øvre og nedre anslag, og er omtrentlige.
- **Inntekt 2001–2018:** SSB analyse 2020/13 (Aaberge, Modalsli og Vestad). Tallene er hentet fra figur 3 på ssb.no.
- **Inntekt 2016–2022:** SSB Rapporter 2024/32 (Vestad). Samme inntektsmål som 2020/13. 2022: de 10 prosent rikeste
  46 prosent, den rikeste prosenten 23 prosent, de 0,1 prosent rikeste 14 prosent.
- **SSB Rapporter 2021/33** har et bredere mål med bolig (den rikeste prosenten: 15 prosent i 2018). Brukes bare
  for andelen eierinntekt i leksjon 1. Boligseksjonene er tatt ut av leksjon 1 og 2.
- **Formue:** SSB Discussion Papers 1028.
- **Skatt:** Ring, Seim og Zucman (2026), NBER Working Paper 35534.
- **Finnes ikke:** inntektsgrenser i kroner for å være blant de rikeste. Bare snitt kan regnes ut (rundt 12 mill.
  for den rikeste prosenten, rundt 74 mill. for de 0,1 prosent rikeste i 2022). Ikke lagt inn på siden.

## Uavklart

- **Graftittelen på `krafw`** sier «tilbake på nivået fra for hundre år siden». Den skal være «fra 1880-tallet»,
  som i ingressen. Må rettes i Datawrapper og publiseres på nytt.
- **Leksjon 8:** teksten bruker 108 milliarder (7,6 prosent av statens skatteinntekter 2025). Karusellen bruker 127.
  Grunnlaget for 127 er ikke kjent.
- **Leksjon 2:** «kanskje var 6-7 prosent» på 80-tallet har ingen kilde. Notisen nederst kan kortes ned.
- **Leksjon 1:** ingressen sier «rundt 1/5», tallet er 23 prosent. Påstanden om små lønnsforskjeller
  internasjonalt har ingen kilde.
- **«Til deg, Gaute»-notater** i leksjon 6 og 8 må slettes før lansering.
- Datafila for den lange grafen (1875–2022) er ikke lagret på Gautes PC.

## Feiringssiden

`/grunnkurset-fullfort` bruker blokken `feiring` (`src/components/Feiring.tsx`): ett skjermbilde med yachtbilde,
konfetti (`Konfetti.tsx`), fyrverkeri (`Fyrverkeri.tsx`), påmelding til nyhetsbrev og knappene «Mer konfetti» og
«Mer fyrverkeri». All animasjon er skjult ved `prefers-reduced-motion`. «Gratulerer!» og bildeteksten er Claudes
forslag.

## Datawrapper

Gjøres i Gautes Chrome (konto «gautery», arbeidsområde `/muwzpeammh/`). Han har godkjent publisering av grafer til kurset.

1. Dupliser en graf fra arkivet (⋮ på kortet, «Duplicate»). Den nye åpnes i en ny fane.
2. `…/edit/<ID>/upload`: klikk i datafeltet, Ctrl+A, skriv inn CSV.
3. `…/visualize#annotate`: sett tittel, beskrivelse, note, kilde og alt-tekst med JavaScript mot `textarea`-feltene.
4. `…/publish`: vent 7–8 sekunder før du klikker «Publish»/«Republish». Sjekk `https://datawrapper.dwcdn.net/<ID>/`
   at versjonsnummeret har økt.

Deleknappene peker på `https://valgogpolitikk.no/<slug>`. Instagram og TikTok kan ikke få deleknapper.

## Feller

- **Valider `.pages.yml` etter hver endring** (`python3 -c "import yaml; yaml.safe_load(open('.pages.yml'))"`).
  En ugyldig linje 26. november gjorde at Pages CMS ikke lastet nye felt, og grafer og knapper forsvant ved lagring.
- **Etter endringer i filer eller felt:** be Gaute laste Pages CMS på nytt før han redigerer.
- **Flere samtaler i samme repo:** hent siste `master` før sammenslåing.

## Formuestallene: gjennomgang 27. november (ikke avklart med Gaute)

Gaute spurte om formuestallene er gode, og om de tar med verdiene som ligger i selskapene. Kildene er lest på nytt.

- **Leksjon 3 og 4 bruker «benchmark»-serien i SSB Discussion Papers 1028:** skattepliktig formue per skatteenhet
  (ektepar eller enslig), 1912–2019. Tabell 1: Gini 0,862 og 37,3 prosent til den rikeste prosenten i 2019.
  Både bolig og unoterte aksjer står til skatteverdi.
- **Det er ikke et «nedre anslag».** Rapporten sier (s. 7–8 og 46) at serien med markedsverdi på bolig er nedre
  grense, fordi unoterte selskaper står til bokført verdi. Markedsverdi på bolig gir lavere ulikhet (Gini 0,66 i
  1995 og 0,70 i 2016), fordi boligen er folk flests formue. Leksjon 3 sier «forsiktig anslag» om 37 prosent, og
  det stemmer ikke med kilden.
- **Med markedsverdi på bolig:** SSB Rapporter 2021/33, figur 3.4: den rikeste prosenten av husholdningene eide
  20 prosent av nettoformuen i 2001 og 22 prosent i 2018. Unoterte aksjer til bokført verdi. Samme nivå i 2024,
  regnet av Claude fra SSBs tall: snitt 85 mill. for den rikeste prosenten (tabell 10318) mot 3,9 mill. for alle.
- **Med markedsverdi også på selskapene finnes bare Gini, ikke andeler:** 2021/33, figur 3.1: 69 med bokført verdi
  i 2018, 82 med kapitalisering (årsresultat delt på fire prosent), og en egen serie justert for Kapital 400 og
  nasjonalregnskapet. SSB Rapporter 2022/31 (Andresen og Bø): unoterte selskaper er undervurdert med en faktor på
  om lag 1,9 mot ligningsverdi, eierne skattlegges for om lag 35 prosent av reell verdi med rabatten i 2022, og
  Gini øker fra 68 til 75 i 2020. SSB Rapporter 2025/21 (Grindaker og Vestad) har verdier for 2011–2022.
- **Forslag:** leksjon 3 bruker 22 prosent som hovedtall og kaller det et nedre anslag, med 1,9-faktoren og
  Gini-tallene som forklaring. Leksjon 4 beholder den lange serien, men sier at den måler skattepliktig formue og
  viser utviklingen, ikke nivået. De to tallene må ikke blandes. Spørre SSB om toppandeler med markedsverdi.

### Oppfølging samme dag: Gautes valg og nye utkast (grein `formue-utkast`, ikke på demoen)

Gaute vil holde på den lange serien (37 prosent) som svaret, og forklare usikkerheten lenger ned. Utkastene er
skrevet om etter det. Han har ikke godkjent teksten.

- **Leksjon 3:** ingressen sier ikke lenger «forsiktig anslag». Nøkkeltallet «1/10» er tatt ut. Ny del
  «To kompliserende faktorer»: selskaper utenfor børs (SSB: rundt en tredjedel av reell verdi i formuesskatten,
  Ring, Seim og Zucman: en tidel) og bolig (rundt en firedel av markedsverdi).
- **Leksjon 4:** «Hvor sikre er tallene?» er byttet ut med «Trenden er likevel tydelig», og setningen om USA har
  fått egen del, «Ligner Norge på USA?».
- **Tall fra DP 1028 som er nye i tekstene:** tabell A.2 (bolig til markedsverdi, «modern data»): den rikeste
  prosenten 15 prosent i 1995 og 19 prosent i 2016, Gini 0,664 og 0,699. Tabell A.1 (skatteverdier): 24 prosent
  i 1995, 37 i 2016. Forskerne skriver selv (s. 35) at økningen i toppandelen er «much lower» med bolig til
  markedsverdi.
- **Tidelen er omstridt.** Ring, Seim og Zucman skriver «only a tenth» i innledningen, uten at utregningen er
  vist der. Tre SSB-rapporter (2022/31, 2022/37, 2025/21) finner at markedsverdien er rundt det dobbelte av
  ligningsverdien, altså rundt 35 prosent av reell verdi med rabatten i 2022. Alle bruker multipler fra
  børsnoterte selskaper. RSZ ble denne gangen lest gjennom søk i PDF-en, ikke side for side.
- **USA:** DP 1028 (kap. 4.1 og s. 46) sammenligner utviklingen, ikke nivået, og sier selv at forskjellen kan
  skyldes data og metode, og at land er vanskelige å rangere.
- **Motstemme å kjenne til:** Mæland og Thorburn (NHH), kronikk i DN 23. juni 2026, «Rikere og likere enn vi
  tror». De mener SSB-serien overdriver fordi bolig og pensjon teller for lite.
- **Ikke gjort:** Datawrapper-grafen i leksjon 3 (`YpzU3`) har en fotnote som sier «nedre anslag». Den må
  rettes. Samme graf viser 20 prosent av inntektene (2020), mens Gautes leksjon 2 nå bruker 23 prosent (2022).

