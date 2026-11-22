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
};

export type Tekst = {
  type: "tekst";
  overskrift?: string;
  tekst?: string;
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

export type Nyhetsbrev = {
  type: "nyhetsbrev";
  overskrift?: string;
  tekst?: string;
  bakgrunn?: Bakgrunn;
};

export type Kloss =
  | Toppfelt
  | Tekst
  | Nokkeltall
  | Bilde
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
  | Nyhetsbrev;
