import type { Metadata } from "next";
import Statsbudsjett from "@/components/statsbudsjett/Statsbudsjett";
import {
  forrigeId,
  hentBudsjett,
  hentHistorikk,
  hentOversikt,
  slank,
  standardId,
  verdiKart,
} from "@/lib/statsbudsjett";

// Tallene ligger i public/data/statsbudsjett og lages med scripts/statsbudsjett.py.

export const metadata: Metadata = {
  title: "Statsbudsjettet: hva pengene går til — valg og politikk",
  description:
    "Hva staten bruker penger på, og hvor pengene kommer fra. Regjeringens forslag og vedtatte budsjett fra 2014.",
  robots: { index: false, follow: false }, // utkast
};

export default function StatsbudsjettSide() {
  const oversikt = hentOversikt();
  const id = standardId(oversikt);
  const start = hentBudsjett(id)!;
  const fid = forrigeId(oversikt, oversikt.find((o) => o.id === id)!);
  const forrige = fid ? hentBudsjett(fid) : null;

  return (
    <>
      <div className="border-b border-amber-300 bg-amber-50 px-6 py-3">
        <p className="mx-auto max-w-[1100px] text-[13px] text-amber-900">
          <strong>Utkast.</strong> Siden er ikke godkjent for publisering og vises ikke i søkemotorer.
        </p>
      </div>
      <Statsbudsjett
        oversikt={oversikt}
        start={slank(start)}
        startForrige={forrige ? { tittel: forrige.tittel, kart: verdiKart(forrige.utgifter) } : null}
        historikk={hentHistorikk()}
      />
    </>
  );
}
