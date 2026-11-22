"use client";

import { useEffect, useRef, useState } from "react";
import type { TrappaData } from "@/lib/trappa-felles";
import type { TrappaTekst } from "@/lib/trappa-tekst";

// Formuen i riktig målestokk: én piksel per to millioner kroner, søylene henger nedover.

const PX_PER_MILL = 0.5;
const nf0 = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat("nb-NO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

function belop(mill: number) {
  if (mill >= 1000) return `${nf1.format(mill / 1000).replace(",0", "")} mrd.`;
  if (mill >= 10) return `${nf0.format(mill)} mill.`;
  return `${nf1.format(mill)} mill.`;
}

type Soyle = { id: string; navn: string; mill: number };
type Milepael = { mill: number; tekst: string };

export default function Formuevegg({ data, tekst }: { data: TrappaData; tekst: TrappaTekst["formue"] }) {
  const f = data.formue;
  const k = data.kapital;
  const median = f.median / 1e6;

  const soyler: Soyle[] = [
    { id: "median", navn: "Midt på", mill: median },
    { id: "topp1", navn: "Topp 1 %", mill: f.topp1_snitt / 1e6 },
    { id: "topp01", navn: "Topp 0,1 %", mill: f.topp01_snitt / 1e6 },
    { id: "k400", navn: "400 rikeste", mill: (k.samlet_mrd * 1000) / 400 },
    ...[...k.topp3].reverse().map((p) => ({ id: `nr${p.plass}`, navn: `Nr. ${p.plass}`, mill: p.mrd * 1000 })),
  ];
  const dybde = Math.max(...soyler.map((s) => s.mill)) * PX_PER_MILL;

  const milepaeler: Milepael[] = [
    { mill: median, tekst: `Husholdningen midt på: ${belop(median)} Halvparten av husholdningene eier mindre.` },
    { mill: f.topp1_snitt / 1e6, tekst: `Snittet for den rikeste prosenten av husholdningene: ${belop(f.topp1_snitt / 1e6)}` },
    {
      mill: f.topp01_snitt / 1e6,
      tekst: `Snittet for de ${nf0.format(f.topp01_antall)} rikeste husholdningene i SSBs statistikk: ${belop(f.topp01_snitt / 1e6)}`,
    },
    { mill: 1000, tekst: `1 milliard. Kapital teller ${nf0.format(k.milliardaerer)} nordmenn med mer enn dette.` },
    { mill: (k.samlet_mrd * 1000) / 400, tekst: `Snittet for de 400 rikeste på Kapitals liste: ${belop((k.samlet_mrd * 1000) / 400)}` },
    ...k.topp3.map((p) => ({ mill: p.mrd * 1000, tekst: `Nr. ${p.plass} på Kapitals liste, ${p.navn}: ${belop(p.mrd * 1000)}` })),
  ];
  // Fremdrift på vei ned mot den rikeste
  const bunn = k.topp3[0].mrd * 1000;
  for (const v of [25000, 50000, 150000, 250000, 300000]) {
    milepaeler.push({
      mill: v,
      tekst: `${belop(v)} Du er ${nf0.format((v / bunn) * 100)} prosent av veien ned til den rikeste.`,
    });
  }
  milepaeler.sort((a, b) => a.mill - b.mill);
  // Plassering: ved riktig dybde, men aldri oppå forrige milepæl
  const plass: number[] = [];
  milepaeler.forEach((m, i) => {
    plass.push(Math.max(m.mill * PX_PER_MILL, i ? plass[i - 1] + 120 : 90));
  });
  const hjelpelinjer: number[] = [];
  for (let v = 50000; v < dybde / PX_PER_MILL; v += 50000) hjelpelinjer.push(v);

  // Teller: hvor langt ned leseren er kommet
  const flate = useRef<HTMLDivElement>(null);
  const teller = useRef<HTMLDivElement>(null);
  const [naa, setNaa] = useState(0);
  useEffect(() => {
    let ramme = 0;
    const oppdater = () => {
      ramme = 0;
      if (!flate.current || !teller.current) return;
      const px = teller.current.getBoundingClientRect().bottom - flate.current.getBoundingClientRect().top;
      const mill = Math.min(dybde, Math.max(0, px)) / PX_PER_MILL;
      setNaa(mill < 1000 ? Math.round(mill) : Math.round(mill / 100) * 100);
    };
    const vedScroll = () => {
      if (!ramme) ramme = requestAnimationFrame(oppdater);
    };
    oppdater();
    window.addEventListener("scroll", vedScroll, { passive: true });
    window.addEventListener("resize", vedScroll);
    return () => {
      window.removeEventListener("scroll", vedScroll);
      window.removeEventListener("resize", vedScroll);
      if (ramme) cancelAnimationFrame(ramme);
    };
  }, [dybde]);

  const husholdninger = naa / median;

  return (
    <div className="mt-14">
      <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold">{tekst.trapp_tittel}</h3>
      <p className="mt-3 max-w-[640px] text-[16px] leading-relaxed text-white/75">
        {tekst.trapp_ingress}{" "}
        <a href="#etter-formuestrappa" className="font-medium text-white underline underline-offset-2">
          Hopp over
        </a>
      </p>

      {/* Navn og beløp over søylene */}
      <div className="mt-8 grid grid-cols-[42%_1fr] gap-3 sm:grid-cols-[45%_1fr] sm:gap-6">
        <div />
        <div className="flex gap-1 sm:gap-3" aria-hidden="true">
          {soyler.map((s) => (
            <div key={s.id} className="min-w-0 flex-1 text-[10px] leading-tight sm:text-[13px]">
              <span className="block font-semibold">{s.navn}</span>
              <span className="block tabular-nums text-white/60">{belop(s.mill)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-2" style={{ height: dybde + 120 }}>
        {/* Teller som følger med nedover */}
        <div
          ref={teller}
          className="sticky top-16 z-10 grid grid-cols-[42%_1fr] gap-3 sm:grid-cols-[45%_1fr] sm:gap-6"
          aria-live="off"
        >
          <div className="w-fit max-w-full rounded-md bg-white px-3 py-2 text-text-primary shadow-sm">
            <span className="block font-[family-name:var(--font-playfair)] text-[19px] font-bold tabular-nums sm:text-2xl">
              {belop(naa)} kr
            </span>
            <span className="block text-[11px] leading-snug text-text-secondary sm:text-[13px]">
              {naa < median * 2
                ? "Scroll nedover"
                : `like mye som ${nf0.format(Math.round(husholdninger))} husholdninger midt på eier`}
            </span>
          </div>
        </div>

        <div ref={flate} className="absolute inset-x-0 top-0" style={{ height: dybde }} aria-hidden="true">
          {/* Hjelpelinjer */}
          {hjelpelinjer.map((v) => (
            <div
              key={v}
              className="absolute right-0 border-t border-dashed border-white/15"
              style={{ top: v * PX_PER_MILL, left: "45%" }}
            >
              <span className="absolute -top-2.5 right-1 text-[11px] tabular-nums text-white/40">{belop(v)}</span>
            </div>
          ))}

          <div className="grid h-full grid-cols-[42%_1fr] gap-3 sm:grid-cols-[45%_1fr] sm:gap-6">
            {/* Milepæler */}
            <div className="relative">
              {milepaeler.map((m, i) => (
                <p
                  key={m.mill}
                  className="absolute right-0 max-w-[340px] border-t-2 border-accent pt-1.5 text-[12px] leading-snug text-white/85 sm:text-[14px]"
                  style={{ top: plass[i] }}
                >
                  {m.tekst}
                </p>
              ))}
            </div>
            {/* Søyler */}
            <div className="flex items-start gap-1 sm:gap-3">
              {soyler.map((s) => (
                <div key={s.id} className="flex-1">
                  <div
                    className={`w-full rounded-b-[4px] ${s.id.startsWith("nr") || s.id === "k400" ? "bg-accent" : "bg-white/70"}`}
                    style={{ height: Math.max(1, s.mill * PX_PER_MILL) }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <table className="sr-only">
        <caption>Formue i riktig målestokk</caption>
        <tbody>
          {soyler.map((s) => (
            <tr key={s.id}>
              <th>{s.navn}</th>
              <td>{belop(s.mill)} kr</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mb-4 text-[15px] font-semibold">
        {tekst.trapp_slutt}{" "}
        <a href="#formue" className="font-normal underline underline-offset-2">
          Tilbake til toppen av trappa
        </a>
      </p>
      <p id="etter-formuestrappa" className="scroll-mt-24 text-[13px] text-white/55">
        {tekst.trapp_fotnote}
      </p>
    </div>
  );
}
