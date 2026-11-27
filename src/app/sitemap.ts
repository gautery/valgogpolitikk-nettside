import type { MetadataRoute } from "next";
import { hentAlleKaruseller } from "@/lib/karuseller";
import { hentAlleSider } from "@/lib/sider";
import { hentAlleSkraablikk } from "@/lib/skraablikk";
import { hentAlleTema } from "@/lib/tema";
import { UTKAST } from "@/lib/utkast";

// Nettstedskartet til søkemotorene. Bare sider som ikke er utkast står her,
// så en side kommer med av seg selv når «Utkast» fjernes i Pages CMS.
// Eksempelinnleggene under /analyser er holdt utenfor.

const ADRESSE = "https://www.valgogpolitikk.no";

export default function sitemap(): MetadataRoute.Sitemap {
  const karuseller = hentAlleKaruseller().filter((k) => !k.utkast);
  const skraablikk = hentAlleSkraablikk().filter((s) => !s.utkast);
  const stier = [
    "/",
    "/kilder",
    ...hentAlleSider().filter((s) => !s.utkast).map((s) => `/${s.slug}`),
    ...(karuseller.length || skraablikk.length ? ["/karuseller"] : []),
    ...karuseller.map((k) => `/${k.slug}`),
    ...skraablikk.map((s) => `/skraablikk/${s.slug}`),
    ...hentAlleTema().filter((t) => !t.utkast).map((t) => `/tema/${t.slug}`),
    ...(UTKAST.trappa ? [] : ["/trappa"]),
    ...(UTKAST.statsbudsjett ? [] : ["/statsbudsjett"]),
  ];
  return [...new Set(stier)].map((sti) => ({ url: `${ADRESSE}${sti === "/" ? "" : sti}` }));
}
