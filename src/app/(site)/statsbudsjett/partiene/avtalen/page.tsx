import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { SKJULT_FOR_SOK, UTKAST } from "@/lib/utkast";
import { AAR, TYPETILFELLE_AAR } from "@/lib/partibudsjett";
import Avtale, { type AvtaleSak } from "@/components/partibudsjett/Avtale";
import { Tilbake, Utkastlinje } from "@/components/partibudsjett/Felles";

// Budsjettavtalen mot partienes egne alternative budsjetter. Dataene ligger i
// public/data/budsjettavtale og er skrevet for hånd fra forliksdokumentet.

type Data = {
  aar: number;
  dato: string;
  hovedtall: { endringer_mrd: number; oljepenger_mrd: number; inndekning_mrd: number };
  lonn_600: { trygdeavgift: number; personfradrag: number; sum: number };
  saker: AvtaleSak[];
  kilder: string[];
};

const komma = (x: number) => x.toLocaleString("nb-NO", { maximumFractionDigits: 1 });

export const metadata: Metadata = {
  title: "Budsjettavtalen for 2027: hvem fikk viljen sin? — valg og politikk",
  description:
    "Budsjettavtalen mellom Ap, Sp, SV og Rødt sammenlignet sak for sak med det Sp, SV og Rødt foreslo i sine egne alternative statsbudsjetter.",
  robots: UTKAST.partibudsjett ? SKJULT_FOR_SOK : undefined,
};

export default function AvtaleSide() {
  const data = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "public", "data", "budsjettavtale", `${TYPETILFELLE_AAR}.json`), "utf-8"),
  ) as Data;
  return (
    <>
      <Utkastlinje provedata={false} aar={data.aar} />

      <div className="border-b border-black bg-white px-6 py-14 md:py-20">
        <div className="mx-auto max-w-[1100px]">
          <Tilbake aar={AAR} lenke={`Parti for parti: rammene i budsjettene for ${AAR}`} />
          <h1 className="max-w-[760px] font-display text-[42px] leading-[1.02] text-black sm:text-[56px]">
            Budsjettavtalen: hvem fikk viljen sin?
          </h1>
          <div className="mt-6 max-w-[620px] space-y-4 text-[18px] leading-[1.55] text-text-secondary">
            <p>
              Arbeiderpartiet, Senterpartiet, SV og Rødt ble {data.dato} enige om statsbudsjettet for {data.aar}.
              Regjeringen fikk beholde det meste av sitt eget forslag. Avtalen flytter{" "}
              {komma(data.hovedtall.endringer_mrd)} mrd. kroner, og skatteopplegget står nesten urørt.
            </p>
            <p>
              Sp, SV og Rødt fikk mest der regjeringen ikke hadde foreslått noe selv: tannlegerabatt for de eldste,
              billigere månedskort og litt billigere barnehage. Uten MDG har avtalen ikke flertall.
            </p>
          </div>
        </div>
      </div>

      <section className="border-b border-black bg-white px-6 py-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="max-w-[720px]">
            <h2 className="font-display text-[28px] leading-[1.1] text-black sm:text-[34px]">Det viktigste</h2>
            <ul className="mt-5 space-y-3.5 text-[16px] leading-[1.55] text-text-secondary">
              <li>
                <strong className="font-semibold text-black">Regjeringen holdt på skattene.</strong> SV og Rødt ville
                hente inn om lag 16 mrd. kroner mer i formuesskatt hver, og øke utbytteskatten. Avtalen rører ingen av
                delene.
              </li>
              <li>
                <strong className="font-semibold text-black">Lønnsmottakere får litt mindre.</strong> En som tjener
                600 000 kroner, betaler {data.lonn_600.sum} kroner mer i skatt med avtalen enn med regjeringens
                forslag, fordi trygdeavgiften kuttes mindre. SV og Rødt ville gi samme person om lag 5 000 kroner i
                lettelse.
              </li>
              <li>
                <strong className="font-semibold text-black">Regjeringen holdt på strømprisen.</strong> Sp, SV og Rødt
                gikk alle imot å øke Norgespris til 45 øre. Avtalen nevner ikke strøm, så økningen står.
              </li>
              <li>
                <strong className="font-semibold text-black">Regjeringen ga etter på tannlege og månedskort.</strong>{" "}
                Avtalen bruker 1,9 mrd. kroner på tannlegerabatt for alle over 75 år og 1,3 mrd. kroner på billigere
                månedskort. Ingen av delene sto i regjeringens forslag.
              </li>
              <li>
                <strong className="font-semibold text-black">Oljepenger.</strong> Forliksdokumentet oppgir at avtalen
                bruker {komma(data.hovedtall.oljepenger_mrd)} mrd. kroner mer enn regjeringens forslag.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-black bg-white px-6 py-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="max-w-[720px]">
            <h2 className="font-display text-[28px] leading-[1.1] text-black sm:text-[34px]">Sak for sak</h2>
            <div className="mt-6">
              <Avtale saker={data.saker} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface px-6 py-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="max-w-[720px] space-y-4 text-[15.5px] leading-[1.6] text-text-secondary">
            <h2 className="font-display text-[26px] text-black">Slik har vi gjort det</h2>
            <p>
              «Regjeringen fikk viljen sin» betyr at avtalen ikke endrer regjeringens forslag, selv om andre partier
              ville det. «Regjeringen ga litt» betyr at avtalen går et stykke i retning av de andre partiene.
              «Regjeringen ga etter» betyr at avtalen har med et tiltak regjeringen ikke hadde foreslått.
            </p>
            <p>
              Vi har sammenlignet avtalen med det hvert parti foreslo i sitt eget alternative statsbudsjett. «Fikk
              det» betyr at avtalen gir omtrent det partiet ba om. «Fikk noe» betyr at avtalen går samme vei, men
              kortere eller for en annen gruppe. «Fikk ikke» betyr at avtalen ikke endrer noe, eller går motsatt vei.
            </p>
            <p>
              Gjennomgangen dekker sakene vi har lest i partienes budsjetter, ikke alt partiene ba om. Senterpartiet
              har færre saker med enn SV og Rødt. Hva som teller som «noe», er en vurdering.
            </p>
            <p>
              Regnestykket for skatt: trygdeavgiften blir 0,1 prosentenhet høyere enn i regjeringens forslag, som er{" "}
              {data.lonn_600.trygdeavgift} kroner av 600 000 kroner. Personfradraget øker med 975 kroner, som gir{" "}
              {Math.abs(data.lonn_600.personfradrag)} kroner lavere skatt.
            </p>
            <h3 className="pt-2 font-display text-[19px] text-black">Kilder</h3>
            <ul className="space-y-1 text-[14.5px]">
              {data.kilder.map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
