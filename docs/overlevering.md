# Overlevering: valgogpolitikk.no

Skrevet 22. november 2026 for å starte en ny samtale. Lim inn denne fila, eller be Claude lese
`docs/overlevering.md` i repoet gautery/valgogpolitikk-nettside. Grunnkurset har et eget tillegg:
`docs/overlevering-grunnkurs.md`. Les begge. Siste gjennomgang står nederst i denne fila.

Alt som er merket **Uavklart** er ikke bestemt. Ikke bygg videre på det uten å spørre Gaute først.

## Start her (oppdatert 27. november 2026, kveld)

Notatene er skrevet lagvis gjennom flere dager. Der to avsnitt sier forskjellige ting, gjelder det nyeste.
Denne delen er fasiten for hvor vi står.

**På demoen nå** (`master`, valgogpolitikk-nettside.vercel.app), alt merket som utkast:

- Grunnkurs i ulikhet, åtte leksjoner. Gaute skrev om leksjon 3–8 i Pages CMS 27. november.
- Quiz før feiringen, seks påstander som alle er feil (`/grunnkurset-fullfort`).
- Lønnsmottaker-sida, budsjettomaten og «Hvem fikk viljen sin?» med tall for 2027.
- Parti for parti-sidene, fortsatt med prøvedata for 2026.

Ingen greiner har arbeid som ikke ligger i `master`.

**Slik svarer du Gaute**

- Han skriver fra mobilen. Svar kort, på norsk, med svaret først og punktlister.
- Han vil ha forslag, ikke endringer, i tekst han har skrevet selv. Åpenbare feil kan rettes, og meldes.
- Han ber ofte om at tall graves fram. Vær nøyaktig, les kilden selv og si fra når et tall er ditt eget
  regnestykke.

**Slik jobber vi i repoet**

- Hent `master` først, hver gang. Gaute lagrer ofte fra Pages CMS mens vi jobber.
- Avtalte endringer legges rett på `master`. Sikkerhetsfilteret i arbeidsmiljøet kan likevel nekte et push
  som ikke er uttrykkelig bestilt. Legg det da på en grein og be Gaute si «legg det på demoen».
- Vent rundt 90 sekunder etter push, og kontroller siden på demoen før du sier at den ligger ute.
- `npx next build` feiler av og til første gang på Google Fonts. Kjør én gang til.
- Test med Playwright og Chrome som finnes i arbeidsmiljøet (`/usr/bin/google-chrome`, `--no-sandbox`).
  Mot demoen må nettleseren bruke proxyen i `HTTPS_PROXY`. Lokalt: `--no-proxy-server`.
- Skript og nedlastede filer i arbeidsmiljøet forsvinner med samtalen. Det som skal brukes igjen, ligger i
  `scripts/` i repoet. Kildene må lastes ned på nytt, se lenkene i grunnkurs-notatet.
- Commit-meldinger avsluttes med linjene som samtalen selv oppgir (Co-Authored-By og Claude-Session).

**Venter på svar fra Gaute**

- Grunnkurset: se «Åpne punkter» øverst i `docs/overlevering-grunnkurs.md`.
- Budsjettsidene: sjekke tallet 7,4 mrd. i oljepenger mot Aps uttalelse, se over dommene på «Hvem fikk
  viljen sin?», og si om avtalen skal inn som egen rad på lønnsmottaker-sida og i budsjettomaten.
- Innst. 2 S (2026–2027) fra finanskomiteen ventes 30. november. Da kan parti for parti-sidene få tall for
  2027, og anslagene på lønnsmottaker-sida kan byttes ut med satsene i innstillingen.

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
- **Lansering:** valgogpolitikk.no viser «kommer snart» til Gaute sier fra. Ved lansering slettes `src/proxy.ts`.
- **90-tallskarusellen:** Gautes egne formuleringer skal stå ordrett.
- **Blokkerte nettsteder:** Hvis et nettsted blokkerer nedlasting (f.eks. regjeringen.no), ikke gå rundt det.
  Be Gaute laste ned og legge ved fila.
- **Navngitte personer** (f.eks. de rikeste på Kapital-lista) skal være et bevisst valg fra Gaute.

## Teknisk oppsett

- **Nettsiden:** repo gautery/valgogpolitikk-nettside, Next.js 16, Vercel, gren `master`.
  Push til `master` gir ny forhåndsvisning på Vercel. Les `node_modules/next/dist/docs/` før kodeendringer
  (se AGENTS.md).
  **Avtalt 27. november 2026:** Gaute vil at endringer vi er blitt enige om, legges på demoen (`master`)
  uten at han må be om det hver gang. Gjelder det han har bestemt eller sagt ja til. Forslag han ikke
  har svart på, og nytt innhold han ikke har bedt om, ligger på en grein til han har sett det.
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

## Venter på Gaute

