# Overlevering: valgogpolitikk.no

Skrevet 22. november 2026 for å starte en ny samtale. Lim inn denne fila, eller be Claude lese
`docs/overlevering.md` i repoet gautery/valgogpolitikk-nettside.

Alt som er merket **Uavklart** er ikke bestemt. Ikke bygg videre på det uten å spørre Gaute først.

---

## Om Gaute og arbeidsreglene

Gaute driver @valgogpolitikk (Instagram, TikTok, nyhetsbrev på Beehiiv). Han skriver norsk, og svar skal være på norsk.
Han er ikke programmerer, men kan statistikk.

Faste regler:

- **Ikke gjeninnfør tekst eller innhold som er fjernet, og ikke legg til nytt innhold uten å spørre først.**
  Utkast skal merkes som utkast og godkjennes av Gaute.
- **Bruk alltid skillene carousel-design og frontend-design** i produksjon.
- **Hent inspirasjonskilder faktisk**, ikke gjett hva de inneholder.
- **Hemmeligheter** (f.eks. Beehiiv-nøkkelen) legges rett inn i Vercel, aldri i chatten.
- **Lansering:** valgogpolitikk.no viser «kommer snart» til Gaute sier fra. Lanseringen ligger klar på grenen `lansering`
  (se «Lansering» under). Den slås sammen med `master` først når Gaute sier «lanser».
- **90-tallskarusellen:** Gautes egne formuleringer skal stå ordrett.
- **Blokkerte nettsteder:** Hvis et nettsted blokkerer nedlasting (f.eks. regjeringen.no), ikke gå rundt det.
  Be Gaute laste ned og legge ved fila.
- **Navngitte personer** (f.eks. de rikeste på Kapital-lista) skal være et bevisst valg fra Gaute.

## Teknisk oppsett

- **Nettsiden:** repo gautery/valgogpolitikk-nettside, Next.js 16, Vercel, gren `master`.
  Push til `master` gir ny forhåndsvisning på Vercel. Les `node_modules/next/dist/docs/` før kodeendringer
  (se AGENTS.md).
- **Kildeovervåking:** repo gautery/kildeoverv-kning (gren `main`). Henter saker fra kildene i `kilder.yaml`
  og deler dem i tre spor: rapporter, tall og løpende nytt. Civita og Rødt er slått av.
- **Pages CMS** (app.pagescms.org) brukes til redigering. Oppsettet ligger i `.pages.yml`.
- **SSB-data:** statistikkbankens API (data.ssb.no) virker fra arbeidsmiljøet. regjeringen.no gjør det ikke.
- **Tall fra figurer:** Når en rapport bare har tall i figurer, leses de ut av vektorgrafikken i PDF-en
  (PyMuPDF: punktkoordinater mot aksemerkene). Avlesningen kontrolleres alltid mot et kjent tall.

## Sider og status

Alle sidene under er **utkast**, merket som det på siden og skjult for søkemotorer. Ingen er godkjent av Gaute.

### /trappa: «Trappa til toppen» (laget 22. november)

- **Kalkulator:** du skriver inn inntekten din og ser hvor mange som tjener mindre (SSB 2024, 25 år og eldre).
- **Inntektstrappa i riktig målestokk:** snittinntekt med og uten overskuddet i selskapene.
- **Jo rikere, jo mindre i skattemeldingen:** skattbar andel og skattesats helt opp til de rundt 20 øverste.
- **Formue:** tall fra Kapital 400 og en formuestrappa i riktig målestokk (2 millioner kroner per piksel)
  med teller mens man scroller.
- **Forklaringer:** «Hvorfor to tall?» og «Slik er tallene regnet».

Filer:

- Tall: `scripts/trappa.py` lager `public/data/trappa/trappa.json`.
- Tekst: `content/trappa.yml`, som redigeres i Pages CMS under «Trappa til toppen».
  `{ord}` i teksten byttes ut med tall.
