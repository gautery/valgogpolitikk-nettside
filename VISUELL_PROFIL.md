# Visuell profil — @valgogpolitikk

## Merkevarepersonlighet

**Tre ord:** Troverdig. Skarp. Tilgjengelig.

Vi er ikke en avis, ikke en tenketank, ikke en meme-konto. Vi er noe midt i mellom — og designet skal reflektere det. Tenk: en venn som er økonom, men som forklarer ting over en øl.

**Designprinsipper:**
1. **Tall først, mening etter** — data er helten, ikke dekorasjon
2. **Seriøst uten å være stivt** — profesjonell troverdighet med et glimt i øyet
3. **Hvert innlegg har sin egen energi** — som The Pudding: unike accent-farger per sak
4. **Luft er luksus** — generøs whitespace, aldri overfylt
5. **Craft i detaljene** — som Linear: det du ikke legger merke til er det som gjør det bra

---

## Fargepalett

### Primærfarger
| Navn | Hex | Bruk |
|------|-----|------|
| **Blekk** | `#1a1a2e` | Overskrifter, hero-bakgrunn, aktive elementer |
| **Hvit** | `#ffffff` | Bakgrunn, kort |
| **Kritt** | `#f7f7f5` | Sekundær bakgrunn, sidebar, footer |
| **Signalrød** | `#c1121f` | Primær accent, logo-stripe, CTA-knapper, hover |

### Accent-farger (én per innlegg/kategori)
| Kategori | Hex | Navn |
|----------|-----|------|
| Skatt & avgifter | `#c1121f` | Signalrød |
| Arbeid & sysselsetting | `#2d6a4f` | Skoggrønn |
| Ulikhet & mobilitet | `#7048e8` | Kongelilla |
| Velferd & privatisering | `#e67700` | Brannvarsel |
| Internasjonalt | `#1864ab` | Havblå |
| Faktasjekk | `#d6336c` | Kritisk rosa |

Accent-fargene brukes som kategori-badge, accent-stripe, og graf-farge. De gjør at hvert innlegg føles unikt, inspirert av The Puddings tilnærming.

### Nøytrale
| Navn | Hex | Bruk |
|------|-----|------|
| Tekst primær | `#1a1a2e` | Overskrifter, viktig tekst |
| Tekst sekundær | `#495057` | Brødtekst |
| Tekst dempet | `#868e96` | Meta-info, datoer, lesetid |
| Linje | `#e9ecef` | Borders, separatorer |
| Linje lys | `#dee2e6` | Subtile skiller |

---

## Typografi

### Font-par
- **Overskrifter:** Playfair Display (serif) — gir autoritet og editorial-følelse
- **Brødtekst & UI:** Inter (sans-serif) — lesbart, moderne, profesjonelt

### Skala
| Element | Font | Størrelse | Vekt | Linjehøyde |
|---------|------|-----------|------|------------|
| Hero-tittel | Playfair | 46px (desktop) / 32px (mobil) | 700 | 1.15 |
| Innlegg-tittel (kort) | Playfair | 24px | 700 | 1.25 |
| Innlegg-tittel (full) | Playfair | 42px (desktop) / 32px (mobil) | 700 | 1.15 |
| H2 i artikkel | Playfair | 22px | 700 | 1.3 |
| Brødtekst | Inter | 15px | 400 | 1.8 |
| Meta (dato, kategori) | Inter | 12px | 500 | 1.5 |
| Kategori-badge | Inter | 11px | 600 | 1 |
| Knapp | Inter | 13px | 600 | 1 |

### Regler
- Overskrifter alltid serif — det signaliserer "dette er journalistikk, ikke en app"
- Brødtekst alltid sans-serif — det signaliserer "dette er moderne og lesbart"
- Aldri mer enn 680px bredde på brødtekst — optimal leselengde
- Linjehøyde 1.8 på brødtekst — luft mellom linjene gjør at tung statistikk føles lettere

---

## Layout

### Grid
- Max-bredde: 1100px (sentrert)
- Forside: 2-kolonne (280px sidebar + flex innhold) på desktop, stacker på mobil
- Artikkelside: 1-kolonne, 740px max, sentrert

### Spacing-system (8px base)
| Token | Verdi | Bruk |
|-------|-------|------|
| xs | 4px | Mellom ikon og tekst |
| sm | 8px | Mellom badge og dato |
| md | 16px | Padding i kort |
| lg | 24px | Mellom seksjoner |
| xl | 40px | Over/under hero |
| 2xl | 64px | Mellom hovedseksjoner |

