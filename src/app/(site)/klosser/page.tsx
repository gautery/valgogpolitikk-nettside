import type { Metadata } from "next";
import Klosser from "@/components/klosser/Klosser";
import type { Kloss } from "@/lib/klosser";
import { lesForside } from "@/lib/sider";
import { lesTema } from "@/lib/tema";
import { lesKarusell } from "@/lib/karuseller";

// Katalog over byggeklossene, med eksempler hentet fra innhold som allerede
// finnes på nettsiden. Kun til internt bruk: skjult for søkemotorer.

export const revalidate = 3600;
export const metadata: Metadata = {
  title: "Byggeklosser — valg og politikk",
  robots: { index: false, follow: false },
};

type Oppføring = { navn: string; bruk: string; felt: string; kloss: Kloss };

function katalog(): Oppføring[] {
  const forside = lesForside().seksjoner;
  const toppfelt = forside.find((k) => k.type === "toppfelt") ?? { type: "toppfelt" as const };
  const skatt = lesTema("skatt");
  const strom = lesKarusell("stromleverandorer");
  const slide2 = strom?.slides[1];
  const slide9 = strom?.slides[8];

  return [
    {
      navn: "Toppfelt",
      bruk: "Øverst på en side. Mørk bakgrunn.",
      felt: "Overlinje, tittel, ingress, bilde eller bokrygger",
      kloss: toppfelt,
    },
    {
      navn: "Tekst",
      bruk: "Vanlig brødtekst, med mellomtitler, lenker og lister.",
      felt: "Overskrift, tekst, bakgrunn",
      kloss: { type: "tekst", overskrift: skatt?.tittel, tekst: skatt?.avsnitt.join("\n\n") },
    },
    {
      navn: "Nøkkeltall",
      bruk: "Fire tall eller færre, med kilde. Gir best effekt rett etter toppfeltet.",
      felt: "Overskrift, tall (tall, forklaring, kilde, lenke), bakgrunn",
      kloss: { type: "nokkeltall", tall: skatt?.nokkeltall, bakgrunn: "lys" },
    },
    {
      navn: "Bilde",
      bruk: "Et bilde eller en graf, i tekstbredde eller full bredde.",
      felt: "Bilde, beskrivelse for skjermlesere, bildetekst, bredde, bakgrunn",
      kloss: {
        type: "bilde",
        bilde: slide2?.bilde,
        alt: slide2?.tekst,
        bildetekst: slide2 ? `${slide2.tittel}. Fra karusellen «${strom?.tittel}».` : undefined,
      },
    },
    {
      navn: "Graf fra Datawrapper",
      bruk: "En interaktiv graf, kart eller tabell laget i Datawrapper. Vises ikke før lenken er fylt inn.",
      felt: "Lenke til grafen, beskrivelse for skjermlesere, bredde, bakgrunn",
      kloss: { type: "datawrapper" },
    },
    {
      navn: "Sitat",
      bruk: "Én setning som skal stå ut.",
      felt: "Sitat, hvem som sa det, bakgrunn",
      kloss: {
        type: "sitat",
        sitat: slide9?.tittel ? `${slide9.tittel} for å selge strømavtaler.` : undefined,
        kilde: strom ? `Fra karusellen «${strom.tittel}»` : undefined,
        bakgrunn: "lys",
      },
    },
    {
      navn: "Kildeliste",
      bruk: "Kilder med kommentar om hva de er gode til.",
      felt: "Overskrift, kilder (navn, utgiver, lenke, kommentar, bruk den til), bakgrunn",
      kloss: { type: "kildeliste", overskrift: "Kildene", kilder: skatt?.kilder.slice(0, 2) },
    },
    {
      navn: "Knapp",
      bruk: "En tydelig lenke videre, med en setning foran.",
      felt: "Forklaring, knappetekst, lenke, bakgrunn",
      kloss: { type: "knapp", tekst: "Alle saker fra kildene", lenke: "/kilder", bakgrunn: "lys" },
    },
    {
      navn: "Karuseller",
      bruk: "De nyeste karusellsidene, med forsidebilde. Fylles ut automatisk.",
      felt: "Overskrift, antall, bakgrunn",
      kloss: { type: "karuseller", overskrift: "Karuseller" },
    },
    {
      navn: "Skråblikk",
      bruk: "De nyeste skråblikkene, med forsidebilde. Fylles ut automatisk.",
      felt: "Overskrift, antall, bakgrunn",
      kloss: { type: "skraablikk", overskrift: "Skråblikk" },
    },
    {
      navn: "Temaoversikt",
      bruk: "Alle temasidene. Fylles ut automatisk.",
      felt: "Overskrift, bakgrunn",
      kloss: { type: "temaoversikt", overskrift: "Temaer", bakgrunn: "lys" },
    },
    {
      navn: "Siste nytt fra kildene",
      bruk: "Nye saker fra kildeovervåkingen, gjerne for ett tema.",
      felt: "Overskrift, tema, antall, bakgrunn",
      kloss: { type: "siste_nytt", overskrift: "Siste nytt om skatt", tema: "Skatt" },
    },
    {
      navn: "Kildebånd",
      bruk: "Båndet fra forsiden, med fanene Utvalgt og Løpende.",
      felt: "Ingen felt",
      kloss: { type: "kildeband" },
    },
    {
      navn: "Siste analyser",
      bruk: "De nyeste innleggene, som tre kort.",
      felt: "Overskrift, antall, bakgrunn",
      kloss: { type: "siste_analyser", overskrift: "Analyser" },
    },
    {
      navn: "Hovedsak",
      bruk: "Øverst på forsiden: ett funn som tittel, med noen få søyler og en knapp videre.",
      felt: "Liten tekst, tittel, tekst, søyler (hvem, tall, uthev), enhet, forklaring, knapp",
      kloss: {
        type: "hovedsak" as const,
        overlinje: "Liten tekst",
        tittel: "Ett funn som tittel",
        tall: [
          { etikett: "Gruppe A", verdi: 47 },
          { etikett: "Gruppe B", verdi: 22, uthev: true },
        ],
        forklaring: "Hva tallene viser, og kilden.",
        knapp: "Knapp",
        knappLenke: "/",
      },
    },
    {
      navn: "Fremhevet",
      bruk: "Løfter fram én ting, f.eks. Grunnkurset. Svart felt med knapp og en nummerert liste.",
      felt: "Overskrift, tekst, lenke, knapp, liste (linje uten lenke blir mellomtittel)",
      kloss: forside.find((k) => k.type === "fremhevet") ?? { type: "fremhevet" as const },
    },
    {
      navn: "Utforsk",
      bruk: "Snarveier til Trappa, Statsbudsjettet, temasidene, Kilder og Om. Oppdateres av seg selv.",
      felt: "Overskrift, bakgrunn",
      kloss: { type: "utforsk" },
    },
    {
      navn: "Om meg",
      bruk: "Bilde til venstre og tekst til høyre. Til Om-siden.",
      felt: "Bilde, beskrivelse av bildet, navn, undertittel, tekst, bakgrunn",
      kloss: { type: "om_meg", navn: "Navnet ditt", tekst: "Teksten om deg står her." },
    },
    {
      navn: "Samarbeid og tips",
      bruk: "Invitasjon til samarbeid og tips, med knapp som åpner en e-post til deg.",
      felt: "Overskrift, tekst, e-postadresse, tekst på knappen, bakgrunn",
      kloss: {
        type: "samarbeid",
        tekst: "Vil du samarbeide med valgogpolitikk, eller har du tips til kilder? Send en melding her.",
      },
    },
    {
      navn: "Nyhetsbrev",
      bruk: "Påmelding til nyhetsbrevet.",
      felt: "Overskrift, tekst, bakgrunn",
      kloss: { type: "nyhetsbrev", overskrift: "Nyhetsbrev", tekst: "Få nye analyser rett i innboksen.", bakgrunn: "lys" },
    },
    {
      navn: "Alle analyser",
      bruk: "Hele innleggsarkivet med søk og kategorier, slik det står på forsiden i dag.",
      felt: "Ingen felt. «Om»-boksen redigeres under Innstillinger.",
      kloss: { type: "analyser" },
    },
  ];
}

export default function KlossKatalog() {
  const liste = katalog();
  return (
    <>
      <div className="border-b border-border bg-surface px-6 py-10">
        <div className="mx-auto max-w-[1100px]">
          <h1 className="font-display text-3xl">Byggeklosser</h1>
          <p className="mt-3 max-w-[620px] text-[15px] leading-relaxed text-text-secondary">
            Alle klossene du kan sette sammen sider av i Pages CMS. Eksemplene bruker innhold som
            allerede finnes på nettsiden. Siden er skjult for søkemotorer.
          </p>
        </div>
      </div>
      {liste.map((o, i) => (
        <div key={o.navn} className="border-b-4 border-text-primary">
          <div className="bg-text-primary px-6 py-3 text-white">
            <div className="mx-auto flex max-w-[1100px] flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className="text-[13px] tabular-nums text-white/50">{i + 1}</span>
              <h2 className="text-[15px] font-semibold">{o.navn}</h2>
              <span className="text-[13px] text-white/70">{o.bruk}</span>
              <span className="text-[12px] text-white/60">Felt: {o.felt}</span>
            </div>
          </div>
          <Klosser seksjoner={[o.kloss]} ktx={{ visUtkast: true }} />
        </div>
      ))}
    </>
  );
}
