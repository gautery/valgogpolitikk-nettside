---
# ─────────────────────────────────────────────────────────────
#  TEMASIDE: Skatt og formue
#  UTKAST skrevet av Claude – må leses og godkjennes av Gaute
#  før lansering. Sett «utkast: false» når teksten er godkjent.
# ─────────────────────────────────────────────────────────────
tittel: Skatt og formue
ingress: Hvem betaler hva, og hvorfor betaler de rikeste en lavere andel enn folk flest?
utkast: true

# Temaene fra kildeovervåkningen som vises under «Siste nytt»
temaer: [Skatt, Ulikhet og fordeling]

nokkeltall:
  - tall: "9–17 %"
    tekst: gjennomsnittlig skattesats for de 0,1 prosent rikeste i 2004–2018, ifølge SSB.
    kilde: SSB / NHH
    lenke: https://www.nhh.no/nhh-bulletin/artikkelarkiv/2024/desember/de-rikestes-skatteregning/
  - tall: "Halvparten"
    tekst: av inntekten til de 0,1 prosent rikeste blir liggende i personlige holdingselskaper.
    kilde: Ring, Seim og Zucman 2026
    lenke: https://www.nber.org/papers/w35534
  - tall: "71–176 %"
    tekst: høyere er den rikeste prosentens andel av markedsinntekten enn skattemeldingene viser.
    kilde: SSB analyse 2020/13
    lenke: https://www.ssb.no/inntekt-og-forbruk/artikler-og-publikasjoner/ulikheten-betydelig-storre-enn-statistikken-viser
  - tall: "21,7 %"
    tekst: av all formue eies av den rikeste prosenten. Den fattigste halvparten eier 3,5 prosent.
    kilde: SSB, 2024
    lenke: https://www.ssb.no/inntekt-og-forbruk/statistikker/ifhus

