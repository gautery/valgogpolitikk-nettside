"use client";

import { useState } from "react";
import { Stolpe } from "./Felles";

// Lønnsmottakeren: skatt, avgifter og noen velferdsgoder med hvert partis opplegg.
// Alle tall er gevinst i kroner per år, der pluss betyr bedre råd enn med regjeringens
// forslag. Tallene lages av scripts/typetilfeller/bygg.py.

type Alder = "21-28" | "29-30" | "31+";
type Barn = { barnehage: number; sfo: number; barnetrygd: number; utbetaling: number; foreldrefradrag: number };

export type LommebokParti = {
  id: string;
  navn: string;
  skatt: number;
  skatt_anslag: boolean;
  mat: number;
  mat_anslag: boolean;
  utbetaling: number;
  utbetaling_navn: string;
  utbetaling_anslag: boolean;
  bil: number;
  bil_anslag: boolean;
  fagforening: number;
  barn: Barn[][]; // [barn i barnehage 0–2][barn på SFO i 4. klasse 0–1]
  barnetrygd_anslag: boolean;
  tannlege: Record<Alder, number>;
  merknader: string[];
  kilder: string[];
};

const MINUS = "−";
const kr = (x: number) => `${Math.abs(x).toLocaleString("nb-NO").replace(/\s/g, " ")} kr`;
const fortegn = (x: number) => (x === 0 ? "0 kr" : `${x > 0 ? "+" : MINUS}${kr(x)}`);
const FOKUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function Bryter({ paa, sett, children }: { paa: boolean; sett: (v: boolean) => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={paa}
      onClick={() => sett(!paa)}
      className={`flex w-full items-center justify-between gap-4 rounded-md border border-black bg-white px-4 py-3 text-left text-[15.5px] font-semibold text-black ${FOKUS}`}
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

function Valg<T extends string | number>({
  navn,
  verdi,
  sett,
  valg,
}: {
  navn: string;
  verdi: T;
  sett: (v: T) => void;
  valg: [T, string][];
}) {
  // En id kan ikke ha mellomrom: aria-labelledby leser dem som flere id-er.
  const id = `valg-${navn.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
  return (
    <div className="rounded-md border border-black bg-white px-4 py-3">
      <p className="text-[15.5px] font-semibold text-black" id={id}>
        {navn}
      </p>
      <div className="mt-2.5 flex flex-wrap gap-2" role="radiogroup" aria-labelledby={id}>
        {valg.map(([v, tekst]) => (
          <button
            key={String(v)}
            type="button"
            role="radio"
            aria-checked={verdi === v}
            onClick={() => sett(v)}
            className={`min-w-[52px] rounded-md border border-black px-3.5 py-2 text-[14.5px] font-semibold ${FOKUS} ${
              verdi === v ? "bg-black text-white" : "bg-white text-black hover:bg-surface"
            }`}
          >
            {tekst}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Lommebok({ partier, liter }: { partier: LommebokParti[]; liter: number }) {
  const [fag, setFag] = useState(false);
  const [bil, setBil] = useState(false);
  const [alder, setAlder] = useState<Alder>("31+");
  const [bhg, setBhg] = useState(0);
  const [sfo, setSfo] = useState(false);
  const harBarn = bhg > 0 || sfo;

  const rader = partier
    .map((p) => {
      const b = p.barn[bhg][sfo ? 1 : 0];
      const deler = [
        { navn: "Skatt på lønn", v: p.skatt, anslag: p.skatt_anslag },
        { navn: "Mat og drikke", v: p.mat, anslag: p.mat_anslag },
        ...(p.utbetaling ? [{ navn: p.utbetaling_navn, v: p.utbetaling, anslag: p.utbetaling_anslag }] : []),
        ...(bil ? [{ navn: `Bensin, ${liter} liter`, v: p.bil, anslag: p.bil_anslag }] : []),
        ...(fag ? [{ navn: "Fagforeningsfradrag", v: p.fagforening, anslag: false }] : []),
        ...(alder !== "31+" ? [{ navn: "Tannlege", v: p.tannlege[alder], anslag: false }] : []),
        ...(bhg > 0 ? [{ navn: "Barnehage", v: b.barnehage, anslag: false }] : []),
        ...(sfo ? [{ navn: "SFO", v: b.sfo, anslag: false }] : []),
        ...(harBarn
          ? [
              { navn: "Barnetrygd", v: b.barnetrygd, anslag: p.barnetrygd_anslag },
              ...(b.utbetaling ? [{ navn: `${p.utbetaling_navn} for barna`, v: b.utbetaling, anslag: p.utbetaling_anslag }] : []),
              { navn: "Foreldrefradrag", v: b.foreldrefradrag, anslag: false },
            ]
          : []),
      ];
      return { p, deler, sum: deler.reduce((s, d) => s + d.v, 0) };
    })
    .sort((a, b) => b.sum - a.sum);

  const min = Math.min(0, ...rader.map((r) => r.sum));
  const maks = Math.max(0, ...rader.map((r) => r.sum));
  const null0 = ((0 - min) / (maks - min || 1)) * 100;

  return (
    <div>
      <div className="grid gap-x-6 gap-y-8 sm:grid-cols-2">
        <fieldset>
          <legend className="mb-3 font-display text-[19px] text-black">Deg</legend>
          <div className="flex flex-col gap-3">
            <Bryter paa={fag} sett={setFag}>
              Er fagorganisert
            </Bryter>
            <Bryter paa={bil} sett={setBil}>
              Kjører bensinbil
            </Bryter>
            <Valg
              navn="Alder"
              verdi={alder}
              sett={setAlder}
              valg={[
                ["21-28", "21–28 år"],
                ["29-30", "29–30 år"],
                ["31+", "31 eller eldre"],
              ]}
            />
          </div>
        </fieldset>
        <fieldset>
          <legend className="mb-3 font-display text-[19px] text-black">Barn</legend>
          <div className="flex flex-col gap-3">
            <Valg
              navn="Barn i barnehage"
              verdi={bhg}
              sett={setBhg}
              valg={[
                [0, "0"],
                [1, "1"],
                [2, "2"],
              ]}
            />
            <Bryter paa={sfo} sett={setSfo}>
              Ett barn i 4. klasse på SFO
            </Bryter>
          </div>
        </fieldset>
      </div>

      <div className="mt-10 mb-2 text-[12.5px] text-text-muted" aria-hidden="true">
        <div className="flex justify-between gap-4">
          <span>{min < 0 ? "← Dårligere råd" : ""}</span>
          <span>{maks > 0 ? "Bedre råd →" : ""}</span>
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
                {sum === 0 ? "som regjeringen" : `${kr(sum)} ${sum > 0 ? "bedre" : "dårligere"} råd i året`}
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
              <summary
                className={`cursor-pointer text-[13.5px] font-medium text-black underline decoration-border-light underline-offset-[3px] ${FOKUS}`}
              >
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
