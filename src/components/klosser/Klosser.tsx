import Image from "next/image";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";
import BookSpines from "@/components/BookSpines";
import NewsletterForm from "@/components/NewsletterForm";
import PostList from "@/components/PostList";
import { KildeBand, TEMAFARGER } from "@/components/SisteFraKildene";
import DatawrapperGraf from "@/components/klosser/DatawrapperGraf";
import { datawrapperId, type Bakgrunn, type Kloss } from "@/lib/klosser";
import { hentKildeoversikt } from "@/lib/kilder";
import { hentAlleKaruseller } from "@/lib/karuseller";
import { getAllPosts } from "@/lib/posts";
import { erEkstern, lesInnstillinger } from "@/lib/sider";
import { hentAlleTema } from "@/lib/tema";
import { hentAlleSkraablikk } from "@/lib/skraablikk";

// Tegner en side bygd av byggeklosser. Hver kloss er en seksjon i full bredde.

export type KlossKontekst = {
  /** Ta med karusell- og temasider som er merket som utkast (brukes i kloss-katalogen). */
  visUtkast?: boolean;
};

const MND = ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"];
function datoTekst(iso: string) {
  const d = new Date(new Date(iso).toLocaleString("en-US", { timeZone: "Europe/Oslo" }));
  return `${d.getDate()}. ${MND[d.getMonth()]}`;
}
function postDato(dato: string) {
  const d = new Date(dato);
  return isNaN(d.getTime()) ? "" : d.toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" });
}

function Seksjon({ bakgrunn, children }: { bakgrunn?: Bakgrunn; children: ReactNode }) {
  return (
    <section
      className={`px-6 py-12 md:py-14 ${
        bakgrunn === "lys" ? "border-y border-border bg-surface" : "bg-background"
      }`}
    >
      <div className="mx-auto max-w-[1100px]">{children}</div>
    </section>
  );
}

function Overskrift({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <h2 className="mb-6 font-[family-name:var(--font-playfair)] text-2xl font-bold leading-snug text-text-primary sm:text-[28px]">
      {children}
    </h2>
  );
}

const lenkeStil =
  "font-medium text-text-primary underline decoration-border-light underline-offset-[3px] hover:text-accent hover:decoration-accent";

