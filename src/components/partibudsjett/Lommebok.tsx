"use client";

import { useState } from "react";
import { Stolpe } from "./Felles";

// Lønnsmottakeren: skatt og avgifter med hvert partis opplegg, med brytere for
// det som skiller mest mellom folk. Tallene lages av scripts/typetilfeller/bygg.py.

export type LommebokParti = {
  id: string;
  navn: string;
  skatt: number;
  mat: number;
  mat_anslag: boolean;
  utbetaling: number;
  bil: number;
  bil_anslag: boolean;
  fagforening: number;
  merknader: string[];
  kilder: string[];
};

const MINUS = "−";
const kr = (x: number) => `${Math.abs(x).toLocaleString("nb-NO").replace(/\s/g, " ")} kr`;
const fortegn = (x: number) => (x === 0 ? "0 kr" : `${x > 0 ? "+" : MINUS}${kr(x)}`);

function Bryter({ paa, sett, children }: { paa: boolean; sett: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={paa}
      onClick={() => sett(!paa)}
      className="flex w-full items-center justify-between gap-4 rounded-md border border-black bg-white px-4 py-3 text-left text-[15.5px] font-semibold text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent sm:w-auto sm:min-w-[250px]"
    >
      <span>{children}</span>
      <span
        aria-hidden="true"
        className={`relative h-[26px] w-[46px] shrink-0 rounded-full border border-black transition-colors ${paa ? "bg-black" : "bg-white"}`}
      >
        <span
          className={`absolute top-[2px] h-[20px] w-[20px] rounded-full transition-[left] ${paa ? "left-[22px] bg-white" : "left-[2px] bg-black"}`}
        />
      </span>
    </button>
  );
}

export default function Lommebok({ partier, liter }: { partier: LommebokParti[]; liter: number }) {
  const [fag, setFag] = useState(false);
  const [bil, setBil] = useState(false);

  const rader = partier
    .map((p) => {
      const deler = [
        { navn: "Skatt på lønn", v: p.skatt, anslag: false },
        { navn: "Mat og drikke", v: p.mat, anslag: p.mat_anslag },
        ...(p.utbetaling ? [{ navn: "Utbetaling", v: p.utbetaling, anslag: true }] : []),
        ...(bil ? [{ navn: `Bensin, ${liter} liter`, v: p.bil, anslag: p.bil_anslag }] : []),
        ...(fag ? [{ navn: "Fagforeningsfradrag", v: p.fagforening, anslag: false }] : []),
      ];
      return { p, deler, sum: deler.reduce((s, d) => s + d.v, 0) };
    })
    .sort((a, b) => a.sum - b.sum);

  const min = Math.min(0, ...rader.map((r) => r.sum));
  const maks = Math.max(0, ...rader.map((r) => r.sum));
  const null0 = ((0 - min) / (maks - min || 1)) * 100;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row" role="group" aria-label="Tilpass eksempelet">
        <Bryter paa={fag} sett={setFag}>
          Er fagorganisert
        </Bryter>
        <Bryter paa={bil} sett={setBil}>
          Kjører bensinbil
        </Bryter>
      </div>

      <div className="mt-9 mb-2 text-[12.5px] text-text-muted" aria-hidden="true">
        <div className="flex justify-between gap-4">
          <span>{min < 0 ? "← Betaler mindre" : ""}</span>
          <span>{maks > 0 ? "Betaler mer →" : ""}</span>
        </div>
        <div className="relative mt-1 h-[18px]">
          <span
            className={`absolute top-0 whitespace-nowrap font-medium text-black ${null0 < 22 ? "" : null0 > 78 ? "-translate-x-full" : "-translate-x-1/2"}`}
            style={{ left: `${null0}%` }}
          >
            Regjeringens forslag
          </span>
        </div>
      </div>

      <ol className="border-t border-black" aria-live="polite">
        {rader.map(({ p, deler, sum }) => (
          <li key={p.id} className="border-b border-border py-5">
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-display text-[22px] leading-none text-black">{p.navn}</h3>
              <p className="text-right text-[15.5px] font-semibold leading-snug tabular-nums text-black">
                {sum === 0 ? "som regjeringen" : `${kr(sum)} ${sum < 0 ? "mindre" : "mer"} i året`}
              </p>
            </div>
            <div className="mt-3">
              <Stolpe v={sum} min={min} maks={maks} />
            </div>
            <dl className="mt-4 grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 text-[14px] leading-snug">
              {deler.map((d) => (
                <div key={d.navn} className="contents">
                  <dt className="text-text-secondary">
                    {d.navn}
                    {d.anslag && d.v !== 0 && <span className="text-text-muted"> (anslag)</span>}
                  </dt>
                  <dd className="text-right tabular-nums text-text-primary">{fortegn(d.v)}</dd>
                </div>
              ))}
            </dl>
            <details className="mt-3">
              <summary className="cursor-pointer text-[13.5px] font-medium text-black underline decoration-border-light underline-offset-[3px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                Forutsetninger og kilde
              </summary>
              <div className="mt-2 space-y-2 text-[13.5px] leading-relaxed text-text-secondary">
                {p.merknader.map((m) => (
                  <p key={m}>{m}</p>
                ))}
                <p className="text-text-muted">Kilde: {p.kilder.join(". ")}.</p>
              </div>
            </details>
          </li>
        ))}
      </ol>
    </div>
  );
}
