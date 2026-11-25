import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { hentAlleTema } from "@/lib/tema";
import { hentAlleKaruseller } from "@/lib/karuseller";
import { hentAlleSkraablikk } from "@/lib/skraablikk";
import { hentAlleSider } from "@/lib/sider";
import { UTKAST } from "@/lib/utkast";

// Nettstedskartet (valgogpolitikk.no/sitemap.xml) som sendes inn i Google Search Console.
// Lages automatisk av innholdet. Sider merket som utkast er ikke med.

const NETTSTED = "https://www.valgogpolitikk.no";

export default function sitemap(): MetadataRoute.Sitemap {
  const adresser: string[] = ["/", "/kilder", "/skraablikk"];

  if (!UTKAST.trappa) adresser.push("/trappa");
  if (!UTKAST.statsbudsjett) adresser.push("/statsbudsjett");

  for (const s of hentAlleSider()) if (!s.utkast) adresser.push(`/${s.slug}`);
  for (const k of hentAlleKaruseller()) if (!k.utkast) adresser.push(`/${k.slug}`);
  for (const s of hentAlleSkraablikk()) if (!s.utkast) adresser.push(`/skraablikk/${s.slug}`);
  for (const t of hentAlleTema()) if (!t.utkast) adresser.push(`/tema/${t.slug}`);

  const innlegg = getAllPosts().map((p) => {
    const dato = new Date(p.date);
    return {
      url: `${NETTSTED}/innlegg/${p.slug}`,
      ...(isNaN(dato.getTime()) ? {} : { lastModified: dato }),
    };
  });

  return [...adresser.map((a) => ({ url: `${NETTSTED}${a === "/" ? "" : a}` })), ...innlegg];
}
