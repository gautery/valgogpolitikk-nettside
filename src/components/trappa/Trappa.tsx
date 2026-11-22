"use client";

import { useId, useMemo, useState } from "react";
import { andelUnder, type Trinn, type TrappaData } from "@/lib/trappa-felles";

// ── Formatering ────────────────────────────────────────────────

const nf0 = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat("nb-NO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function kroner(n: number) {
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

function ganger(x: number) {
  return x < 10 ? nf1.format(x) : nf0.format(x);
}

type Maalvalg ="offisiell" | "med_overskudd";

// ── Komponent ──────────────────────────────────────────────────

export default function Trappa({ data }: { data: TrappaData }) {
  const [tekst, setTekst] = useState("");
  const [maal, setMaal] = useState<Maalvalg>("offisiell");
  const inputId = useId();
  const hintId = useId();

  const inntekt = useMemo(() => {
    const tall = Number(tekst.replace(/[^\d]/g, ""));
    return tall > 0 ? tall : null;
  }, [tekst]);

  // Trinnene fra toppen og ned
  const trinn = useMemo(() => [...data.trinn].sort((a, b) => a.topp - b.topp), [data.trinn]);
  const mittTrinn = inntekt === null ? null : (trinn.find((t) => inntekt >= t.grense)?.id ?? "gulv");
  const nesteTrinn =
    inntekt === null ? null : [...trinn].reverse().find((t) => inntekt < t.grense) ?? null;

  const t01 = data.trinn.find((t) => t.id === "topp01")!;
  const t1 = data.trinn.find((t) => t.id === "topp1")!;
  const median = data.trinn.find((t) => t.id === "median")!;

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
            <span className="text-[13px] font-medium text-white/50">Inntekt og ulikhet</span>
          </div>
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold leading-tight text-white sm:text-5xl">
            Trappa til toppen
          </h1>
          <p className="mt-5 max-w-[620px] text-[17px] leading-relaxed text-white/75">
            Hvor høyt opp står du? Skriv inn inntekten din og se hvor mange som tjener mer enn deg. Lenger ned ser du
            hvor mye som havner helt på toppen, og hvor mye mer det blir når vi regner med pengene som blir liggende i
            selskapene.
          </p>

          <div className="mt-9 grid gap-8 md:grid-cols-[minmax(0,420px)_1fr] md:items-end">
            <div>
              <label htmlFor={inputId} className="block text-[15px] font-semibold text-white">
                Hva var inntekten din i {data.aar}, før skatt?
              </label>
              <p id={hintId} className="mt-1 text-[13px] leading-snug text-white/60">
                Lønn, pensjon, trygd og kapitalinntekter til sammen.
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

      {/* ── Trappa ── */}
      <section id="trappa" aria-labelledby="trappa-tittel" className="scroll-mt-6 px-6 py-14">
        <div className="mx-auto max-w-[1100px]">
          <h2 id="trappa-tittel" className="font-[family-name:var(--font-playfair)] text-2xl font-bold sm:text-[28px]">
            Hvor mye får de på toppen?
          </h2>

          <div className="mt-5 inline-flex rounded-full border border-border bg-surface p-1" role="group" aria-label="Velg tall">
            {(
              [
                ["offisiell", "Offisiell statistikk"],
                ["med_overskudd", "Med overskuddet i selskapene"],
              ] as const
            ).map(([verdi, etikett]) => (
              <button
                key={verdi}
                type="button"
                aria-pressed={maal === verdi}
                onClick={() => setMaal(verdi)}
                className={`rounded-full px-4 py-2 text-[14px] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  maal === verdi
                    ? verdi === "offisiell"
                      ? "bg-text-primary text-white"
                      : "bg-accent text-white"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {etikett}
              </button>
            ))}
          </div>

          <p aria-live="polite" className="mt-5 max-w-[680px] text-[17px] leading-relaxed text-text-primary">
            {maal === "offisiell" ? (
              <>
                Ifølge den offisielle statistikken får de 0,1 prosent med høyest inntekt{" "}
                <strong>{nf1.format(t01.offisiell!.andel)} prosent</strong> av alle inntektene.
              </>
            ) : (
              <>
                Regner vi med overskuddet i selskapene de eier, får de 0,1 prosent med høyest inntekt{" "}
                <strong className="text-accent-dark">{nf1.format(t01.med_overskudd!.andel)} prosent</strong> av alle
                inntektene.
                {t01.med_overskudd!.andel > t1.offisiell!.andel &&
                  ` Det er mer enn den offisielle statistikken sier at hele den øverste prosenten får (${nf1.format(t1.offisiell!.andel)} prosent).`}
              </>
            )}
          </p>

          <ol className="mt-10" aria-label="Trinnene fra toppen og ned">
            {trinn.map((t, i) => (
              <TrinnRad
                key={t.id}
                trinn={t}
                niva={trinn.length - 1 - i}
                maal={maal}
                erHer={mittTrinn === t.id}
                aar={data.aar}
                forskningsaar={data.forskningsaar}
              />
            ))}
          </ol>
          <div className="relative border-t-[3px] border-text-primary pt-4">
            {mittTrinn === "gulv" && <DuErHer />}
            <p className="text-[15px] text-text-secondary">
              <span className="font-semibold text-text-primary">Den nederste halvparten</span>,{" "}
              {nf0.format(data.antall - median.antall)} personer, tjener under {kroner(median.grense)}.
            </p>
          </div>
          <p className="mt-6 text-[13px] text-text-muted">
            Personer 25 år og eldre. Grensene gjelder bruttoinntekt i {data.aar}. Andelene og snittinntektene gjelder{" "}
            {data.forskningsaar}, siste år forskningen dekker.
          </p>
        </div>
      </section>
    </>
  );
}

// ── Ett trinn ──────────────────────────────────────────────────

function TrinnRad({
  trinn: t,
  niva,
  maal,
  erHer,
  aar,
  forskningsaar,
}: {
  trinn: Trinn;
  niva: number;
  maal: Maalvalg;
  erHer: boolean;
  aar: number;
  forskningsaar: number;
}) {
  const tall = t[maal];
  const off = t.offisiell;
  const navn = t.id === "median" ? "Den øverste halvparten" : `Topp ${prosentTopp(t.topp)} prosent`;

  return (
    <li
      className="trinn relative border-l-[3px] border-t-[3px] border-text-primary pb-7 pl-5 pt-4 sm:pl-7"
      style={{ ["--niva" as string]: niva }}
    >
      {erHer && <DuErHer />}
      <div className="grid gap-x-8 gap-y-4 md:grid-cols-[15rem_minmax(0,1fr)]">
        <div>
          <h3 className="text-[19px] font-bold leading-tight">{navn}</h3>
          <p className="mt-1 text-[14px] text-text-secondary">{nf0.format(t.antall)} personer</p>
          <p className="mt-2 text-[15px]">
            Tjener over{" "}
            <strong className="tabular-nums">
              {t.anslag ? `rundt ${nf0.format(t.grense / 1e6)} mill. kr` : kroner(t.grense)}
            </strong>
          </p>
        </div>

        <div className="md:pt-1">
          {tall && off ? (
            <>
              <p className="text-[15px] leading-snug">
                Får{" "}
                <strong className={`tabular-nums ${maal === "med_overskudd" ? "text-accent-dark" : ""}`}>
                  {nf1.format(tall.andel)} prosent
                </strong>{" "}
                av alle inntektene, {ganger(tall.andel / (t.topp * 100))} ganger så mye som om alle fikk like mye.
              </p>
              <div className="relative mt-3 h-3 w-full rounded-full bg-surface-light" aria-hidden="true">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full motion-safe:transition-[width,background-color] motion-safe:duration-500 ${
                    maal === "med_overskudd" ? "bg-accent" : "bg-text-muted"
                  }`}
                  style={{ width: `${tall.andel}%` }}
                />
                {maal === "med_overskudd" && (
                  <div
                    className="absolute -inset-y-1 w-[2px] bg-text-primary"
                    style={{ left: `calc(${off.andel}% - 1px)` }}
                    title="Offisiell statistikk"
                  />
                )}
              </div>
              <p className="mt-2 text-[13px] text-text-muted">
                {maal === "med_overskudd"
                  ? `Streken viser den offisielle statistikken (${nf1.format(off.andel)} prosent). `
                  : ""}
                Snittinntekt i gruppa: {kroner(tall.snittinntekt)} ({forskningsaar}-kroner).
              </p>
            </>
          ) : t.id === "median" ? (
            <p className="max-w-[460px] text-[15px] leading-snug text-text-secondary">
              Halvparten av alle voksne over 25 år tjente mer enn {kroner(t.grense)} i {aar}. Her endrer overskuddet i
              selskapene nesten ingenting.
            </p>
          ) : (
            <p className="max-w-[460px] text-[15px] leading-snug text-text-secondary">
              For de aller rikeste finnes det ikke forskningstall med overskuddet i selskapene. Grensa er et anslag ut
              fra skattestatistikken.
            </p>
          )}
        </div>
      </div>
    </li>
  );
}

function DuErHer() {
  return (
    <span className="absolute -top-[15px] right-0 rounded-full bg-accent px-3 py-1 text-[12px] font-semibold text-white">
      Du er her
    </span>
  );
}
