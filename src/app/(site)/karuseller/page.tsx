import type { Metadata } from "next";
import Klosser from "@/components/klosser/Klosser";

// Alle karusellene og skråblikkene, med kildene bak hvert tall.

export const metadata: Metadata = {
  title: "Karuseller — valg og politikk",
  description: "Alle karusellene fra Instagram og TikTok, med kildene bak hvert tall.",
};

export default function Karuseller() {
  return (
    <>
      <div className="px-6 pt-12 md:pt-16">
        <div className="mx-auto max-w-[1100px]">
          <h1 className="font-display text-[42px] leading-[1.02] sm:text-[56px]">Karuseller</h1>
          <p className="mt-4 max-w-[560px] text-[18px] leading-[1.55] text-text-secondary">
            Karusellene fra Instagram og TikTok, slide for slide, med kildene bak hvert tall.
          </p>
        </div>
      </div>
      <Klosser seksjoner={[{ type: "karuseller", antall: 100, visKnapp: false }]} />
    </>
  );
}
