import type { Metadata } from "next";
import Trappa from "@/components/trappa/Trappa";
import { hentTrappa } from "@/lib/trappa";

// Tallene ligger i public/data/trappa og lages med scripts/trappa.py.

export const metadata: Metadata = {
  title: "Trappa til toppen — valg og politikk",
  description:
    "Hvor står du i inntektstrappa? Se hvor mye du må tjene for å være blant de 10, 1 og 0,1 prosent med høyest inntekt, og hvor mye de egentlig får.",
  robots: { index: false, follow: false }, // utkast
};

const nf0 = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 });

export default function TrappaSide() {
  const data = hentTrappa();
  const t01 = data.trinn.find((t) => t.id === "topp01")!;

  return (
    <>
      <div className="border-b border-amber-300 bg-amber-50 px-6 py-3">
        <p className="mx-auto max-w-[1100px] text-[13px] text-amber-900">
          <strong>Utkast.</strong> Siden er ikke godkjent for publisering og vises ikke i søkemotorer.
        </p>
      </div>

      <Trappa data={data} />

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
                Forskningen viser ikke hvor grensene går når overskuddet er med, og har ikke tall for de 0,01 prosent.
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
