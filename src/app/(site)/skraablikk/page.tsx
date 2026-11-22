import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { teletekst } from "@/components/skraablikk/teletekst";
import { hentAlleSkraablikk } from "@/lib/skraablikk";

export const metadata: Metadata = {
  title: "Skråblikk — valg og politikk",
  description: "Karuseller med et glimt i øyet, og forklaringene bak spøkene.",
};

export default function SkraablikkOversikt() {
  // Utkast vises bare på sin egen adresse, ikke i oversikten.
  const liste = hentAlleSkraablikk().filter((s) => !s.utkast);
  return (
    <>
      <div className="bg-hero px-6 py-14">
        <div className="mx-auto max-w-[1100px]">
          <h1
            className={`${teletekst.className} inline-block bg-[#C9B8FF] px-4 py-1.5 text-[44px] leading-none text-black shadow-[7px_7px_0_#5EEAD4] sm:text-[56px]`}
          >
            Skråblikk
          </h1>
          <p className="mt-7 max-w-[560px] text-[17px] leading-relaxed text-white/70">
            Karuseller med et glimt i øyet. Her er forklaringene bak spøkene, litt for moro og litt på alvor.
          </p>
        </div>
      </div>
      <div className="px-6 py-12">
        {liste.length === 0 && (
          <p className="mx-auto max-w-[1100px] text-[16px] text-text-secondary">Det kommer snart skråblikk her.</p>
        )}
        <ul className="mx-auto grid max-w-[1100px] grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {liste.map((s) => (
            <li key={s.slug}>
              <Link href={`/skraablikk/${s.slug}`} className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
                {s.slides[0]?.bilde && (
                  <Image
                    src={s.slides[0].bilde}
                    alt=""
                    width={1080}
                    height={1350}
                    sizes="(min-width: 1024px) 340px, (min-width: 640px) 50vw, 100vw"
                    className="w-full rounded-[4px] border border-border transition-transform group-hover:-translate-y-1"
                  />
                )}
                <div className="mt-4 font-[family-name:var(--font-playfair)] text-[22px] font-bold leading-snug text-text-primary group-hover:text-accent">
                  {s.tittel}
                </div>
                <div className="mt-1 text-[13.5px] text-text-muted">
                  {s.slides.length} slides
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