- Godkjenne eller rette utkastene over. Det gjelder særlig tekstene på /trappa.
- Bestemme om de tre rikeste skal stå med navn i formuestrappa (Fredriksen, Hagen, Røkke).
- Logge inn i Pages CMS og gi GitHub-appen tilgang til bare de to repoene.
- Legge Beehiiv-nøklene inn i Vercel og slå på totrinnsinnlogging (Vercel, Gigahost, GitHub).
- Legge inn Instagram-lenker til karusellene og sjekke bilderettigheter for fotoene i slidene.
- Før lansering: bytte ut eksempelinnleggene, fjerne TestBanner og slette `src/proxy.ts`.

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

## Gjennomgang 27. november

Claude gikk gjennom hele demoen på mobil (360, 375 og 390 piksler) og utkastet på grenen `offentlig-sektor-side`.

Rettet (ligger i `master`):

- Lange ord i hovedoverskrifter deles med bindestrek (`h1` i `globals.css`). Før stakk overskriftene i leksjon 2,
  leksjon 4, holdingselskap-leksjonen og /stromleverandorer ut av skjermen på smale telefoner.
- Den skjulte tabellen på /trappa gjorde siden 492 piksler bred. Den ligger nå i en `sr-only`-boks.
- /kontrollsenter er slettet. Siden var en rest fra den første prototypen, og passordet sto i koden.
- Skrivefeil: «ulihet» på forsiden, «bedre mer nøyaktige» og «de beste dataen» i leksjon 2.

Ikke rettet: På 320 piksler (de aller smaleste telefonene) er forsiden, /statsbudsjett, /trappa, /karuseller
og to leksjoner fortsatt noen piksler for brede.

Vurderinger Gaute må ta (ikke bygg på dem uten svar):

1. Lansere en liten versjon før skattelistene 2. desember, eller vente til alt er klart?
2. Leksjon 2: avklart. Ingressen sier nå «som på 1880-tallet». Graftittelen i Datawrapper (`krafw`) sier
   fortsatt «for hundre år siden» og må rettes i Gautes Chrome.
3. Leksjon 1: ingressen sier «rundt 1/5», overskriften lenger ned «nesten en fjerdedel» (23 prosent).
4. /tema/skatt bruker offisielle tall (21,7 prosent av formuen, 9–17 prosent skatt for de 0,1 prosent rikeste).
   Grunnkurset sier 37 prosent og 32 prosent.
5. Leksjon 8: 108 milliarder i teksten, 127 milliarder i karusellen.
6. Leksjon 6: SSB-tallene 8 og 11,5 prosent (Aaberge mfl. 2021) er tatt ut fordi de ikke er sjekket.
7. Fjerne eksempelinnleggene og «Analyser» fra meny og forside til det finnes ekte tekster?
8. Meny: Grunnkurs, Trappa og Statsbudsjett inn, Instagram og TikTok ned i bunnteksten.
   Bunnteksten: «OECD, SSB, Eurostat» ut.
9. Forsiden: inntektsfeltet fra Trappa øverst, og kort for Trappa, Grunnkurs og Statsbudsjett rett under.
10. Nyhetsbrev-påmelding på forsiden, i bunnteksten og etter leksjoner og karusellsider.
11. Deleknapp på resultatet i Trappa-kalkulatoren.
12. Karusellsidene: store slides som på Skråblikk, og skjule «Argument, ingen nye tall».
13. /kilder: vise bare utvalgte saker, og fjerne duplikater og utenlandske artikler utenfor tema.
14. De tre rikeste med navn i formuestrappa.
15. /offentlig-sektor: flytte til nytt design før eller etter lansering?

Bare Gaute kan gjøre:

- Skrive Om-teksten og leksjonen om privat forbruk i selskaper (begge har stikkord nå).
- Lese og slette «Til deg, Gaute»-notatene i leksjon 6 og 8.
- Åpne Chrome på PC-en, så Claude kan rette graftittelen til leksjon 2 i Datawrapper.
- Fylle inn eller godkjenne de seks «Legg inn …»-merknadene på /skatt-pa-de-rikeste.
- Legge inn Instagram-lenker på de tre karusellsidene.
- Sjekke bilderettigheter for fotoene i slidene.
- E-post er avklart: nettstedet bruker valgogpolitikk@proton.me inntil videre (Gaute, 27. november).
- Bytte passord andre steder hvis passordet fra /kontrollsenter er brukt der.
- Beehiiv-nøklene i Vercel og totrinnsinnlogging, hvis det ikke er gjort.
- Godkjenne utkastene og si «lanser».

## Forsiden: Grunnkurset løftet fram (27. november, kveld)

Gaute ba om at forsiden kobles til Grunnkurset og det andre som er ferdig. Ligger på demoen.

- **Ny kloss «Fremhevet»** (`fremhevet` i `Klosser.tsx`, `klosser.ts` og `.pages.yml`): svart felt med overskrift,
  tekst, rosa knapp og nummerert liste. En linje uten lenke blir mellomtittel. Forsiden bruker den til Grunnkurset,
  rett under toppfeltet. Tekstene er Gautes egne, hentet fra oversiktssiden. Redigeres i Pages CMS under Forsiden.
