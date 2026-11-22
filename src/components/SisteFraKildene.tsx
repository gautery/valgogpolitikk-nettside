"use client";

import Link from "next/link";
import { useState } from "react";
import type { Sak, Utvalgt } from "@/lib/kilder";

// Båndet «Nytt fra kildene» på forsiden. To faner:
//  – Utvalgt: saker Gaute har valgt ut i kildeovervåkningens utvalgt.yaml, med kommentar
//  – Løpende: de nyeste sakene, én per kilde
// Utvalgt er standard når det finnes utvalgte saker fra de siste 14 dagene.

export const TEMAFARGER: Record<string, string> = {
  Skatt: "#c1121f",
  "Ulikhet og fordeling": "#7048e8",
  "Markedsmakt og konkurranse": "#a61e4d",
  "Offentlige finanser": "#1a1a2e",
  "Arbeid og trygd": "#2d6a4f",
  Bolig: "#8a5a00",
  "Energi og strøm": "#b35c00",
  "EU og EØS": "#1864ab",
  "Velferd og privatisering": "#c2410c",
};

const MND = ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"];

function oslo(iso: string) {
  return new Date(new Date(iso).toLocaleString("en-US", { timeZone: "Europe/Oslo" }));
}

function nårTekst(iso: string) {
  const d = oslo(iso);
  const nå = oslo(new Date().toISOString());
  const dager = Math.round(
    (new Date(nå.toDateString()).getTime() - new Date(d.toDateString()).getTime()) / 86400000
  );
  const kl = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  if (dager === 0) return `I dag ${kl}`;
  if (dager === 1) return `I går ${kl}`;
  return `${d.getDate()}. ${MND[d.getMonth()]}`;
}

