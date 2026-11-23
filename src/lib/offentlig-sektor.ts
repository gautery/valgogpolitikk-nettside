import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Siden /offentlig-sektor.
// Tall: public/data/offentlig-sektor/offentlig-sektor.json, lages med scripts/offentlig_sektor.py.
// Tekst: content/offentlig-sektor.yml, redigeres i Pages CMS under «Hvor stor er offentlig sektor?».

export type Post = { navn: string; mrd: number };
export type Land = {
  kode: string;
  navn: string;
  norden: boolean;
  offentlig_betalt_andel: number;
  fellesgoder_pst_bnp: number;
  kontantytelser_pst_bnp: number | null;
};

export type OffentligSektorData = {
  aar: number;
  hentet: string;
  totalt_mrd: number;
  fastlands_bnp_mrd: number;
  andel_av_fastlands_bnp: number;
  typer: { id: "overforinger" | "velferd" | "fellesgoder" | "annet"; navn: string; mrd: number }[];
  overforinger: Post[];
  velferd: Post[];
  brukerbetalinger_mrd: number;
  fellesgoder: Post[];
  naeringsstotte_mrd: number;
  land: Land[];
  eu: Land;
  kilder: { navn: string; lenke: string }[];
};

/** Hvem som har skrevet avsnittet. Bare «gaute» er godkjent tekst. */
export type AvsnittType = "gaute" | "forslag" | "tall" | "vurder" | "mangler" | "figur";
export type Avsnitt = { type: AvsnittType; tekst: string };
export type Figur = "tre-typer" | "overforinger" | "velferd" | "fellesgoder" | "land" | "";
export type Seksjon = { figur: Figur; tittel: string; avsnitt: Avsnitt[] };

export type OffentligSektorTekst = {
  utkast: boolean;
  tittel: string;
  beskrivelse: string;
  seksjoner: Seksjon[];
  gjenstar: string[];
  metode: string[];
};

export function hentOffentligSektor(): OffentligSektorData {
  const fil = path.join(process.cwd(), "public", "data", "offentlig-sektor", "offentlig-sektor.json");
  return JSON.parse(fs.readFileSync(fil, "utf-8")) as OffentligSektorData;
}

export function lesOffentligSektorTekst(): OffentligSektorTekst {
  const fil = path.join(process.cwd(), "content", "offentlig-sektor.yml");
  const d = matter(`---\n${fs.readFileSync(fil, "utf-8")}\n---`).data;
  return {
    utkast: d.utkast !== false,
    tittel: d.tittel ?? "",
    beskrivelse: d.beskrivelse ?? "",
    seksjoner: (d.seksjoner ?? [])
      .filter((s: Seksjon | null) => s)
      .map((s: Partial<Seksjon>) => ({
        figur: (s.figur ?? "") as Figur,
        tittel: s.tittel ?? "",
        avsnitt: (s.avsnitt ?? []).filter((a: Avsnitt | null) => a && (a.tekst || a.type === "figur")),
      })),
    gjenstar: (d.gjenstar ?? []).filter(Boolean),
    metode: (d.metode ?? []).filter(Boolean),
  };
}