### Kort-design
- Hvit bakgrunn, 1px border `#e9ecef`
- Border-radius: 8px
- Padding: 24px
- Hover: subtil skygge (`box-shadow: 0 4px 12px rgba(0,0,0,0.06)`)
- Ingen accent-stripe — i stedet: farget kategori-badge øverst til venstre

### Hero-seksjon
- Mørk bakgrunn (`#1a1a2e`)
- Hvit serif-tittel
- Subtil rød accent-strek ved @valgogpolitikk-taggen
- Underbeskrivelse i 60% hvit
- Generøs padding (64-96px vertikalt)

---

## Komponenter

### Header
- Hvit bakgrunn, sticky, 1px border under
- Rød vertikal strek (4px bred, 32px høy) som logo-element
- "valg og politikk" i Inter Bold 17px
- Nav-lenker til høyre: Inter Medium 13px
- Ingen hamburgermeny-ikon — bare ren tekst

### Kategori-badge
- Rundet pille (border-radius: full)
- Farget bakgrunn (accent-farge for kategorien)
- Hvit tekst, 11px, semibold, uppercase
- Brukes på kort og artikkelside

### Innleggskort
- Hvit med border
- Øverst: kategori-badge + dato + lesetid
- Tittel i Playfair Bold 24px — endrer farge til signalrød ved hover
- Ingress i Inter Regular 14px, farget `#495057`
- "Les mer ↓" i signalrød, 12px

### Nyhetsbrev-boks
- Mørk bakgrunn (`#1a1a2e`) — skiller seg ut fra hvit feed
- Label "NYHETSBREV" i 12px uppercase, 50% hvit
- Beskrivelse i 70% hvit
- E-post-input med subtil hvit border
- Signalrød "Meld på"-knapp

### Grafer (Recharts)
- Hvit bakgrunn med 1px border
- Rutenett: `#e9ecef` (nesten usynlig)
- Aksetekst: `#868e96` 12px
- Søylefarger: accent-fargen for innlegget som standard, ellers syklisk fra paletten
- Tooltip: hvit, avrundet, med subtil skygge
- Responsive (ResponsiveContainer)

### Kilder-boks
- Lys bakgrunn (`#f7f7f5`)
- 1px border
- "KILDER" label i 11px uppercase, tracking-wider
- Kildenavn i 13px med understrek-lenke

### Tags
- Rundet pille, lys bakgrunn (`#f7f7f5`), 1px border
- 11px, font-medium, farget `#495057`
- Plassert under kilder på artikkelside

### Footer
- Bakgrunn `#f7f7f5`
- To-kolonne: merkevare til venstre, lenker til høyre
- Rød strek-element gjenbrukt fra header
- Disclaimer-linje i 11px, lys grå

---

## Ikoner og dekorasjon

### Logo-element
Ikke en tradisjonell logo — i stedet en **rød vertikal strek** (4px bred) ved siden av "valg og politikk" i bold tekst. Inspirert av pull-quotes i aviser og den røde streken til Brennan Center. Enkel, gjenkjennbar, skalerbar.

### Ingen emojier i UI
Emojier i kategorier fjernes — de fungerer på Instagram men ser amatørmessig ut på en nettside. I stedet brukes fargekodede badges.

### Subtile animasjoner
- Kort: skygge på hover (150ms ease)
- Lenker: farge-endring på hover (150ms)
- Sideoverganger: ingen — rask navigasjon er viktigere enn animasjon
- Grafer: Recharts default-animasjon er nok

---

## Tone møter design

| Tone | Designuttrykk |
|------|---------------|
| "Vi har kildene" | Kildeliste synlig i hvert kort, ikke gjemt |
| "Dette er viktig" | Stor serif-tittel, generøs plass |
| "Men det trenger ikke være kjedelig" | Fargede badges, unik accent per innlegg |
| "Vi er transparente" | Metainfo synlig (dato, lesetid, kategori) |
| "Vi respekterer tiden din" | Kort ingress, expand-on-click, lesetid |

---

## Inspirasjon og referanser

Denne profilen henter fra:
- **The Pudding** — unik farge per artikkel, lekent men substansielt
- **Linear** — craft i detaljene, restrained eleganse, Inter-font
- **Stripe** — gradient-kontraster, progressive disclosure, klarhet i kompleksitet
- **Brennan Center** — institusjonell troverdighet, serif-overskrifter, forskning-layout
- **Vox** — editorial hierarki, bold typografi, tilgjengelig journalistikk

---

*Denne profilen er levende dokumentasjon — oppdater den når merkevaren utvikler seg.*
