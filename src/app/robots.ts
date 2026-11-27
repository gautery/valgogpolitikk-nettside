import type { MetadataRoute } from "next";

// Søkemotorene får lese alt. Utkast holdes ute med «noindex» på hver side,
// og demoadressen på vercel.app holdes ute i next.config.ts.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://www.valgogpolitikk.no/sitemap.xml",
  };
}
