import Link from "next/link";
import { AVTALE_LENKE, avtaleSaker, lesBudsjettavtalen } from "@/lib/budsjettavtalen";
import { KOLONNER, RadInnhold, REKKEFOLGE, Tegnforklaring, vinner } from "./avtale-felles";

// De første radene av tavla fra siden om budsjettavtalen, som lenke til hele tavla.
// Brukes i hovedsaken på forsiden og ved siden av kommentaren.
export default function TavleSmakebit({
  antall = 6,
  ramme = false,
  hendelse = "tavle-smakebit",
}: {
  antall?: number;
  /** Tynn ramme rundt, for hvit bakgrunn. */
  ramme?: boolean;
  hendelse?: string;
}) {
  const rader = avtaleSaker(lesBudsjettavtalen()).slice(0, antall);
  if (rader.length === 0) return null;
  return (
    <div>
      <Link
        href={AVTALE_LENKE}
        tabIndex={-1}
        aria-hidden="true"
        className={`block overflow-hidden rounded-[10px] bg-white ${ramme ? "border border-black" : ""}`}
        data-umami-event={hendelse}
      >
        <div className={`${KOLONNER} border-b border-black px-3 py-2 text-[13px] font-semibold text-black`}>
          <span>Sak</span>
          {REKKEFOLGE.map((p) => (
            <span key={p} className="text-center">
              {p}
            </span>
          ))}
        </div>
        {rader.map((r) => (
          <div
            key={r.tittel}
            className={`${KOLONNER} border-b border-border-light px-3 py-2.5 last:border-b-0 ${vinner(r).ap ? "bg-[#ffd1ee]" : "bg-white"}`}
          >
            <RadInnhold s={r} />
          </div>
        ))}
      </Link>
      <Tegnforklaring className="mt-3 text-black" />
    </div>
  );
}
