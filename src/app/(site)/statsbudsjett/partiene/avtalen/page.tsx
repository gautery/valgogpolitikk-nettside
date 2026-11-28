import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { DEMO, SKJULT_FOR_SOK, UTKAST } from "@/lib/utkast";
import { tilknyttetSide, utenMerke } from "@/lib/sider";
import { AAR, TYPETILFELLE_AAR } from "@/lib/partibudsjett";
import { avsnitt, avtaleSaker, lesBudsjettavtalen } from "@/lib/budsjettavtalen";
import Avtale from "@/components/partibudsjett/Avtale";
import { Tilbake, Utkastlinje } from "@/components/partibudsjett/Felles";

// Budsjettavtalen mot partienes egne alternative budsjetter. All tekst ligger i
// content/budsjettavtalen.yml og redigeres i Pages CMS (se .pages.yml).

export const metadata: Metadata = {
  title: "Budsjettavtalen for 2027: hvem fikk viljen sin? — valg og politikk",
  description:
    "Budsjettavtalen mellom Ap, Sp, SV og Rødt sammenlignet sak for sak med det Sp, SV og Rødt foreslo i sine egne alternative statsbudsjetter.",
  robots: UTKAST.partibudsjett ? SKJULT_FOR_SOK : undefined,
};

export default function AvtaleSide() {
  const d = lesBudsjettavtalen();
  const saker = avtaleSaker(d);
  // Kommentaren vises ikke etter lansering så lenge siden den ligger på er utkast.
  const kommentar = tilknyttetSide(d.topp.kommentarLenke);
  const visKommentar = kommentar && (DEMO || !kommentar.utkast);

  return (
    <>
      <Utkastlinje provedata={false} aar={TYPETILFELLE_AAR} />

      <div className="bg-rosa px-6 py-12 md:py-16">
        <div
          className={`mx-auto grid max-w-[1100px] grid-cols-1 gap-9 ${
            d.topp.bilde ? "md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] md:items-center md:gap-14" : ""
          }`}
        >
          <div>
            <Tilbake aar={AAR} lenke="Partienes alternative budsjetter" />
            <h1 className="max-w-[760px] font-display text-[38px] leading-[1.03] text-black sm:text-[56px]">{d.topp.tittel}</h1>
            <div className="mt-6 max-w-[620px] space-y-4 text-[18px] leading-[1.55] text-black">
              {avsnitt(d.topp.ingress).map((a) => (
                <p key={a}>{a}</p>
              ))}
            </div>
            {visKommentar && (
              <p className="mt-7 max-w-[620px] border-t border-black pt-4 text-[17px] leading-snug text-black">
                <span className="mr-2 rounded bg-black px-1.5 py-0.5 text-[12.5px] font-semibold text-white">Kommentar</span>
                <Link
                  href={d.topp.kommentarLenke!.trim()}
                  className="font-extrabold underline underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
                  data-umami-event="avtalen-kommentar"
                >
                  {utenMerke(kommentar.tittel, "Kommentar")}
                </Link>
              </p>
            )}
          </div>
          {d.topp.bilde && (
            <figure>
              <Image
                src={d.topp.bilde}
                alt={d.topp.bildetekst ?? ""}
                width={1200}
                height={800}
                priority
                sizes="(min-width: 768px) 480px, 100vw"
                className="aspect-[3/2] w-full rounded-[10px] object-cover"
              />
              {d.topp.fotokreditt && <figcaption className="mt-2 text-[13px] text-black/80">{d.topp.fotokreditt}</figcaption>}
            </figure>
          )}
        </div>
      </div>

      <section className="border-b border-black bg-white px-6 py-12">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="font-display text-[28px] leading-[1.1] text-black sm:text-[34px]">{d.saker.overskrift}</h2>
          <div className="mt-6">
            <Avtale saker={saker} />
          </div>
        </div>
      </section>

      <section className="border-b border-black bg-white px-6 py-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="max-w-[720px]">
            <h2 className="font-display text-[28px] leading-[1.1] text-black sm:text-[34px]">{d.viktigste.overskrift}</h2>
            <ul className="mt-5 space-y-3.5 text-[16px] leading-[1.55] text-text-secondary">
              {(d.viktigste.punkter ?? []).map((p) => (
                <li key={p.tittel}>
                  <strong className="font-semibold text-black">{p.tittel}</strong> {p.tekst}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-surface px-6 py-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="max-w-[720px] space-y-4 text-[15.5px] leading-[1.6] text-text-secondary">
            <h2 className="font-display text-[26px] text-black">{d.metode.overskrift}</h2>
            {avsnitt(d.metode.tekst).map((a) => (
              <p key={a}>{a}</p>
            ))}
            <h3 className="pt-2 font-display text-[19px] text-black">Kilder</h3>
            <ul className="space-y-1 text-[14.5px]">
              {(d.kilder ?? []).map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
