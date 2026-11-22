// Typer og utregninger for «Trappa til toppen». Trygg å bruke i klientkomponenter.
// Tallene lages av scripts/trappa.py og ligger i public/data/trappa/trappa.json.

export type Intervall =
  | { a: number; b: number; k: number; n: number } // lukket intervall, lineær tetthet
  | { a: number; b: null; alfa: number; n: number }; // åpent toppintervall, Pareto

export type Maal = { andel: number; snittinntekt: number };

export type Trinn = {
  id: "median" | "topp10" | "topp1" | "topp01" | "topp001";
  topp: number;
  navn: string;
  grense: number;
  antall: number;
  anslag: boolean;
  offisiell?: Maal;
  med_overskudd?: Maal;
};

export type TrappaData = {
  aar: number;
  forskningsaar: number;
  antall: number;
  intervaller: Intervall[];
  trinn: Trinn[];
  snitt: { offisiell: number; med_overskudd: number };
  vegg: {
    median: { offisiell: number; med_overskudd: number };
    topp001: { offisiell: number; med_overskudd: number; forhold: number };
  };
  fingrupper: {
    id: string;
    navn: string;
    antall: number | null;
    skattbar: number;
    skattesats: number;
    i_selskaper: number;
  }[];
  topp100: { skatt_av_inntekt: number; personlig_inntektsskatt: number; skatt_av_formue: number };
  skattbar_formue_andel: number;
  kapital: { aar: number; samlet_mrd: number; milliardaerer: number; rikeste_mrd: number; fra_utlandet_andel: number };
  kilder: { navn: string; lenke: string }[];
};

/** Andelen voksne (25+) som tjener mindre enn `x` kroner i bruttoinntekt. */
export function andelUnder(x: number, data: TrappaData): number {
  let under = 0;
  for (const p of data.intervaller) {
    if (p.b !== null && x >= p.b) {
      under += p.n;
    } else if (x >= p.a) {
      if (p.b === null) {
        under += p.n * (1 - Math.pow(x / p.a, -p.alfa));
      } else {
        const u = (x - p.a) / (p.b - p.a);
        under += p.n * (u + (p.k * (u * u - u)) / 2);
      }
    }
  }
  return Math.min(1, Math.max(0, under / data.antall));
}
