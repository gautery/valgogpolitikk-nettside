import type { BPost } from "./statsbudsjett";

/** Summer per nivå (formål, programkategori, kapittel, post) for sammenligning. */
export function verdiKart(poster: BPost[]): Record<string, number> {
  const m: Record<string, number> = {};
  const leggTil = (k: string, v: number) => (m[k] = Math.round(((m[k] ?? 0) + v) * 10) / 10);
  for (const p of poster) {
    if (p.b === 0) continue;
    leggTil("rot", p.b);
    leggTil(`omr:${p.omr_id}`, p.b);
    leggTil(`kat:${p.kat_id}`, p.b);
    leggTil(`kap:${p.kap}`, p.b);
    leggTil(`post:${p.kap}-${p.post}`, p.b);
  }
  return m;
}
