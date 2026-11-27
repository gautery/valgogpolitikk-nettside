// Byggeklossene som sider settes sammen av. Feltnavnene her må stemme med
// blokkene i .pages.yml. Hver kloss lagres med «type» som navn på klossen.

export type Bakgrunn = "hvit" | "lys";

export type Toppfelt = {
  type: "toppfelt";
  overlinje?: string;
  tittel?: string;
  ingress?: string;
  bilde?: string;
  bokrygger?: boolean;
  farge?: "mork" | "rosa";
  konfetti?: boolean;
};

export type Tekst = {
  type: "tekst";
  overskrift?: string;
  tekst?: string;
  /** Valgfri graf fra Datawrapper mellom overskriften og teksten. */
  graf?: string;
  grafBeskrivelse?: string;
  /** Valgfri knapp under teksten. */
  knapp?: string;
  knappLenke?: string;
  bakgrunn?: Bakgrunn;
};

export type Nokkeltall = {
  type: "nokkeltall";
  overskrift?: string;
  tall?: { tall?: string; tekst?: string; kilde?: string; lenke?: string }[];
  bakgrunn?: Bakgrunn;
};

export type Bilde = {
  type: "bilde";
  bilde?: string;
  alt?: string;
  bildetekst?: string;
  bredde?: "normal" | "bred";
  bakgrunn?: Bakgrunn;
};

export type Datawrapper = {
  type: "datawrapper";
  lenke?: string;
  beskrivelse?: string;
  bredde?: "normal" | "bred";
  bakgrunn?: Bakgrunn;
};

/** Finner graf-ID-en (fem tegn) i en Datawrapper-lenke. Godtar delelenken
 *  (datawrapper.dwcdn.net/AbC12/1/) og redigeringslenken (app.datawrapper.de/chart/AbC12/...). */
export function datawrapperId(lenke?: string): string | null {
  if (!lenke) return null;
  const m =
    lenke.match(/datawrapper\.dwcdn\.net\/([A-Za-z0-9]{5})(?:[/?#]|$)/) ??
    lenke.match(/datawrapper\.de\/(?:_|chart|map|table)\/([A-Za-z0-9]{5})(?:[/?#]|$)/);
  return m ? m[1] : null;
}

export type Sitat = {
  type: "sitat";
  sitat?: string;
  kilde?: string;
  bakgrunn?: Bakgrunn;
};

export type Kildeliste = {
  type: "kildeliste";
  overskrift?: string;
  kilder?: { navn?: string; utgiver?: string; lenke?: string; kommentar?: string; bruk?: string }[];
  bakgrunn?: Bakgrunn;
};

export type Knapp = {
  type: "knapp";
  tekst?: string;
  lenke?: string;
  forklaring?: string;
  bakgrunn?: Bakgrunn;
};

export type Karuseller = {
  type: "karuseller";
  overskrift?: string;
  antall?: number;
  /** Vis «Se alle karuseller» under raden (standard: ja). */
  visKnapp?: boolean;
  bakgrunn?: Bakgrunn;
};

export type Temaoversikt = {
  type: "temaoversikt";
  overskrift?: string;
  bakgrunn?: Bakgrunn;
};

export type SisteNytt = {
  type: "siste_nytt";
  overskrift?: string;
  tema?: string;
  antall?: number;
  bakgrunn?: Bakgrunn;
};

export type SkraablikkKloss = {
  type: "skraablikk";
  overskrift?: string;
  antall?: number;
  bakgrunn?: Bakgrunn;
};

export type Kildeband = { type: "kildeband" };

export type Analyser = { type: "analyser" };

export type SisteAnalyser = {
  type: "siste_analyser";
  overskrift?: string;
  antall?: number;
  bakgrunn?: Bakgrunn;
};

export type FeiringKloss = {
  type: "feiring";
  overlinje?: string;
  tittel?: string;
  ingress?: string;
  bilde?: string;
  bildetekst?: string;
  fotokreditt?: string;
  fotokredittLenke?: string;
  knapp?: string;
  knappLenke?: string;
  lenke?: string;
  lenkeTil?: string;
  /** Valgfri quiz som vises før feiringen. Alle påstandene skal være feil. */
  quiz?: FeiringQuiz;
};

export type FeiringQuiz = {
  tittel?: string;
  ingress?: string;
  pastander?: { pastand?: string; forklaring?: string }[];
  /** Vises til slutt, før resultatet. */
  avsloring?: string;
  /** {riktige} og {antall} byttes ut med tallene. */
  resultatBra?: string;
  resultatSvakt?: string;
  /** Så mange rette trengs for «resultatBra». Standard: 4. */
  grense?: number;
};

export type Nyhetsbrev = {
  type: "nyhetsbrev";
  overskrift?: string;
  tekst?: string;
  bakgrunn?: Bakgrunn;
};

export type OmMeg = {
  type: "om_meg";
  bilde?: string;
  alt?: string;
  navn?: string;
  undertittel?: string;
  tekst?: string;
  bakgrunn?: Bakgrunn;
};

export type Utforsk = {
  type: "utforsk";
  overskrift?: string;
  bakgrunn?: Bakgrunn;
};

/** Løfter fram én ting, f.eks. Grunnkurset: svart felt med overskrift, knapp og en nummerert liste. */
export type Fremhevet = {
  type: "fremhevet";
  overskrift?: string;
  tekst?: string;
  /** Siden overskriften lenker til, f.eks. /grunnkurs-i-ulikhet. */
  lenke?: string;
  knapp?: string;
  knappLenke?: string;
  /** Lenkene i lista. En linje uten lenke blir en mellomtittel. */
  lenker?: { tekst?: string; lenke?: string }[];
};

export type Samarbeid = {
  type: "samarbeid";
  overskrift?: string;
  tekst?: string;
  epost?: string;
  knapp?: string;
  bakgrunn?: Bakgrunn;
};

export type Kloss =
  | Toppfelt
  | Tekst
  | Nokkeltall
  | Bilde
  | Datawrapper
  | Sitat
  | Kildeliste
  | Knapp
  | Karuseller
  | SkraablikkKloss
  | Temaoversikt
  | SisteNytt
  | Kildeband
  | Analyser
  | SisteAnalyser
  | Nyhetsbrev
  | FeiringKloss
  | Samarbeid
  | Fremhevet
  | Utforsk
  | OmMeg;
