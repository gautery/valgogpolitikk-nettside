"use client";

import { useRef, useState } from "react";
import { KOLONNER, RadInnhold, REKKEFOLGE, Tegnforklaring, vinner, type AvtaleSak, type Utfall } from "./avtale-felles";

export type { AvtaleSak };

// Budsjettavtalen sak for sak. Øverst står tavla: alle sakene som rader, med ett merke per
// parti. Et trykk på en rad åpner kortet for saken. Vanlig visning er ett kort om gangen,
// med knapper for forrige og neste, og «Vis som tekst» viser alt under hverandre.
// Teksten ligger i content/budsjettavtalen.yml og redigeres i Pages CMS.

const FOKUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const KNAPP = `rounded-md border border-black px-5 py-3 text-[15.5px] font-semibold ${FOKUS}`;
const LITEN = `rounded-md border border-black px-3.5 py-2 text-[14.5px] font-semibold ${FOKUS}`;
const UTFALL: Record<Utfall, { tekst: string; klasse: string }> = {
  "fikk det": { tekst: "Fikk det", klasse: "border-black bg-black text-white" },
  "fikk noe": { tekst: "Fikk noe", klasse: "border-black bg-white text-black" },
  "fikk ikke": { tekst: "Fikk ikke", klasse: "border-border bg-surface text-text-muted" },
};
function Tavle({ saker, valgt, velg }: { saker: AvtaleSak[]; valgt: number | null; velg: (i: number) => void }) {
  return (
    <div>
      <div aria-hidden="true" className={`${KOLONNER} border-b border-black px-2 pb-2 text-[13px] font-semibold text-black`}>
        <span>Trykk på en sak</span>
        {REKKEFOLGE.map((p) => (
          <span key={p} className="text-center">
            {p}
          </span>
        ))}
      </div>
      <ol>
        {saker.map((s, i) => (
          <li key={s.tittel} className="border-b border-border-light">
            <button
              type="button"
              onClick={() => velg(i)}
              aria-current={valgt === i ? "true" : undefined}
              className={`${KOLONNER} w-full px-2 py-2.5 text-left hover:shadow-[inset_3px_0_0_#000] ${FOKUS} ${vinner(s).ap ? "bg-[#ffd1ee]" : "bg-white"} ${
                valgt === i ? "shadow-[inset_3px_0_0_#000]" : ""
              }`}
            >
              <RadInnhold s={s} />
            </button>
          </li>
        ))}
      </ol>
      <Tegnforklaring className="mt-4 text-text-secondary" />
    </div>
  );
}

function Prikk({ ap }: { ap: boolean }) {
  return <span aria-hidden="true" className={`h-[10px] w-[10px] shrink-0 ${ap ? "rounded-full bg-accent" : "rounded-[2px] bg-black"}`} />;
}

function Kort({ s, overskrift }: { s: AvtaleSak; overskrift: React.ReactNode }) {
  return (
    <>
      {overskrift}
      <p className="mt-3 flex items-center gap-2 text-[15px] font-semibold text-black">
        <Prikk ap={vinner(s).ap} />
        {vinner(s).tekst}
      </p>
      <p className="mt-3 text-[16.5px] leading-[1.5] text-black">
        <strong className="font-semibold">Avtalen:</strong> {s.avtalen}
      </p>
      <p className="mt-1.5 text-[15px] leading-[1.5] text-text-secondary">
        <strong className="font-semibold text-black">Regjeringen foreslo:</strong> {s.regjeringen}
      </p>
      <ul className="mt-5 space-y-3 border-t border-border-light pt-4">
        {s.krav.map((k) => (
          <li key={k.parti} className="flex items-start justify-between gap-4">
            <p className="text-[15.5px] leading-[1.5] text-text-secondary">
              <strong className="font-semibold text-black">{k.parti} ville:</strong> {k.krav}
            </p>
            <span className={`inline-block shrink-0 rounded-[3px] border px-2 py-0.5 text-[12.5px] font-semibold leading-tight ${(UTFALL[k.utfall] ?? UTFALL["fikk ikke"]).klasse}`}>
              {(UTFALL[k.utfall] ?? UTFALL["fikk ikke"]).tekst}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function Avtale({ saker }: { saker: AvtaleSak[] }) {
  const [tekst, settTekst] = useState(false);
  const [nr, settNr] = useState(0);
  const topp = useRef<HTMLHeadingElement>(null);
  const n = saker.length;

  function gaTil(i: number) {
    settNr(i);
    settTekst(false);
    requestAnimationFrame(() => {
      const rolig = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      topp.current?.scrollIntoView({ block: "start", behavior: rolig ? "auto" : "smooth" });
      topp.current?.focus({ preventScroll: true });
    });
  }

  if (n === 0) return null;

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:items-start lg:gap-14">
      <div>
        <Tavle saker={saker} valgt={tekst ? null : nr} velg={gaTil} />
        <button
          type="button"
          aria-pressed={tekst}
          onClick={() => settTekst(!tekst)}
          className={`mt-6 ${LITEN} ${tekst ? "bg-black text-white" : "bg-white text-black hover:bg-surface"}`}
        >
          {tekst ? "Vis ett tema om gangen" : "Vis som sammenhengende tekst"}
        </button>
      </div>

      {tekst ? (
        <ol className="mt-8 border-t border-black lg:mt-0">
          {saker.map((s) => (
            <li key={s.tittel} className="border-b border-border-light py-7">
              <Kort s={s} overskrift={<h3 className="font-display text-[24px] leading-tight text-black">{s.tittel}</h3>} />
            </li>
          ))}
        </ol>
      ) : (
        <div className="mt-10 border-t border-black pt-6 lg:mt-0">
          <p className="text-[14.5px] font-semibold text-text-muted">
            Tema {nr + 1} av {n}
          </p>
          <div aria-live="polite">
            <Kort
              s={saker[nr]}
              overskrift={
                <h3
                  ref={topp}
                  tabIndex={-1}
                  className="mt-1.5 scroll-mt-28 font-display text-[30px] leading-[1.08] text-black outline-none sm:text-[38px]"
                >
                  {saker[nr].tittel}
                </h3>
              }
            />
          </div>
          <div className="sticky bottom-0 z-10 -mx-6 mt-8 flex items-center justify-between gap-3 border-t border-black bg-white px-6 py-3 lg:static lg:mx-0 lg:px-0">
            <button type="button" disabled={nr === 0} onClick={() => gaTil(nr - 1)} className={`${KNAPP} bg-white px-4 text-black hover:bg-surface disabled:cursor-not-allowed disabled:border-border disabled:text-text-muted`}>
              Forrige
            </button>
            <button type="button" disabled={nr === n - 1} onClick={() => gaTil(nr + 1)} className={`${KNAPP} bg-black text-white hover:bg-accent disabled:cursor-not-allowed disabled:border-border disabled:bg-surface disabled:text-text-muted`}>
              {nr === n - 1 ? "Siste tema" : `Neste: ${saker[nr + 1].tittel}`}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
