import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Demoadressen på vercel.app og forhåndsvisningene skal ikke dukke opp i Google
  // som kopier av valgogpolitikk.no. Alle andre adresser enn det ekte domenet
  // får derfor beskjed om ikke å bli indeksert.
  async headers() {
    return [
      {
        source: "/:path*",
        missing: [{ type: "host", value: "(www\\.)?valgogpolitikk\\.no" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
