"use client";

import { useRef, useState } from "react";

// Budsjettomaten: ett spørsmål om gangen, hvert svar med prislapp. Etter hvert svar
// vises hvem som vil hva, og til slutt må budsjettet gå opp. Dataene lages av
// scripts/budsjettomat/bygg.py. «verdi» går fra −1 til 1, der 0 er regjeringens forslag.

type Valg = { verdi: number; tekst: string; pris: number; pristekst: string };
type Plassering = { verdi: number | null; tekst: string; kilde?: string };
export type Sporsmal = {
  id: string;
  tittel: string;
  sporsmal: string;
  bakgrunn: string;
  valg: Valg[];
  partier: Record<string, Plassering>;
};
export type OmatData = {
  aar: number;
  innbyggere_mill: number;
  partier: { id: string; navn: string }[];
  sporsmal: Sporsmal[];
  ikke_med: string[];
};

const FOKUS = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";
const KNAPP = `rounded-md border border-black px-5 py-3 text-[15.5px] font-semibold ${FOKUS}`;
const mrd = (x: number) => `${Math.abs(x).toLocaleString("nb-NO", { maximumFractionDigits: 1 })} mrd. kr`;
const fortegn = (x: number) => (x > 0 ? 1 : x < 0 ? -1 : 0);
const stor = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function saldotekst(s: number) {
  if (Math.abs(s) < 0.05) return "som regjeringen";
  return `${mrd(s)} ${s > 0 ? "mer" : "mindre"} enn regjeringen`;
}

const BETALING = {
  pluss: {
    sporsmal: "Hvordan betaler du?",
    valg: ["Høyere skatter", "Kutt andre steder", "Mer oljepenger"],
  },
  minus: {
    sporsmal: "Hva gjør du med pengene?",
    valg: ["Lavere skatter", "Mer til velferd", "Mindre oljepenger"],
  },
};

type Enighet = "enig" | "delvis" | "uenig" | "ukjent";
function enighet(u: number, p: number | null): Enighet {
  if (p === null) return "ukjent";
  if (fortegn(u) === fortegn(p)) return "enig";
  return fortegn(u) === 0 || fortegn(p) === 0 ? "delvis" : "uenig";
}
const ENIGHET_TEKST: Record<Enighet, string> = { enig: "Enig", delvis: "Delvis", uenig: "Uenig", ukjent: "Vet ikke" };