- Peker klossen på en side som er utkast, vises merket «Utkast» på demoen, og feltet skjules etter lansering.
- «Utforsk» gjentar ikke sider som er løftet fram. «Grunnkurs» står først i menyen.
- Be Gaute laste Pages CMS på nytt før han redigerer forsiden.

**Ryddet 27. november, etter at Gaute sa ja** (ligger på demoen):

- TestBanner er slettet. «Siste analyser» er tatt ut av forsiden og «Analyser» ut av menyen.
  Eksempelinnleggene ligger fortsatt på /analyser og /innlegg/…, men er skjult for søkemotorer.
- Bunnteksten: «OECD, SSB, Eurostat» er byttet ut med lenker til Grunnkurs, Karuseller, Kilder og Om
  (`content/innstillinger.yml`, redigeres i Pages CMS under Innstillinger). Teksten er gjort større.
- Sidetittel, beskrivelse og delingsbilde bruker Gautes egen tekst fra toppfeltet (`src/app/layout.tsx`,
  `src/app/opengraph-image.tsx`).
- `src/app/sitemap.ts` lister bare sider som ikke er utkast, så sider kommer med av seg selv når
  «Utkast» fjernes. `src/app/robots.ts` peker på nettstedskartet.
- `next.config.ts` setter `X-Robots-Tag: noindex` på alle vercel.app-adresser, også etter lansering.
- Lange ord i karuselltitlene deles, så forsiden og /karuseller holder 320 piksler.

**Ny forside (natt til 28. november), godkjent av Gaute:** utkastet er nå forsiden (`content/forside.md`).
Siden `/forside-utkast` og filen bak er slettet.

- **Hovedsaken øverst er en karusell, ikke en leksjon.** Gaute vil ikke at en leksjon fra Grunnkurset
  selges inn som første sak. Kurset har sitt eget felt under.
- **Kloss «Hovedsak»** (`hovedsak`): feltet `karusell` tar filnavnet til en karusell eller et skråblikk
  (nå `skatt-pa-de-rikeste`). Tittel, ingress og de fire første slidene hentes derfra, og slidene kan sveipes.
  Uten karusell kan klossen vise ett funn med søyler (`tall`). Er karusellen utkast, skjules hele hovedsaken
  etter lansering.
- **Karusellkortene** har samme oppsett overalt: bilde, merkelapp («Karusell» svart, «Skråblikk» rosa),
  tittel, ingress og dato med antall slides. På mobil ligger bildet til venstre. Hovedsaken gjentas ikke i lista.
- **Karuseller har fått feltet `dato`.** De to karusellene mangler dato. Gaute må fylle inn selv, Claude vet
  ikke når de ble publisert.
- **«Fremhevet»** (Grunnkurs-feltet): `merknad` («Omtrent 25 minutter til sammen», Claudes anslag) og `seAlle`,
  som gjør at mobil viser første gruppe og en lenke til resten.
- «Utforsk» er ute av forsiden. Nyhetsbrev ligger mellom karusellene og kildene.
- Forbildene Gaute sa ja til: toppen fra VG (én stor sak), kortene fra NRK (likt oppsett, merkelapper),
  detaljene fra NYT (sammendragslinje, dato, kilde).

**Toppsak 28. november: budsjettavtalen.** Gaute ba om at «Hvem fikk viljen sin?» blir hovedsak på forsiden.

- `hovedsak` i `content/forside.md` har nå `tavle: budsjettavtalen` i stedet for `karusell`. Da vises de seks
  første radene av tavla, med tittel, første avsnitt av ingressen og knappen «Se alle 18 sakene» hentet fra
  `content/budsjettavtalen.yml`. Skattekarusellen ligger igjen i lista under.
- **Kommentar fra Gaute (28. november):** teksten er hans egen og ligger på `/kommentar-budsjettavtalen`
  (`content/sider/kommentar-budsjettavtalen.md`, utkast). Claude rettet bare fire skrivefeil («et et», «kasnkje»,
  «Sv-velgere», «entuastisk»). «[bilde på tvetydighet]» står i klammer fordi Gaute leter etter et bilde, og
  han er ikke fornøyd med overskriften. Forslag fra Claude er gitt i samtalen, ikke lagt inn.
  Tall å avklare: teksten sier «over 2300 milliarder», mens statsbudsjettsiden har 2 287 mrd. for 2027.
- **Lenker:** linja «Kommentar» under hovedsaken (`tilknyttetLenke` på `hovedsak`) og under ingressen på siden om
  avtalen (`topp.kommentarLenke` i `content/budsjettavtalen.yml`). Tittelen hentes fra toppfeltet på
  kommentarsiden (`tilknyttetSide()` i `src/lib/sider.ts`), så den endres bare ett sted. Kommentaren har en
  knapp tilbake til avtalen. Linjene skjules etter lansering så lenge kommentarsiden er utkast.
