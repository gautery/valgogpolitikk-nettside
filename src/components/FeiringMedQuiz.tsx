"use client";

import { useEffect, useRef, useState } from "react";
import Feiring, { FeiringRamme, type FeiringProps } from "@/components/Feiring";
import type { FeiringQuiz } from "@/lib/klosser";

// Quizen før feiringen etter grunnkurset. Alle påstandene er feil, og det
// røpes først til slutt. Teksten redigeres i Pages CMS (klossen «Feiring»).

const KNAPP =
  "min-h-[52px] rounded-md border-2 border-black px-6 text-[17px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent";

function fyllInn(tekst: string, riktige: number, antall: number) {
  return tekst.replaceAll("{riktige}", String(riktige)).replaceAll("{antall}", String(antall));
}

export default function FeiringMedQuiz({ quiz, ...p }: FeiringProps & { quiz: FeiringQuiz }) {
  const pastander = (quiz.pastander ?? []).filter((x) => x.pastand?.trim());
  const antall = pastander.length;
  const grense = quiz.grense ?? 4;

  const [steg, setSteg] = useState(0);
  // Svaret på påstanden som vises nå. «feil» er alltid det riktige svaret.
  const [svar, setSvar] = useState<"stemmer" | "feil" | null>(null);
  const [riktige, setRiktige] = useState(0);
  const [ferdig, setFerdig] = useState<"nei" | "ja" | "hoppet">(antall === 0 ? "hoppet" : "nei");

  // Flytt fokus til det som nettopp dukket opp: fasiten etter et svar, og
  // neste påstand etter «Neste». Ikke ved første visning av siden.
  const fasitRef = useRef<HTMLDivElement>(null);
  const pastandRef = useRef<HTMLHeadingElement>(null);
  const forsteVisning = useRef(true);
  useEffect(() => {
    if (forsteVisning.current) {
      forsteVisning.current = false;
      return;
    }
    if (svar) fasitRef.current?.focus();
    else pastandRef.current?.focus();
  }, [svar, steg]);

  if (ferdig !== "nei") {
    const resultat = riktige >= grense ? quiz.resultatBra : quiz.resultatSvakt;
    return (
      <Feiring
        {...p}
        forst={
          ferdig === "ja" ? (
            <>
              {quiz.avsloring && <p>{quiz.avsloring}</p>}
              {resultat && <p className="mt-2 font-semibold">{fyllInn(resultat, riktige, antall)}</p>}
            </>
          ) : undefined
        }
      />
    );
  }

  const denne = pastander[steg];
  const siste = steg === antall - 1;

  function svarPaa(valg: "stemmer" | "feil") {
    setSvar(valg);
    if (valg === "feil") setRiktige((n) => n + 1);
  }

  function videre() {
    if (siste) {
      setFerdig("ja");
      return;
    }
    setSvar(null);
    setSteg((n) => n + 1);
  }

  return (
    <FeiringRamme bilde={p.bilde} bildetekst={p.bildetekst} fotokreditt={p.fotokreditt}>
      {p.overlinje && <p className="mb-3 text-[15px] font-semibold text-black">{p.overlinje}</p>}
      {quiz.tittel && (
        <h1 className="font-display text-[32px] leading-[1.05] text-black sm:text-[40px]">{quiz.tittel}</h1>
      )}
      {quiz.ingress && <p className="mt-3 text-[17px] leading-[1.45] text-black">{quiz.ingress}</p>}

      <p className="mt-6 text-[15px] font-semibold text-black">
        Påstand {steg + 1} av {antall}
      </p>
      <h2
        ref={pastandRef}
        tabIndex={-1}
        className="mt-2 scroll-mt-28 font-display text-[24px] leading-[1.15] text-black focus:outline-none sm:text-[28px]"
      >
        «{denne.pastand?.trim()}»
      </h2>

      {svar === null ? (
        <div className="mt-5 flex flex-wrap gap-3">
          <button type="button" onClick={() => svarPaa("stemmer")} className={`${KNAPP} bg-white text-black hover:bg-rosa`}>
            Stemmer
          </button>
          <button type="button" onClick={() => svarPaa("feil")} className={`${KNAPP} bg-white text-black hover:bg-rosa`}>
            Feil
          </button>
        </div>
      ) : (
        <>
          <div
            ref={fasitRef}
            tabIndex={-1}
            className="mt-5 scroll-mt-28 rounded-md border-2 border-black bg-surface p-4 text-[17px] leading-[1.45] text-black focus:outline-none"
          >
            <p className="font-semibold">
              {svar === "feil" ? "Riktig. Påstanden er feil." : "Nei, påstanden er feil."}
            </p>
            {denne.forklaring && <p className="mt-2">{denne.forklaring}</p>}
          </div>
          <button type="button" onClick={videre} className={`${KNAPP} mt-5 bg-black text-white hover:bg-accent`}>
            {siste ? "Se resultatet" : "Neste påstand"}
          </button>
        </>
      )}

      <p className="mt-6">
        <button
          type="button"
          onClick={() => setFerdig("hoppet")}
          className="text-[15px] font-semibold text-black underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          Hopp over quizen
        </button>
      </p>
    </FeiringRamme>
  );
}
