"use client";

import Link from "next/link";
import type { Sak } from "@/lib/kilder";

// Felles byggeklosser for å vise de siste sakene fra kildeovervåkningen
// på forsiden. Tre visninger: bånd under hero, panel i hero, og
// boks i sidekolonnen.

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

/* ───────────────────────── A: Bånd under hero ───────────────────────── */

export function KildeBand({ saker, oppdatert }: { saker: Sak[]; oppdatert: string }) {
  const utvalg = velgSaker(saker, 4);
  if (!utvalg.length) return null;
  return (
    <section aria-labelledby="kildebaand" className="border-b border-border bg-surface">
      <div className="mx-auto max-w-[1100px] px-6 py-7">
        <div className="mb-4 flex items-baseline justify-between gap-4">
          <h2 id="kildebaand" className="font-[family-name:var(--font-playfair)] text-[19px] font-bold text-text-primary">
            Nytt fra kildene
          </h2>
          <div className="flex items-baseline gap-4 text-[12px]">
            <span className="hidden text-text-muted sm:inline" suppressHydrationWarning>
              Oppdatert {oppdatertTekst(oppdatert)}
            </span>
            <Link href="/kilder" className="font-semibold text-accent hover:underline">
              Alle saker
            </Link>
          </div>
        </div>
        <ol className="-mx-6 flex snap-x gap-4 overflow-x-auto px-6 pb-1 lg:mx-0 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-0">
          {utvalg.map((s) => (
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

/* ───────────────────────── B: Panel i hero ───────────────────────── */

export function KildePanel({
  saker,
  oppdatert,
  totalt,
}: {
  saker: Sak[];
  oppdatert: string;
  totalt: number;
}) {
  const utvalg = velgSaker(saker, 5);
  if (!utvalg.length) return null;
  return (
    <section
      aria-labelledby="kildepanel"
      className="w-full rounded-lg border border-white/10 bg-white/[0.04] p-5 md:max-w-[400px]"
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 id="kildepanel" className="flex items-center gap-2 text-[14px] font-semibold text-white">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-60 motion-safe:animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          Nytt fra kildene
        </h2>
        <span className="text-[11.5px] text-white/45" suppressHydrationWarning>
          Oppdatert {oppdatertTekst(oppdatert)}
        </span>
      </div>
      <ol>
        {utvalg.map((s) => (
          <li key={s.id} className="border-t border-white/10 py-2.5 first:border-0 first:pt-0">
            <Kildelinje sak={s} lys />
            <a
              href={s.lenke}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 line-clamp-2 text-[13.5px] font-medium leading-snug text-white/90 hover:text-white hover:underline"
            >
              {s.tittel}
            </a>
          </li>
        ))}
      </ol>
      <Link
        href="/kilder"
        className="mt-3 inline-block text-[12.5px] font-semibold text-accent hover:underline"
      >
        Se alle {totalt} saker fra regjering, Storting, SSB og flere
      </Link>
    </section>
  );
}

/* ───────────────────────── C: Boks i sidekolonnen ───────────────────────── */

export function KildeBoks({ saker }: { saker: Sak[] }) {
  const utvalg = velgSaker(saker, 5);
  if (!utvalg.length) return null;
  return (
    <section aria-labelledby="kildeboks" className="rounded-md border border-border bg-white p-5">
      <h2 id="kildeboks" className="mb-3 font-[family-name:var(--font-playfair)] text-[16px] font-bold text-text-primary">
        Nytt fra kildene
      </h2>
      <ol>
        {utvalg.map((s) => (
          <li key={s.id} className="border-t border-border py-2.5 first:border-0 first:pt-0">
            <Kildelinje sak={s} />
            <a
              href={s.lenke}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-0.5 line-clamp-3 text-[13px] font-medium leading-snug text-text-primary hover:text-accent"
            >
              {s.tittel}
            </a>
          </li>
        ))}
      </ol>
      <Link href="/kilder" className="mt-2 inline-block text-[12px] font-semibold text-accent hover:underline">
        Alle saker
      </Link>
    </section>
  );
}
