import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { SKJULT_FOR_SOK, UTKAST } from "@/lib/utkast";
import { AAR, TYPETILFELLE_AAR } from "@/lib/partibudsjett";
import { Tilbake, Utkastlinje } from "@/components/partibudsjett/Felles";

// Budsjettavtalen mot partienes egne alternative budsjetter. Dataene ligger i
// public/data/budsjettavtale og er skrevet for hånd fra forliksdokumentet.

type Utfall = "fikk" | "delvis" | "ikke";
type Krav = { parti: string; krav: string; utfall: Utfall };
type Sak = { tittel: string; avtalen: string; regjeringen: string; krav: Krav[] };
type Data = {
  aar: number;
  dato: string;
  hovedtall: { endringer_mrd: number; oljepenger_mrd: number; inndekning_mrd: number };
  lonn_600: { trygdeavgift: number; personfradrag: number; sum: number };
  partier: string[];
  saker: Sak[];
  kilder: string[];
};

const UTFALL: Record<Utfall, { tekst: string; klasse: string }> = {
  fikk: { tekst: "Fikk det", klasse: "border-black bg-black text-white" },
  delvis: { tekst: "Fikk noe", klasse: "border-black bg-white text-black" },
  ikke: { tekst: "Fikk ikke", klasse: "border-border bg-surface text-text-muted" },
};
const komma = (x: number) => x.toLocaleString("nb-NO", { maximumFractionDigits: 1 });

export const metadata: Metadata = {
  title: "Budsjettavtalen for 2027: hvem fikk viljen sin? — valg og politikk",
  description:
    "Budsjettavtalen mellom Ap, Sp, SV og Rødt sammenlignet sak for sak med det Sp, SV og Rødt foreslo i sine egne alternative statsbudsjetter.",
  robots: UTKAST.partibudsjett ? SKJULT_FOR_SOK : undefined,
};

function Merke({ u }: { u: Utfall }) {
  return (
    <span className={`inline-block shrink-0 rounded-[3px] border px-2 py-0.5 text-[12.5px] font-semibold leading-tight ${UTFALL[u].klasse}`}>
      {UTFALL[u].tekst}
    </span>
  );
}

export default function AvtaleSide() {
  const data = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "public", "data", "budsjettavtale", `${TYPETILFELLE_AAR}.json`), "utf-8"),
  ) as Data;
  const tell = (parti: string, u: Utfall) =>
    data.saker.reduce((n, s) => n + s.krav.filter((k) => k.parti === parti && k.utfall === u).length, 0);

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
              Avtalen flytter {komma(data.hovedtall.endringer_mrd)} mrd. kroner. Ifølge forliksdokumentet øker
              oljepengebruken med {komma(data.hovedtall.oljepenger_mrd)} mrd. kroner. Uten MDG har avtalen ikke
              flertall.
            </p>
            <p>
              Partiene møttes der det koster minst: litt billigere barnehage, noe mer til kommunene og tannlegerabatt
              for de eldste. De store kravene fra SV og Rødt om å flytte skatt fra lønn til formue er ikke med.
            </p>
          </div>
        </div>
      </div>

      <section className="border-b border-black bg-white px-6 py-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="max-w-[720px]">
            <h2 className="font-display text-[28px] leading-[1.1] text-black sm:text-[34px]">De viktigste forskjellene</h2>
            <ul className="mt-5 space-y-3.5 text-[16px] leading-[1.55] text-text-secondary">
              <li>
                <strong className="font-semibold text-black">Skatt.</strong> En som tjener 600 000 kroner, betaler{" "}
                {data.lonn_600.sum} kroner mer i skatt med avtalen enn med regjeringens forslag, fordi trygdeavgiften
                kuttes mindre. SV og Rødt ville gi samme person om lag 5 000 kroner i lettelse.
              </li>
              <li>
                <strong className="font-semibold text-black">Formue og utbytte.</strong> SV og Rødt ville hente inn
                om lag 16 mrd. kroner mer i formuesskatt hver. Avtalen rører den ikke.
              </li>
              <li>
                <strong className="font-semibold text-black">Strøm.</strong> Sp, SV og Rødt gikk alle imot å øke
                Norgespris til 45 øre. Avtalen nevner ikke strøm, så økningen står.
              </li>
              <li>
                <strong className="font-semibold text-black">Tannlege.</strong> Avtalen bruker 1,9 mrd. kroner på
                rabatt for alle over 75 år. Rødt ville bruke 3,4 mrd. kroner på alle med store regninger.
              </li>
              <li>
                <strong className="font-semibold text-black">Oljepenger.</strong> I sine egne budsjetter brukte Sp, SV
                og Rødt om lag like mye oljepenger som regjeringen. Forliksdokumentet oppgir at avtalen bruker{" "}
                {komma(data.hovedtall.oljepenger_mrd)} mrd. kroner mer.
              </li>
            </ul>

            <h2 className="mt-12 font-display text-[28px] leading-[1.1] text-black sm:text-[34px]">Stillingen</h2>
            <p className="mt-3 text-[15.5px] leading-[1.55] text-text-secondary">
              Antall krav i gjennomgangen under. Arbeiderpartiet er ikke med, fordi regjeringens forslag er
              utgangspunktet.
            </p>
            <table className="mt-4 w-full border-t border-black text-left text-[15.5px]">
              <thead>
                <tr className="border-b border-black">
                  <th className="py-2.5 pr-3 font-semibold text-black">Parti</th>
                  {(Object.keys(UTFALL) as Utfall[]).map((u) => (
                    <th key={u} className="py-2.5 pr-2 font-semibold text-black">
                      {UTFALL[u].tekst}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.partier.map((p) => (
                  <tr key={p} className="border-b border-border-light">
                    <th className="py-2.5 pr-3 font-display text-[18px] font-normal text-black">{p}</th>
                    {(Object.keys(UTFALL) as Utfall[]).map((u) => (
                      <td key={u} className="py-2.5 pr-2 text-text-secondary">
                        {tell(p, u)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="border-b border-black bg-white px-6 py-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="max-w-[720px]">
            <h2 className="font-display text-[28px] leading-[1.1] text-black sm:text-[34px]">Sak for sak</h2>
            <ol className="mt-6 border-t border-black">
              {data.saker.map((s) => (
                <li key={s.tittel} className="border-b border-border-light py-6">
                  <h3 className="font-display text-[22px] leading-tight text-black">{s.tittel}</h3>
                  <p className="mt-2.5 text-[16px] leading-[1.5] text-black">
                    <span className="mr-2 inline-block h-[10px] w-[10px] rounded-full bg-accent" aria-hidden="true" />
                    <strong className="font-semibold">Avtalen:</strong> {s.avtalen}
                  </p>
                  <p className="mt-1.5 text-[14.5px] leading-[1.5] text-text-muted">
                    Regjeringen foreslo: {s.regjeringen}
                  </p>
                  <ul className="mt-4 space-y-3">
                    {s.krav.map((k) => (
                      <li key={k.parti} className="flex items-start justify-between gap-4">
                        <p className="text-[15.5px] leading-[1.5] text-text-secondary">
                          <strong className="font-semibold text-black">{k.parti} ville:</strong> {k.krav}
                        </p>
                        <Merke u={k.utfall} />
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-surface px-6 py-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="max-w-[720px] space-y-4 text-[15.5px] leading-[1.6] text-text-secondary">
            <h2 className="font-display text-[26px] text-black">Slik har vi gjort det</h2>
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