- Kode: `src/components/trappa/` (Trappa.tsx og Formuevegg.tsx), `src/lib/trappa*.ts`
  og `src/app/(site)/trappa/page.tsx`.

Kilder og hovedtall:

- **SSB tabell 06655 og 07006 (2024):** grenser for bruttoinntekt. Median 576 000, topp 10 % 1,38 mill.,
  topp 1 % 2,64 mill., topp 0,1 % 8,4 mill. og topp 0,01 % rundt 28 mill. Det siste er et anslag.
- **Vestad (2024), SSB Rapporter 2024/32, figur C.1 og C.2 (år 2022):** andel av all inntekt og snittinntekt.
  - Topp 10 %: 27,5 % → 37,1 % med overskuddet i selskapene.
  - Topp 1 %: 7,8 % → 18,2 %.
  - Topp 0,1 %: 2,6 % → 11,1 %, og snittinntekt 16 → 74 mill.
  - Avlesningen er kontrollert mot Nasjonalbudsjettet 2027, figur 6.18 (stemmer på desimalen).
- **Ring, Seim og Zucman (2026), NBER WP 35534** (ikke fagfellevurdert ennå):
  - Figur 9d: andelene i toppgruppene. De summerer seg til topp 1 % hvert år, som er kontrollen.
  - Figur 5: skattesats og skattbar andel per gruppe.
  - Figur 2: andel av inntekten som blir liggende i selskapene.
  - Figur A12: topp 100-familiene i Kapital 400.
  - Figur A17: skattbar formue er rundt 30 % av Kapitals anslag.
- **Topp 0,01 %:** snittinntekt rundt 340 mill. (snitt 2018–2020). Regnet ut som andelen hos Ring, Seim og Zucman
  × nasjonalinntekten for Fastlands-Norge (SSB) ÷ antall voksne over 20 år.
- **SSB tabell 10318 (2024):** husholdningenes formue. Median 2,0 mill., topp 1 % i snitt 85 mill.,
  topp 0,1 % i snitt 402 mill.
- **Kapital 400 (2026), gjengitt av NTB:** til sammen 2 699 mrd., 518 milliardærer, nr. 1–3: 325, 210 og 84,3 mrd.
  Nær 60 % av verdiene styres helt eller delvis fra utlandet.

Svakheter som står på siden:

- Forskjellige år og inntektsbegreper i de ulike kildene.
- SSB måler husholdninger, mens Kapital måler personer og familier, også de som har flyttet ut.
- Grensa for topp 0,01 % er et anslag.

### Andre sider

- **/statsbudsjett:** hva pengene går til og hvor de kommer fra. Bygger på Gul bok 2027 og vedtatte budsjetter fra DFØ
  (`scripts/statsbudsjett.py`).
- **/skraablikk/rare-ting-90-tallet:** Skråblikk-karusell med forklaringer som rulles ut.
  Forklaringen om KrF mangler et sitat fra Gautes dokumenter.
- **/stromleverandorer:** karusellside. Mangler Instagram-lenke, og påstandene i slide 11 mangler kilder.
- **/tema/skatt:** temaside.
- **/kilder:** kildeoversikten med faner for rapporter, tall og løpende nytt.

## Statistikk og søk (lagt til 25. november)

- **Umami Cloud** teller besøk uten cookies, bare på valgogpolitikk.no (`src/components/Umami.tsx`).
  Gratisplanen lagrer 6 måneder. Gaute får en påminnelse 26. april 2027 om å eksportere dataene.
- **Hendelser i Umami** (`src/lib/hendelser.ts`): `nyhetsbrev-pamelding`, `kalkulator-brukt` (/trappa, én gang
  per besøk, inntekten sendes aldri) og `lenke-ut` (lenker ut fra meny og bunntekst).
