"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { teletekst } from "./teletekst";

// Knapp som ruller ut forklaringen under en slide. Alle kan åpnes samtidig
// med «Vis alle forklaringene» (sender en hendelse på window).

export const VIS_ALLE = "skraablikk:vis-alle";

export default function Forklaring({ children }: { children: ReactNode }) {
  const [åpen, setÅpen] = useState(false);
  const id = useId();

  useEffect(() => {
    const vis = (e: Event) => setÅpen((e as CustomEvent<boolean>).detail);
    window.addEventListener(VIS_ALLE, vis);
    return () => window.removeEventListener(VIS_ALLE, vis);
  }, []);

  return (
    <div className="mt-5">
      <button
        type="button"
        aria-expanded={åpen}
        aria-controls={id}
        onClick={() => setÅpen((v) => !v)}
        className={`${teletekst.className} group inline-flex items-center gap-3 bg-black px-4 py-2.5 text-left text-[22px] leading-none sm:px-5 sm:text-[26px] text-[#FFE600] shadow-[6px_6px_0_#5EEAD4] transition-[transform,box-shadow] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_#5EEAD4] focus-visible:outline-3 focus-visible:outline-offset-4 focus-visible:outline-[#FF65C5] active:translate-x-0 active:translate-y-0 active:shadow-[3px_3px_0_#5EEAD4] motion-reduce:transition-none`}
      >
        {åpen ? "Skjul forklaringen" : "Skjønte du den? Se forklaringen"}
        <span
          aria-hidden="true"
          className={`inline-block transition-transform duration-300 motion-reduce:transition-none ${åpen ? "rotate-180" : ""}`}
        >
          ▼
        </span>
      </button>

      <div
        id={id}
        role="region"
        aria-label="Forklaring"
        inert={!åpen}
        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
          åpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <div className="mt-6 border-l-4 border-[#5EEAD4] pl-5 sm:pl-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function VisAlle() {
  const [alle, setAlle] = useState(false);
  return (
    <button
      type="button"
      aria-pressed={alle}
      onClick={() => {
        const ny = !alle;
        setAlle(ny);
        window.dispatchEvent(new CustomEvent(VIS_ALLE, { detail: ny }));
      }}
      className="rounded-md border border-border px-3.5 py-2 text-[14px] font-medium text-text-secondary hover:border-text-primary hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
    >
      {alle ? "Skjul alle forklaringene" : "Vis alle forklaringene"}
    </button>
  );
}
