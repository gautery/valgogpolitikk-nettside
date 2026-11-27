import Link from "next/link";
import type { Partibudsjett } from "@/lib/partibudsjett-felles";

export const ROT = "/statsbudsjett/partiene";

export function Utkastlinje({ provedata, aar }: { provedata: boolean; aar: number }) {
  return (
    <div className="border-b border-amber-300 bg-amber-50 px-6 py-3">
      <p className="mx-auto max-w-[1100px] text-[13px] leading-relaxed text-amber-900">
        <strong>Utkast{provedata ? " med prøvedata" : ""}.</strong>{" "}
        {provedata && <>Tallene gjelder budsjettet for {aar} og er hentet fra fjorårets finansinnstilling. </>}
        Siden er ikke godkjent for publisering og vises ikke i søkemotorer.
      </p>
    </div>
  );
}

export function Tilbake({ aar, tekst = "Alle partiene og områdene" }: { aar: number; tekst?: string }) {
  return (
    <p className="mb-5 text-[15px] font-semibold text-black">
      <Link
        href={ROT}
        className="underline decoration-border-light underline-offset-[4px] hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      >
        Statsbudsjettet {aar}, parti for parti
      </Link>
      <span className="sr-only">. {tekst}</span>
    </p>
  );
}

// Én stolpe ut fra nullpunktet, som er regjeringens forslag. Skalaen (min–maks) er
// felles for alle stolpene i samme liste, så lengdene kan sammenlignes.
export function Stolpe({ v, min, maks }: { v: number; min: number; maks: number }) {
  const bredde = maks - min || 1;
  const null0 = ((0 - min) / bredde) * 100;
  const til = ((v - min) / bredde) * 100;
  const venstre = Math.min(null0, til);
  const lengde = Math.abs(til - null0);
  return (
    <div className="relative h-[12px] w-full" aria-hidden="true">
      <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
      {lengde > 0 && (
        <div
          className={`absolute top-0 h-full bg-black ${v > 0 ? "rounded-r-[3px]" : "rounded-l-[3px]"}`}
          style={{ left: `${venstre}%`, width: `max(${lengde}%, 2px)` }}
        />
      )}
      <div className="absolute top-[-3px] h-[18px] w-[2px] -translate-x-1/2 bg-black" style={{ left: `${null0}%` }} />
    </div>
  );
}

export function Akse({ venstre, hoyre, min, maks }: { venstre: string; hoyre: string; min: number; maks: number }) {
  const null0 = ((0 - min) / (maks - min || 1)) * 100;
  return (
    <div className="mb-2 text-[12.5px] text-text-muted" aria-hidden="true">
      <div className="flex justify-between gap-4">
        <span>{min < 0 ? `← ${venstre}` : ""}</span>
        <span className="text-right">{maks > 0 ? `${hoyre} →` : ""}</span>
      </div>
      <div className="relative mt-1 h-[18px]">
        <span
          className={`absolute top-0 whitespace-nowrap font-medium text-black ${
            null0 < 22 ? "" : null0 > 78 ? "-translate-x-full" : "-translate-x-1/2"
          }`}
          style={{ left: `${null0}%` }}
        >
          Regjeringens forslag
        </span>
      </div>
    </div>
  );
}

export function Kilde({ data }: { data: Partibudsjett }) {
  return (
    <p className="mt-8 max-w-[680px] text-[13.5px] leading-relaxed text-text-muted">
      Kilde:{" "}
      <a
        href={data.kilde_lenke}
        className="font-medium text-text-primary underline decoration-border-light underline-offset-[3px] hover:text-accent"
      >
        {data.kilde}
      </a>
      , tabellen over partienes forslag til rammevedtak. Tallene viser hvert partis eget forslag, før
      forhandlinger og forlik.
    </p>
  );
}