- **Datawrapper:** byggeklossen «Graf fra Datawrapper» i Pages CMS viser siste publiserte versjon av grafen.
- **Google Search Console:** domenet er bekreftet med TXT-post hos Gigahost (navnet må være `@`).

## Lansering (grenen `lansering`)

Klar, men ikke slått sammen med `master`:

- `src/proxy.ts` er slettet, så valgogpolitikk.no viser hele siden.
- `src/app/sitemap.ts` og `src/app/robots.ts`: nettstedskart og robots.txt. Utkast er ikke med.
- `next.config.ts`: alle andre adresser enn valgogpolitikk.no (vercel.app, forhåndsvisninger) får `noindex`.
- `src/lib/utkast.ts`: én bryter for /trappa og /statsbudsjett. Sett til `false` når Gaute har godkjent siden.

Gjenstår før lansering: bytte ut eksempelinnleggene (de står i nettstedskartet), fjerne TestBanner og godkjenne
utkastene. Etter lansering sender Gaute inn `https://www.valgogpolitikk.no/sitemap.xml` i Search Console.

## Venter på Gaute

- Godkjenne eller rette utkastene over. Det gjelder særlig tekstene på /trappa.
- Bestemme om de tre rikeste skal stå med navn i formuestrappa (Fredriksen, Hagen, Røkke).
- Logge inn i Pages CMS og gi GitHub-appen tilgang til bare de to repoene.
- Legge Beehiiv-nøklene inn i Vercel og slå på totrinnsinnlogging (Vercel, Gigahost, GitHub).
- Legge inn Instagram-lenker til karusellene og sjekke bilderettigheter for fotoene i slidene.
- Før lansering: bytte ut eksempelinnleggene og fjerne TestBanner. Resten ligger klart på grenen `lansering`.

## Uavklart

- **Innledning til /trappa:** Gaute har en idé til vinkling: «Hvor rike er "de rike"?».
  - Problemet: hvem er de rike, egentlig? Naboen som er elektriker, legen, eller noen få tusen helt på toppen?
  - Kjernen: de to problemene i debatten er at de rike betaler for lite skatt, og at de kan påvirke demokratiet
    uforholdsmessig mye.
  - Claude foreslo en tekst og en oppbygging. Den er **ikke lagt inn**. Gaute vil kanskje skrive den selv.
- **«Skole i ulikhet»:** en serie leksjoner med kilder, der /trappa kan bli én leksjon.
  Neste leksjon blir kanskje «hvor lite de betaler i skatt». Claude foreslo åtte leksjoner, men oppsettet blir
  trolig annerledes:
  1. Hvem er de rike?
  2. Hvor mye skatt betaler de?
  3. Hvordan slipper de unna?
  4. Hvor kommer pengene fra?
  5. Flytter de ut?
  6. Verdiskaping eller markedsmakt?
  7. Makt og innflytelse
  8. Hva kan gjøres?
- **Kort med et konkret eksempel** (Gustav Magnar Witzøe og Kvarv-regnskapet): satt på vent av Gaute.
- **Forbedringer av statsbudsjettsiden, del 1:**
  - per 100-lapp, per innbygger og prisjustering
  - snarveier og søk, og en merknad om kommunene
  - flagg for omorganiseringer, avrunding og gruppering av små ruter
  - Gaute har ikke svart på om dette skal gjøres.
- **Partienes alternative budsjetter:** når Innst. 2 S (2026–2027) kommer.
- **Trafikk før lansering:** OG-bilder, sitemap og Search Console (Gaute må logge inn selv),
  og lenker fra karusellene til kildesidene.
- **Senere ideer:**
  - spørsmålssider (myter)
  - nyhetsbrevet «Uka i kildene»
  - oversikt over hele offentlig sektor
  - sider før kommunevalget 2027
  - flere tekster fra /trappa i Pages CMS: etikettene på søylene, tekstene nedover formuestrappa
    og resultatteksten i kalkulatoren
