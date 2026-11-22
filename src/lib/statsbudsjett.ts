import fs from "fs";
import path from "path";

// Datafilene lages av scripts/statsbudsjett.py og ligger i public/data/statsbudsjett.
// Beløp er i millioner kroner.

export type BPost = {
  kap: number;
  post: number;
  kap_navn: string;
  post_navn: string;
  omr_id: string;
  omr: string;
  kat_id: string;
  kat: string;
  dep?: string;
  gruppe?: string;
  b: number;
};

export type Budsjett = {
  id: string;
  aar: number;
  versjon: "vedtatt" | "forslag";
  tittel: string;
  kilde: string;
  kilde_lenke: string;
  sum_utgifter: number;
  sum_inntekter: number;
  fra_oljefondet: number;
  utgifter: BPost[];
  inntekter: BPost[];
};

export type BudsjettOversikt = Pick<
  Budsjett,
  "id" | "aar" | "versjon" | "tittel" | "sum_utgifter" | "sum_inntekter" | "fra_oljefondet"
>;

export type Historikk = {
  formal: Record<string, { navn: string; verdier: Record<string, number> }>;
  kapittel: Record<string, { navn: string; verdier: Record<string, number> }>;
};

const DIR = path.join(process.cwd(), "public", "data", "statsbudsjett");

function les<T>(fil: string): T {
  return JSON.parse(fs.readFileSync(path.join(DIR, fil), "utf-8")) as T;
}

export function hentOversikt(): BudsjettOversikt[] {
  return les<BudsjettOversikt[]>("oversikt.json");
}

export function hentBudsjett(id: string): Budsjett | null {
  try {
    return les<Budsjett>(`${id}.json`);
  } catch {
    return null;
  }
}

export function hentHistorikk(): Historikk {
  return les<Historikk>("historikk.json");
}

/** Budsjettet det er naturlig å sammenligne med: vedtatt budsjett året før. */
export function forrigeId(oversikt: BudsjettOversikt[], b: BudsjettOversikt): string | null {
  const f = oversikt.find((o) => o.aar === b.aar - 1 && o.versjon === "vedtatt");
  return f?.id ?? null;
}

/** Nyeste forslag hvis det finnes, ellers nyeste vedtatte budsjett. */
export function standardId(oversikt: BudsjettOversikt[]): string {
  const sortert = [...oversikt].sort((a, b) => b.aar - a.aar || (a.versjon === "forslag" ? -1 : 1));
  return sortert[0].id;
}

/** Fjerner felt siden ikke bruker, så mindre data sendes til nettleseren. */
export function slank(b: Budsjett): Budsjett {
  return {
    ...b,
    utgifter: b.utgifter.map(({ dep: _dep, ...p }) => p),
    inntekter: b.inntekter.map(({ dep: _dep, ...p }) => p),
  };
}

export { verdiKart } from "./statsbudsjett-felles";