- Tavla og innlesingen er skilt ut i `src/components/partibudsjett/avtale-felles.tsx` og
  `src/lib/budsjettavtalen.ts`, så forsiden og siden bruker samme kode.
- Hovedsaken skjules etter lansering så lenge `UTKAST.partibudsjett` er `true`.

**Dette gjenstår før forsiden ser ferdig ut:**

1. Gaute må si hvilke sider som er godkjent. Etter lansering skjules alt som er utkast, og da står forsiden igjen
   med toppfelt, «Nytt fra kildene» og «Samarbeid og tips». Nettstedskartet har nå bare forsiden og /kilder.
2. «Til deg, Gaute»-notatet i leksjon 6 må slettes før kurset kan miste utkast-merket.
3. Påmelding til nyhetsbrev på forsiden (klossen `nyhetsbrev` finnes). Krever Beehiiv-nøklene i Vercel.
4. E-post er avklart: «Send en melding» peker på valgogpolitikk@proton.me. Gaute bruker den inntil videre.
   Adressen byttes i Pages CMS: Forsiden → Samarbeid og tips, og på Om-siden.

## Partienes alternative budsjetter (utkast, 27. november)

Gaute vil ha en side der man ser hva hvert parti ville endret i statsbudsjettet, med tre innganger fra samme
tabell: en introliste over områdene partiene er mest uenige om, en side per område med alle partiene på én linje,
og en side per parti med de største plussene og kuttene. Alt kan trykkes på, fra parti til område og tilbake.

- **Adresse:** `/statsbudsjett/partiene`, `/statsbudsjett/partiene/<parti>` og `/statsbudsjett/partiene/omrade/<område>`.
  Utkast, skjult for søkemotorer med bryteren `partibudsjett` i `src/lib/utkast.ts`.
- **Tall:** `scripts/partibudsjett.py` leser tabellen «Oversikt over partienes forslag til rammevedtak»
  (kap. 3.2) i finansinnstillingen og skriver `public/data/partibudsjett/<år>.json`. Skriptet stopper hvis
  summene ikke stemmer med kilden. Stortinget.no kan lastes ned fra arbeidsmiljøet.
- **Prøvedata:** Siden viser nå budsjettet for 2026, fra Innst. 2 S (2025–2026). Når Innst. 2 S (2026–2027)
  kommer: kjør skriptet med årets PDF og sidetall, sett `AAR = 2027` og `PROVEDATA = false` i
  `src/lib/partibudsjett.ts`.
- **Kode:** `src/lib/partibudsjett*.ts`, `src/components/partibudsjett/` og `src/app/(site)/statsbudsjett/partiene/`.
- **Fortegn:** For skatt og utbytte er fortegnet snudd, så høyre side alltid betyr «mer» (høyere skatter, mer utbytte).

Uavklart:

- Første versjon er på de 22 rammeområdene. Enkeltsaker per budsjettpost kan fylles på fra fagkomiteenes
  innstillinger.
- Noen tall trenger forklaring før publisering: «Tilfeldige utgifter og inntekter» er en reserve, og flere partier
  har store kutt der. På forsvar står FrP, Høyre og Venstre med 2–3 milliarder mindre enn regjeringen i 2026-tallene.
  Det kan være en teknisk flytting og må sjekkes mot innstillingen før noen leser det som et kutt.
- Arbeiderpartiet og Senterpartiet har ingen egen kolonne i 2026-tabellen.
- Tekstene på sidene er Claudes utkast.

## Typetilfeller: skatt med hvert partis opplegg (prøve, 27. november)

Gaute vil vise hvem som tjener og taper på partienes skatteopplegg. Bare SV og Rødt hadde full fordelingstabell
i 2026-budsjettene, og FrP en delvis. Derfor regner vi selv, på konkrete typetilfeller i stedet for gjennomsnitt.

- **Kode og regler:** `scripts/typetilfeller/`. `regler2026.json` har regjeringens forslag og hvert partis endringer,
  med kilde og sidetall. `regn.py` regner tre typetilfeller. `kontroll.py` sammenligner med partienes egne tabeller.
- **Kontroll:** Fra 400 000 kroner og opp treffer vi FrPs tabell innenfor avrundingen. Fire av Venstres fem
  eksempler på formuesskatt treffes på krona. Under 400 000 er partienes gjennomsnitt lavere enn en ren lønnsmottaker,
  fordi gruppene også har pensjonister og andre som betaler lite skatt fra før.
- **Mangler:** Rødts satser. De står ikke i finansinnstillingen, og roedt.no slipper ikke arbeidsmiljøet inn.
  Gaute må legge ved Rødts alternative budsjett.
