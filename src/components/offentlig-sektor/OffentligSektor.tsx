import type { ReactNode } from "react";
import type {
  Avsnitt,
  Land,
  OffentligSektorData,
  OffentligSektorTekst,
  Post,
  Seksjon,
} from "@/lib/offentlig-sektor";

// «Hvor stor er offentlig sektor?»
// Farger: alt som går til husholdningene (overføringer og velferdstjenester) er oransje,
// fellesgoder og annet er nøytrale. Samme farge betyr samme type overalt på siden.

const nf0 = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat("nb-NO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const TYPE = {
  overforinger: { kort: "Pensjon, trygd, barnetrygd", lys: "bg-accent-orange", mork: "bg-accent-orange" },
  velferd: { kort: "Helse, omsorg, skole, barnehage", lys: "bg-[#f4b06a]", mork: "bg-[#f4b06a]" },
  fellesgoder: { kort: "Politi, forsvar, domstoler, veier, forvaltning", lys: "bg-text-primary", mork: "bg-white/40" },
  annet: { kort: "Bistand, Ukraina-støtte, renter", lys: "bg-border-light", mork: "bg-white/15" },
} as const;

// Mørk oransje for tekst på hvit bakgrunn (accent-orange er for lys til liten tekst).
const ORANSJE_TEKST = "text-[#9a4d00]";

export default function OffentligSektor({ data, tekst }: { data: OffentligSektorData; tekst: OffentligSektorTekst }) {
  const [topp, ...resten] = tekst.seksjoner;
  return (
    <>
      {tekst.utkast && <Utkastlinje />}
      <Topp seksjon={topp} tittel={tekst.tittel} data={data} utkast={tekst.utkast} />
      {resten.map((s, i) => (
        <SeksjonVis key={`${s.figur}-${i}`} s={s} data={data} utkast={tekst.utkast} />
      ))}
      <Bunn tekst={tekst} data={data} />
    </>
  );
}

/* ── Utkast ─────────────────────────────────────────────────────── */

function Utkastlinje() {
  return (
    <div className="border-b border-amber-300 bg-amber-50 px-6 py-3">
      <p className="mx-auto max-w-[1100px] text-[13px] leading-relaxed text-amber-900">
        <strong>Utkast.</strong> Siden er ikke godkjent for publisering og vises ikke i søkemotorer. Tekst uten
        merking er Gautes. Avsnitt merket «Forslag» eller «Tall» er lagt inn av Claude, og gule bokser er spørsmål
        som må avklares.
      </p>
    </div>
  );
}

const MERKE: Record<string, string> = {
  forslag: "Forslag fra Claude",
  tall: "Tall lagt inn av Claude",
  vurder: "Til vurdering",
  mangler: "Mangler",
};

function AvsnittVis({ a, utkast, mork = false }: { a: Avsnitt; utkast: boolean; mork?: boolean }) {
  const p = <p>{medLenker(a.tekst, mork)}</p>;
  if (a.type === "gaute" || !utkast) {
    if (a.type === "vurder" || a.type === "mangler" || a.type === "figur") return null;
    return p;
  }
  if (a.type === "forslag" || a.type === "tall") {
    return (
      <div className={`border-l-2 pl-4 ${mork ? "border-accent-orange/60" : "border-accent-orange/50"}`}>
        <span className={`block text-[12px] font-medium ${mork ? "text-orange-300" : ORANSJE_TEKST}`}>
          {MERKE[a.type]}
        </span>
        {p}
      </div>
    );
  }
  if (a.type === "vurder" || a.type === "mangler") {
    return (
      <aside className="rounded-md border border-amber-300 bg-amber-50 px-4 py-3 text-[14px] leading-relaxed text-amber-950">
        <span className="block text-[12px] font-semibold text-amber-800">{MERKE[a.type]}</span>
        {medLenker(a.tekst, false)}
      </aside>
    );
  }
  return null;
}

/** Gjør [tekst](lenke) om til lenker. Tåler parenteser i lenken, f.eks. …(AIC). */
function medLenker(tekst: string, mork: boolean): ReactNode[] {
  const ut: ReactNode[] = [];
  const re = /\[([^\]]+)\]\((https?:\/\/[^()\s]*(?:\([^()\s]*\)[^()\s]*)*)\)/g;
  let sist = 0;
  for (const m of tekst.matchAll(re)) {
    ut.push(tekst.slice(sist, m.index));
    ut.push(
      <a
        key={m.index}
        href={m[2]}
        className={`underline underline-offset-2 ${mork ? "text-white hover:text-orange-200" : "text-accent-dark hover:text-accent"}`}
      >
        {m[1]}
      </a>,
    );
    sist = (m.index ?? 0) + m[0].length;
  }
  ut.push(tekst.slice(sist));
  return ut;
}

/* ── Toppen: hundrelappen ───────────────────────────────────────── */

