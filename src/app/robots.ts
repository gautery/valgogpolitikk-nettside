import type { MetadataRoute } from "next";

// robots.txt: søkemotorer får lese hele siden, unntatt interne sider og API-et,
// og får vite hvor nettstedskartet ligger. Utkast skjules med «noindex» på hver side.

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/klosser", "/kontrollsenter"],
    },
    sitemap: "https://www.valgogpolitikk.no/sitemap.xml",
  };
}
