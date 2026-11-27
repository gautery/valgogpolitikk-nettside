import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { SKJULT_FOR_SOK, UTKAST } from "@/lib/utkast";
import { AAR, PROVEDATA } from "@/lib/partibudsjett";
import Lommebok, { type LommebokParti } from "@/components/partibudsjett/Lommebok";
import { Tilbake, Utkastlinje } from "@/components/partibudsjett/Felles";

type Data = {
  aar: number;
  lonn: number;
  skatt_regjeringen: number;
  forutsetninger: { mat: number; km: number; liter: number; fagforeningsfradrag: number };
  kilder: string[];
  partier: LommebokParti[];
  mangler: { navn: string; tekst: string }[];
};

const tall = (x: number) => x.toLocaleString("nb-NO").replace(/\s/g, " ");

export const metadata: Metadata = {
  title: "En lønn på 600 000 kroner: hva ville partiene endret? — valg og politikk",
  description:
    "Skatt og avgifter for en lønnsmottaker med hvert partis alternative statsbudsjett, sammenlignet med regjeringens forslag.",
  robots: UTKAST.partibudsjett ? SKJULT_FOR_SOK : undefined,
};

export default function LonnsmottakerSide() {
  const data = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "public", "data", "typetilfeller", `${AAR}.json`), "utf-8"),
  ) as Data;
  const f = data.forutsetninger;

  return (
    <>
      <Utkastlinje provedata={PROVEDATA} aar={data.aar} />

      <div className="border-b border-black bg-white px-6 py-14 md:py-20">
        <div className="mx-auto max-w-[1100px]">
          <Tilbake aar={data.aar} />
          <h1 className="max-w-[760px] font-display text-[42px] leading-[1.02] text-black sm:text-[56px]">
            En lønn på {tall(data.lonn)} kroner: hva ville partiene endret?
          </h1>
          <p className="mt-6 max-w-[560px] text-[18px] leading-[1.55] text-text-secondary">
            Skatt og avgifter i året for en som bor alene og tjener {tall(data.lonn)} kroner, sammenlignet med
            regjeringens forslag. Slå på det som gjelder deg.
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

            {data.mangler.map((m) => (
              <p key={m.navn} className="mt-6 text-[14.5px] leading-relaxed text-text-secondary">
                <strong className="font-semibold text-black">{m.navn} mangler.</strong> {m.tekst}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section aria-labelledby="ikke-med" className="border-t border-border bg-surface px-6 py-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="max-w-[680px]">
            <h2 id="ikke-med" className="font-display text-[28px] leading-[1.1] sm:text-[34px]">
              Dette viser bare det du betaler inn
            </h2>
            <p className="mt-4 text-[16.5px] leading-[1.65] text-text-primary">
              Hva partiene bruker pengene på, er ikke med. Et parti som øker skattene for å gjøre tannlege eller
              barnehage billigere, kommer dårligere ut her enn det gjør i lommeboka til dem som bruker tjenestene.
            </p>

            <h3 className="mt-9 font-display text-[21px]">Slik har vi regnet</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-[15.5px] leading-relaxed text-text-primary">
              <li>
                Skatten er regnet etter reglene i hvert partis forslag, for en lønn på {tall(data.lonn)} kroner uten
                andre inntekter og fradrag. Med regjeringens forslag er skatten {tall(data.skatt_regjeringen)} kroner.
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
                Tall merket «anslag» har vi regnet ut fra partiets egne eksempler eller fra hvor mye partiet venter å
                få inn. De er mer usikre enn resten.
              </li>
            </ul>

            <h3 className="mt-9 font-display text-[21px]">Ikke med</h3>
            <p className="mt-3 text-[15.5px] leading-relaxed text-text-primary">
              Strøm, flyreiser, utbytte, formue og ordninger som bare gjelder unge eller barnefamilier. Flere partier
              foreslår endringer her.
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