function Topp({
  seksjon,
  tittel,
  data,
  utkast,
}: {
  seksjon: Seksjon;
  tittel: string;
  data: OffentligSektorData;
  utkast: boolean;
}) {
  const sum = data.typer.reduce((s, t) => s + t.mrd, 0);
  const andel = (mrd: number) => (mrd / sum) * 100;
  // Kroner av 100, rundet slik at de summerer til nøyaktig 100.
  const kr = hundrelapp(data.typer.map((t) => andel(t.mrd)));
  const krAv = (id: string) => kr[data.typer.findIndex((t) => t.id === id)];
  const tilHusholdningene = krAv("overforinger") + krAv("velferd");
  const kolonner = data.typer.map((t) => `${andel(t.mrd).toFixed(2)}fr`).join(" ");

  return (
    <header className="border-b border-border bg-hero px-6 pb-14 pt-12 md:pt-16">
      <div className="mx-auto max-w-[1100px]">
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold leading-tight text-white sm:text-5xl">
          {tittel}
        </h1>
        <div className="mt-6 max-w-[640px] space-y-4 text-[17px] leading-relaxed text-white/80">
          {seksjon?.avsnitt.map((a, i) => (
            <AvsnittVis key={i} a={a} utkast={utkast} mork />
          ))}
        </div>

        <figure className="mt-12" aria-labelledby="hundrelapp-tekst">
          <figcaption id="hundrelapp-tekst" className="text-[15px] font-semibold text-white">
            Slik fordeles hver hundrelapp stat og kommune bruker ({data.aar})
          </figcaption>

          {/* Klammen over de to typene som går til husholdningene */}
          <div className="mt-6 hidden md:grid" style={{ gridTemplateColumns: kolonner }} aria-hidden="true">
            <div className="col-span-2 pr-1">
              <p className="text-[14px] text-white/85">
                <span className="font-semibold text-white">{tilHusholdningene} av 100 kroner</span>{" "}
                går direkte til husholdningene
              </p>
              <div className="mt-2 h-3 rounded-t-sm border-x-2 border-t-2 border-accent-orange/80" />
            </div>
          </div>

          <div
            className="mt-2 flex h-14 overflow-hidden rounded-md md:h-16"
            role="img"
            aria-label={data.typer.map((t, i) => `${t.navn}: ${kr[i]} kroner av 100`).join(", ")}
          >
            {data.typer.map((t) => (
              <div
                key={t.id}
                className={`${TYPE[t.id].mork} border-r-2 border-hero last:border-r-0`}
                style={{ width: `${andel(t.mrd)}%` }}
                title={`${t.navn}: ${nf0.format(t.mrd)} mrd. kr`}
              />
            ))}
          </div>

          {/* Etiketter under hver del (stor skjerm) */}
          <div className="mt-4 hidden md:grid" style={{ gridTemplateColumns: kolonner }}>
            {data.typer.map((t, i) =>
              t.id === "annet" ? (
                <div key={t.id} className="pl-2 text-[13px] leading-snug text-white/55">
                  {kr[i]} kr
                </div>
              ) : (
                <div key={t.id} className="pr-4">
                  <p className="font-[family-name:var(--font-playfair)] text-3xl font-bold tabular-nums text-white">
                    {kr[i]} kr
                  </p>
                  <p className="mt-1 text-[15px] font-semibold text-white">{t.navn}</p>
                  <p className="text-[13px] leading-snug text-white/60">{TYPE[t.id].kort}</p>
                  <p className="mt-1 text-[13px] tabular-nums text-white/60">{nf0.format(t.mrd)} mrd. kr</p>
                </div>
              ),
            )}
          </div>

          {/* Liste på mobil */}
          <ul className="mt-5 space-y-3 md:hidden">
            {data.typer.map((t, i) => (
              <li key={t.id} className="flex items-start gap-3">
                <span className={`mt-1.5 h-3 w-3 shrink-0 rounded-sm ${TYPE[t.id].mork}`} aria-hidden="true" />
                <span className="text-[14px] leading-snug text-white/70">
                  <span className="font-semibold text-white">
                    {t.navn}: {kr[i]} kr
                  </span>
                  <br />
                  {TYPE[t.id].kort} ({nf0.format(t.mrd)} mrd. kr)
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-6 text-[13px] text-white/50">
            Totalt {nf0.format(data.totalt_mrd)} milliarder kroner, {nf0.format(data.andel_av_fastlands_bnp)} prosent av
            BNP for Fastlands-Norge. «Annet» er bistand, støtte til Ukraina og renter. Kilde: SSB, tabell 14669.
          </p>
        </figure>
      </div>
    </header>
  );
}

/** Runder andeler til hele kroner som summerer til 100 (største rest-metoden). */
function hundrelapp(andeler: number[]): number[] {
  const hele = andeler.map(Math.floor);
  const mangler = 100 - hele.reduce((s, v) => s + v, 0);
  andeler
    .map((a, i) => ({ i, rest: a - Math.floor(a) }))
    .sort((a, b) => b.rest - a.rest)
    .slice(0, mangler)
    .forEach(({ i }) => (hele[i] += 1));
  return hele;
}

/* ── Seksjonene ─────────────────────────────────────────────────── */

function SeksjonVis({ s, data, utkast }: { s: Seksjon; data: OffentligSektorData; utkast: boolean }) {
  const id = s.figur || "konklusjon";
  const typeFigur = s.figur === "overforinger" || s.figur === "velferd" || s.figur === "fellesgoder";

  if (s.figur === "land") {
    const [for_, etter] = delVedFigur(s.avsnitt);
    return (
      <section aria-labelledby={id} className="border-t border-border bg-surface px-6 py-14">
        <div className="mx-auto max-w-[1100px]">
          <h2 id={id} className="font-[family-name:var(--font-playfair)] text-2xl font-bold sm:text-[28px]">
            {s.tittel}
          </h2>
          <div className="mt-5 max-w-[680px] space-y-4 text-[16px] leading-relaxed text-text-secondary">
            {for_.map((a, i) => (
              <AvsnittVis key={i} a={a} utkast={utkast} />
            ))}
          </div>
          <Landfigur land={data.land} eu={data.eu} aar={data.aar} />
          <div className="mt-8 max-w-[680px] space-y-4 text-[16px] leading-relaxed text-text-secondary">
            {etter.map((a, i) => (
              <AvsnittVis key={i} a={a} utkast={utkast} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-labelledby={id} className="border-t border-border px-6 py-14">
      <div
        className={`mx-auto grid max-w-[1100px] gap-10 ${typeFigur ? "md:grid-cols-[minmax(0,1fr)_380px] md:gap-14" : ""}`}
      >
        <div className="max-w-[680px]">
          <h2
            id={id}
            className="flex items-center gap-3 font-[family-name:var(--font-playfair)] text-2xl font-bold sm:text-[28px]"
          >
            {typeFigur && (
              <span className={`h-4 w-4 shrink-0 rounded-sm ${TYPE[s.figur as keyof typeof TYPE].lys}`} aria-hidden="true" />
            )}
            {s.tittel}
          </h2>
          <div className="mt-5 space-y-4 text-[16px] leading-relaxed text-text-secondary">
            {s.avsnitt.map((a, i) => (
              <AvsnittVis key={i} a={a} utkast={utkast} />
            ))}
          </div>
        </div>
        {s.figur === "overforinger" && (
          <Poster tittel="Overføringene fordelt" poster={data.overforinger} farge={TYPE.overforinger.lys} />
        )}
        {s.figur === "velferd" && (
          <Poster
            tittel="Velferdstjenestene fordelt"
            poster={data.velferd}
            farge={TYPE.velferd.lys}
            merknad={`Brukerne betalte ${nf1.format(data.brukerbetalinger_mrd)} mrd. kr i egenandeler og brukerbetaling til det offentlige.`}
          />
        )}
        {s.figur === "fellesgoder" && (
          <Poster
            tittel="Fellesgodene fordelt"
            poster={data.fellesgoder}
            farge={TYPE.fellesgoder.lys}
            merknad={`Næring og samferdsel inkluderer ${nf0.format(data.naeringsstotte_mrd)} mrd. kr i subsidier til næringer.`}
          />
        )}
      </div>
    </section>
  );
}

function delVedFigur(avsnitt: Avsnitt[]): [Avsnitt[], Avsnitt[]] {
  const i = avsnitt.findIndex((a) => a.type === "figur");
  return i < 0 ? [avsnitt, []] : [avsnitt.slice(0, i), avsnitt.slice(i + 1)];
}

function Poster({ tittel, poster, farge, merknad }: { tittel: string; poster: Post[]; farge: string; merknad?: string }) {
  const sortert = [...poster].sort((a, b) => b.mrd - a.mrd);
  const maks = sortert[0]?.mrd ?? 1;
  return (
    <figure className="self-start rounded-lg border border-border p-5 md:mt-14">
      <figcaption className="text-[14px] font-semibold">
        {tittel} <span className="font-normal text-text-muted">(mrd. kr)</span>
      </figcaption>
      <ul className="mt-4 space-y-3">
        {sortert.map((p) => (
          <li key={p.navn}>
            <div className="flex items-baseline justify-between gap-3 text-[13px]">
              <span className="text-text-secondary">{p.navn}</span>
              <span className="tabular-nums font-medium">{nf0.format(p.mrd)}</span>
            </div>
            <div className="mt-1 h-2 rounded-full bg-surface-light" aria-hidden="true">
              <div className={`h-2 rounded-full ${farge}`} style={{ width: `${(p.mrd / maks) * 100}%` }} />
            </div>
          </li>
        ))}
      </ul>
      {merknad && <p className="mt-4 text-[12px] leading-snug text-text-muted">{merknad}</p>}
    </figure>
  );
}

function Landfigur({ land, eu, aar }: { land: Land[]; eu: Land; aar: number }) {
  const maks = Math.ceil(Math.max(...land.map((l) => l.offentlig_betalt_andel)) / 5) * 5;
  const pst = (v: number) => `${(v / maks) * 100}%`;
  const rad = "grid grid-cols-[92px_minmax(0,1fr)_40px] items-center gap-3 sm:grid-cols-[110px_minmax(0,1fr)_44px]";
  return (
    <figure className="mt-10 max-w-[820px] rounded-lg border border-border bg-background p-5 sm:p-7">
      <figcaption>
        <span className="block font-[family-name:var(--font-playfair)] text-xl font-bold leading-snug">
          I Norden betaler det offentlige over en fjerdedel av det husholdningene forbruker
        </span>
        <span className="mt-1 block text-[13px] text-text-muted">
          Offentlig betalt andel av husholdningenes faktiske forbruk, {aar}. Prosent
        </span>
      </figcaption>

      <div className="relative mt-6">
        {/* EU-snittet som stiplet linje over alle radene */}
        <div className={`pointer-events-none absolute inset-0 ${rad}`} aria-hidden="true">
          <span />
          <span className="relative h-full">
            <span className="absolute inset-y-0 border-l border-dashed border-text-muted" style={{ left: pst(eu.offentlig_betalt_andel) }} />
          </span>
          <span />
        </div>
        <ul className="relative space-y-1.5" aria-label={`Offentlig betalt andel av forbruket per land. EU-snitt ${nf1.format(eu.offentlig_betalt_andel)} prosent`}>
          {land.map((l) => (
            <li key={l.kode} className={rad}>
              <span className={`text-right text-[13px] ${l.norden ? "font-semibold text-text-primary" : "text-text-secondary"}`}>
                {l.navn}
              </span>
              <span className="h-5">
                <span
                  className={`block h-full rounded-r-sm ${l.norden ? "bg-accent-orange" : "bg-border-light"}`}
                  style={{ width: pst(l.offentlig_betalt_andel) }}
                />
              </span>
              <span className="text-[13px] tabular-nums text-text-secondary">{nf1.format(l.offentlig_betalt_andel)}</span>
            </li>
          ))}
        </ul>
        <div className={`mt-2 ${rad}`} aria-hidden="true">
          <span />
          <span className="relative h-5">
            <span className="absolute whitespace-nowrap pl-1.5 text-[12px] text-text-muted" style={{ left: pst(eu.offentlig_betalt_andel) }}>
              EU-snitt {nf1.format(eu.offentlig_betalt_andel)}
            </span>
          </span>
          <span />
        </div>
      </div>
      <p className="mt-4 text-[12px] leading-snug text-text-muted">
        Kilde: Eurostat, nama_10_gdp. Offentlig individuelt konsum delt på summen av offentlig individuelt konsum og
        husholdningenes konsum. Utregningen er vår egen.
      </p>
    </figure>
  );
}

/* ── Bunnen: gjenstår, metode og kilder ─────────────────────────── */

function Bunn({ tekst, data }: { tekst: OffentligSektorTekst; data: OffentligSektorData }) {
  return (
    <section aria-labelledby="metode" className="border-t border-border bg-surface px-6 py-14">
      <div className="mx-auto grid max-w-[1100px] gap-12 md:grid-cols-2">
        {tekst.utkast && tekst.gjenstar.length > 0 && (
          <div className="max-w-[560px] rounded-lg border border-amber-300 bg-amber-50 p-6 md:col-span-2">
            <h2 className="text-[16px] font-semibold text-amber-950">Gjenstår før publisering</h2>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[14px] leading-relaxed text-amber-950">
              {tekst.gjenstar.map((g) => (
                <li key={g}>{g}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="max-w-[560px]">
          <h2 id="metode" className="font-[family-name:var(--font-playfair)] text-2xl font-bold">
            Slik er tallene regnet
          </h2>
          <ul className="mt-4 list-disc space-y-2.5 pl-5 text-[15px] leading-relaxed text-text-secondary">
            {tekst.metode.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </div>
        <div className="max-w-[560px]">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold">Kilder</h2>
          <ul className="mt-4 space-y-1.5 text-[14px]">
            {data.kilder.map((k) => (
              <li key={k.lenke}>
                <a href={k.lenke} className="text-accent-dark underline underline-offset-2 hover:text-accent">
                  {k.navn}
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[13px] text-text-muted">Tallene er hentet {data.hentet}.</p>
        </div>
      </div>
    </section>
  );
}
