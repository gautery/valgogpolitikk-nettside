import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hentAlleKaruseller, lesKarusell, type Sikkerhet } from "@/lib/karuseller";
import { hentKildeoversikt } from "@/lib/kilder";

// Én kildeside per karusell, på toppnivå: valgogpolitikk.no/<slug>.
// Bare slugs som finnes i content/karuseller blir sider; alt annet gir 404.
export const dynamicParams = false;
export const revalidate = 3600;

const NIVA: Record<Sikkerhet, number> = {
  sikkert: 4,
  "ganske sikkert": 3,
  middels: 2,
  usikkert: 1,
};

const MND = ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"];
function datoTekst(iso: string) {
  const d = new Date(new Date(iso).toLocaleString("en-US", { timeZone: "Europe/Oslo" }));
  return `${d.getDate()}. ${MND[d.getMonth()]}`;
}

export function generateStaticParams() {
  return hentAlleKaruseller().map((k) => ({ karusell: k.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ karusell: string }>;
}): Promise<Metadata> {
  const { karusell } = await params;
  const k = lesKarusell(karusell);
  if (!k) return {};
  return {
    title: `${k.tittel} — valg og politikk`,
    description: k.ingress,
    robots: k.utkast ? { index: false, follow: false } : undefined,
    openGraph: { images: k.slides[0] ? [k.slides[0].bilde] : undefined },
  };
}

function Sikkerhetsmaler({ niva }: { niva: Sikkerhet }) {
  const n = NIVA[niva];
  return (
    <div className="flex items-center gap-2.5">
      <div className="flex gap-[3px]" aria-hidden="true">
        {[1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className={`h-2.5 w-5 rounded-[2px] ${i <= n ? "bg-text-primary" : "bg-border"}`}
          />
        ))}
      </div>
      <span className="text-[13px] text-text-secondary">
        <span className="sr-only">Hvor sikkert tallet er: </span>
        {niva.charAt(0).toUpperCase() + niva.slice(1)}
      </span>
    </div>
  );
}

