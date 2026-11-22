import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Teksten på /trappa ligger i content/trappa.yml og redigeres i Pages CMS.
// {ord} i teksten byttes ut med tall (se fyll()).

type Tre = { [nokkel: string]: string | string[] | Tre };

export function lesTrappaTekst(): Tre {
  const fil = path.join(process.cwd(), "content", "trappa.yml");
  return matter(`---\n${fs.readFileSync(fil, "utf-8")}\n---`).data as Tre;
}

/** Bytter ut {nokkel} med verdien. Ukjente nøkler blir stående, så skrivefeil synes. */
export function fyll(tekst: string, verdier: Record<string, string>): string {
  return tekst.replace(/\{([a-z0-9_]+)\}/g, (hele, nokkel: string) => verdier[nokkel] ?? hele);
}

/** Fyller ut alle tekstene i treet. */
export function fyllAlt<T extends Tre>(tre: T, verdier: Record<string, string>): T {
  const ut: Tre = {};
  for (const [k, v] of Object.entries(tre)) {
    if (typeof v === "string") ut[k] = fyll(v, verdier);
    else if (Array.isArray(v)) ut[k] = v.map((s) => fyll(String(s ?? ""), verdier));
    else if (v && typeof v === "object") ut[k] = fyllAlt(v, verdier);
  }
  return ut as T;
}

/** Deler tekst i avsnitt på tomme linjer. */
export function avsnitt(tekst: string | undefined): string[] {
  return (tekst ?? "")
    .split(/\n\s*\n/)
    .map((a) => a.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

export type TrappaTekst = {
  topp: { overlinje: string; tittel: string; ingress: string; sporsmal: string; hjelpetekst: string };
  inntektstrappa: { tittel: string; ingress: string; fotnote: string };
  toppen: { tittel: string; ingress: string; fotnote: string };
  formue: {
    tittel: string;
    ingress: string;
    etikett_samlet: string;
    etikett_snitt: string;
    etikett_milliardaerer: string;
    etikett_rikeste: string;
    trapp_tittel: string;
    trapp_ingress: string;
    trapp_slutt: string;
    trapp_fotnote: string;
    tekst: string;
    fotnote: string;
  };
  hvorfor: { tittel: string; tekst: string };
  metode: { tittel: string; punkter: string[] };
};
