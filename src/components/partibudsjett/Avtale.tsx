"use client";

import { useRef, useState } from "react";

// Budsjettavtalen sak for sak. Vanlig visning er ett kort om gangen, med knapper for
// forrige og neste. «Alle temaer» hopper rett til et kort, og «Vis som tekst» viser alt
// under hverandre. Dataene ligger i public/data/budsjettavtale.

type Utfall = "fikk" | "delvis" | "ikke";
type RegUtfall = "holdt" | "litt" | "etter";
type Krav = { parti: string; krav: string; utfall: Utfall };
export type AvtaleSak = { tittel: string; avtalen: string; regjeringen: string; regjeringen_utfall: RegUtfall; krav: Krav[] };

const FOKUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const KNAPP = `rounded-md border border-black px-5 py-3 text-[15.5px] font-semibold ${FOKUS}`;
const LITEN = `rounded-md border border-black px-3.5 py-2 text-[14.5px] font-semibold ${FOKUS}`;
const UTFALL: Record<Utfall, { tekst: string; klasse: string }> = {
  fikk: { tekst: "Fikk det", klasse: "border-black bg-black text-white" },
  delvis: { tekst: "Fikk noe", klasse: "border-black bg-white text-black" },
  ikke: { tekst: "Fikk ikke", klasse: "border-border bg-surface text-text-muted" },
};
const REKKEFOLGE = ["Sp", "SV", "Rødt"];
const liste = (a: string[]) => a.join(", ").replace(/, ([^,]*)$/, " og $1");

// Hvem vant saken: Ap når avtalen lar regjeringens forslag stå, ellers partiene som fikk noe.
function vinner(s: AvtaleSak): { ap: boolean; tekst: string } {
  const med = (u: Utfall) =>
    s.krav.filter((k) => k.utfall === u).map((k) => k.parti).sort((a, b) => REKKEFOLGE.indexOf(a) - REKKEFOLGE.indexOf(b));
  const fullt = med("fikk");
  const noe = med("delvis");
  if (s.regjeringen_utfall === "holdt" || fullt.length + noe.length === 0) return { ap: true, tekst: "Ap fikk viljen sin" };
  const deler = [];
  if (fullt.length) deler.push(`${liste(fullt)} fikk fullt gjennomslag`);
  if (noe.length) deler.push(`${liste(noe)} fikk noe gjennomslag`);
  return { ap: false, tekst: deler.join(". ") };
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
            <span className={`inline-block shrink-0 rounded-[3px] border px-2 py-0.5 text-[12.5px] font-semibold leading-tight ${UTFALL[k.utfall].klasse}`}>
              {UTFALL[k.utfall].tekst}
            </span>
          </li>
        ))}
      </ul>
    </>
  );
}

export default function Avtale({ saker }: { saker: AvtaleSak[] }) {
  const [tekst, settTekst] = useState(false);
  const [meny, settMeny] = useState(false);
  const [nr, settNr] = useState(0);
  const topp = useRef<HTMLHeadingElement>(null);
  const n = saker.length;

  function gaTil(i: number) {
    settNr(i);
    settMeny(false);
    settTekst(false);
    requestAnimationFrame(() => topp.current?.focus());
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2.5 border-b border-black pb-4">
        <button type="button" aria-expanded={meny} onClick={() => settMeny(!meny)} className={`${LITEN} ${meny ? "bg-black text-white" : "bg-white text-black hover:bg-surface"}`}>
          Alle temaer
        </button>
        <button type="button" aria-pressed={tekst} onClick={() => { settTekst(!tekst); settMeny(false); }} className={`${LITEN} ${tekst ? "bg-black text-white" : "bg-white text-black hover:bg-surface"}`}>
          {tekst ? "Vis ett tema om gangen" : "Vis som sammenhengende tekst"}
        </button>
      </div>

      {meny && (
        <ol className="border-b border-black py-2">
          {saker.map((s, i) => (
            <li key={s.tittel}>
              <button type="button" onClick={() => gaTil(i)} className={`block w-full py-2 text-left ${FOKUS}`}>
                <span className={`block text-[15.5px] font-semibold ${!tekst && i === nr ? "text-accent" : "text-black"}`}>{s.tittel}</span>
                <span className="mt-0.5 flex items-center gap-2 text-[13.5px] text-text-secondary">
                  <Prikk ap={vinner(s).ap} />
                  {vinner(s).tekst}
                </span>
              </button>
            </li>
          ))}
        </ol>
      )}

      {tekst ? (
        <ol>
          {saker.map((s) => (
            <li key={s.tittel} className="border-b border-border-light py-7">
              <Kort s={s} overskrift={<h3 className="font-display text-[24px] leading-tight text-black">{s.tittel}</h3>} />
            </li>
          ))}
        </ol>
      ) : (
        <div>
          <p className="mt-6 text-[14.5px] font-semibold text-text-muted">
            Tema {nr + 1} av {n}
          </p>
          <div aria-live="polite">
            <Kort
              s={saker[nr]}
              overskrift={
                <h3 ref={topp} tabIndex={-1} className="mt-1.5 font-display text-[30px] leading-[1.08] text-black outline-none sm:text-[38px]">
                  {saker[nr].tittel}
                </h3>
              }
            />
          </div>
          <div className="sticky bottom-0 z-10 -mx-6 mt-8 flex items-center justify-between gap-3 border-t border-black bg-white px-6 py-3">
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