- **Forutsetninger som må godkjennes:** FrPs formuesskatt er lest som én sats på 0,8 prosent. Sps sammenslåtte trinn
  er lest som 17,7 prosent fra 960 000. Venstres eksempler bruker bunnfradrag 2,25 mill., som ikke står i tiltakslista.
  Lønnsmottakeren er ikke fagorganisert (FrP og Høyre kutter fagforeningsfradraget).
- **Utkastside:** `/statsbudsjett/partiene/lonnsmottaker` viser lønnsmottakeren (600 000 kr) med brytere for
  «Er fagorganisert» og «Kjører bensinbil». Tallene lages av `scripts/typetilfeller/bygg.py`, som leser
  `regler2026.json` og `avgifter2026.json` og skriver `public/data/typetilfeller/2026.json`.
- **Med:** skatt på lønn, matmoms, bensin (veibruksavgift og CO2-avgift) og fagforeningsfradrag. Forbruket er
  SSBs snitt for aleneboende (tabell 14152, 2022-kroner), og bilen går 12 000 km på 840 liter.
- **Sikre tall:** skatten, matmomsen for FrP, Sp og Venstre, FrPs bensinpris (partiets eget tall) og fagforeningsfradraget.
- **Anslag som må erstattes med partienes satser før publisering:** bensin for SV, Sp, Venstre og MDG (regnet fra
  partienes eksempler og proveny), og MDGs matmoms (SSBs varegrupper passer ikke helt).
- **Ikke med:** strøm, flyreiser (MDGs flyseteavgift og klimabelønningen den betaler for), utbytteskatt og ordninger
  for unge og barnefamilier. Gaute har foreslått flere brytere. Flyreiser er den som skiller mest, men krever satser.
- **Velferdsgoder (lagt til 27. november):** barnehage, SFO i 4. klasse, barnetrygd, foreldrefradrag og tannlege, fra
  `velferd2026.json`. Valg på sida: alder (21–28, 29–30, 31 eller eldre), barn i barnehage (0–2) og ett barn i
  4. klasse på SFO. Tallene på sida er nå gevinst: pluss betyr bedre råd enn med regjeringens forslag.
- **Forutsetninger Gaute ba om at skal stå tydelig, og som står på sida:** makspris 1 200 kr i 11 måneder, 30 prosent
  søskenmoderasjon for barn nummer to, SFO-halvdagsplass i 4. klasse til 20 600 kr (SVs tall), barnetrygd 1 968 kr
  i måneden, tannlege 1 500 kr i året til full pris, og en husholdning med to voksne som tjener over 800 000 kr.
- **Må avklares:** Skatt, mat og bil gjelder én voksen, mens barnehage, SFO og barnetrygd gjelder hele husholdningen.
  En egen familie med to inntekter ville vært ryddigere. Venstres barnetrygd er ikke tallfestet. MDGs barnetrygd er
  partiets eget tall for inntekter på 600 000–700 000 kr. Høyres barnetrygd er anslått fra provenyet.
- Siden sier tydelig hva som ikke er med, og at det meste partiene bruker penger på ikke kan regnes per husholdning.
- Lagt på demoen 27. november etter at Gaute ba om det: `/statsbudsjett/partiene/lonnsmottaker`.
- Pensjonisten og eieren er regnet (`regn.py`), men har ingen side ennå. Tallene gjelder budsjettene for 2026.

### Dette mangler på lønnsmottaker-sida (vurdert 27. november)

Forslag fra Claude. Gaute har ikke tatt stilling til dem.

1. **Årets tall.** Sida bruker budsjettene for 2026. Stortingets liste over alternative budsjetter for 2027
   (oppdatert 26. november 2026) lenker til SV, Sp, Rødt, MDG, Høyre, KrF og Venstre. FrP sto ikke der ennå.
   Finansinnstillingen for 2027 fant vi ikke på Stortingets sider 27. november. Reglene må leses inn på nytt
   (`regler2027.json`, `avgifter2027.json`, `velferd2027.json`), og `AAR` og `PROVEDATA` endres.
2. **Rødt.** roedt.no slipper ikke arbeidsmiljøet inn. Gaute må legge ved Rødts dokument.
3. **Anslagene.** Bensin for SV, Sp, Venstre og MDG, MDGs matmoms og Høyres barnetrygd er anslag. Partienes
   forslag til avgiftsvedtak i Innst. 3 S har satsene og bør brukes i stedet.
4. **Flere inntekter.** Sida viser bare 600 000 kroner. Regnemotoren tar alle lønninger, så et valg mellom
   for eksempel 400 000, 600 000, 900 000 og 1,5 mill. viser fordelingen, som er hovedpoenget.
5. **Eieren og pensjonisten.** De er regnet, men har ingen side. Eieren med 100 mill. i aksjer gir de største utslagene.
6. **Hva det koster.** Sida viser bare gevinsten i lommeboka. Hver partirad bør lenke til partiets største kutt
   og vise oljepengebruken, ellers ser det dyreste opplegget alltid best ut.
