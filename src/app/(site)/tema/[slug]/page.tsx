import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hentAlleTema, lesTema } from "@/lib/tema";
import { hentKildeoversikt } from "@/lib/kilder";

export const revalidate = 3600;

const MND = ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"];

function datoTekst(iso: string) {
  const d = new Date(new Date(iso).toLocaleString("en-US", { timeZone: "Europe/Oslo" }));
  return `${d.getDate()}. ${MND[d.getMonth()]}`;
}

export function generateStaticParams() {
  return hentAlleTema().map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tema = lesTema(slug);
  if (!tema) return {};
  return {
    title: `${tema.tittel} — valg og politikk`,
    description: tema.ingress,
    robots: tema.utkast ? { index: false, follow: false } : undefined,
  };
}

export default async function TemaSide({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tema = lesTema(slug);
  if (!tema) notFound();

  const oversikt = await hentKildeoversikt();
  // Maks to saker per kilde, så listen viser bredden.
  const perKilde = new Map<string, number>();
  const siste = (oversikt?.saker ?? [])
    .filter((s) => {
      if (s.kilde === "Stortinget – høringer i komiteene") return false;
      if (!s.temaer.some((t) => tema.temaer.includes(t))) return false;
      const n = perKilde.get(s.kilde) ?? 0;
      if (n >= 2) return false;
      perKilde.set(s.kilde, n + 1);
      return true;
    })
    .slice(0, 8);

  return (
    <>
      {/* Topp */}
      <div className="border-b border-border bg-hero px-6 py-14 md:py-16">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-4 w-1 rounded-full bg-accent" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-white/60">
              Tema
            </span>
          </div>
          <h1 className="mb-4 max-w-[680px] font-[family-name:var(--font-playfair)] text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[44px] lg:leading-[1.15]">
            {tema.tittel}
          </h1>
          <p className="max-w-[560px] text-[16px] leading-relaxed text-white/70">{tema.ingress}</p>
        </div>
      </div>

      {tema.utkast && (
        <div className="border-b border-amber-300 bg-amber-50 px-6 py-3">
          <p className="mx-auto max-w-[1100px] text-[13px] text-amber-900">
            <strong>Utkast.</strong> Teksten og kildekommentarene er foreløpige og ikke godkjent
            for publisering.
          </p>
        </div>
      )}

      {/* Nøkkeltall */}
      {tema.nokkeltall.length > 0 && (
        <section aria-labelledby="nokkeltall" className="border-b border-border bg-surface px-6 py-10">
          <div className="mx-auto max-w-[1100px]">
            <h2 id="nokkeltall" className="sr-only">
              Nøkkeltall
            </h2>
            <dl className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
              {tema.nokkeltall.map((n) => (
                <div key={n.tall} className="border-t-2 border-text-primary pt-4">
                  <dt className="font-[family-name:var(--font-playfair)] text-[40px] font-bold leading-none text-text-primary">
                    {n.tall}
                  </dt>
                  <dd className="mt-3 text-[14px] leading-relaxed text-text-secondary">
                    {n.tekst}
                    <a
                      href={n.lenke}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-2 block text-[12px] font-medium text-text-muted underline decoration-border underline-offset-2 hover:text-accent"
                    >
                      Kilde: {n.kilde}
                    </a>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <div className="px-6 py-12">
      <div className="mx-auto grid max-w-[1100px] gap-14 lg:grid-cols-[minmax(0,1fr)_320px]">
        {/* Hovedkolonne */}
        <div className="min-w-0">
          <div className="mb-12 max-w-[680px] space-y-4 text-[16px] leading-[1.8] text-text-secondary">
            {tema.avsnitt.map((a, i) => (
              <p key={i}>{a}</p>
            ))}
          </div>

          <h2 className="mb-2 font-[family-name:var(--font-playfair)] text-2xl font-bold">
            Kildene
          </h2>
          <p className="mb-6 text-[14px] text-text-muted">
            {tema.kilder.length} kilder, med hva de er gode til.
          </p>
          <ol className="max-w-[720px]">
            {tema.kilder.map((k) => (
              <li key={k.navn} className="border-t border-border py-6">
                <a
                  href={k.lenke}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-[family-name:var(--font-playfair)] text-[20px] font-bold leading-snug text-text-primary hover:text-accent hover:underline"
                >
                  {k.navn}
                </a>
                <div className="mt-1 text-[13px] text-text-muted">{k.utgiver}</div>
                <p className="mt-3 text-[15px] leading-[1.75] text-text-secondary">{k.kommentar}</p>
                {k.bruk && (
                  <p className="mt-3 border-l-2 border-accent pl-3 text-[14px] text-text-primary">
                    <span className="font-semibold">Bruk den til:</span> {k.bruk}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>

        {/* Sidekolonne */}
        <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
          <section aria-labelledby="sistenytt" className="rounded-lg border border-border bg-white p-5">
            <h2 id="sistenytt" className="mb-3 font-[family-name:var(--font-playfair)] text-lg font-bold">
              Siste nytt om {tema.tittel.toLowerCase()}
            </h2>
            {siste.length === 0 ? (
              <p className="text-[13px] italic text-text-muted">Ingen nye saker de siste ukene.</p>
            ) : (
              <ol>
                {siste.map((s) => (
                  <li key={s.id} className="border-t border-border py-2.5 first:border-0 first:pt-0">
                    <div className="text-[11.5px] text-text-muted">
                      {s.viktig && <span className="mr-1 text-accent">★</span>}
                      {s.kilde} / {datoTekst(s.dato)}
                    </div>
                    <a
                      href={s.lenke}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-0.5 line-clamp-3 text-[13.5px] font-medium leading-snug text-text-primary hover:text-accent"
                    >
                      {s.tittel}
                    </a>
                  </li>
                ))}
              </ol>
            )}
            <Link href="/kilder" className="mt-3 inline-block text-[12.5px] font-semibold text-accent hover:underline">
              Alle saker fra kildene
            </Link>
          </section>

          {(tema.analyser.length > 0 || tema.karuseller.length > 0) && (
            <section aria-labelledby="mineanalyser" className="rounded-lg border border-border bg-surface p-5">
              <h2 id="mineanalyser" className="mb-3 font-[family-name:var(--font-playfair)] text-lg font-bold">
                Analyser og karuseller
              </h2>
              <ul className="text-[13.5px]">
                {tema.analyser.map((a) => (
                  <li key={a.tittel} className="border-t border-border py-2 first:border-0 first:pt-0">
                    {a.lenke ? (
                      <Link href={a.lenke} className="font-medium text-text-primary hover:text-accent hover:underline">
                        {a.tittel}
                      </Link>
                    ) : (
                      <span className="font-medium text-text-primary">{a.tittel}</span>
                    )}
                    <div className="text-[11.5px] text-text-muted">{a.type ?? "Analyse"}</div>
                  </li>
                ))}
                {tema.karuseller.map((k) => (
                  <li key={k.tittel} className="border-t border-border py-2 first:border-0 first:pt-0">
                    {k.lenke ? (
                      <a href={k.lenke} target="_blank" rel="noopener noreferrer" className="font-medium text-text-primary hover:text-accent hover:underline">
                        {k.tittel}
                      </a>
                    ) : (
                      <span className="font-medium text-text-primary">{k.tittel}</span>
                    )}
                    <div className="text-[11.5px] text-text-muted">Karusell på Instagram</div>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>
      </div>
    </>
  );
}
