import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Demoadressen (…vercel.app) skal aldri havne i søkemotorene, heller ikke etter lansering.
  // Bare valgogpolitikk.no skal kunne søkes opp.
  async headers() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: ".*\\.vercel\\.app" }],
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
    ];
  },
};

export default nextConfig;