7. **Det som ble vedtatt.** Budsjettforliket mangler som egen linje.
8. **En ryddig familie.** Skatt, mat og bil gjelder én voksen, barnegodene hele husholdningen.
9. **Ikke med:** strøm (makspris hos FrP og KrF, elavgift hos Venstre), flyreiser, Venstres barnetrygd,
   Sps barnetrygd for tredje barn, KrFs lettelser for unge.
10. **Kontroll utenfra.** Sende hvert parti tallene sine før publisering og be om rettelser.
11. **Deling.** Ingen delingsknapp, ikke eget delingsbilde, og sida ligger ikke i menyen.
12. **Tekstene** er Claudes utkast og må godkjennes av Gaute.

### Lønnsmottaker-sida bruker budsjettene for 2027 (27. november)

Gaute ba om årets tall og la ved Rødts dokument. Grenen `skatten-din-utkast` har 2027-versjonen. Demoen viser
fortsatt 2026-versjonen til Gaute sier «legg det på demoen».

- **Filer:** `scripts/typetilfeller/regler2027.json`, `avgifter2027.json` og `velferd2027.json`, med kilde og sidetall
  for hvert parti. `python3 bygg.py` lager `public/data/typetilfeller/2027.json` (`python3 bygg.py 2026` lager fjorårets).
  `kontroll2027.py` sammenligner med partienes egne tall. Sida leser året fra `TYPETILFELLE_AAR` i
  `src/lib/partibudsjett.ts`. «Parti for parti»-sidene bruker fortsatt 2026 (`AAR`), fordi finansinnstillingen
  for 2027 ikke var ute.
- **Dokumentene:** SV, Sp, MDG, Høyre, KrF og Venstre er lastet ned fra lenkene på Stortingets side. Rødt er lagt ved
  av Gaute. **FrP mangler:** frp.no stenger arbeidsmiljøet ute, så FrPs tall er fra NTBs omtale (Dagsavisen
  25. november). Gaute må legge ved FrPs dokument. Da må også fagforeningsfradrag, foreldrefradrag, trygdeavgift og
  barnetrygd sjekkes.
- **Grunnlaget (regjeringens forslag for 2027):** personfradrag 120 180, trygdeavgift 7,4 prosent, minstefradrag
  maks 99 550, trinnskatt fra 235 150 / 331 050 / 754 050 / 1 019 300 / 1 525 900, fagforeningsfradrag 8 950,
  makspris barnehage 1 200, barnetrygd 2 012 i måneden, veibruksavgift bensin 3,37 og CO2-avgift 4,40 kr per liter.
  Satsene er lest fra Smarte Penger og Regnskap Norge, ikke fra proposisjonen selv.
- **Kontroll:** MDGs tabell over inntektsskatt treffes på krona for alle 18 inntektsnivåer. Rødts eksempel for
  600 000 kroner sier 5 800, vi får 5 660 med satsene i Rødts tabell 1. KrFs egne tall for foreldrefradraget
  (16 500 og 36 300 kroner) treffes.
- **Tolkninger Gaute bør se på:**
  1. Høyre og KrF går imot «regjeringens generelle lettelse» uten å oppgi satser. Lest som trygdeavgift 7,6 prosent
     og lønnsjustert personfradrag (119 100), som trekker fra om lag 1 440 kroner.
  2. Sp kutter trygdeavgiften «mindre» uten å oppgi sats. Anslått til 7,45 prosent ut fra provenyet. Sps «økt skatt
     på høye inntekter» er antatt å ligge over 600 000 kroner.
  3. SVs tabell og eksempler er snitt og inkluderer formuesskatt. Vi bruker satsene: 5 000 kroner.
  4. MDGs klimabelønning er lagt inn med sone 3 av 6 (2 506 kr per voksen, 2 255 per barn).
  5. Bensin: FrP og Rødt er partienes egne tall. SV, Sp, MDG, KrF og Venstre er anslag. Midlertidige kutt (Sp til
     1. juli, KrF til 1. april) er regnet for den tida de varer.
  6. KrFs sukker- og brusavgift er anslått til 650 kroner per person ut fra provenyet.
- **Ikke med, men skiller i år:** Norgespris (regjeringen 45 øre, Høyre, Sp og KrF 41, Rødt og FrP 40, MDG
  strømbonus), MDGs avgifter på klær og plast, månedskort, skolemat.
- **Finansinnstillingen:** trengs ikke for å vise sida, men partienes forslag til skatte- og avgiftsvedtak der har
  de nøyaktige satsene. Den vil avgjøre punkt 1, 2 og 5 over, og er eneste kilde til «parti for parti»-sidene.
- **Rettet samtidig:** valggruppene på sida hadde id med mellomrom, så skjermlesere fikk ikke navnet på gruppa.

### Budsjettomaten (prøve, 27. november)

Gaute syntes oversiktssida («parti for parti») ikke fungerte så godt som håpet, og landet på en budsjettomat:
ett spørsmål per avveining, kort forklaring etter hvert svar med vekt på partiene som skiller seg ut, løpende
saldo, og partikort til slutt. Han liker også avstandskartet mellom budsjettene, som egen grafikk.

