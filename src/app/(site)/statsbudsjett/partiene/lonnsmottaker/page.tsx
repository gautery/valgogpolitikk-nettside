import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { SKJULT_FOR_SOK, UTKAST } from "@/lib/utkast";
import { AAR, TYPETILFELLE_AAR } from "@/lib/partibudsjett";
import Lommebok, { type LommebokParti } from "@/components/partibudsjett/Lommebok";
import { Tilbake, Utkastlinje } from "@/components/partibudsjett/Felles";

type Data = {
  aar: number;
  lonn: number;
  skatt_regjeringen: number;
  forutsetninger: {
    mat: number;
    km: number;
    liter: number;
    fagforeningsfradrag: number;
    barnehage_mnd: number;
    barnehage_aar: number;
    soskenmoderasjon: number;
    sfo_aar: number;
    barnetrygd_mnd: number;
    tannlege: number;
    tannlege_egenandel_21_28: number;
  };
  kilder: string[];
  partier: LommebokParti[];
  merk: { tittel: string; tekst: string }[];
};

const tall = (x: number) => x.toLocaleString("nb-NO").replace(/\s/g, " ");

export const metadata: Metadata = {
  title: "En lønn på 600 000 kroner: hva ville partiene endret? — valg og politikk",
  description:
    "Skatt, avgifter, barnehage, SFO, barnetrygd og tannlege for en lønnsmottaker med hvert partis alternative statsbudsjett for 2027, sammenlignet med regjeringens forslag.",
  robots: UTKAST.partibudsjett ? SKJULT_FOR_SOK : undefined,
};

