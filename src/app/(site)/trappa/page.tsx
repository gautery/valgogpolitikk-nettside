import type { Metadata } from "next";
import Trappa from "@/components/trappa/Trappa";
import { hentTrappa } from "@/lib/trappa";
import { hentBudsjett, hentOversikt, standardId } from "@/lib/statsbudsjett";

// Tallene ligger i public/data/trappa og lages med scripts/trappa.py.

export const metadata: Metadata = {
  title: "Trappa til toppen — valg og politikk",
  description:
    "Hvor står du i inntektstrappa? Se hvor mye du må tjene for å være blant de 10, 1 og 0,1 prosent med høyest inntekt, og hvor mye de egentlig får.",
  robots: { index: false, follow: false }, // utkast
};

const nf0 = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 });
const nf1 = new Intl.NumberFormat("nb-NO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

export default function TrappaSide() {
  const data = hentTrappa();
  const t01 = data.trinn.find((t) => t.id === "topp01")!;
  const budsjett = hentBudsjett(standardId(hentOversikt()));
  const k = data.kapital;

  return (
    <>
      <div className="border-b border-amber-300 bg-amber-50 px-6 py-3">
        <p className="mx-auto max-w-[1100px] text-[13px] text-amber-900">
          <strong>Utkast.</strong> Siden er ikke godkjent for publisering og vises ikke i søkemotorer.
        </p>
      </div>

      <Trappa data={data} />

      {/* ── Helt på toppen ── */}
      <section aria-labelledby="toppen" className="border-t border-border px-6 py-14">
        <div className="mx-auto max-w-[1100px]">
          <h2 id="toppen" className="font-[family-name:var(--font-playfair)] text-2xl font-bold sm:text-[28px]">
            Jo rikere, jo mindre havner i skattemeldingen
          </h2>
          <p className="mt-3 max-w-[660px] text-[16px] leading-relaxed text-text-secondary">
            Ring, Seim og Zucman har fulgt inntektene helt opp til de rundt 20 personene med høyest inntekt i Norge. For
            folk flest står nesten hele inntekten i skattemeldingen. Helt på toppen blir nesten alt liggende i
            selskapene, og da faller også skatten.
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
            Norge, snitt 2018–2020. Inntekt er her alt som tjenes, også overskudd som blir liggende i selskaper personen
            eier. Skatten omfatter inntektsskatt, trygdeavgift, arbeidsgiveravgift, moms, selskapsskatt, formuesskatt og
            eiendomsskatt. Antall personer er omtrentlig. Kilde: Ring, Seim og Zucman (2026), figur 2 og 5.
          </p>
        </div>
      </section>

      {/* ── De 400 rikeste ── */}
      <section aria-labelledby="formue" className="border-t border-border bg-hero px-6 py-14 text-white">
        <div className="mx-auto max-w-[1100px]">
          <h2 id="formue" className="font-[family-name:var(--font-playfair)] text-2xl font-bold sm:text-[28px]">
            Hvor rike er de rikeste?
          </h2>
          <p className="mt-3 max-w-[660px] text-[16px] leading-relaxed text-white/75">
            Inntekt er én ting. Formue er noe annet. Magasinet Kapital anslår hvert år hva de 400 rikeste i Norge er
            verdt, og forskerne bruker lista til å sjekke sine egne tall.
          </p>
          <dl className="mt-9 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 [&>div]:flex [&>div]:flex-col">
            <div>
              <dt className="text-[14px] text-white/65">eier de 400 rikeste til sammen</dt>
              <dd className="order-first font-[family-name:var(--font-playfair)] text-4xl font-bold tabular-nums">
                {nf0.format(k.samlet_mrd)} mrd.
              </dd>
            </div>
            <div>
              <dt className="text-[14px] text-white/65">i snitt per person på lista</dt>
              <dd className="order-first font-[family-name:var(--font-playfair)] text-4xl font-bold tabular-nums">
                {nf1.format(k.samlet_mrd / 400)} mrd.
              </dd>
            </div>
            <div>
              <dt className="text-[14px] text-white/65">nordmenn er milliardærer</dt>
              <dd className="order-first font-[family-name:var(--font-playfair)] text-4xl font-bold tabular-nums">
                {nf0.format(k.milliardaerer)}
              </dd>
            </div>
            <div>
              <dt className="text-[14px] text-white/65">eier den rikeste alene</dt>
              <dd className="order-first font-[family-name:var(--font-playfair)] text-4xl font-bold tabular-nums">
                {nf0.format(k.rikeste_mrd)} mrd.
              </dd>
            </div>
          </dl>
          <div className="mt-10 grid max-w-[980px] gap-6 text-[16px] leading-relaxed text-white/80 md:grid-cols-2">
            <p>
              {budsjett && (
                <>
                  Det er mer enn hele statsbudsjettet: Regjeringen foreslår å bruke{" "}
                  {nf0.format(Math.round(budsjett.sum_utgifter / 1000))} milliarder kroner i {budsjett.aar}.{" "}
                </>
              )}
              Nesten {nf0.format(k.fra_utlandet_andel * 100)} prosent av verdiene på lista styres nå helt eller delvis
              fra utlandet.
            </p>
            <p>
              I skattelistene ser de rikeste mye fattigere ut. Den skattbare formuen deres er bare rundt{" "}
              {nf0.format(Math.round(data.skattbar_formue_andel * 20) * 5)} prosent av det Kapital anslår. De 100 rikeste familiene betalte
              i 2020 til sammen {nf1.format(data.topp100.skatt_av_inntekt)} prosent av inntekten sin i skatt. Bare{" "}
              {nf1.format(data.topp100.personlig_inntektsskatt)} prosent var inntektsskatt de betalte selv. Resten var
              selskapsskatt og formuesskatt.
            </p>
          </div>
          <p className="mt-6 text-[13px] text-white/55">
            Kapital 400 for {k.aar}. Lista tar med nordmenn som bor i utlandet. Forskernes tall gjelder bare dem som bor i
            Norge, og topp 100-familiene i Kapital 400 i 2020.
          </p>
        </div>
      </section>

      <section aria-labelledby="hvorfor" className="border-t border-border bg-surface px-6 py-14">
        <div className="mx-auto grid max-w-[1100px] gap-12 md:grid-cols-2">
          <div className="max-w-[560px]">
            <h2 id="hvorfor" className="font-[family-name:var(--font-playfair)] text-2xl font-bold">
              Hvorfor to tall?
            </h2>
            <div className="mt-4 space-y-4 text-[16px] leading-relaxed text-text-secondary">
              <p>
                Den offisielle statistikken regner bare med det folk får utbetalt til seg selv: lønn, pensjon, trygd,
                renter, utbytte og gevinster de har tatt ut. Penger som tjenes i et aksjeselskap og blir stående der,
                kommer ikke med.
              </p>
              <p>
                Det betyr lite for folk flest. Men de som eier mest, tar ofte ut lite og lar overskuddet bli liggende i
                selskapet, gjerne i et holdingselskap. Da ser de mindre rike ut i statistikken enn de er.
              </p>
              <p>
                Forskere i SSB har derfor regnet hver eiers andel av overskuddet i selskapene som en del av inntekten.
                Arbeidet ble gjort på oppdrag fra Finansdepartementet. For 99 prosent av befolkningen endrer det
                nesten ingenting. Helt på toppen blir forskjellen stor: snittinntekten til de 0,1 prosent øverst går
                fra {nf0.format(t01.offisiell!.snittinntekt / 1e6)} til {nf0.format(t01.med_overskudd!.snittinntekt / 1e6)}{" "}
                millioner kroner i året.
              </p>
            </div>
          </div>

          <div className="max-w-[560px]">
            <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold">Slik er tallene regnet</h2>
            <ul className="mt-4 list-disc space-y-2.5 pl-5 text-[15px] leading-relaxed text-text-secondary">
              <li>
                Alle tall gjelder personer som er 25 år eller eldre, og bruttoinntekt: inntekt før skatt, inkludert
                pensjon, trygd og kapitalinntekter.
              </li>
              <li>
                Kalkulatoren og grensene bygger på SSBs skattestatistikk for {data.aar}. SSB oppgir hvor mange som
                tjener innenfor hvert inntektsintervall og hva de tjener i snitt. Innenfor hvert intervall har vi
                regnet oss fram til grensene.
              </li>
              <li>
                Grensa for de 0,01 prosent ligger langt over det høyeste intervallet i statistikken (7,5 millioner
                og over), og er derfor et anslag.
              </li>
              <li>
                Andelene og snittinntektene er fra Vestad (2024) og gjelder {data.forskningsaar}. Rapporten viser
                tallene i figurer, ikke tabeller, så vi har lest dem ut av figurene. Samme avlesning av en annen figur i
                rapporten gir nøyaktig de tallene Finansdepartementet oppgir i nasjonalbudsjettet for 2027.
              </li>
              <li>
                Tallene helt på toppen, finere grupper og skatten til de 100 rikeste familiene er fra Ring, Seim og
                Zucman (2026), lest ut av figurene på samme måte. Som kontroll summerer de tre toppgruppene seg til
                nøyaktig det forskerne oppgir for hele den øverste prosenten, hvert år.
              </li>
              <li>
                Forskningen viser ikke hvor grensene går når overskuddet er med. Forskerne bruker ulike inntektsbegreper
                og år, så tallene fra de to studiene er ikke helt sammenlignbare.
              </li>
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
