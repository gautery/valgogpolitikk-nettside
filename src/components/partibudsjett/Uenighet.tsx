"use client";

import Link from "next/link";
import { useState } from "react";

// Lista «Dette er partiene mest uenige om». Radene er regnet ut på tjeneren.

export type UenighetRad = {
  slug: string;
  navn: string;
  dekker: string;
  kroner: number; // spennet i 1 000 kroner
  andel: number; // spennet som andel av regjeringens forslag
  spennTekst: string; // «89,5 mrd. kr»
  andelTekst: string; // «5 %»
  fraTil: string; // «fra … (FrP) til … (MDG)»
  min: number;
  maks: number;
  punkter: number[]; // partienes plassering, i 1 000 kroner
  gulBok: number;
};

type Maal = "kroner" | "andel";

// Så mange områder vises før man trykker «Vis alle».
const FORST = 8;

export default function Uenighet({ rader, base }: { rader: UenighetRad[]; base: string }) {
  const [maal, setMaal] = useState<Maal>("kroner");
  const [alle, setAlle] = useState(false);
  const sortert = [...rader].sort((a, b) => b[maal] - a[maal]);
  const synlige = alle ? sortert : sortert.slice(0, FORST);
  // Felles skala for hele lista: alle radene har nullpunktet på samme sted.
  const skaler = (r: UenighetRad, x: number) => (maal === "kroner" ? x : x / Math.abs(r.gulBok));
  const min = Math.min(...sortert.map((r) => skaler(r, r.min)));
  const maks = Math.max(...sortert.map((r) => skaler(r, r.maks)));
  const pos = (x: number) => ((x - min) / (maks - min || 1)) * 100;
  const null0 = pos(0);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Sorter etter">
        <span className="mr-1 text-[14px] text-text-secondary">Sorter etter</span>
        {(
          [
            ["kroner", "kroner"],
            ["andel", "prosent av rammen"],
          ] as const
        ).map(([id, tekst]) => (
          <button
            key={id}
            type="button"
            aria-pressed={maal === id}
            onClick={() => setMaal(id)}
            className={`rounded-md border border-black px-3.5 py-2 text-[14px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              maal === id ? "bg-black text-white" : "bg-white text-black hover:bg-surface"
            }`}
          >
            {tekst}
          </button>
        ))}
      </div>

      <ol className="mt-8 border-t border-black">
        {synlige.map((r) => (
          <li key={r.slug} className="border-b border-border">
            <Link
              href={`${base}/omrade/${r.slug}`}
              className="group block py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="font-display text-[20px] leading-[1.15] text-black group-hover:underline group-hover:underline-offset-[4px]">
                  {r.navn}
                </h3>
                <span className="shrink-0 whitespace-nowrap text-[15px] font-semibold tabular-nums text-black">
                  {maal === "kroner" ? r.spennTekst : r.andelTekst}
                </span>
              </div>
              {r.dekker && <p className="mt-0.5 text-[13.5px] text-text-muted">{r.dekker}</p>}

              <div className="relative mt-4 h-[14px]" aria-hidden="true">
                <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-border" />
                <div
                  className="absolute top-1/2 h-[4px] -translate-y-1/2 rounded-full bg-black"
                  style={{
                    left: `${pos(skaler(r, r.min))}%`,
                    width: `max(${pos(skaler(r, r.maks)) - pos(skaler(r, r.min))}%, 2px)`,
                  }}
                />
                <div className="absolute top-[-2px] h-[18px] w-[2px] -translate-x-1/2 bg-accent" style={{ left: `${null0}%` }} />
                {r.punkter.map((p, i) => (
                  <span
                    key={i}
                    className="absolute top-1/2 h-[11px] w-[11px] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-black"
                    style={{ left: `${pos(skaler(r, p))}%` }}
                  />
                ))}
              </div>

              <p className="mt-3 text-[14.5px] leading-snug text-text-secondary">{r.fraTil}</p>
            </Link>
          </li>
        ))}
      </ol>
      {!alle && sortert.length > FORST && (
        <button
          type="button"
          onClick={() => setAlle(true)}
          className="mt-6 rounded-md border border-black bg-white px-5 py-3 text-[15px] font-semibold text-black hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Vis alle {sortert.length} områdene
        </button>
      )}
      <p className="mt-4 text-[13px] leading-relaxed text-text-muted">
        Hver prikk er ett parti. Den rosa streken er regjeringens forslag. Skalaen er den samme i hele lista.
      </p>
    </div>
  );
}
