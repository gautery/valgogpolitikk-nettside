import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { AvtaleSak } from "@/components/partibudsjett/avtale-felles";

// Budsjettavtalen mot partienes egne alternative budsjetter. All tekst ligger i
// content/budsjettavtalen.yml og redigeres i Pages CMS (se .pages.yml).

export const AVTALE_LENKE = "/statsbudsjett/partiene/avtalen";

export type AvtaleInnhold = {
  topp: {
    tittel: string;
    ingress: string;
    bilde?: string;
    bildetekst?: string;
    fotokreditt?: string;
    /** Lenke til en kommentar om avtalen, f.eks. /kommentar-budsjettavtalen. */
    kommentarLenke?: string;
  };
  viktigste: { overskrift: string; punkter: { tittel: string; tekst: string }[] };
  saker: { overskrift: string; liste: AvtaleSak[] };
  /** Andre punkter i avtalen, som ikke er sammenlignet med partienes budsjetter. */
  ogsaa?: { overskrift?: string; ingress?: string; punkter?: { tittel: string; tekst: string }[] };
  metode: { overskrift: string; tekst: string };
  kilder: string[];
};

export function lesBudsjettavtalen(): AvtaleInnhold {
  const fil = path.join(process.cwd(), "content", "budsjettavtalen.yml");
  return matter(`---\n${fs.readFileSync(fil, "utf-8")}\n---`).data as AvtaleInnhold;
}

// Tom linje i teksten gir nytt avsnitt.
export const avsnitt = (t: string) => (t ?? "").split(/\n\s*\n/).map((a) => a.trim()).filter(Boolean);

// Saker uten krav eller med tomme felt skal ikke velte siden mens de redigeres.
export function avtaleSaker(d: AvtaleInnhold): AvtaleSak[] {
  return (d.saker?.liste ?? []).filter((s) => s?.tittel).map((s) => ({ ...s, krav: (s.krav ?? []).filter((k) => k?.parti) }));
}