- **Lagt på demoen 27. november** etter at Gaute ba om det, sammen med 2027-versjonen av lønnsmottaker-sida.
  Grenen heter `budsjettomat-utkast` (bygger på `skatten-din-utkast`).
- **Side:** `/statsbudsjett/partiene/budsjettomat`. Komponent: `src/components/partibudsjett/Budsjettomat.tsx`.
- **Saklista:** `scripts/budsjettomat/saker2027.json`. Seksten spørsmål har status «ferdig»: tannlege, moms på mat,
  barnehagepris, bistand, formuesskatt, skatt på lønn, utbytteskatt, oppdrett, bensin og diesel, strøm, barnetrygd,
  minsteytelser, kommunene, ansatte i barnehagene, skolemat og kvoteflyktninger. Ti har status «delvis», med
  grunnen i feltet `kjent`: de fleste fordi bare ett eller to partier foreslår noe, eller fordi beløpene ikke er lest.
  Oljepengebruk skiller ikke: alle partiene gjør opp med om lag samme oljepengebruk som regjeringen.
  `python3 bygg.py` lager `public/data/budsjettomat/2027.json` av de ferdige.
- **Slik plasseres partiene:** `verdi` fra −1 til 1, der 0 er regjeringens forslag. Likhet er
  1 − |ditt svar − partiets verdi| / 2, i snitt over spørsmål der partiets forslag er kjent.
- **Svakheter:** FrP er fra NTB og mangler på 10 av 16 spørsmål. Gaute la ved en fil som skulle være FrPs, men den
  var Rødts dokument en gang til. Plasseringene bygger på søk i dokumentene, ikke full gjennomlesing, og
  Sps 3 mrd. til kommunene mangler sidetall. «Ingen endring funnet» betyr at søk i
  dokumentet ikke ga treff, ikke at alt er lest. Bistandskuttet til 0,7 prosent (15 mrd. kroner) er vårt anslag.
  Betalingsvalget til slutt teller ikke med i sammenligningen ennå. Alle tekster er Claudes utkast.
- **Neste:** FrPs dokument, kontroll av hver plassering mot dokumentene, eventuelt en kjerne på ti spørsmål, og la
  betalingsvalget telle.

### FrPs dokument er lest inn (27. november)

Gaute la ved FrPs alternative statsbudsjett for 2027. NTB-tallene er byttet ut med tall fra dokumentet, både på
lønnsmottaker-sida og i budsjettomaten.

- **Bekreftet:** personfradrag 130 000, trinn 1 fjernes, trinn 2 ned 0,5 prosentenheter, ingen endring i
  trygdeavgiften (s. 10 og 62). Matmoms halveres fra 1. april (11,9 mrd.). Bensin 6,76 kr billigere per liter (s. 9).
- **Nytt:** FrP fjerner fagforeningsfradraget (s. 62) og rabatten hos tannlegen for 21–28-åringer (s. 69), kutter
  bistanden med om lag 15,6 mrd. (s. 50), senker grunnrenteskatten på havbruk til 15 prosent, øker minstepensjonen
  med 8 000 kroner fra 1. mai (s. 12) og styrker kommunesektoren med 6 mrd. (s. 45–46).
- **Ikke funnet:** barnetrygd, foreldrefradrag, barnehagepris, skolemat, utbytteskatt (står som «som regjeringen»)
  og kvoteflyktninger (står som ukjent, innvandringskapitlet er ikke lest).
- **Lagt på demoen samme dag**, sammen med tre endringer Gaute ba om i budsjettomaten: flere svaralternativer
  (åtte nye, alle knyttet til et partis forslag), regjeringens forslag merket med rosa prikk, og en fast knapperad
  nederst så «Neste spørsmål» alltid er ett trykk unna. Prislappene har pluss for «koster» og minus for «sparer/gir».
  Gaute foreslo grønt for mer forbruk og rødt for mindre. Claude valgte tegn i stedet, fordi grønt og rødt leses som
  bra og dårlig, og fordi fargene er vanskelige for fargeblinde. Gaute har ikke tatt stilling til det ennå.
- **Hvem står bak valgene (på demoen):** etter at man har svart, står partinavnene som merkelapper på hvert svarvalg,
  og knapperaden nederst sier «Samme valg som …». Partier som ligger mellom to valg, står i en egen linje. Partier
  som bare delvis passer med valget, har stjerne og én linje med forbeholdet (feltet `forbehold` i saklista, elleve
  i alt). Forklaringslista er foldet sammen bak «Les hva partiene foreslår». Gaute godkjente løsningen.

### «Hvem fikk viljen sin?» (utkast, 27. november)

Gaute la ved budsjettavtalen mellom Ap, Sp, SV og Rødt (forliksdokument 25. november og avtale med verbalforslag)
og ba om en sammenligning med partienes alternative budsjetter, del for del, med oppsummering øverst.

