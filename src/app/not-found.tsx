import type { Metadata } from "next";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookSpines from "@/components/BookSpines";
import { lesInnstillinger } from "@/lib/sider";

// Vises når en adresse ikke finnes.

export const metadata: Metadata = {
  title: "Fant ikke siden — valg og politikk",
  robots: { index: false, follow: false },
};

const FORSLAG = [
  { tekst: "Forsiden", lenke: "/" },
  { tekst: "Nytt fra kildene", lenke: "/kilder" },
  { tekst: "Skråblikk", lenke: "/skraablikk" },
];

export default function FantIkke() {
  return (
    <>
      <Header meny={lesInnstillinger().meny} />
      <main id="innhold" className="border-b border-border bg-hero px-6 py-20 md:py-28">
        <div className="mx-auto max-w-[1100px]">
          <BookSpines className="mb-8 h-12 w-auto opacity-80" />
          <p className="mb-3 text-[12px] font-semibold uppercase tracking-widest text-white/60">Feil 404</p>
          <h1 className="mb-4 max-w-[560px] font-[family-name:var(--font-playfair)] text-3xl font-bold leading-tight text-white sm:text-4xl">
            Denne siden fant vi ikke
          </h1>
          <p className="mb-10 max-w-[480px] text-[16px] leading-relaxed text-white/75">
            Kanskje lenken er feil, eller så er siden flyttet. Prøv en av disse:
          </p>
          <ul className="flex flex-wrap gap-3">
            {FORSLAG.map((f, i) => (
              <li key={f.lenke}>
                <Link
                  href={f.lenke}
                  className={`inline-block rounded-md px-5 py-3 text-[14px] font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    i === 0 ? "bg-accent text-white hover:bg-accent-dark" : "border border-white/30 text-white hover:bg-white/10"
                  }`}
                >
                  {f.tekst}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </>
  );
}