export default async function KarusellSide({
  params,
}: {
  params: Promise<{ karusell: string }>;
}) {
  const { karusell } = await params;
  const k = lesKarusell(karusell);
  if (!k) notFound();

  const medTall = k.slides.filter((s) => s.tall).length;

  const oversikt = await hentKildeoversikt();
  const perKilde = new Map<string, number>();
  const siste = (oversikt?.saker ?? [])
    .filter((s) => {
      if (!k.tema || !s.temaer.includes(k.tema)) return false;
      if (s.kilde === "Stortinget – høringer i komiteene") return false;
      const n = perKilde.get(s.kilde) ?? 0;
      if (n >= 2) return false;
      perKilde.set(s.kilde, n + 1);
      return true;
    })
    .slice(0, 6);

  return (
    <>
      {/* Topp */}
      <div className="border-b border-border bg-hero px-6 py-12 md:py-16">
        <div className="mx-auto grid max-w-[1100px] items-center gap-10 md:grid-cols-[minmax(0,1fr)_240px]">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="h-4 w-1 rounded-full bg-accent" />
              <span className="text-[13px] font-medium text-white/50">Kildene bak karusellen</span>
            </div>
            <h1 className="mb-4 max-w-[640px] font-[family-name:var(--font-playfair)] text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[44px] lg:leading-[1.15]">
              {k.tittel}
            </h1>
            <p className="max-w-[540px] text-[16px] leading-relaxed text-white/70">{k.ingress}</p>
            <p className="mt-5 text-[14px] text-white/50">
              {k.slides.length} slides, {medTall} tall med kilde
            </p>
            {k.instagram && (
              <a
                href={k.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block rounded-md bg-accent px-5 py-2.5 text-[14px] font-semibold text-white hover:bg-accent-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Se karusellen på Instagram
              </a>
            )}
          </div>
          {k.slides[0] && (
            <Image
              src={k.slides[0].bilde}
              alt=""
              width={1080}
              height={1350}
              priority
              sizes="240px"
              className="hidden w-[240px] rotate-[2deg] rounded-md shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)] md:block"
            />
          )}
        </div>
      </div>

      {k.utkast && (
        <div className="border-b border-amber-300 bg-amber-50 px-6 py-3">
          <p className="mx-auto max-w-[1100px] text-[13px] text-amber-900">
            <strong>Utkast.</strong> Siden er ikke godkjent for publisering. Sikkerhetsvurderingene og
            kildemerknadene er foreløpige.
          </p>
        </div>
      )}

      {/* Slide for slide */}
      <div className="px-6 py-12">
        <div className="mx-auto max-w-[1100px]">
          <h2 className="mb-2 font-[family-name:var(--font-playfair)] text-2xl font-bold">
            Slide for slide
          </h2>
          <p className="mb-8 max-w-[620px] text-[15px] leading-relaxed text-text-muted">
            Hvert tall med kilden det bygger på, og hvor sikkert det er. Fire streker betyr at tallet
            står direkte i kilden. Én strek betyr et grovt anslag.
          </p>

          <ol>
            {k.slides.map((s, i) => (
              <li
                key={s.bilde}
                className="grid gap-5 border-t border-border py-8 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-8 lg:grid-cols-[190px_minmax(0,1fr)]"
              >
                <div className="flex items-start gap-4 sm:block">
                  <a href={s.bilde} className="shrink-0 rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                  <Image
                    src={s.bilde}
                    alt={`Slide ${i + 1}, åpner i full størrelse: ${s.tekst}`}
                    width={1080}
                    height={1350}
                    sizes="(min-width: 1024px) 190px, 150px"
                    className="w-[110px] rounded-[4px] border border-border sm:w-full"
                  />
                  </a>
                  <span className="text-[13px] text-text-muted sm:mt-2 sm:block">
                    Slide {i + 1} av {k.slides.length}
                  </span>
                </div>

                <div className="min-w-0 max-w-[680px]">
                  <h3 className="text-[17px] font-semibold leading-snug text-text-primary">
                    {s.tittel}
                  </h3>

                  {s.tall ? (
                    <>
                      <p className="mt-2 font-[family-name:var(--font-playfair)] text-[34px] font-bold leading-tight text-accent sm:text-[40px]">
                        {s.tall}
                      </p>
                      {s.sikkerhet && (
                        <div className="mt-3">
                          <Sikkerhetsmaler niva={s.sikkerhet} />
                        </div>
                      )}
                      <ul className="mt-5 space-y-3">
                        {s.kilder.map((kilde) => (
                          <li key={kilde.navn + kilde.merknad} className="border-l-2 border-border pl-4">
                            {kilde.lenke ? (
                              <a
                                href={kilde.lenke}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[15px] font-medium text-text-primary underline decoration-border-light underline-offset-[3px] hover:text-accent hover:decoration-accent"
                              >
                                {kilde.navn}
                              </a>
                            ) : (
                              <span className="text-[15px] font-medium text-text-primary">{kilde.navn}</span>
                            )}
                            {kilde.merknad && (
                              <p className="mt-1 text-[14px] leading-relaxed text-text-secondary">
                                {kilde.merknad}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <p className="mt-2 text-[14px] text-text-muted">Argument, ingen nye tall.</p>
                  )}

                  <details className="group mt-5">
                    <summary className="cursor-pointer text-[13.5px] font-medium text-text-muted hover:text-text-primary">
                      Teksten på sliden
                    </summary>
                    <p className="mt-2 text-[14.5px] leading-[1.75] text-text-secondary">{s.tekst}</p>
                  </details>
                </div>
              </li>
            ))}
          </ol>

          {k.avsnitt.length > 0 && (
            <section aria-labelledby="regnet" className="mt-6 border-t-2 border-text-primary pt-8">
              <h2 id="regnet" className="mb-4 font-[family-name:var(--font-playfair)] text-2xl font-bold">
                Slik regnet vi
              </h2>
              <div className="max-w-[680px] space-y-4 text-[16px] leading-[1.8] text-text-secondary">
                {k.avsnitt.map((a, i) => (
                  <p key={i}>{a}</p>
                ))}
              </div>
            </section>
          )}

          {siste.length > 0 && (
            <section aria-labelledby="sistenytt" className="mt-12 rounded-lg border border-border bg-surface p-6">
              <h2 id="sistenytt" className="mb-4 font-[family-name:var(--font-playfair)] text-xl font-bold">
                Siste nytt om {k.tema.toLowerCase()}
              </h2>
              <ol className="grid gap-x-8 sm:grid-cols-2">
                {siste.map((s) => (
                  <li key={s.id} className="border-t border-border py-3">
                    <div className="text-[12px] text-text-muted">
                      {s.kilde}, {datoTekst(s.dato)}
                    </div>
                    <a
                      href={s.lenke}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 line-clamp-2 text-[14px] font-medium leading-snug text-text-primary hover:text-accent"
                    >
                      {s.tittel}
                    </a>
                  </li>
                ))}
              </ol>
              <Link href="/kilder" className="mt-3 inline-block text-[13px] font-semibold text-accent hover:underline">
                Alle saker fra kildene
              </Link>
            </section>
          )}
        </div>
      </div>
    </>
  );
}