- **Grenen `budsjettavtale-utkast`** (bygger på `budsjettomat-utkast`). Ikke på demoen. Gaute må si fra først.
- **Side:** `/statsbudsjett/partiene/avtalen`. All tekst ligger i `content/budsjettavtalen.yml` og redigeres i
  Pages CMS under «Budsjettavtalen» (se neste punkt).
- **Innhold:** 18 saker. For hver: hva avtalen sier, hva regjeringen foreslo, og hva Sp, SV og Rødt ba om, med
  merkene «Fikk det», «Fikk noe» og «Fikk ikke». Hver sak har også regjeringens utfall (`regjeringen_utfall`):
  «fikk viljen sin» (8 saker), «ga litt» (8) og «ga etter» (2: tannlege og månedskort).
- **Gaute ba om (27. november):** stillingstabellen er fjernet, fordi tallene er for ulike til å telles sammen.
  Mer vekt på hva regjeringen fikk gjennomslag for: de vinner når andre ville ha endring og det ikke ble noe.
  Standardvisningen er ett tema om gangen med «Forrige» og «Neste» (`src/components/partibudsjett/Avtale.tsx`).
  «Alle temaer» hopper til et tema, og «Vis som sammenhengende tekst» viser alt under hverandre.
- **Funn:** en lønn på 600 000 kroner får 385 kroner høyere skatt med avtalen enn med regjeringens forslag
  (trygdeavgift 7,5 i stedet for 7,4 prosent, personfradrag +975 kroner). Norgespris er ikke nevnt. Formuesskatt,
  utbytteskatt, matmoms, barnetrygd, minsteytelser, bistand og skolemat er ikke med.
- **Må sjekkes av Gaute:** merkene er Claudes vurdering. Oppsummeringen øverst er Claudes utkast. Forliksdokumentet
  oppgir at oljepengebruken øker med 7,4 mrd. kroner, mens Ap skal ha omtalt nivået som uendret. Sp har bare fire
  saker med, fordi Sps budsjett er lest dårligst. Avtalens verbalforslag er ikke gjennomgått.
- **Ny topp og tavle (28. november, Gaute sa ja):** toppen er rosa, og linja over tittelen sier «Partienes
  alternative budsjetter» (ikke «for 2026»). Rett under står **tavla** (`Tavle` i `Avtale.tsx`): alle sakene som
  rader, med ett merke per parti (fylt = fikk det, halv = fikk noe, tom = fikk ikke, strek = ingen krav med).
  Rader der Ap fikk viljen sin er rosa. Et trykk åpner kortet. På PC står tavla til venstre og kortet til høyre.
  Tavla erstatter «Alle temaer»-knappen. «Det viktigste» ligger nå under kortene.
- **Bilde øverst:** `topp.bilde`, `bildetekst` og `fotokreditt` i `content/budsjettavtalen.yml` (valgfritt, i
  Pages CMS). Gaute har ikke foto. Stortingets egne bilder kan brukes redaksjonelt mot kreditering, se
  stortinget.no «Vilkår for bruk av Stortingets fotografier». Claude legger ikke inn bilder av politikere selv.
- Siden har eget delingsbilde (`opengraph-image.tsx`).
- **Kandidat til toppsak på forsiden**, men ferskvare: avtalen manglet flertall 27. november fordi MDG sto
  utenfor. Dommene må ses over av Gaute først. Aps egen omtale sier oljepengebruken er 2,7 prosent, som i
  regjeringens forslag, mens forliksdokumentet sier 7,4 mrd. mer. Posten er med i avtalen, men ikke på siden.
- **Ikke gjort:** egen rad for avtalen på lønnsmottaker-sida og merkelapp i budsjettomaten.
- **Hvem vant, i klartekst:** oversikten og kortene sier nå «Ap fikk viljen sin» eller hvilke partier som fikk noe
  eller fullt gjennomslag («SV og Rødt fikk noe gjennomslag»). Teksten lages av `vinner()` i `Avtale.tsx` ut fra
  merkene på partienes krav. Gaute ba om det 27. november.
- **Inn i Pages CMS (27. november):** Gaute ba om å kunne redigere teksten selv. Ingress, «Det viktigste», sakene,
  «Slik har vi gjort det» og kildene ligger i `content/budsjettavtalen.yml`, med skjema i `.pages.yml` etter Trappa.
  Tallene i teksten (385 kroner, 10,8 mrd.) er nå vanlig tekst og regnes ikke ut. Utfallet på et krav er
  «fikk det», «fikk noe» eller «fikk ikke». Feltet `regjeringen_utfall` er fjernet: «Ap fikk viljen sin» vises når
  ingen partier fikk noe i saken. `.pages.yml` ble lest med en YAML-leser etter endringen, og alle ni
  innholdstypene lastet. Be Gaute laste Pages CMS på nytt før han redigerer.
