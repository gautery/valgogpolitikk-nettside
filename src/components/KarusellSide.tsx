import Image from "next/image";
import Link from "next/link";
import type { Karusell, Sikkerhet } from "@/lib/karuseller";
import { hentKildeoversikt } from "@/lib/kilder";

// Kildesiden for én karusell. Vises på valgogpolitikk.no/<adresse> via app/(site)/[side].

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

export default async function KarusellSide({ k }: { k: Karusell }) {
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
      {/* Topp: slide 1 slik den ser ut på Instagram, med tittel og nøkkeltall ved siden av */}
      <div className="border-b border-black px-6 py-10 md:py-14">
        <div className="mx-auto grid max-w-[1100px] items-center gap-8 md:grid-cols-[360px_minmax(0,1fr)] md:gap-14">
          {k.slides[0]?.bilde && (
            <Image
              src={k.slides[0].bilde}
              alt=""
              width={1080}
              height={1350}
              priority
              sizes="(min-width: 768px) 360px, 100vw"
              className="w-full max-w-[360px] rounded-[10px]"
            />
          )}
          <div>
            <p className="mb-4 text-[15px] font-semibold text-black">Kildene bak karusellen</p>
            <h1 className="font-display text-[38px] leading-[1.04] sm:text-[50px]">{k.tittel}</h1>
            <p className="mt-5 max-w-[540px] text-[18px] leading-[1.55] text-text-secondary">{k.ingress}</p>
            <p className="mt-5 text-[15px] text-text-muted">
              {k.slides.length} slides, {medTall} tall med kilde
            </p>
            {k.instagram && (
              <a
                href={k.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block rounded-[6px] bg-black px-5 py-3 text-[15px] font-semibold text-white hover:bg-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                Se karusellen på Instagram
              </a>
            )}
          </div>
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
          <h2 className="mb-2 font-display text-[30px] sm:text-[36px]">
            Slide for slide
          </h2>
          <p className="mb-8 max-w-[620px] text-[15px] leading-relaxed text-text-muted">
            Hvert tall med kilden det bygger på, og hvor sikkert det er. Fire streker betyr at tallet
            står direkte i kilden. Én strek betyr et grovt anslag.
          </p>

          <ol>
            {k.slides.map((s, i) => (
              <li
                key={i}
                className="grid gap-5 border-t border-black py-8 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-8 lg:grid-cols-[190px_minmax(0,1fr)]"
              >
                <div className="flex items-start gap-4 sm:block">
                  {s.bilde ? (
                  <a href={s.bilde} className="shrink-0 rounded-[4px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                    <Image
                      src={s.bilde}
                      alt={`Slide ${i + 1}, åpner i full størrelse: ${s.tekst}`}
                      width={1080}
                      height={1350}
                      sizes="(min-width: 1024px) 190px, 150px"
                      className="w-[110px] rounded-[8px] sm:w-full"
                    />
                    </a>
                  ) : (
                    <div className="flex aspect-[4/5] w-[110px] items-center justify-center rounded-[4px] border border-dashed border-border-light text-[12px] text-text-muted sm:w-full">
                      Bilde mangler
                    </div>
                  )}
                  <span className="text-[13px] text-text-muted sm:mt-2 sm:block">
                    Slide {i + 1} av {k.slides.length}
                  </span>
                </div>

                <div className="min-w-0 max-w-[680px]">
                  <h3 className="text-[19px] font-extrabold leading-snug tracking-[-0.01em] text-black">
                    {s.tittel}
                  </h3>

                  {s.tall ? (
                    <>
                      <p className="mt-2 font-display text-[40px] leading-[1.05] text-accent sm:text-[48px]">
                        {s.tall}
                      </p>
                      {s.sikkerhet && (
                        <div className="mt-3">
                          <Sikkerhetsmaler niva={s.sikkerhet} />
                        </div>
                      )}
                      <ul className="mt-5 space-y-3">
                        {s.kilder.map((kilde) => (
                          <li key={kilde.navn + kilde.merknad} className="border-l-[3px] border-black pl-4">
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
              <h2 id="regnet" className="mb-4 font-display text-2xl">
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
            <section aria-labelledby="sistenytt" className="mt-12 border-t border-black pt-6">
              <h2 id="sistenytt" className="mb-4 font-display text-xl">
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
              <Link href="/kilder" className="mt-3 inline-block text-[13px] font-semibold text-black underline underline-offset-4 hover:text-accent-dark">
                Alle saker fra kildene
              </Link>
            </section>
          )}

          <div className="mt-12 flex flex-wrap gap-3 border-t border-black pt-6">
            <Link
              href="/karuseller"
              className="inline-block rounded-[6px] bg-black px-6 py-3.5 text-[16px] font-semibold text-white hover:bg-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Se flere karuseller
            </Link>
            <Link
              href="/analyser"
              className="inline-block rounded-[6px] border border-black px-6 py-3.5 text-[16px] font-semibold text-black hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Se analysene
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
