import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Skråblikk: karuseller med en spøk på hver slide, og en forklaring som rulles ut.
// Filene ligger i content/skraablikk/<adresse>.md og redigeres i Pages CMS.

const DIR = path.join(process.cwd(), "content", "skraablikk");

export type SkraaSlide = {
  bilde: string;
  tekst: string;
  forklaring: string;
  kilder: { navn: string; lenke?: string }[];
};

export type Skraablikk = {
  slug: string;
  tittel: string;
  ingress: string;
  utkast: boolean;
  instagram: string;
  dato: string;
  slides: SkraaSlide[];
};

function dato(v: unknown) {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  return v ? String(v) : "";
}

export function lesSkraablikk(slug: string): Skraablikk | null {
  const fil = path.join(DIR, `${slug}.md`);
  if (!fs.existsSync(fil)) return null;
  const { data } = matter(fs.readFileSync(fil, "utf-8"));
  return {
    slug,
    tittel: data.tittel ?? "",
    ingress: data.ingress ?? "",
    utkast: data.utkast !== false,
    instagram: data.instagram ?? "",
    dato: dato(data.dato),
    slides: (data.slides ?? [])
      .filter(Boolean)
      .map((s: Partial<SkraaSlide>) => ({
        bilde: s.bilde ?? "",
        tekst: s.tekst ?? "",
        forklaring: (s.forklaring ?? "").trim(),
        kilder: (s.kilder ?? []).filter((k) => k && k.navn),
      })),
  };
}

export function hentAlleSkraablikk(): Skraablikk[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => lesSkraablikk(f.replace(/\.md$/, "")))
    .filter((s): s is Skraablikk => s !== null)
    .sort((a, b) => b.dato.localeCompare(a.dato));
}
