"use client";

import { useId, useMemo, useState } from "react";
import { andelUnder, type Trinn, type TrappaData } from "@/lib/trappa-felles";
import type { TrappaTekst } from "@/lib/trappa-tekst";

// ── Formatering ────────────────────────────────────────────────

const nf0 = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat("nb-NO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function kroner(n: number) {
  if (n >= 1e8) return `${nf0.format(n / 1e6)} mill. kr`;
  if (n >= 1e6) return `${nf1.format(n / 1e6)} mill. kr`;
  return `${nf0.format(Math.round(n / 1000) * 1000)} kr`;
}
function prosentTopp(topp: number) {
  // 0.001 -> «0,1»
  return nf0.format(topp * 100) === "0" ? String(topp * 100).replace(".", ",") : nf0.format(topp * 100);
}
function plassering(andel: number) {
  const p = andel * 100;
  if (p >= 99.99) return "over 99,99";
  if (p >= 99.9) return p.toFixed(2).replace(".", ",");
  if (p >= 99) return p.toFixed(1).replace(".", ",");
  return nf0.format(Math.floor(p));
}

// ── Komponent ──────────────────────────────────────────────────

export default function Trappa({
  data,
  tekst: t,
}: {
  data: TrappaData;
  tekst: Pick<TrappaTekst, "topp" | "inntektstrappa">;
}) {
  const [tekst, setTekst] = useState("");
  const inputId = useId();
  const hintId = useId();

  const inntekt = useMemo(() => {
    const tall = Number(tekst.replace(/[^\d]/g, ""));
    return tall > 0 ? tall : null;
  }, [tekst]);

  // Trinnene fra toppen og ned
  const trinn = useMemo(() => [...data.trinn].sort((a, b) => a.topp - b.topp), [data.trinn]);
  const nesteTrinn =
    inntekt === null ? null : [...trinn].reverse().find((t) => inntekt < t.grense) ?? null;

  function formaterInntekt(verdi: string) {
    const siffer = verdi.replace(/[^\d]/g, "").slice(0, 10);
    setTekst(siffer ? nf0.format(Number(siffer)) : "");
  }

  return (
    <>
      {/* ── Topp med kalkulator ── */}
      <div className="border-b border-border bg-hero px-6 py-12 md:py-16">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-4 w-1 rounded-full bg-accent" />
            <span className="text-[13px] font-medium text-white/50">{t.topp.overlinje}</span>
          </div>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold leading-tight text-white sm:text-5xl">
            {t.topp.tittel}
          </h1>
          <p className="mt-5 max-w-[620px] text-[17px] leading-relaxed text-white/75">
            {t.topp.ingress}
          </p>

          <div className="mt-9 grid gap-8 md:grid-cols-[minmax(0,420px)_1fr] md:items-end">
            <div>
              <label htmlFor={inputId} className="block text-[15px] font-semibold text-white">
                {t.topp.sporsmal}
              </label>
              <p id={hintId} className="mt-1 text-[13px] leading-snug text-white/60">
                {t.topp.hjelpetekst}
              </p>
              <div className="mt-3 flex items-center rounded-lg border border-white/25 bg-white/10 focus-within:border-white focus-within:ring-2 focus-within:ring-white/40">
                <input
                  id={inputId}
                  aria-describedby={hintId}
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="For eksempel 650 000"
                  value={tekst}
                  onChange={(e) => formaterInntekt(e.target.value)}
                  className="w-full bg-transparent px-4 py-3.5 text-[22px] font-semibold tabular-nums text-white placeholder:font-normal placeholder:text-white/35 focus:outline-none"
                />
                <span className="pr-4 text-[16px] text-white/60" aria-hidden="true">
                  kr
                </span>
              </div>
            </div>

            <div aria-live="polite" className="min-h-[96px]">
              {inntekt !== null && (
                <div>
                  <p className="text-white">
                    <span className="font-[family-name:var(--font-playfair)] text-5xl font-bold tabular-nums">
                      {plassering(andelUnder(inntekt, data))} %
                    </span>
                    <span className="mt-1 block text-[16px] text-white/80">
                      av alle voksne over 25 år tjener mindre enn deg.
                    </span>
                  </p>
                  <p className="mt-3 text-[15px] text-white/70">
                    {nesteTrinn
                      ? `For å komme blant de ${prosentTopp(nesteTrinn.topp)} prosent med høyest inntekt må du tjene ${kroner(nesteTrinn.grense - inntekt)} mer.`
                      : "Du er blant de 0,01 prosent med høyest inntekt i Norge."}{" "}
                    <a href="#trappa" className="font-medium text-white underline underline-offset-2 hover:text-accent-light">
                      Se deg selv i trappa
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Vegg data={data} inntekt={inntekt} tekst={t.inntektstrappa} />
    </>
  );
}

// ── Veggen: snittinntekt i hver gruppe, i samme målestokk hele veien ──

const PX_PER_MILL = 6;

type Soyle = {
  id: string;
  navn: string;
  med: number;
  off: number | null;
  merknad?: string;
};

function Vegg({
  data,
  inntekt,
  tekst,
}: {
  data: TrappaData;
  inntekt: number | null;
  tekst: TrappaTekst["inntektstrappa"];
}) {
  const t = (id: Trinn["id"]) => data.trinn.find((x) => x.id === id)!;
  const soyler: Soyle[] = [
    { id: "median", navn: "Midt på", med: data.vegg.median.med_overskudd, off: data.vegg.median.offisiell },
    { id: "topp10", navn: "Topp 10 %", med: t("topp10").med_overskudd!.snittinntekt, off: t("topp10").offisiell!.snittinntekt },
    { id: "topp1", navn: "Topp 1 %", med: t("topp1").med_overskudd!.snittinntekt, off: t("topp1").offisiell!.snittinntekt },
    { id: "topp01", navn: "Topp 0,1 %", med: t("topp01").med_overskudd!.snittinntekt, off: t("topp01").offisiell!.snittinntekt },
    {
      id: "topp001",
      navn: "Topp 0,01 %",
      med: data.vegg.topp001.med_overskudd,
      off: data.vegg.topp001.offisiell,
      merknad: `snitt ${data.vegg.topp001.aar}`,
    },
  ];
  const maks = Math.max(...soyler.map((s) => s.med));
  const hoyde = (kr: number) => Math.max(1, (kr / 1e6) * PX_PER_MILL);
  const linjer = [];
  for (let v = 50e6; v < maks; v += 50e6) linjer.push(v);

  return (
    <section id="trappa" aria-labelledby="vegg-tittel" className="scroll-mt-6 px-6 py-14">
      <div className="mx-auto max-w-[1100px]">
        <h2 id="vegg-tittel" className="font-[family-name:var(--font-playfair)] text-2xl font-bold sm:text-[28px]">
          {tekst.tittel}
        </h2>
        <p className="mt-3 max-w-[640px] text-[16px] leading-relaxed text-text-secondary">
          {tekst.ingress}
        </p>

        <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[14px]" aria-hidden="true">
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-[3px] bg-accent" /> Med overskuddet i selskapene
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-[3px] bg-text-muted" /> Offisiell statistikk
          </span>
        </div>

        <div className="relative mt-10 pl-14 sm:pl-20" aria-hidden="true">
          <div className="relative flex items-end gap-2 border-b-[3px] border-text-primary sm:gap-6">
            {/* Hjelpelinjer */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0" style={{ height: hoyde(maks) }}>
              {linjer.map((v) => (
                <div key={v} className="absolute inset-x-0 border-t border-dashed border-border" style={{ bottom: hoyde(v) }}>
                  <span className="absolute -left-14 -translate-y-1/2 text-[12px] tabular-nums text-text-muted sm:-left-20">
                    {nf0.format(v / 1e6)} mill.
                  </span>
                </div>
              ))}
            </div>
            {inntekt !== null && (
              <Stolpe verdi={inntekt} hoyde={hoyde(inntekt)} erDu />
            )}
            {soyler.map((s) => (
              <Stolpe
                key={s.id}
                verdi={s.med}
                hoyde={hoyde(s.med)}
                offHoyde={s.off ? hoyde(s.off) : undefined}
                merknad={s.merknad}
              />
            ))}
          </div>
          <div className="flex gap-2 pt-2 sm:gap-6">
            {inntekt !== null && <div className="min-w-0 flex-1 text-[12px] font-semibold text-accent-dark sm:text-[14px]">Du</div>}
            {soyler.map((s) => (
              <div key={s.id} className="min-w-0 flex-1 text-[12px] font-semibold leading-tight sm:text-[14px]">
                {s.navn}
              </div>
            ))}
          </div>
        </div>

        <table className="sr-only">
          <caption>Snittinntekt per gruppe ({data.forskningsaar})</caption>
          <thead>
            <tr>
              <th>Gruppe</th>
              <th>Med overskuddet i selskapene</th>
              <th>Offisiell statistikk</th>
            </tr>
          </thead>
          <tbody>
            {soyler.map((s) => (
              <tr key={s.id}>
                <td>{s.navn}</td>
                <td>{kroner(s.med)}</td>
                <td>{s.off ? kroner(s.off) : "–"}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-8 grid gap-6 text-[14px] leading-relaxed text-text-secondary md:grid-cols-2">
          <p>
            {tekst.fotnote}
          </p>
          <Andelstabell data={data} />
        </div>
      </div>
    </section>
  );
}

/** Kort beløp til søyleetikettene: «650 000», «2,5 mill.», «380 mill.». */
function kort(n: number) {
  if (n >= 1e8) return `${nf0.format(n / 1e6)} mill.`;
  if (n >= 1e6) return `${nf1.format(n / 1e6)} mill.`;
  return nf0.format(Math.round(n / 1000) * 1000);
}

function Stolpe({
  verdi,
  hoyde,
  offHoyde,
  merknad,
  erDu = false,
}: {
  verdi: number;
  hoyde: number;
  offHoyde?: number;
  merknad?: string;
  erDu?: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-1 flex-col justify-end">
      <p className={`mb-1.5 text-[11px] leading-tight sm:text-[14px] ${erDu ? "text-accent-dark" : ""}`}>
        <span className="block font-bold tabular-nums">{kort(verdi)}</span>
        {merknad && <span className="block text-text-muted">{merknad}</span>}
      </p>
      <div
        className={`relative w-full rounded-t-[4px] ${erDu ? "bg-text-primary" : "bg-accent"}`}
        style={{ height: hoyde }}
      >
        {offHoyde !== undefined && (
          <div
            className="absolute inset-x-[18%] bottom-0 rounded-t-[3px] bg-text-muted ring-2 ring-background"
            style={{ height: Math.min(offHoyde, hoyde) }}
          />
        )}
      </div>
    </div>
  );
}

function Andelstabell({ data }: { data: TrappaData }) {
  const rader = data.trinn.filter((t) => t.offisiell && t.med_overskudd);
  return (
    <div>
      <table className="w-full text-left text-[14px]">
        <caption className="mb-2 text-left font-semibold text-text-primary">
          Hvor stor del av alle inntektene får de? ({data.forskningsaar})
        </caption>
        <thead>
          <tr className="border-b border-border text-[13px] text-text-muted">
            <th className="py-1.5 font-medium">Gruppe</th>
            <th className="py-1.5 text-right font-medium">Offisielt</th>
            <th className="py-1.5 text-right font-medium">Med overskudd</th>
          </tr>
        </thead>
        <tbody>
          {rader.map((t) => (
            <tr key={t.id} className="border-b border-border">
              <td className="py-1.5">Topp {prosentTopp(t.topp)} %</td>
              <td className="py-1.5 text-right tabular-nums">{nf1.format(t.offisiell!.andel)} %</td>
              <td className="py-1.5 text-right font-semibold tabular-nums text-accent-dark">
                {nf1.format(t.med_overskudd!.andel)} %
              </td>
            </tr>
          ))}
          <tr className="border-b border-border">
            <td className="py-1.5">Topp 0,01 %*</td>
            <td className="py-1.5 text-right text-text-muted">–</td>
            <td className="py-1.5 text-right font-semibold tabular-nums text-accent-dark">
              {nf1.format(data.vegg.topp001.andel)} %
            </td>
          </tr>
        </tbody>
      </table>
      <p className="mt-2 text-[12px] text-text-muted">
        *Snitt {data.vegg.topp001.aar}, Ring, Seim og Zucman. Rundt 400 personer.
      </p>
    </div>
  );
}