kilder:
  - navn: Økonomisk ulikhet i Norge i det 21. århundre
    utgiver: SSB Rapporter 2021/33 – Aaberge, Mogstad, Vestad og Vestre
    lenke: https://www.ssb.no/inntekt-og-forbruk/inntekt-og-formue/artikler/okonomisk-ulikhet-i-norge-i-det-21.arhundre
    kommentar: >-
      Grunnsteinen for alt om skatt på de rikeste. SSB regner med overskuddet som blir
      liggende igjen i selskapene, og da faller skattesatsen helt på toppen av
      inntektsfordelingen. Den rikeste prosenten betalte i snitt 22 prosent i 2001–2018.
    bruk: Effektive skattesatser per inntektsgruppe, og hvor progressivt systemet egentlig er.

  - navn: Eierinntekter, skatt og inntektsulikhet i Norge
    utgiver: SSB analyse 2020/13
    lenke: https://www.ssb.no/inntekt-og-forbruk/artikler-og-publikasjoner/ulikheten-betydelig-storre-enn-statistikken-viser
    kommentar: >-
      Den korte og lettleste versjonen av SSB-funnene. Viser at den offisielle statistikken
      undervurderer kraftig hvor mye de rikeste tjener, fordi mye av inntekten aldri havner
      på skattemeldingen.
    bruk: Forklare hvorfor «Norge er et likt land» er en sannhet med modifikasjoner.

  - navn: Utviklingen i inntektsulikhet i perioden 2016–2022
    utgiver: SSB Rapporter 2024/32 – Vestad, på oppdrag for Finansdepartementet
    lenke: https://www.ssb.no/en/inntekt-og-forbruk/inntekt-og-formue/artikler/income-inequality-in-norway-2016-2022
    kommentar: >-
      Oppdaterte tall for toppinntekter med og uten tilbakeholdt overskudd i aksjeselskaper.
      Ulikheten målt med Gini blir klart større når overskuddet i selskapene tas med.
    bruk: De nyeste tallene for hvor stor andel av inntektene som går til de rikeste.

  - navn: Personal Holding Companies, Tax Progressivity, and Inequality
    utgiver: Ring, Seim og Zucman – NBER Working Paper 35534, juli 2026
    lenke: https://www.nber.org/papers/w35534
    kommentar: >-
      Tjue år med registerdata fra Norge og Sverige. Viser at holdingselskaper skjermer
      rundt halvparten av utbyttene fra personskatt, og at pengene blir liggende i
      selskapene i lang tid. USA har hatt regler mot dette siden 1930-tallet.
    bruk: Holdingselskapenes rolle, og sammenligning med Sverige og USA.

  - navn: The Taxation of Norway's Richest
    utgiver: Bjerksund, Hopland og Schjelderup – Nordic Tax Journal (NHH)
    lenke: https://www.nhh.no/nhh-bulletin/artikkelarkiv/2024/desember/de-rikestes-skatteregning/
    kommentar: >-
      Der SSB viser at de rikeste betaler lite, prøver NHH-forskerne å forklare hvordan
      skattesystemet gjør det mulig.
    bruk: Mekanismene bak de lave satsene.

  - navn: NOU 2026:9 Veien mot et bedre og mer forutsigbart skattesystem
    utgiver: Skattekommisjonen, juni 2026
    lenke: https://www.regjeringen.no/no/dokumenter/nou-2026-9/id3167167/
    kommentar: >-
      Grunnlaget for neste skatteforlik. Mandatet var å anbefale en skattereform som gir
      et konkurransedyktig skattenivå for norsk næringsliv. Høringssvarene viser hvem som
      vil ha hva.
    bruk: Hva partiene forhandler om, og hvem som tjener på forslagene.

  - navn: NOU 2022:20 Et helhetlig skattesystem
    utgiver: Skatteutvalget (Torvik-utvalget)
    lenke: https://www.regjeringen.no/no/dokumenter/nou-2022-20/id2951826/
    kommentar: >-
      Forrige store skatteutredning, ledet av Ragnar Torvik. Foreslo blant annet å
      innføre skatt på arv og redusere formuesskatten.
    bruk: Historikk og argumentene for og mot formuesskatten.

  - navn: Prop. 1 LS – Skatter, avgifter og toll
    utgiver: Finansdepartementet, hvert år
    lenke: https://www.regjeringen.no/no/dokumenter/prop.-1-ls-20262027/id3176120/
    kommentar: >-
      Den årlige skatteproposisjonen. Gjemt i tabellene ligger gjennomsnittlig skatt per
      inntektsgruppe, helt opp til de 0,1 prosent rikeste.
    bruk: Ferske tall fra regjeringen selv, og effekten av årets skatteendringer.

  - navn: Revenue Statistics
    utgiver: OECD, hvert år
    lenke: https://www.oecd.org/en/publications/revenue-statistics-2025_3a264267-en.html
    kommentar: >-
      Sammenligner skattenivå og skattetyper mellom 38 land. Norges skatter var 41,4
      prosent av BNP i 2023, sjuende høyest i OECD. Sier lite om hvem som betaler.
    bruk: Internasjonale sammenligninger av skattenivå og eiendoms- og formuesskatter.

  - navn: Inntekts- og formuesstatistikk for husholdninger
    utgiver: SSB, hvert år
    lenke: https://www.ssb.no/inntekt-og-forbruk/statistikker/ifhus
    kommentar: >-
      Den offisielle statistikken for inntekt, lavinntekt og formuesfordeling. Husk at den
      ikke tar med overskudd som blir liggende i selskapene.
    bruk: Formuesfordeling og lavinntekt, år for år.

analyser:
  - tittel: Norge har IKKE verdens høyeste skatter
    lenke: /innlegg/norge-har-ikke-verdens-hoyeste-skatter
    type: Analyse

karuseller:
  # Lenker til Instagram legges inn når Gaute har bekreftet hvilke som skal med
  - tittel: Hvorfor kan noen rike ta ut millioner årlig skattefritt?
  - tittel: Hvor mye lavere skatt kunne du fått?
  - tittel: Hvordan er skattene på de rike i Norge sammenlignet med Sverige, USA og Nederland?
---
Norge har et høyt skattenivå, men ikke for alle. De fleste lønnstakere betaler en jevn og forutsigbar andel av inntekten sin i skatt. Helt på toppen faller andelen: de rikeste får mesteparten av inntekten som utbytte og verdistigning, og mye blir liggende i holdingselskaper der det ikke skattlegges på personlig hånd.

Her har jeg samlet kildene jeg bruker for å forstå hvordan skattesystemet faktisk fungerer, hvem som betaler hva, og hva som står på spill når politikerne forhandler om et nytt skatteforlik.
