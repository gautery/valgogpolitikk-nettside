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
