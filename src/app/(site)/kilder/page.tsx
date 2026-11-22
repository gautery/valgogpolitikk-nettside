import type { Metadata } from "next";
import KildeListe from "@/components/KildeListe";
import { hentKildeoversikt } from "@/lib/kilder";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Kildeovervåkning — valg og politikk",
  description:
    "Nytt fra regjeringen, Stortinget, Riksrevisjonen, SSB, Eurostat, tilsyn, partier og forskning, sortert etter tema.",
};

export default async function KilderSide() {
  const data = await hentKildeoversikt();

  return (
    <>
      <div className="border-b border-border bg-hero px-6 py-14 md:py-16">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-4 w-1 rounded-full bg-accent" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
              Oppdateres hver time
            </span>
          </div>
          <h1 className="mb-4 max-w-[640px] font-[family-name:var(--font-playfair)] text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[44px] lg:leading-[1.15]">
            Kildeovervåkning
          </h1>
          <p className="max-w-[560px] text-[15px] leading-relaxed text-white/70">
            Nytt fra regjeringen, Stortinget, Riksrevisjonen, SSB, Eurostat,
            tilsyn, partier og forskning, samlet på ett sted og sortert etter
            tema.
          </p>
        </div>
      </div>

      {data ? (
        <KildeListe data={data} />
      ) : (
        <div className="mx-auto max-w-[1100px] px-6 py-16 text-sm text-text-muted">
          Klarte ikke å hente oversikten akkurat nå. Prøv igjen om litt.
        </div>
      )}
    </>
  );
}