export default function Budsjettomat({ data }: { data: OmatData }) {
  const n = data.sporsmal.length;
  const [svar, settSvar] = useState<(number | null)[]>(() => Array(n).fill(null));
  const [steg, settSteg] = useState(0); // 0..n−1 spørsmål, n betaling, n+1 resultat
  const [betaling, settBetaling] = useState<string | null>(null);
  const [kopiert, settKopiert] = useState(false);
  const topp = useRef<HTMLHeadingElement>(null);

  const valgt = (i: number) => (svar[i] === null ? null : data.sporsmal[i].valg[svar[i] as number]);
  const saldo = data.sporsmal.reduce((sum, _, i) => sum + (valgt(i)?.pris ?? 0), 0);
  const iBalanse = Math.abs(saldo) < 0.05;
  const navn = (id: string) => data.partier.find((p) => p.id === id)?.navn ?? id;

  function gaTil(s: number) {
    settSteg(s === n && iBalanse ? n + 1 : s);
    requestAnimationFrame(() => topp.current?.focus());
  }
  function forfra() {
    settSvar(Array(n).fill(null));
    settBetaling(null);
    settKopiert(false);
    gaTil(0);
  }

  const Saldo = (
    <p className="text-[14.5px] text-text-secondary">
      Budsjettet ditt så langt: <strong className="font-semibold text-black">{saldotekst(saldo)}</strong>
    </p>
  );

  // ——— Spørsmål ———
  if (steg < n) {
    const q = data.sporsmal[steg];
    const v = valgt(steg);
    const med = data.partier
      .map((p) => ({ ...p, ...q.partier[p.id] }))
      .sort((a, b) => Math.abs(b.verdi ?? 0) - Math.abs(a.verdi ?? 0));
    const samme = v ? med.filter((p) => p.verdi !== null && p.tekst && fortegn(p.verdi) === fortegn(v.verdi)) : [];
    const andre = v ? med.filter((p) => p.verdi !== null && p.tekst && fortegn(p.verdi) !== fortegn(v.verdi)) : [];
    const stille = med.filter((p) => p.verdi === 0 && !p.tekst && p.id !== "ap");
    const ukjent = med.filter((p) => p.verdi === null);
    const perInnbygger = v ? Math.round((Math.abs(v.pris) * 1000) / data.innbyggere_mill / 50) * 50 : 0;

    return (
      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-black pb-3">
          <p className="text-[14.5px] font-semibold text-black">
            Spørsmål {steg + 1} av {n}: {q.tittel}
          </p>
          {Saldo}
        </div>

        <h2 ref={topp} tabIndex={-1} className="mt-7 font-display text-[30px] leading-[1.08] text-black outline-none sm:text-[38px]">
          {q.sporsmal}
        </h2>
        <p className="mt-3 max-w-[560px] text-[16px] leading-[1.55] text-text-secondary">{q.bakgrunn}</p>

        <div className="mt-6 grid gap-2.5" role="radiogroup" aria-label={q.sporsmal}>
          {q.valg.map((o, i) => {
            const paa = svar[steg] === i;
            return (
              <button
                key={o.tekst}
                type="button"
                role="radio"
                aria-checked={paa}
                onClick={() => settSvar(svar.map((s, j) => (j === steg ? i : s)))}
                className={`rounded-md border border-black px-4 py-3 text-left ${FOKUS} ${paa ? "bg-black text-white" : "bg-white text-black hover:bg-surface"}`}
              >
                <span className="block text-[16px] font-semibold">{o.tekst}</span>
                <span className={`mt-0.5 block text-[13.5px] ${paa ? "text-white/80" : "text-text-muted"}`}>{o.pristekst}</span>
              </button>
            );
          })}
        </div>

        <div aria-live="polite" className="mt-7">
          {v && (
            <div className="border-t border-black pt-5">
              {v.pris !== 0 && perInnbygger > 0 && (
                <p className="mb-4 text-[14.5px] text-text-secondary">
                  Det er om lag {perInnbygger.toLocaleString("nb-NO")} kroner per innbygger.
                </p>
              )}
              {samme.length > 0 && (
                <Gruppe tittel={fortegn(v.verdi) === 0 ? "Midt imellom" : "Samme vei som deg"} partier={samme} />
              )}
              {andre.length > 0 && (
                <Gruppe tittel={fortegn(v.verdi) === 0 ? "Vil endre" : "En annen vei"} partier={andre} />
              )}
              {stille.length > 0 && (
                <p className="mt-3 text-[14.5px] leading-relaxed text-text-secondary">
                  <strong className="font-semibold text-black">Som regjeringen:</strong>{" "}
                  {stille.map((p) => p.navn).join(", ").replace(/, ([^,]*)$/, " og $1")}.
                </p>
              )}
              {ukjent.length > 0 && (
                <p className="mt-3 text-[14.5px] leading-relaxed text-text-secondary">
                  <strong className="font-semibold text-black">Vet ikke ennå:</strong>{" "}
                  {ukjent.map((p) => p.navn).join(", ")}.
                </p>
              )}
            </div>
          )}
        </div>

        <div className="mt-7 flex flex-wrap gap-2.5">
          {steg > 0 && (
            <button type="button" onClick={() => gaTil(steg - 1)} className={`${KNAPP} bg-white text-black hover:bg-surface`}>
              Tilbake
            </button>
          )}
          <button
            type="button"
            disabled={!v}
            onClick={() => gaTil(steg + 1)}
            className={`${KNAPP} bg-black text-white hover:bg-accent disabled:cursor-not-allowed disabled:border-border disabled:bg-surface disabled:text-text-muted`}
          >
            {steg === n - 1 ? "Gjør opp budsjettet" : "Neste spørsmål"}
          </button>
        </div>
      </div>
    );
  }

  // ——— Betaling ———
  if (steg === n) {
    const b = saldo > 0 ? BETALING.pluss : BETALING.minus;
    return (
      <div>
        <p className="border-b border-black pb-3 text-[14.5px] font-semibold text-black">Budsjettet må gå opp</p>
        <h2 ref={topp} tabIndex={-1} className="mt-7 font-display text-[30px] leading-[1.08] text-black outline-none sm:text-[38px]">
          {saldo > 0 ? `Du bruker ${mrd(saldo)} mer enn regjeringen.` : `Du har ${mrd(saldo)} til overs.`} {b.sporsmal}
        </h2>
        <p className="mt-3 max-w-[560px] text-[16px] leading-[1.55] text-text-secondary">
          Partiene må også velge. I denne prøven teller ikke svaret med når vi sammenligner deg med partiene.
        </p>
        <div className="mt-6 grid gap-2.5" role="radiogroup" aria-label={b.sporsmal}>
          {b.valg.map((t) => (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={betaling === t}
              onClick={() => settBetaling(t)}
              className={`rounded-md border border-black px-4 py-3 text-left text-[16px] font-semibold ${FOKUS} ${betaling === t ? "bg-black text-white" : "bg-white text-black hover:bg-surface"}`}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="mt-7 flex flex-wrap gap-2.5">
          <button type="button" onClick={() => gaTil(n - 1)} className={`${KNAPP} bg-white text-black hover:bg-surface`}>
            Tilbake
          </button>
          <button
            type="button"
            disabled={!betaling}
            onClick={() => gaTil(n + 1)}
            className={`${KNAPP} bg-black text-white hover:bg-accent disabled:cursor-not-allowed disabled:border-border disabled:bg-surface disabled:text-text-muted`}
          >
            Se resultatet
          </button>
        </div>
      </div>
    );
  }

  // ——— Resultat ———
  const rader = data.partier
    .map((p) => {
      const saker = data.sporsmal.map((q, i) => {
        const u = valgt(i)?.verdi ?? 0;
        const pl = q.partier[p.id];
        return { q, pl, e: enighet(u, pl.verdi), avstand: pl.verdi === null ? null : Math.abs(u - pl.verdi) / 2 };
      });
      const kjent = saker.filter((s) => s.avstand !== null);
      const naerhet = kjent.length ? 1 - kjent.reduce((s, x) => s + (x.avstand as number), 0) / kjent.length : 0;
      return { ...p, saker, kjent: kjent.length, enig: saker.filter((s) => s.e === "enig").length, naerhet };
    })
    .sort((a, b) => b.naerhet - a.naerhet || b.enig - a.enig);
  const best = rader[0];
  const deling = `Jeg ligger nærmest ${best.navn} i budsjettomaten til valg og politikk. Budsjettet mitt: ${saldotekst(saldo)}.`;

  return (
    <div>
      <p className="border-b border-black pb-3 text-[14.5px] font-semibold text-black">Resultatet ditt</p>
      <h2 ref={topp} tabIndex={-1} className="mt-7 font-display text-[30px] leading-[1.08] text-black outline-none sm:text-[38px]">
        Du ligger nærmest {best.navn}.
      </h2>

      <h3 className="mt-9 font-display text-[21px] text-black">Ditt budsjett</h3>
      <ul className="mt-3 border-t border-black">
        {data.sporsmal.map((q, i) => (
          <li key={q.id} className="flex flex-wrap justify-between gap-x-6 gap-y-0.5 border-b border-border-light py-2.5 text-[15px]">
            <span className="font-semibold text-black">{q.tittel}</span>
            <span className="text-text-secondary">{valgt(i)?.tekst}</span>
          </li>
        ))}
        <li className="flex flex-wrap justify-between gap-x-6 gap-y-0.5 py-2.5 text-[15px]">
          <span className="font-semibold text-black">Til sammen</span>
          <span className="text-text-secondary">
            {stor(saldotekst(saldo))}
            {betaling ? `. ${betaling}.` : "."}
          </span>
        </li>
      </ul>

      <h3 className="mt-10 font-display text-[21px] text-black">Partiene, fra nærmest til lengst unna</h3>
      <ol className="mt-3 border-t border-black">
        {rader.map((r) => (
          <li key={r.id} className="border-b border-border-light py-4">
            <div className="flex items-baseline justify-between gap-4">
              <h4 className="font-display text-[19px] text-black">{r.navn}</h4>
              <p className="text-[14.5px] font-semibold text-black">{Math.round(r.naerhet * 100)} prosent likt</p>
            </div>
            <div className="mt-2 h-[10px] w-full bg-surface" aria-hidden="true">
              <div className="h-full rounded-r-[3px] bg-black" style={{ width: `${Math.round(r.naerhet * 100)}%` }} />
            </div>
            <details className="mt-2.5">
              <summary className={`cursor-pointer text-[14px] font-semibold text-black underline decoration-border-light underline-offset-[4px] ${FOKUS}`}>
                Sak for sak
              </summary>
              <ul className="mt-2.5 space-y-2">
                {r.saker.map((s) => (
                  <li key={s.q.id} className="text-[14.5px] leading-relaxed text-text-secondary">
                    <strong className="font-semibold text-black">
                      {s.q.tittel}: {ENIGHET_TEKST[s.e].toLowerCase()}.
                    </strong>{" "}
                    {s.e === "ukjent"
                      ? "Vi har ikke funnet partiets forslag."
                      : s.pl.tekst
                        ? `${r.navn} ${s.pl.tekst}.`
                        : r.id === "ap"
                          ? "Dette er regjeringens forslag."
                          : "Som regjeringen."}
                  </li>
                ))}
              </ul>
            </details>
          </li>
        ))}
      </ol>

      <div className="mt-8 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(`${deling} ${window.location.href}`);
              settKopiert(true);
            } catch {
              settKopiert(false);
            }
          }}
          className={`${KNAPP} bg-black text-white hover:bg-accent`}
        >
          {kopiert ? "Kopiert" : "Kopier resultatet"}
        </button>
        <button type="button" onClick={forfra} className={`${KNAPP} bg-white text-black hover:bg-surface`}>
          Start på nytt
        </button>
      </div>
      <p className="mt-6 max-w-[620px] text-[14px] leading-relaxed text-text-muted">
        Dette er et utkast med {n} spørsmål. Disse temaene er ikke med ennå: {data.ikke_med.join(", ").toLowerCase()}.
      </p>
    </div>
  );
}

function Gruppe({ tittel, partier }: { tittel: string; partier: { id: string; navn: string; tekst: string }[] }) {
  return (
    <div className="mt-3 first:mt-0">
      <p className="text-[13.5px] font-semibold text-text-muted">{tittel}</p>
      <ul className="mt-1 space-y-1.5">
        {partier.map((p) => (
          <li key={p.id} className="text-[15.5px] leading-[1.5] text-text-secondary">
            <strong className="font-semibold text-black">{p.navn}</strong> {p.tekst}.
          </li>
        ))}
      </ul>
    </div>
  );
}
