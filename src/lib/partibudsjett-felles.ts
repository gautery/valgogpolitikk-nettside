// Felles typer og tallformat for sidene om partienes forslag til statsbudsjett.
// Brukes både på tjeneren og i nettleseren, så her er det ingen fillesing.
// Alle beløp er i 1 000 kroner, som i finansinnstillingen.

export type Retning = "utgift" | "skatt" | "inntekt" | "netto";

export type Parti = { id: string; kort: string; navn: string };

export type Omrade = {
  nr: number;
  slug: string;
  navn: string;
  navn_kilde: string;
  dekker: string;
  retning: Retning;
  gul_bok: number;
  avvik: Record<string, number>;
  flertall: number | null;
};

export type Partibudsjett = {
  aar: number;
  kilde: string;
  kilde_lenke: string;
  flertall: string | null;
  partier: Parti[];
  omrader: Omrade[];
  sum: { gul_bok: number; avvik: Record<string, number>; flertall: number | null };
};

const MINUS = "−";

function desimal(x: number, n = 1) {
  return x.toFixed(n).replace(".", ",");
}

// 51 436 000 -> «51,4 mrd. kr», 609 613 -> «610 mill. kr». Uten fortegn.
export function belop(tusen: number): string {
  const a = Math.abs(tusen);
  if (a === 0) return "0 kr";
  // Over 100 milliarder: hele milliarder med tusenskille («1 863 mrd. kr»).
  if (a >= 99_950_000) return `${Math.round(a / 1_000_000).toLocaleString("nb-NO").replace(/\s/g, "\u00a0")} mrd. kr`;
  if (a >= 999_500) return `${desimal(a / 1_000_000)} mrd. kr`;
  if (a >= 950) return `${Math.round(a / 1000)} mill. kr`;
  return "under 1 mill. kr";
}

export function medFortegn(tusen: number): string {
  if (tusen === 0) return "0";
  return `${tusen > 0 ? "+" : MINUS}${belop(tusen)}`;
}

export function prosent(andel: number): string {
  const p = andel * 100;
  if (p === 0) return "0 %";
  const a = Math.abs(p);
  return `${p > 0 ? "+" : MINUS}${a >= 10 ? Math.round(a) : desimal(a)} %`;
}

// Verdien slik den tegnes. For skatt og utbytte snur vi fortegnet, så høyre side
// alltid betyr «mer»: mer brukt, høyere skatter, mer utbytte.
export function vist(o: Pick<Omrade, "retning">, avvik: number): number {
  return o.retning === "skatt" || o.retning === "inntekt" ? -avvik || 0 : avvik;
}

// «16,4 mrd. kr mindre», «51,4 mrd. kr lavere skatter og avgifter».
// Med kort = true sløyfes det som alt står i overskriften: «51,4 mrd. kr lavere».
export function iOrd(o: Pick<Omrade, "retning">, avvik: number, kort = false): string {
  if (avvik === 0) return "som regjeringen";
  const v = vist(o, avvik);
  const b = belop(avvik);
  if (o.retning === "skatt") return `${b} ${v > 0 ? "høyere" : "lavere"}${kort ? "" : " skatter og avgifter"}`;
  if (o.retning === "inntekt") return `${b} ${v > 0 ? "mer" : "mindre"}${kort ? "" : " i utbytte"}`;
  return `${b} ${v > 0 ? "mer" : "mindre"}`;
}

// «Høyres», «Rødts», «Miljøpartiet De Grønnes».
export function genitiv(navn: string): string {
  return /[sxz]$/i.test(navn) ? `${navn}'` : `${navn}s`;
}

export function akseTekst(o: Pick<Omrade, "retning">): [string, string] {
  if (o.retning === "skatt") return ["Lavere skatter", "Høyere skatter"];
  if (o.retning === "inntekt") return ["Mindre utbytte", "Mer utbytte"];
  return ["Mindre enn regjeringen", "Mer enn regjeringen"];
}

// Hvor langt det er mellom partiet som vil gå lengst ned og det som vil gå lengst opp.
// Regjeringens forslag (0) regnes med, siden det er Arbeiderpartiets standpunkt.
export function spenn(o: Omrade) {
  const liste = Object.entries(o.avvik).map(([id, a]) => ({ id, v: vist(o, a), avvik: a }));
  const sortert = [...liste].sort((a, b) => a.v - b.v);
  const lavest = sortert[0];
  const hoyest = sortert[sortert.length - 1];
  const min = Math.min(lavest.v, 0);
  const maks = Math.max(hoyest.v, 0);
  return { liste, lavest, hoyest, min, maks, kroner: maks - min, andel: (maks - min) / Math.abs(o.gul_bok) };
}
