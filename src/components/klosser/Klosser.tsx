import Image from "next/image";
import Link from "next/link";
import { compileMDX } from "next-mdx-remote/rsc";
import type { ReactNode } from "react";
import BookSpines from "@/components/BookSpines";
import NewsletterForm from "@/components/NewsletterForm";
import PostList from "@/components/PostList";
import { KildeBand, TEMAFARGER } from "@/components/SisteFraKildene";
import Konfetti from "@/components/Konfetti";
import DatawrapperGraf from "@/components/klosser/DatawrapperGraf";
import { datawrapperId, type Bakgrunn, type Kloss } from "@/lib/klosser";
import { hentKildeoversikt } from "@/lib/kilder";
import { hentAlleKaruseller } from "@/lib/karuseller";
import { getAllPosts } from "@/lib/posts";
import { erEkstern, lesInnstillinger, lesSide } from "@/lib/sider";
import { hentAlleTema } from "@/lib/tema";
import { hentAlleSkraablikk } from "@/lib/skraablikk";
import { DEMO, UTKAST } from "@/lib/utkast";

// Tegner en side bygd av byggeklosser. Hver kloss er en seksjon i full bredde.

export type KlossKontekst = {
  /** Ta med karusell- og temasider som er merket som utkast (brukes i kloss-katalogen). */
  visUtkast?: boolean;
  /** Siden er et utkast: vis plassholdere der noe mangler (f.eks. bilde). */
  utkastSide?: boolean;
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

function KnappLenke({ href, children }: { href: string; children: ReactNode }) {
  return (
    <div className="mt-6">
      <Link
        href={href}
        className="inline-block rounded-[6px] border border-black bg-white px-5 py-3 text-[15px] font-semibold text-black hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
      >
        {children}
      </Link>
    </div>
  );
}

function Overskrift({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <h2 className="mb-6 font-display text-[30px] leading-tight text-black sm:text-[36px]">
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
      h2: (p) => <h3 className="mb-3 mt-8 font-display text-xl text-text-primary" {...p} />,
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
    case "toppfelt": {
      const rosa = kloss.farge === "rosa";
      const tekst = "text-black";
      return (
        <div className={`relative px-6 py-14 md:py-20 ${rosa ? "bg-rosa" : "border-b border-black bg-white"}`}>
          {kloss.konfetti && <Konfetti />}
          <div className="relative mx-auto max-w-[1100px]">
            <div className="flex flex-col gap-10 md:flex-row md:items-center md:justify-between">
              <div className="max-w-[640px]">
                {kloss.overlinje && <p className={`mb-5 text-[15px] font-semibold ${tekst}`}>{kloss.overlinje}</p>}
                {kloss.tittel && (
                  <h1 className={`font-display text-[42px] leading-[1.02] sm:text-[56px] lg:text-[68px] ${tekst}`}>
                    {kloss.tittel}
                  </h1>
                )}
                {kloss.ingress && (
                  <p className={`mt-6 max-w-[520px] text-[18px] leading-[1.55] ${rosa ? "text-black" : "text-text-secondary"}`}>
                    {kloss.ingress}
                  </p>
                )}
              </div>
              {kloss.bilde ? (
                <Image
                  src={kloss.bilde}
                  alt=""
                  width={1080}
                  height={1350}
                  priority
                  sizes="260px"
                  className="hidden w-[260px] rounded-[10px] md:block"
                />
              ) : rosa && kloss.bokrygger ? (
                <Image
                  src="/bilder/bokrad.webp"
                  alt=""
                  width={900}
                  height={470}
                  priority
                  sizes="(min-width: 768px) 400px, 100vw"
                  className="w-full max-w-[400px] md:w-[400px]"
                />
              ) : (
                kloss.bokrygger && <BookSpines className="hidden h-24 w-auto opacity-40 md:block" />
              )}
            </div>
          </div>
        </div>
      );
    }

    case "tekst":
      if (!kloss.tekst && !kloss.overskrift) return null;
      return (
        <Seksjon bakgrunn={kloss.bakgrunn}>
          <Overskrift>{kloss.overskrift}</Overskrift>
          {datawrapperId(kloss.graf) && (
            <div className="mb-8 max-w-[680px] rounded-[10px] bg-white p-3 sm:p-4">
              <DatawrapperGraf id={datawrapperId(kloss.graf)!} tittel={kloss.grafBeskrivelse || "Graf fra Datawrapper"} />
            </div>
          )}
          {kloss.tekst && <Markdown kilde={kloss.tekst} />}
          {kloss.knapp && kloss.knappLenke && (
            <div className="mt-6">
              <Link
                href={kloss.knappLenke}
                className="inline-block rounded-[6px] bg-black px-6 py-3.5 text-[16px] font-semibold text-white hover:bg-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
              >
                {kloss.knapp}
              </Link>
            </div>
          )}
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
                <dt className="font-display text-[40px] leading-none text-text-primary">
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
            <blockquote className="font-display text-[24px] leading-snug text-text-primary sm:text-[30px]">
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
                    className="font-display text-[20px] leading-snug text-text-primary hover:text-black underline underline-offset-4 hover:text-accent-dark"
                  >
                    {k.navn}
                  </a>
                ) : (
                  <span className="font-display text-[20px] leading-snug text-text-primary">
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
      // Karuseller og skråblikk i samme rad, nyeste først i hver gruppe.
      type Omslag = { key: string; href: string; tittel: string; bilde?: string; under: string; utkast: boolean };
      const karuseller: Omslag[] = hentAlleKaruseller()
        .filter((k) => ktx.visUtkast || DEMO || !k.utkast)
        .map((k) => ({
          key: `k-${k.slug}`,
          href: `/${k.slug}`,
          tittel: k.tittel,
          bilde: k.slides[0]?.bilde,
          under: `${k.slides.length} slides, alle tall med kilde`,
          utkast: k.utkast,
        }));
      const skraablikk: Omslag[] = hentAlleSkraablikk()
        .filter((s) => ktx.visUtkast || DEMO || !s.utkast)
        .map((s) => ({
          key: `s-${s.slug}`,
          href: `/skraablikk/${s.slug}`,
          tittel: s.tittel,
          bilde: s.slides[0]?.bilde,
          under: "Skråblikk, med forklaringer",
          utkast: s.utkast,
        }));
      const liste = [...karuseller, ...skraablikk].slice(0, kloss.antall || 8);
      if (liste.length === 0) return null;
      return (
        <Seksjon bakgrunn={kloss.bakgrunn}>
          <Overskrift>{kloss.overskrift}</Overskrift>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {liste.map((o) => (
              <li key={o.key}>
                <Link href={o.href} className="group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black">
                  {o.bilde ? (
                    <Image
                      src={o.bilde}
                      alt=""
                      width={1080}
                      height={1350}
                      sizes="(min-width: 1024px) 260px, (min-width: 640px) 33vw, 50vw"
                      className="w-full rounded-[10px]"
                    />
                  ) : (
                    <div className="aspect-[4/5] rounded-[10px] bg-surface" />
                  )}
                  <div className="mt-3 text-[17px] font-extrabold leading-snug tracking-[-0.01em] text-black group-hover:underline">
                    {o.tittel}
                  </div>
                  <div className="mt-1 text-[13.5px] text-text-muted">
                    {o.under}
                    {o.utkast && <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-amber-900">Utkast</span>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          {kloss.visKnapp !== false && <KnappLenke href="/karuseller">Se alle karuseller</KnappLenke>}
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
                      className="w-full rounded-[10px]"
                    />
                  )}
                  <div className="mt-3 text-[17px] font-extrabold leading-snug tracking-[-0.01em] text-black group-hover:underline">{s.tittel}</div>
                  <div className="mt-1 text-[13.5px] text-text-muted">
                    Med forklaringer
                    {s.utkast && <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-amber-900">Utkast</span>}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/skraablikk" className="mt-6 inline-block text-[15px] font-semibold text-black underline underline-offset-4 hover:text-accent">
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
                  className="font-display text-[20px] leading-snug text-text-primary hover:text-accent"
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
          <Link href="/kilder" className="mt-4 inline-block text-[13px] font-semibold text-black underline underline-offset-4 hover:text-accent-dark">
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
          <Overskrift>{kloss.overskrift || "Siste analyser"}</Overskrift>
          <ul className="grid gap-x-8 gap-y-2 md:grid-cols-3">
            {poster.map((p) => (
              <li key={p.slug} className="border-t border-black pt-4 pb-6">
                <div className="text-[14px] text-text-muted">{postDato(p.date)}</div>
                <h3 className="mt-2 font-display text-[24px] leading-[1.12]">
                  <Link href={`/innlegg/${p.slug}`} className="text-black underline-offset-[5px] hover:underline">
                    {p.title}
                  </Link>
                </h3>
                <p className="mt-3 line-clamp-3 text-[15.5px] leading-relaxed text-text-secondary">{p.summary}</p>
              </li>
            ))}
          </ul>
          <KnappLenke href="/analyser">Se alle analyser</KnappLenke>
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

    case "om_meg": {
      if (!kloss.tekst && !kloss.navn && !kloss.bilde) return null;
      return (
        <Seksjon bakgrunn={kloss.bakgrunn}>
          <div className="grid gap-8 md:grid-cols-[300px_minmax(0,1fr)] md:gap-14">
            <div>
              {kloss.bilde ? (
                <Image
                  src={kloss.bilde}
                  alt={kloss.alt ?? ""}
                  width={900}
                  height={1125}
                  sizes="(min-width: 768px) 300px, 100vw"
                  className="w-full max-w-[300px] rounded-[10px] object-cover"
                />
              ) : (
                ktx.utkastSide && (
                  <div className="flex aspect-[4/5] w-full max-w-[300px] items-center justify-center rounded-[10px] border-2 border-dashed border-border-light p-6 text-center text-[15px] text-text-muted">
                    Plass til bilde (valgfritt). Legg det inn i Pages CMS.
                  </div>
                )
              )}
            </div>
            <div className="max-w-[640px]">
              {kloss.navn && <h2 className="font-display text-[34px] leading-tight text-black sm:text-[42px]">{kloss.navn}</h2>}
              {kloss.undertittel && <p className="mt-2 text-[17px] font-semibold text-text-secondary">{kloss.undertittel}</p>}
              {kloss.tekst && (
                <div className="mt-6">
                  <Markdown kilde={kloss.tekst} klasse="text-[17px] leading-[1.75] text-text-secondary" />
                </div>
              )}
            </div>
          </div>
        </Seksjon>
      );
    }

    case "utforsk": {
      const tema = hentAlleTema().filter((t) => DEMO || !t.utkast);
      type Punkt = { tittel: string; tekst: string; href: string; utkast?: boolean };
      const alle: Punkt[] = [
        { tittel: "Trappa til toppen", tekst: "Hvor står du i inntektstrappa, og hvor mye skatt betaler de på toppen?", href: "/trappa", utkast: UTKAST.trappa },
        { tittel: "Statsbudsjettet", tekst: "Hvor pengene kommer fra, og hva de går til.", href: "/statsbudsjett", utkast: UTKAST.statsbudsjett },
        ...(lesSide("grunnkurs-i-ulikhet")
          ? [{ tittel: "Grunnkurs i ulikhet", tekst: "Åtte korte sider om ulikhet i Norge, steg for steg og med kilder.", href: "/grunnkurs-i-ulikhet", utkast: lesSide("grunnkurs-i-ulikhet")?.utkast }]
          : []),
        ...tema.map((t) => ({ tittel: t.tittel, tekst: t.ingress || "Alt om temaet, samlet på ett sted.", href: `/tema/${t.slug}`, utkast: t.utkast })),
        { tittel: "Nytt fra kildene", tekst: "Rapporter og tall fra SSB, regjeringen, Stortinget og andre.", href: "/kilder" },
        { tittel: "Om valgogpolitikk", tekst: "Hvem som står bak, og hvordan jeg jobber med kildene.", href: "/om", utkast: lesSide("om")?.utkast },
      ];
      const punkter = alle.filter((p) => DEMO || !p.utkast);
      return (
        <Seksjon bakgrunn={kloss.bakgrunn}>
          <Overskrift>{kloss.overskrift || "Utforsk"}</Overskrift>
          <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {punkter.map((p) => (
              <li key={p.href} className="border-t border-black">
                <Link href={p.href} className="group block py-5 pr-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
                  <span className="block text-[21px] font-extrabold leading-snug tracking-[-0.015em] text-black group-hover:underline">
                    {p.tittel}
                  </span>
                  <span className="mt-1.5 block text-[15.5px] leading-relaxed text-text-secondary">{p.tekst}</span>
                  {p.utkast && <span className="mt-2 inline-block rounded bg-amber-100 px-1.5 py-0.5 text-[13px] text-amber-900">Utkast</span>}
                </Link>
              </li>
            ))}
          </ul>
        </Seksjon>
      );
    }

    case "samarbeid": {
      const epost = (kloss.epost || "post@valgogpolitikk.no").trim();
      return (
        <Seksjon bakgrunn={kloss.bakgrunn}>
          <div className="grid gap-6 border-t border-black pt-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-end md:gap-12">
            <div>
              <h2 className="font-display text-[30px] leading-tight text-black sm:text-[36px]">
                {kloss.overskrift || "Samarbeid og tips"}
              </h2>
              {kloss.tekst && (
                <p className="mt-4 max-w-[560px] text-[18px] leading-[1.55] text-text-secondary">{kloss.tekst}</p>
              )}
            </div>
            <div className="flex flex-col items-start gap-2">
              <a
                href={`mailto:${epost}`}
                className="rounded-[6px] bg-black px-6 py-3.5 text-[16px] font-semibold text-white hover:bg-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                data-umami-event="samarbeid-epost"
              >
                {kloss.knapp || "Send en melding"}
              </a>
              <span className="text-[14px] text-text-muted">{epost}</span>
            </div>
          </div>
        </Seksjon>
      );
    }

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