export default function LonnsmottakerSide() {
  const data = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "public", "data", "typetilfeller", `${TYPETILFELLE_AAR}.json`), "utf-8"),
  ) as Data;
  const f = data.forutsetninger;

  return (
    <>
      <Utkastlinje provedata={false} aar={data.aar} />

      <div className="border-b border-black bg-white px-6 py-14 md:py-20">
        <div className="mx-auto max-w-[1100px]">
          <Tilbake aar={AAR} lenke={`Parti for parti: rammene i budsjettene for ${AAR}`} />
          <h1 className="max-w-[760px] font-display text-[42px] leading-[1.02] text-black sm:text-[56px]">
            En lønn på {tall(data.lonn)} kroner: hva ville partiene endret?
          </h1>
          <p className="mt-6 max-w-[560px] text-[18px] leading-[1.55] text-text-secondary">
            Skatt, avgifter og noen velferdsgoder for en som tjener {tall(data.lonn)} kroner, med partienes
            alternative budsjetter for {data.aar}. Alt er sammenlignet med regjeringens forslag. Velg det som gjelder
            deg.
          </p>
        </div>
      </div>

      <section aria-labelledby="partiene" className="px-6 py-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="max-w-[720px]">
            <h2 id="partiene" className="sr-only">
              Partiene
            </h2>
            <Lommebok partier={data.partier} liter={f.liter} />

            {data.merk.map((m) => (
              <p key={m.tittel} className="mt-6 text-[14.5px] leading-relaxed text-text-secondary">
                <strong className="font-semibold text-black">{m.tittel}</strong> {m.tekst}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="forutsetninger" className="border-t border-border bg-surface px-6 py-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="max-w-[680px]">
            <h2 id="forutsetninger" className="font-display text-[28px] leading-[1.1] sm:text-[34px]">
              Dette har vi regnet med
            </h2>
            <p className="mt-4 text-[16.5px] leading-[1.65] text-text-primary">
              Alle tall er kroner i året, sammenlignet med regjeringens forslag. Pluss betyr at du får bedre råd.
              Der partiene innfører noe varig midt i året, viser vi virkningen for et helt år. Midlertidige kutt er
              regnet for den tida de varer.
            </p>

            <h3 className="mt-9 font-display text-[21px]">Deg</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[15.5px] leading-relaxed text-text-primary">
              <li>
                Lønn: {tall(data.lonn)} kroner, uten andre inntekter og fradrag. Med regjeringens forslag er skatten{" "}
                {tall(data.skatt_regjeringen)} kroner.
              </li>
              <li>
                Mat og drikke: {tall(f.mat)} kroner i året, som er snittet for aleneboende i SSBs forbruksundersøkelse
                for 2022. Vi antar at hele endringen i moms havner i prisen.
              </li>
              <li>
                Bil: {tall(f.km)} kilometer i året med en bensinbil som bruker 0,7 liter per mil, altså {f.liter} liter.
              </li>
              <li>
                Fagorganisert: kontingenten er minst {tall(f.fagforeningsfradrag)} kroner, som er det høyeste fradraget
                i regjeringens forslag.
              </li>
              <li>
                Tannlege: du bruker {tall(f.tannlege)} kroner i året til full pris, omtrent én vanlig undersøkelse, og
                går til den offentlige tannhelsetjenesten. I regjeringens forslag betaler de mellom 21 og 28 år{" "}
                {Math.round(f.tannlege_egenandel_21_28 * 100)} prosent av prisen. For dem som er 31 år eller eldre,
                slår ingen av forslagene ut ved så lave utgifter.
              </li>
            </ul>

            <h3 className="mt-9 font-display text-[21px]">Barn</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[15.5px] leading-relaxed text-text-primary">
              <li>
                Husholdningen har to voksne og tjener over 800 000 kroner til sammen. Skatt, mat og bil gjelder den ene
                voksne. Barnehage, SFO, barnetrygd og foreldrefradrag gjelder hele husholdningen.
              </li>
              <li>
                Barnehage: full plass til makspris, {tall(f.barnehage_mnd)} kroner i måneden i elleve måneder, altså{" "}
                {tall(f.barnehage_aar)} kroner i året. Barn nummer to får {Math.round(f.soskenmoderasjon * 100)} prosent
                søskenmoderasjon. Kommuner med lavere makspris er ikke med.
              </li>
              <li>
                SFO: barnet går i 4. klasse og har halvdagsplass, som koster {tall(f.sfo_aar)} kroner i året. Prisen er
                SVs tall. For 1.–3. klasse er tolv timer i uka gratis fra før.
              </li>
              <li>
                Barnetrygd: {tall(f.barnetrygd_mnd)} kroner i måneden per barn i regjeringens forslag.
              </li>
              <li>
                Foreldrefradrag: utgiftene er det husholdningen betaler for barnehage og SFO. Blir barnehagen gratis,
                faller fradraget bort, og gevinsten blir 22 prosent mindre enn prisen.
              </li>
            </ul>

            <h3 className="mt-9 font-display text-[21px]">Anslag</h3>
            <p className="mt-3 text-[15.5px] leading-relaxed text-text-primary">
              Tall merket «anslag» har vi regnet ut fra partiets egne eksempler eller fra hvor mye partiet venter å få
              inn, eller vi har måttet tolke hva partiet mener. De er mer usikre enn resten. Stortingets
              finansinnstilling, som kommer senere, har de nøyaktige satsene.
            </p>

            <h3 className="mt-9 font-display text-[21px]">Ikke med</h3>
            <p className="mt-3 text-[15.5px] leading-relaxed text-text-primary">
              Dette er ikke hele bildet. Strøm, flyreiser, månedskort, klær, utbytte og formue er ikke med, og heller
              ikke ordninger som bare gjelder unge. På strøm skiller partiene seg i år: regjeringen vil øke Norgespris
              til 45 øre per kilowattime før moms, mens flere partier vil holde den på 40 eller 41 øre. Det meste partiene bruker penger på, som bemanning i barnehager, sykehus, pensjoner og
              kommuneøkonomi, kan ikke regnes om til kroner for én husholdning.
            </p>

            <h3 className="mt-9 font-display text-[21px]">Kilder</h3>
            <ul className="mt-3 space-y-2 text-[14px] leading-relaxed text-text-secondary">
              {data.kilder.map((k) => (
                <li key={k}>{k}</li>
              ))}
              <li>Partienes forslag: se «Forutsetninger og kilde» under hvert parti.</li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
