import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Forklaring, { VisAlle } from "@/components/skraablikk/Forklaring";
import Karusell from "@/components/skraablikk/Karusell";
import { teletekst } from "@/components/skraablikk/teletekst";
import { Markdown } from "@/components/klosser/Klosser";
import { hentAlleSkraablikk, lesSkraablikk } from "@/lib/skraablikk";

export const dynamicParams = false;

export function generateStaticParams() {
  return hentAlleSkraablikk().map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = lesSkraablikk(slug);
  if (!s) return {};
  return {
    title: `${s.tittel} — Skråblikk — valg og politikk`,
    description: s.ingress,
    robots: s.utkast ? { index: false, follow: false } : undefined,
  };
}

export default async function SkraablikkSide({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = lesSkraablikk(slug);
  if (!s) notFound();
  const medForklaring = s.slides.filter((x) => x.forklaring).length;

  return (
    <>
      {s.utkast && (
        <div className="border-b border-amber-300 bg-amber-50 px-6 py-3">
          <p className="mx-auto max-w-[1100px] text-[13px] text-amber-900">
            <strong>Utkast.</strong> Forklaringene er ikke godkjent ennå, og siden vises ikke i søkemotorer.
          </p>
        </div>
      )}

      {/* Topp med karusellen */}
      <div className="overflow-hidden bg-hero pt-10 pb-10">
        <div className="mx-auto max-w-[1100px] px-6">
          <Link
            href="/skraablikk"
            className={`${teletekst.className} inline-block bg-[#C9B8FF] px-3 py-1 text-[24px] leading-none text-black shadow-[5px_5px_0_#5EEAD4] hover:bg-[#FFE600] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#FF65C5]`}
          >
            Skråblikk
          </Link>
          <h1 className="mt-6 max-w-[760px] font-[family-name:var(--font-playfair)] text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[46px] lg:leading-[1.12]">
            {s.tittel}
          </h1>
          {s.ingress && <p className="mt-4 max-w-[600px] text-[17px] leading-relaxed text-white/70">{s.ingress}</p>}
        </div>
        <div className="mt-8">
          <Karusell slides={s.slides} tittel={s.tittel} />
        </div>
        <div className="mx-auto mt-6 flex max-w-[1100px] flex-wrap justify-center gap-x-6 gap-y-2 px-6 text-[14px]">
          <a href="#forklaringer" className="font-semibold text-white underline decoration-white/40 underline-offset-4 hover:decoration-white">
            Gå til forklaringene
          </a>
          {s.instagram && (
            <a
              href={s.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 underline decoration-white/30 underline-offset-4 hover:text-white"
            >
              Se den på Instagram
            </a>
          )}
        </div>
      </div>

      {/* Slide for slide */}
      <div id="forklaringer" className="scroll-mt-20 px-6 py-14">
        <div className="mx-auto max-w-[680px]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-[15px] text-text-secondary">
              {medForklaring} slides med forklaring. Prøv selv først.
            </p>
            <VisAlle />
          </div>

          <ol className="mt-10 space-y-20">
            {s.slides.map((slide, i) => (
              <li key={slide.bilde || i} id={`slide-${i + 1}`} className="scroll-mt-24">
                <h2 className="sr-only">
                  Slide {i + 1}: {slide.tekst}
                </h2>
                <div className={`${teletekst.className} mb-2 text-[22px] leading-none text-text-muted`} aria-hidden="true">
                  {String(i + 1).padStart(2, "0")} / {String(s.slides.length).padStart(2, "0")}
                </div>
                {slide.bilde && (
                  <Image
                    src={slide.bilde}
                    alt=""
                    width={1080}
                    height={1350}
                    sizes="(min-width: 728px) 680px, 100vw"
                    className="w-full rounded-[4px] border border-border"
                  />
                )}
                {slide.forklaring && (
                  <Forklaring>
                    <Markdown kilde={slide.forklaring} klasse="text-[17px] leading-[1.8] text-text-secondary [&>p:first-child]:text-[19px] [&>p:first-child]:font-medium [&>p:first-child]:leading-[1.6] [&>p:first-child]:text-text-primary" />
                    {slide.kilder.length > 0 && (
                      <div className="mt-5 text-[13.5px] leading-relaxed text-text-muted">
                        <span className="font-semibold text-text-secondary">{slide.kilder.length > 1 ? "Kilder: " : "Kilde: "}</span>
                        {slide.kilder.map((k, j) => (
                          <span key={k.navn}>
                            {j > 0 && "; "}
                            {k.lenke ? (
                              <a
                                href={k.lenke}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline decoration-border-light underline-offset-2 hover:text-accent"
                              >
                                {k.navn}
                              </a>
                            ) : (
                              k.navn
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                  </Forklaring>
                )}
              </li>
            ))}
          </ol>

          <div className="mt-20 border-t border-border pt-8">
            <Link href="/skraablikk" className="text-[15px] font-semibold text-accent hover:underline">
              Flere skråblikk
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
