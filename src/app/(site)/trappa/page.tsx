import type { Metadata } from "next";
import { SKJULT_FOR_SOK, UTKAST } from "@/lib/utkast";
import Trappa from "@/components/trappa/Trappa";
import Formuevegg from "@/components/trappa/Formuevegg";
import { hentTrappa } from "@/lib/trappa";
import { hentBudsjett, hentOversikt, standardId } from "@/lib/statsbudsjett";
import { avsnitt, fyllAlt, lesTrappaTekst, type TrappaTekst } from "@/lib/trappa-tekst";

// Tallene ligger i public/data/trappa og lages med scripts/trappa.py.

export const metadata: Metadata = {
  title: "Trappa til toppen — valg og politikk",
  description:
    "Hvor står du i inntektstrappa? Se hvor mye du må tjene for å være blant de 10, 1 og 0,1 prosent med høyest inntekt, og hvor mye de egentlig får.",
  robots: UTKAST.trappa ? SKJULT_FOR_SOK : undefined,
};

const nf0 = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat("nb-NO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export default function TrappaSide() {
  const data = hentTrappa();
  const t01 = data.trinn.find((t) => t.id === "topp01")!;
  const budsjett = hentBudsjett(standardId(hentOversikt()));
  const k = data.kapital;

  // Tall som kan brukes i teksten som {navn}. Lista vises også i Pages CMS.
  const verdier: Record<string, string> = {
    aar: String(data.aar),
    forskningsaar: String(data.forskningsaar),
    topp01_snitt_offisiell: nf0.format(t01.offisiell!.snittinntekt / 1e6),
    topp01_snitt_med: nf0.format(t01.med_overskudd!.snittinntekt / 1e6),
    topp001_aar: data.vegg.topp001.aar,
    topp001_per_aar: Object.entries(data.vegg.topp001.per_aar)
      .map(([aar, v]) => `${nf0.format(v / 1e6)} millioner i ${aar}`)
      .join(", "),
    budsjett_mrd: budsjett ? nf0.format(Math.round(budsjett.sum_utgifter / 1000)) : "",
    budsjett_aar: budsjett ? String(budsjett.aar) : "",
    fra_utlandet_prosent: nf0.format(k.fra_utlandet_andel * 100),
    skattbar_formue_prosent: nf0.format(Math.round(data.skattbar_formue_andel * 20) * 5),
    topp100_skatt: nf1.format(data.topp100.skatt_av_inntekt),
    topp100_inntektsskatt: nf1.format(data.topp100.personlig_inntektsskatt),
    kapital_aar: String(k.aar),
    formue_aar: String(data.formue.aar),
  };
  const t = fyllAlt(lesTrappaTekst(), verdier) as unknown as TrappaTekst;

  return (
    <>
      <div className="border-b border-amber-300 bg-amber-50 px-6 py-3">
        <p className="mx-auto max-w-[1100px] text-[13px] text-amber-900">
          <strong>Utkast.</strong> Siden er ikke godkjent for publisering og vises ikke i søkemotorer.
        </p>
      </div>

      <Trappa data={data} tekst={{ topp: t.topp, inntektstrappa: t.inntektstrappa }} />

      {/* ── Helt på toppen ── */}
      <section aria-labelledby="toppen" className="border-t border-border px-6 py-14">
        <div className="mx-auto max-w-[1100px]">
          <h2 id="toppen" className="font-display text-2xl sm:text-[28px]">
            {t.toppen.tittel}
          </h2>
          <p className="mt-3 max-w-[660px] text-[16px] leading-relaxed text-text-secondary">
            {t.toppen.ingress}
          </p>

          <div className="mt-8">
            <div className="hidden grid-cols-[minmax(0,1fr)_34%_34%] gap-6 border-b-2 border-text-primary pb-2 text-[13px] font-semibold md:grid" aria-hidden="true">
              <span>Inntektsgruppe</span>
              <span>Står i skattemeldingen</span>
              <span>Betaler i skatt, alt medregnet</span>
            </div>
            <ul aria-label="Andel av inntekten som står i skattemeldingen, og samlet skattesats, etter inntektsgruppe">
              {data.fingrupper.map((g) => (
                <li
                  key={g.id}
                  className="grid gap-x-6 gap-y-2 border-b border-border py-3 md:grid-cols-[minmax(0,1fr)_34%_34%] md:items-center"
                >
                  <div>
                    <span className="font-medium">{g.navn}</span>
                    {g.antall && (
                      <span className="block text-[12px] text-text-muted">rundt {nf0.format(g.antall)} personer</span>
                    )}
                  </div>
                  <Stang etikett="Står i skattemeldingen" verdi={g.skattbar} farge="bg-text-primary" />
                  <Stang etikett="Betaler i skatt" verdi={g.skattesats} farge="bg-accent" />
                </li>
              ))}
            </ul>
          </div>
          <p className="mt-3 max-w-[760px] text-[13px] text-text-muted">
            {t.toppen.fotnote}
          </p>
        </div>
      </section>

      {/* ── De 400 rikeste ── */}
      <section aria-labelledby="formue" className="border-t border-border bg-hero px-6 py-14 text-white">
        <div className="mx-auto max-w-[1100px]">
          <h2 id="formue" className="font-display text-2xl sm:text-[28px]">
            {t.formue.tittel}
          </h2>
          <p className="mt-3 max-w-[660px] text-[16px] leading-relaxed text-white/75">
            {t.formue.ingress}
          </p>
          <dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 [&>div]:flex [&>div]:flex-col">
            <div>
              <dt className="text-[14px] text-white/65">{t.formue.etikett_samlet}</dt>
              <dd className="order-first font-display text-4xl tabular-nums">
                {nf0.format(k.samlet_mrd)} mrd.
              </dd>
            </div>
            <div>
              <dt className="text-[14px] text-white/65">{t.formue.etikett_snitt}</dt>
              <dd className="order-first font-display text-4xl tabular-nums">
                {nf1.format(k.samlet_mrd / 400)} mrd.
              </dd>
            </div>
            <div>
              <dt className="text-[14px] text-white/65">{t.formue.etikett_milliardaerer}</dt>
              <dd className="order-first font-display text-4xl tabular-nums">
                {nf0.format(k.milliardaerer)}
              </dd>
            </div>
            <div>
              <dt className="text-[14px] text-white/65">{t.formue.etikett_rikeste}</dt>
              <dd className="order-first font-display text-4xl tabular-nums">
                {nf0.format(k.rikeste_mrd)} mrd.
              </dd>
            </div>
          </dl>
          <Formuevegg data={data} tekst={t.formue} />

          <div className="mt-12 grid max-w-[980px] gap-6 text-[16px] leading-relaxed text-white/80 md:grid-cols-2">
            {avsnitt(t.formue.tekst).map((a) => (
              <p key={a}>{a}</p>
            ))}
          </div>
          <p className="mt-6 text-[13px] text-white/55">
            {t.formue.fotnote}
          </p>
        </div>
      </section>

      <section aria-labelledby="hvorfor" className="border-t border-border bg-surface px-6 py-14">
        <div className="mx-auto grid max-w-[1100px] gap-12 md:grid-cols-2">
          <div className="max-w-[560px]">
            <h2 id="hvorfor" className="font-display text-2xl">
              {t.hvorfor.tittel}
            </h2>
            <div className="mt-4 space-y-4 text-[16px] leading-relaxed text-text-secondary">
              {avsnitt(t.hvorfor.tekst).map((a) => (
                <p key={a}>{a}</p>
              ))}
            </div>
          </div>

          <div className="max-w-[560px]">
            <h2 className="font-display text-2xl">{t.metode.tittel}</h2>
            <ul className="mt-4 list-disc space-y-2.5 pl-5 text-[15px] leading-relaxed text-text-secondary">
              {(t.metode.punkter ?? []).filter(Boolean).map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
            <h3 className="mt-8 text-[15px] font-semibold">Kilder</h3>
            <ul className="mt-2 space-y-1.5 text-[14px]">
              {data.kilder.map((k) => (
                <li key={k.lenke}>
                  <a href={k.lenke} className="text-accent-dark underline underline-offset-2 hover:text-accent">
                    {k.navn}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

function Stang({ etikett, verdi, farge }: { etikett: string; verdi: number; farge: string }) {
  return (
    <div className="flex items-center gap-3 text-[14px]">
      <span className="w-36 shrink-0 text-[13px] text-text-secondary md:sr-only">{etikett}</span>
      <div className="relative h-2.5 flex-1 rounded-full bg-surface-light" aria-hidden="true">
        <div className={`absolute inset-y-0 left-0 rounded-full ${farge}`} style={{ width: `${Math.max(verdi, 0.8)}%` }} />
      </div>
      <span className="w-12 text-right tabular-nums">{nf0.format(verdi)} %</span>
    </div>
  );
}