function oppdatertTekst(iso: string) {
  const d = oslo(iso);
  return `kl. ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

// Kilder som gir mye støy på forsiden (de vises fortsatt på /kilder).
const IKKE_PÅ_FORSIDEN = new Set(["Stortinget – høringer i komiteene"]);

/**
 * Plukker de nyeste sakene som treffer minst ett tema. Viktige saker
 * (NOU, melding, Riksrevisjonen) går først, og hver kilde får maks én plass,
 * så forsiden viser bredden.
 */
export function velgSaker(saker: Sak[], antall: number) {
  const kandidater = saker
    .filter((s) => s.temaer.length > 0 && !IKKE_PÅ_FORSIDEN.has(s.kilde))
    .slice(0, 60);
  const sortert = [
    ...kandidater.filter((s) => s.viktig),
    ...kandidater.filter((s) => !s.viktig),
  ];
  const brukt = new Set<string>();
  const ut: Sak[] = [];
  for (const s of sortert) {
    if (brukt.has(s.kilde)) continue;
    brukt.add(s.kilde);
    ut.push(s);
    if (ut.length === antall) break;
  }
  return ut.sort((a, b) => b.dato.localeCompare(a.dato));
}

function Kildelinje({ sak, lys = false }: { sak: Sak; lys?: boolean }) {
  return (
    <div className={`flex flex-wrap items-center gap-x-1.5 text-[11.5px] ${lys ? "text-white/55" : "text-text-muted"}`}>
      {sak.viktig && <span className={lys ? "text-white" : "text-accent"} aria-label="Viktig">★</span>}
      <span>{sak.kilde}</span>
      <span aria-hidden="true">/</span>
      <span suppressHydrationWarning>{nårTekst(sak.dato)}</span>
    </div>
  );
}

/* ───────────────────────── Båndet ───────────────────────── */

const FERSK_DAGER = 14;

export function KildeBand({
  saker,
  utvalgt,
  oppdatert,
}: {
  saker: Sak[];
  utvalgt: Utvalgt[];
  oppdatert: string;
}) {
  const løpende = velgSaker(saker, 4);
  const valgte = utvalgt.slice(0, 4);
  const grense = Date.now() - FERSK_DAGER * 86400000;
  const harFerske = valgte.some((u) => new Date(u.dato).getTime() >= grense);
  const [fane, setFane] = useState<"utvalgt" | "lopende">(harFerske ? "utvalgt" : "lopende");

  if (!løpende.length && !valgte.length) return null;
  const visUtvalgt = fane === "utvalgt" && valgte.length > 0;

  const faneKnapp = (id: "utvalgt" | "lopende", tekst: string) => (
    <button
      type="button"
      role="tab"
      id={`fane-${id}`}
      aria-selected={fane === id}
      aria-controls="kildebaand-innhold"
      onClick={() => setFane(id)}
      className={`border-b-2 pb-1 text-[13px] font-semibold transition-colors ${
        fane === id ? "border-accent text-text-primary" : "border-transparent text-text-muted hover:text-text-primary"
      }`}
    >
      {tekst}
    </button>
  );

  return (
    <section aria-labelledby="kildebaand" className="border-b border-border bg-surface px-6">
      <div className="mx-auto max-w-[1100px] py-7">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
          <div className="flex flex-wrap items-end gap-x-6 gap-y-2">
            <h2 id="kildebaand" className="font-[family-name:var(--font-playfair)] text-[19px] font-bold text-text-primary">
              Nytt fra kildene
            </h2>
            {valgte.length > 0 && (
              <div role="tablist" aria-label="Velg visning" className="flex gap-4">
                {faneKnapp("utvalgt", "Utvalgt")}
                {faneKnapp("lopende", "Løpende")}
              </div>
            )}
          </div>
          <div className="flex items-baseline gap-4 text-[12px]">
            <span className="hidden text-text-muted sm:inline" suppressHydrationWarning>
              Oppdatert {oppdatertTekst(oppdatert)}
            </span>
            <Link href="/kilder" className="font-semibold text-accent hover:underline">
              Alle saker
            </Link>
          </div>
        </div>

        <ol
          id="kildebaand-innhold"
          role={valgte.length > 0 ? "tabpanel" : undefined}
          aria-labelledby={valgte.length > 0 ? `fane-${fane}` : undefined}
          className="-mx-6 flex snap-x gap-4 overflow-x-auto px-6 pb-1 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0"
        >
          {visUtvalgt
            ? valgte.map((u) => (
                <li
                  key={u.id}
                  className="flex w-[260px] flex-shrink-0 snap-start flex-col border-l-[3px] border-accent bg-white py-3 pl-4 pr-3 lg:w-auto"
                >
                  <div className="text-[11.5px] text-text-muted">
                    <span>{u.kilde}</span> <span aria-hidden="true">/</span>{" "}
                    <span suppressHydrationWarning>{nårTekst(u.dato)}</span>
                  </div>
                  <a
                    href={u.lenke}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 line-clamp-3 text-[14px] font-semibold leading-snug text-text-primary hover:text-accent"
                  >
                    {u.tittel}
                  </a>
                  {u.kommentar && (
                    <p className="mt-2 text-[13px] leading-snug text-text-secondary">{u.kommentar}</p>
                  )}
                </li>
              ))
            : løpende.map((s) => (
                <li
                  key={s.id}
                  className="w-[260px] flex-shrink-0 snap-start border-l-[3px] bg-white py-3 pl-4 pr-3 lg:w-auto"
                  style={{ borderLeftColor: TEMAFARGER[s.temaer[0]] ?? "#8a8a96" }}
                >
                  <Kildelinje sak={s} />
                  <a
                    href={s.lenke}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1.5 line-clamp-3 text-[14px] font-semibold leading-snug text-text-primary hover:text-accent"
                  >
                    {s.tittel}
                  </a>
                  <div className="mt-2 text-[11px] font-medium" style={{ color: TEMAFARGER[s.temaer[0]] }}>
                    {s.temaer[0]}
                  </div>
                </li>
              ))}
        </ol>
      </div>
    </section>
  );
}
