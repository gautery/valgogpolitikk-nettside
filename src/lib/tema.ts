import fs from "fs";
import path from "path";
import matter from "gray-matter";

// Temasider leses fra content/tema/<slug>.md.
// Tekst og lister ligger i filene, så de kan redigeres uten å røre koden.

const TEMA_DIR = path.join(process.cwd(), "content", "tema");

export type Nokkeltall = { tall: string; tekst: string; kilde: string; lenke: string };
export type TemaKilde = { navn: string; utgiver: string; lenke: string; kommentar: string; bruk?: string };
export type TemaLenke = { tittel: string; lenke?: string; type?: string };

export type Tema = {
  slug: string;
  tittel: string;
  ingress: string;
  utkast: boolean;
  temaer: string[];
  nokkeltall: Nokkeltall[];
  kilder: TemaKilde[];
  analyser: TemaLenke[];
  karuseller: TemaLenke[];
  avsnitt: string[];
};

export function hentAlleTema(): Tema[] {
  if (!fs.existsSync(TEMA_DIR)) return [];
  return fs
    .readdirSync(TEMA_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((f) => lesTema(f.replace(/\.md$/, "")))
    .filter((t): t is Tema => t !== null);
}

export function lesTema(slug: string): Tema | null {
  const fil = path.join(TEMA_DIR, `${slug}.md`);
  if (!fs.existsSync(fil)) return null;
  const { data, content } = matter(fs.readFileSync(fil, "utf-8"));
  return {
    slug,
    tittel: data.tittel,
    ingress: data.ingress ?? "",
    utkast: data.utkast !== false,
    temaer: data.temaer ?? [],
    nokkeltall: data.nokkeltall ?? [],
    kilder: data.kilder ?? [],
    analyser: data.analyser ?? [],
    karuseller: data.karuseller ?? [],
    avsnitt: content
      .split(/\n\s*\n/)
      .map((a) => a.trim())
      .filter(Boolean),
  };
}
