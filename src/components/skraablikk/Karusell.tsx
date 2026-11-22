"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { teletekst } from "./teletekst";

// Karusellen øverst: bare bildene, sveip eller bruk pilene.

type Props = { slides: { bilde: string; tekst: string }[]; tittel: string };

export default function Karusell({ slides, tittel }: Props) {
  const spor = useRef<HTMLDivElement>(null);
  const [aktiv, setAktiv] = useState(0);

  // Aktiv slide = den som står nærmest midten av sporet.
  useEffect(() => {
    const el = spor.current;
    if (!el) return;
    let ramme = 0;
    const oppdater = () => {
      ramme = 0;
      const midt = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let avstand = Infinity;
      el.querySelectorAll<HTMLElement>("[data-i]").forEach((n) => {
        const d = Math.abs(n.offsetLeft - el.offsetLeft + n.offsetWidth / 2 - midt);
        if (d < avstand) {
          avstand = d;
          best = Number(n.dataset.i);
        }
      });
      setAktiv(best);
    };
    const vedRulling = () => {
      if (!ramme) ramme = requestAnimationFrame(oppdater);
    };
    oppdater();
    el.addEventListener("scroll", vedRulling, { passive: true });
    window.addEventListener("resize", vedRulling);
    return () => {
      el.removeEventListener("scroll", vedRulling);
      window.removeEventListener("resize", vedRulling);
      cancelAnimationFrame(ramme);
    };
  }, []);

  // Sentrer valgt slide.
  const gåTil = useCallback(
    (i: number) => {
      const el = spor.current;
      const mål = el?.querySelector<HTMLElement>(`[data-i="${Math.max(0, Math.min(slides.length - 1, i))}"]`);
      if (!el || !mål) return;
      const reduser = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.scrollTo({
        left: mål.offsetLeft - el.offsetLeft - (el.clientWidth - mål.offsetWidth) / 2,
        behavior: reduser ? "auto" : "smooth",
      });
    },
    [slides.length]
  );

  const knapp =
    "flex h-12 w-12 items-center justify-center rounded-full bg-white text-[22px] text-black shadow-md transition-opacity hover:bg-[#FFE600] disabled:opacity-30 focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#FF65C5]";

  return (
    <section aria-roledescription="karusell" aria-label={tittel} className="relative">
      <div
        ref={spor}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            gåTil(aktiv + 1);
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            gåTil(aktiv - 1);
          }
        }}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-6 pb-4 [scrollbar-width:none] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#FF65C5] md:px-[calc(50%-190px)] [&::-webkit-scrollbar]:hidden"
      >
        {slides.map((s, i) => (
          <div
            key={s.bilde}
            data-i={i}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} av ${slides.length}`}
            className="w-[min(380px,82vw)] shrink-0 snap-center"
          >
            <Image
              src={s.bilde}
              alt={s.tekst}
              width={1080}
              height={1350}
              priority={i < 2}
              sizes="(min-width: 768px) 380px, 82vw"
              className="w-full rounded-[4px] shadow-[0_24px_48px_-16px_rgba(0,0,0,0.7)]"
            />
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-5">
        <button type="button" onClick={() => gåTil(aktiv - 1)} disabled={aktiv === 0} aria-label="Forrige slide" className={knapp}>
          ‹
        </button>
        <span className={`${teletekst.className} min-w-[80px] text-center text-[26px] text-white`} aria-live="polite">
          {aktiv + 1} / {slides.length}
        </span>
        <button
          type="button"
          onClick={() => gåTil(aktiv + 1)}
          disabled={aktiv === slides.length - 1}
          aria-label="Neste slide"
          className={knapp}
        >
          ›
        </button>
      </div>
    </section>
  );
}