function Lenke({ href, className, children }: { href: string; className?: string; children: ReactNode }) {
  return erEkstern(href) ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

// Markdown fra rik tekst-feltet i Pages CMS. «md» betyr ren markdown: ingen kode kjøres.
export async function Markdown({ kilde, klasse }: { kilde: string; klasse?: string }) {
  const { content } = await compileMDX({
    source: kilde,
    options: { mdxOptions: { format: "md" } },
    components: {
      h2: (p) => <h3 className="mb-3 mt-8 font-[family-name:var(--font-playfair)] text-xl font-bold text-text-primary" {...p} />,
      h3: (p) => <h4 className="mb-2 mt-6 text-[17px] font-semibold text-text-primary" {...p} />,
      p: (p) => <p className="mb-4 last:mb-0" {...p} />,
      a: ({ href = "", children }) => (
        <Lenke href={href} className={lenkeStil}>
          {children}
        </Lenke>
      ),
      ul: (p) => <ul className="mb-4 list-disc space-y-1.5 pl-5" {...p} />,
      ol: (p) => <ol className="mb-4 list-decimal space-y-1.5 pl-5" {...p} />,
      strong: (p) => <strong className="font-semibold text-text-primary" {...p} />,
      blockquote: (p) => <blockquote className="mb-4 border-l-2 border-accent pl-4 italic" {...p} />,
    },
  });
  return <div className={klasse ?? "max-w-[680px] text-[16px] leading-[1.8] text-text-secondary"}>{content}</div>;
}

async function EnKloss({ kloss, ktx }: { kloss: Kloss; ktx: KlossKontekst }) {
  switch (kloss.type) {
    case "toppfelt":
      return (
        <div className="border-b border-border bg-hero px-6 py-16 md:py-20">
          <div className="mx-auto max-w-[1100px]">
            <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
              <div>
                {kloss.overlinje && (
                  <div className="mb-3 flex items-center gap-2">
                    <div className="h-4 w-1 rounded-full bg-accent" />
                    <span className="text-[11px] font-semibold uppercase tracking-widest text-white/60">
                      {kloss.overlinje}
                    </span>
                  </div>
                )}
                {kloss.tittel && (
                  <h1 className="mb-4 max-w-[560px] font-[family-name:var(--font-playfair)] text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[44px] lg:leading-[1.15]">
                    {kloss.tittel}
                  </h1>
                )}
                {kloss.ingress && (
                  <p className="max-w-[460px] text-[15px] leading-relaxed text-white/55">{kloss.ingress}</p>
                )}
              </div>
              {kloss.bilde ? (
                <Image
                  src={kloss.bilde}
                  alt=""
                  width={1080}
                  height={1350}
                  priority
                  sizes="240px"
                  className="hidden w-[240px] rounded-md shadow-[0_20px_40px_-12px_rgba(0,0,0,0.6)] md:block"
                />
              ) : (
                kloss.bokrygger && <BookSpines className="hidden h-24 w-auto opacity-40 md:block" />
              )}
            </div>
          </div>
        </div>
      );

    case "tekst":
      if (!kloss.tekst && !kloss.overskrift) return null;
      return (
        <Seksjon bakgrunn={kloss.bakgrunn}>
          <Overskrift>{kloss.overskrift}</Overskrift>
          {kloss.tekst && <Markdown kilde={kloss.tekst} />}
        </Seksjon>
      );

    case "nokkeltall": {
      const tall = (kloss.tall ?? []).filter((t) => t?.tall);
      if (tall.length === 0) return null;
      return (
        <Seksjon bakgrunn={kloss.bakgrunn}>
          <Overskrift>{kloss.overskrift}</Overskrift>
          <dl className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {tall.map((n, i) => (
              <div key={i} className="border-t-2 border-text-primary pt-4">
                <dt className="font-[family-name:var(--font-playfair)] text-[40px] font-bold leading-none text-text-primary">
                  {n.tall}
                </dt>
                <dd className="mt-3 text-[14px] leading-relaxed text-text-secondary">
                  {n.tekst}
                  {n.kilde &&
                    (n.lenke ? (
                      <a
                        href={n.lenke}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 block text-[12px] font-medium text-text-muted underline decoration-border underline-offset-2 hover:text-accent"
                      >
                        Kilde: {n.kilde}
                      </a>
                    ) : (
                      <span className="mt-2 block text-[12px] font-medium text-text-muted">Kilde: {n.kilde}</span>
                    ))}
                </dd>
              </div>
            ))}
          </dl>
        </Seksjon>
      );
    }

    case "bilde":
      if (!kloss.bilde) return null;
      return (
        <Seksjon bakgrunn={kloss.bakgrunn}>
          <figure className={kloss.bredde === "bred" ? "" : "max-w-[680px]"}>
            <Image
              src={kloss.bilde}
              alt={kloss.alt ?? ""}
              width={1600}
              height={1000}
              sizes={kloss.bredde === "bred" ? "(min-width: 1100px) 1100px, 100vw" : "(min-width: 728px) 680px, 100vw"}
              className="h-auto w-full rounded-md border border-border"
            />
            {kloss.bildetekst && (
              <figcaption className="mt-3 text-[13.5px] leading-relaxed text-text-muted">{kloss.bildetekst}</figcaption>
            )}
          </figure>
        </Seksjon>
      );

    case "datawrapper": {
      const id = datawrapperId(kloss.lenke);
      if (!id) return null;
      return (
        <Seksjon bakgrunn={kloss.bakgrunn}>
          <div className={kloss.bredde === "bred" ? "" : "max-w-[680px]"}>
            <DatawrapperGraf id={id} tittel={kloss.beskrivelse || "Graf fra Datawrapper"} />
          </div>
        </Seksjon>
      );
    }

    case "sitat":
      if (!kloss.sitat) return null;
      return (
        <Seksjon bakgrunn={kloss.bakgrunn}>
          <figure className="max-w-[760px] border-l-[3px] border-accent pl-6 sm:pl-8">
            <blockquote className="font-[family-name:var(--font-playfair)] text-[24px] font-semibold leading-snug text-text-primary sm:text-[30px]">
              {kloss.sitat}
            </blockquote>
            {kloss.kilde && <figcaption className="mt-4 text-[14px] text-text-muted">{kloss.kilde}</figcaption>}
          </figure>
        </Seksjon>
      );

    case "kildeliste": {
      const kilder = (kloss.kilder ?? []).filter((k) => k?.navn);
      if (kilder.length === 0) return null;
      return (
        <Seksjon bakgrunn={kloss.bakgrunn}>
          <Overskrift>{kloss.overskrift}</Overskrift>
          <ol className="max-w-[720px]">
            {kilder.map((k, i) => (
              <li key={i} className="border-t border-border py-6">
                {k.lenke ? (
                  <a
                    href={k.lenke}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-[family-name:var(--font-playfair)] text-[20px] font-bold leading-snug text-text-primary hover:text-accent hover:underline"
                  >
                    {k.navn}
                  </a>
                ) : (
                  <span className="font-[family-name:var(--font-playfair)] text-[20px] font-bold leading-snug text-text-primary">
                    {k.navn}
                  </span>
                )}
                {k.utgiver && <div className="mt-1 text-[13px] text-text-muted">{k.utgiver}</div>}
                {k.kommentar && <p className="mt-3 text-[15px] leading-[1.75] text-text-secondary">{k.kommentar}</p>}
                {k.bruk && (
                  <p className="mt-3 border-l-2 border-accent pl-3 text-[14px] text-text-primary">
                    <span className="font-semibold">Bruk den til:</span> {k.bruk}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </Seksjon>
      );
    }

    case "knapp":
      if (!kloss.tekst || !kloss.lenke) return null;
      return (
        <Seksjon bakgrunn={kloss.bakgrunn}>
          <div className="flex max-w-[680px] flex-col items-start gap-4">
            {kloss.forklaring && <p className="text-[16px] leading-relaxed text-text-secondary">{kloss.forklaring}</p>}
            <Lenke
              href={kloss.lenke}
              className="rounded-md bg-accent px-5 py-3 text-[14px] font-semibold text-white hover:bg-accent-dark focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
            >
              {kloss.tekst}
            </Lenke>
          </div>
        </Seksjon>
      );

    case "karuseller": {
      const liste = hentAlleKaruseller()
        .filter((k) => ktx.visUtkast || !k.utkast)
        .slice(0, kloss.antall || 8);
      if (liste.length === 0) return null;
      return (
        <Seksjon bakgrunn={kloss.bakgrunn}>
          <Overskrift>{kloss.overskrift}</Overskrift>
          <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {liste.map((k) => (
              <li key={k.slug}>
                <Link href={`/${k.slug}`} className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
                  {k.slides[0]?.bilde ? (
                    <Image
                      src={k.slides[0].bilde}
                      alt=""
                      width={1080}
                      height={1350}
                      sizes="(min-width: 1024px) 260px, (min-width: 640px) 33vw, 50vw"
                      className="w-full rounded-[4px] border border-border transition-transform group-hover:-translate-y-0.5"
                    />
                  ) : (
                    <div className="aspect-[4/5] rounded-[4px] border border-dashed border-border-light" />
                  )}
                  <div className="mt-3 text-[15px] font-semibold leading-snug text-text-primary group-hover:text-accent">
                    {k.tittel}
                  </div>
                  <div className="mt-1 text-[12.5px] text-text-muted">
                    {k.slides.length} slides, med kilder
                    {k.utkast && <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-amber-900">Utkast</span>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </Seksjon>
      );
    }

    case "skraablikk": {
      const liste = hentAlleSkraablikk()
        .filter((s) => ktx.visUtkast || !s.utkast)
        .slice(0, kloss.antall || 4);
      if (liste.length === 0) return null;
      return (
        <Seksjon bakgrunn={kloss.bakgrunn}>
          <Overskrift>{kloss.overskrift}</Overskrift>
          <ul className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4">
            {liste.map((s) => (
              <li key={s.slug}>
                <Link href={`/skraablikk/${s.slug}`} className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent">
                  {s.slides[0]?.bilde && (
                    <Image
                      src={s.slides[0].bilde}
                      alt=""
                      width={1080}
                      height={1350}
                      sizes="(min-width: 1024px) 260px, (min-width: 640px) 33vw, 50vw"
                      className="w-full rounded-[4px] border border-border transition-transform group-hover:-translate-y-0.5"
                    />
                  )}
                  <div className="mt-3 text-[15px] font-semibold leading-snug text-text-primary group-hover:text-accent">{s.tittel}</div>
                  <div className="mt-1 text-[12.5px] text-text-muted">
                    Med forklaringer
                    {s.utkast && <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-amber-900">Utkast</span>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/skraablikk" className="mt-6 inline-block text-[13px] font-semibold text-accent hover:underline">
            Alle skråblikk
          </Link>
        </Seksjon>
      );
    }

    case "temaoversikt": {
      const liste = hentAlleTema().filter((t) => ktx.visUtkast || !t.utkast);
      if (liste.length === 0) return null;
      return (
        <Seksjon bakgrunn={kloss.bakgrunn}>
          <Overskrift>{kloss.overskrift}</Overskrift>
          <ul className="grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
            {liste.map((t) => (
              <li
                key={t.slug}
                className="border-t-[3px] pt-4"
                style={{ borderTopColor: TEMAFARGER[t.temaer[0]] ?? "var(--color-text-primary)" }}
              >
                <Link
                  href={`/tema/${t.slug}`}
                  className="font-[family-name:var(--font-playfair)] text-[20px] font-bold leading-snug text-text-primary hover:text-accent"
                >
                  {t.tittel}
                </Link>
                {t.ingress && <p className="mt-2 text-[14px] leading-relaxed text-text-secondary">{t.ingress}</p>}
                {t.utkast && (
                  <span className="mt-2 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[12px] text-amber-900">
                    Utkast
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Seksjon>
      );
    }

    case "siste_nytt": {
      const oversikt = await hentKildeoversikt();
      const perKilde = new Map<string, number>();
      const saker = (oversikt?.saker ?? [])
        .filter((s) => {
          if (s.kilde === "Stortinget – høringer i komiteene") return false;
          if (kloss.tema ? !s.temaer.includes(kloss.tema) : s.temaer.length === 0) return false;
          const n = perKilde.get(s.kilde) ?? 0;
          if (n >= 2) return false;
          perKilde.set(s.kilde, n + 1);
          return true;
        })
        .slice(0, kloss.antall || 6);
      if (saker.length === 0) return null;
      return (
        <Seksjon bakgrunn={kloss.bakgrunn}>
          <Overskrift>{kloss.overskrift}</Overskrift>
          <ol className="grid gap-x-8 sm:grid-cols-2">
            {saker.map((s) => (
              <li key={s.id} className="border-t border-border py-3">
                <div className="text-[12px] text-text-muted">
                  {s.kilde}, {datoTekst(s.dato)}
                </div>
                <a
                  href={s.lenke}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-0.5 line-clamp-2 text-[14.5px] font-medium leading-snug text-text-primary hover:text-accent"
                >
                  {s.tittel}
                </a>
              </li>
            ))}
          </ol>
          <Link href="/kilder" className="mt-4 inline-block text-[13px] font-semibold text-accent hover:underline">
            Alle saker fra kildene
          </Link>
        </Seksjon>
      );
    }

    case "kildeband": {
      const kilder = await hentKildeoversikt();
      if (!kilder) return null;
      return <KildeBand saker={kilder.saker} utvalgt={kilder.utvalgt} oppdatert={kilder.oppdatert} />;
    }

    case "analyser": {
      const om = lesInnstillinger().om;
      return <PostList posts={getAllPosts()} om={om} />;
    }

    case "siste_analyser": {
      const poster = getAllPosts().slice(0, kloss.antall || 3);
      if (poster.length === 0) return null;
      return (
        <Seksjon bakgrunn={kloss.bakgrunn}>
          <Overskrift>{kloss.overskrift}</Overskrift>
          <ul className="grid gap-x-8 gap-y-8 md:grid-cols-3">
            {poster.map((p) => (
              <li key={p.slug} className="border-t-2 pt-4" style={{ borderTopColor: p.accentColor || "var(--color-accent)" }}>
                <div className="text-[12.5px] text-text-muted">{postDato(p.date)}</div>
                <Link
                  href={`/innlegg/${p.slug}`}
                  className="mt-1 block font-[family-name:var(--font-playfair)] text-[20px] font-bold leading-snug text-text-primary hover:text-accent"
                >
                  {p.title}
                </Link>
                <p className="mt-2 line-clamp-3 text-[14px] leading-relaxed text-text-secondary">{p.summary}</p>
              </li>
            ))}
          </ul>
        </Seksjon>
      );
    }

    case "nyhetsbrev":
      return (
        <Seksjon bakgrunn={kloss.bakgrunn}>
          <div className="grid items-center gap-6 md:grid-cols-[minmax(0,1fr)_400px] md:gap-12">
            <div>
              <Overskrift>{kloss.overskrift}</Overskrift>
              {kloss.tekst && <p className="-mt-2 max-w-[520px] text-[16px] leading-relaxed text-text-secondary">{kloss.tekst}</p>}
            </div>
            <NewsletterForm />
          </div>
        </Seksjon>
      );

    default:
      return null;
  }
}

export default function Klosser({ seksjoner, ktx = {} }: { seksjoner: Kloss[]; ktx?: KlossKontekst }) {
  return (
    <>
      {seksjoner.map((k, i) => (
        <EnKloss key={i} kloss={k} ktx={ktx} />
      ))}
    </>
  );
}
