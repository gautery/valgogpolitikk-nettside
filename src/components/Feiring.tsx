"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import Konfetti from "@/components/Konfetti";

// Feiringen etter grunnkurset: ett skjermbilde med bilde, konfetti, påmelding
// til nyhetsbrevet og vei videre. Teksten redigeres i Pages CMS.

export type FeiringProps = {
  overlinje?: string;
  tittel?: string;
  ingress?: string;
  bilde?: string;
  bildetekst?: string;
  fotokreditt?: ReactNode;
  knapp?: string;
  knappLenke?: string;
  lenke?: string;
  lenkeTil?: string;
  children?: ReactNode;
};

export default function Feiring(p: FeiringProps) {
  // Ny nøkkel starter konfettien på nytt.
  const [runde, setRunde] = useState(0);

  return (
    <div className="relative isolate flex min-h-[calc(100svh-150px)] items-center overflow-hidden bg-black px-4 pt-5 pb-16 sm:px-6 sm:pb-12">
      {p.bilde && (
        <Image src={p.bilde} alt="" fill priority sizes="100vw" className="-z-10 object-cover" />
      )}

      <div className="mx-auto w-full max-w-[640px] rounded-[10px] border-2 border-black bg-white p-6 sm:px-9 sm:py-7">
        {p.overlinje && <p className="mb-3 text-[15px] font-semibold text-black">{p.overlinje}</p>}
        {p.tittel && (
          <h1 className="font-display text-[36px] leading-[1.02] text-black sm:text-[44px]">{p.tittel}</h1>
        )}
        {p.ingress && <p className="mt-3 text-[17px] leading-[1.45] text-black">{p.ingress}</p>}

        {p.children && <div className="mt-5">{p.children}</div>}

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
          {p.knapp && p.knappLenke && (
            <Link
              href={p.knappLenke}
              className="inline-flex min-h-[48px] items-center rounded-md bg-black px-6 text-[16px] font-semibold text-white hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {p.knapp}
            </Link>
          )}
          {p.lenke && p.lenkeTil && (
            <Link href={p.lenkeTil} className="text-[16px] font-semibold text-black underline underline-offset-4">
              {p.lenke}
            </Link>
          )}
          <button
            type="button"
            onClick={() => setRunde((n) => n + 1)}
            className="konfetti-knapp min-h-[48px] rounded-md border-2 border-black bg-rosa px-5 text-[16px] font-semibold text-black hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Mer konfetti
          </button>
        </div>
      </div>

      {(p.bildetekst || p.fotokreditt) && (
        <p className="absolute bottom-0 left-0 right-0 bg-black/75 px-4 py-2 text-center text-[13px] leading-snug text-white">
          {p.bildetekst} {p.fotokreditt}
        </p>
      )}

      <Konfetti key={runde} antall={150} stor />
    </div>
  );
}
