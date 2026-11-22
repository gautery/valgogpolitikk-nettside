import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Kildesider for karuseller leses fra content/karuseller/<slug>.md.
// Bildene ligger i public/karuseller/<mappe>/01.webp, 02.webp osv.

const DIR = path.join(process.cwd(), "content", "karuseller");

export type Sikkerhet = "sikkert" | "ganske sikkert" | "middels" | "usikkert";
export type SlideKilde = { navn: string; lenke?: string; merknad?: string };
export type Slide = {
  tittel: string;
  tekst: string;
  tall?: string;
  sikkerhet?: Sikkerhet;
  kilder: SlideKilde[];
  bilde: string;
};

export type Karusell = {
  slug: string;
  tittel: string;
  ingress: string;
  utkast: boolean;
  instagram: string;
  tema: string;
  slides: Slide[];
  avsnitt: string[];
};

export function hentAlleKaruseller(): Karusell[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => lesKarusell(f.replace(/\.md$/, "")))
    .filter((k): k is Karusell => k !== null);
}

export function lesKarusell(slug: string): Karusell | null {
  const fil = path.join(DIR, `${slug}.md`);
  if (!fs.existsSync(fil)) return null;
  const { data, content } = matter(fs.readFileSync(fil, "utf-8"));
  const mappe = data.mappe ?? slug;
  return {
    slug,
    tittel: data.tittel,
    ingress: data.ingress ?? "",
    utkast: data.utkast !== false,
    instagram: data.instagram ?? "",
    tema: data.tema ?? "",
    slides: (data.slides ?? []).map((s: Omit<Slide, "bilde">, i: number) => ({
      ...s,
      kilder: s.kilder ?? [],
      bilde: `/karuseller/${mappe}/${String(i + 1).padStart(2, "0")}.webp`,
    })),
    avsnitt: content
      .split(/\n\s*\n/)
      .map((a) => a.trim())
      .filter(Boolean),
  };
}
