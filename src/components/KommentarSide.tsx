import Link from "next/link";
import Klosser, { Markdown } from "@/components/klosser/Klosser";
import TavleSmakebit from "@/components/partibudsjett/TavleSmakebit";
import { AVTALE_LENKE, avtaleSaker, lesBudsjettavtalen } from "@/lib/budsjettavtalen";
import type { Tekst, Toppfelt } from "@/lib/klosser";
import { lesForside, utenMerke, type Side } from "@/lib/sider";
import { DEMO, UTKAST } from "@/lib/utkast";

// Oppsettet for kommentarer: merkelapp og dato over tittelen, en linje som sier at dette er
// meninger, brødtekst i lesebredde med større første avsnitt, og saken kommentaren handler om
// ved siden av (under på mobil). Innholdet er de samme klossene som på andre sider:
// ett toppfelt og én eller flere tekstklosser. Sitat i teksten (>) blir uthevet sitat.

const BRODTEKST = [
  "max-w-[660px] text-[18.5px] leading-[1.7] text-text-primary",
  "[&>p]:mb-6",
  "[&>blockquote]:my-9 [&>blockquote]:border-l-[6px] [&>blockquote]:!border-rosa [&>blockquote]:pl-5 [&>blockquote]:!not-italic",
  "[&>blockquote]:font-display [&>blockquote]:text-[26px] [&>blockquote]:leading-[1.15] [&>blockquote]:text-black",
].join(" ");
const INGRESS = "[&>p:first-child]:text-[21px] [&>p:first-child]:font-medium [&>p:first-child]:leading-[1.5] [&>p:first-child]:text-black";
const FOKUS = "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black";

/** Kommentaroppsettet passer når siden er ett toppfelt fulgt av rene tekstklosser. */
export function passerSomKommentar(s: Side) {
  const [topp, ...resten] = s.seksjoner;
  return s.mal === "kommentar" && topp?.type === "toppfelt" && resten.length > 0 && resten.every((k) => k.type === "tekst" && !k.graf);
}

export default function KommentarSide({ s }: { s: Side }) {
  const topp = s.seksjoner[0] as Toppfelt;
  const tekster = s.seksjoner.slice(1) as Tekst[];
  // «Kommentar, 29. november 2026» → «29. november 2026». Merkelappen står for seg.
  const dato = (topp.overlinje ?? "").replace(/^\s*kommentar\s*[,:–—-]?\s*/i, "").trim();
  const tittel = utenMerke(topp.tittel || s.tittel, "Kommentar");
  // Lenker kommentaren til siden om budsjettavtalen, vises tavla ved siden av i stedet for en knapp.
  const medTavle = tekster.some((t) => t.knappLenke === AVTALE_LENKE) && (DEMO || !UTKAST.partibudsjett);
  const avtale = medTavle ? lesBudsjettavtalen() : null;
  const nyhetsbrev = lesForside().seksjoner.filter((k) => k.type === "nyhetsbrev").slice(0, 1);

  return (
    <>
      <header className="border-b border-black bg-white px-6 pb-9 pt-10 md:pb-12 md:pt-14">
        <div className="mx-auto max-w-[1100px]">
          <p className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[15px] font-semibold text-black">
            <span className="rounded bg-black px-2 py-0.5 text-[13px] text-white">Kommentar</span>
            {dato && <span>{dato}</span>}
          </p>
          <h1 className="max-w-[860px] font-display text-[38px] leading-[1.03] text-black sm:text-[54px] lg:text-[64px]">{tittel}</h1>
          {topp.ingress && <p className="mt-6 max-w-[660px] text-[20px] leading-[1.5] text-black">{topp.ingress}</p>}
          <p className="mt-6 max-w-[660px] text-[15px] leading-snug text-text-secondary">
            Dette er en kommentar. Den gir uttrykk for skribentens egne meninger.{" "}
            <Link href="/om" className={`font-semibold text-black underline underline-offset-4 ${FOKUS}`}>
              Om valgogpolitikk
            </Link>
          </p>
        </div>
      </header>

      <div className="bg-white px-6 py-10 md:py-14">
        <div
          className={`mx-auto grid max-w-[1100px] grid-cols-1 gap-12 ${
            avtale ? "lg:grid-cols-[minmax(0,660px)_minmax(0,1fr)] lg:gap-16" : ""
          }`}
        >
          <article>
            {tekster.map((t, i) => (
              <div key={i} className={i > 0 ? "mt-10" : undefined}>
                {t.overskrift && <h2 className="mb-4 font-display text-[28px] leading-[1.1] text-black">{t.overskrift}</h2>}
                {t.tekst && <Markdown kilde={t.tekst} klasse={`${BRODTEKST} ${i === 0 ? INGRESS : ""}`} />}
                {t.knapp && t.knappLenke && !(avtale && t.knappLenke === AVTALE_LENKE) && (
                  <Link
                    href={t.knappLenke}
                    className={`mt-8 inline-block rounded-[6px] bg-black px-6 py-3.5 text-[16px] font-semibold text-white hover:bg-text-secondary ${FOKUS}`}
                  >
                    {t.knapp}
                  </Link>
                )}
              </div>
            ))}
          </article>

          {avtale && (
            <aside className="border-t border-black pt-6 lg:sticky lg:top-24 lg:self-start lg:border-t-0 lg:pt-0">
              <p className="text-[13px] font-semibold text-text-secondary">Bakgrunn</p>
              <h2 className="mb-4 mt-1 font-display text-[24px] leading-[1.1] text-black">
                <Link href={AVTALE_LENKE} className={`underline-offset-4 hover:underline ${FOKUS}`}>
                  {avtale.topp.tittel}
                </Link>
              </h2>
              <TavleSmakebit antall={5} ramme hendelse="kommentar-tavle" />
              <Link
                href={AVTALE_LENKE}
                className={`mt-5 inline-block rounded-[6px] bg-black px-6 py-3.5 text-[16px] font-semibold text-white hover:bg-text-secondary ${FOKUS}`}
                data-umami-event="kommentar-til-avtalen"
              >
                Se alle {avtaleSaker(avtale).length} sakene
              </Link>
            </aside>
          )}
        </div>
      </div>

      {nyhetsbrev.length > 0 && <Klosser seksjoner={nyhetsbrev} />}
    </>
  );
}
