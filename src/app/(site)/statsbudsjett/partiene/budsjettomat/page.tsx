import fs from "fs";
import path from "path";
import type { Metadata } from "next";
import { SKJULT_FOR_SOK, UTKAST } from "@/lib/utkast";
import { AAR, TYPETILFELLE_AAR } from "@/lib/partibudsjett";
import Budsjettomat, { type OmatData } from "@/components/partibudsjett/Budsjettomat";
import { Tilbake, Utkastlinje } from "@/components/partibudsjett/Felles";

type Data = OmatData & { kilder: Record<string, string> };

const TALLORD: Record<number, string> = { 5: "Fem", 10: "Ti", 12: "Tolv" };

export const metadata: Metadata = {
  title: "Budsjettomaten: hvilket partis statsbudsjett ligger du nærmest? — valg og politikk",
  description:
    "Svar på spørsmål fra statsbudsjettet for 2027, se hva hvert svar koster, og finn ut hvilket partis alternative budsjett du ligger nærmest.",
  robots: UTKAST.partibudsjett ? SKJULT_FOR_SOK : undefined,
};

export default function BudsjettomatSide() {
  const data = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), "public", "data", "budsjettomat", `${TYPETILFELLE_AAR}.json`), "utf-8"),
  ) as Data;

  return (
    <>
      <Utkastlinje provedata={false} aar={data.aar} />

      <div className="border-b border-black bg-white px-6 py-14 md:py-20">
        <div className="mx-auto max-w-[1100px]">
          <Tilbake aar={AAR} lenke={`Parti for parti: rammene i budsjettene for ${AAR}`} />
          <h1 className="max-w-[760px] font-display text-[42px] leading-[1.02] text-black sm:text-[56px]">
            Budsjettomaten: hvem ligger du nærmest?
          </h1>
          <p className="mt-6 max-w-[560px] text-[18px] leading-[1.55] text-text-secondary">
            {TALLORD[data.sporsmal.length] ?? data.sporsmal.length} spørsmål fra partienes alternative statsbudsjetter for {data.aar}. Hvert svar har
            en prislapp, og til slutt må budsjettet ditt gå opp.
          </p>
        </div>
      </div>

      <section className="border-b border-black bg-white px-6 py-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="max-w-[720px]">
            <Budsjettomat data={data} />
          </div>
        </div>
      </section>

      <section className="bg-surface px-6 py-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="max-w-[720px] space-y-4 text-[15.5px] leading-[1.6] text-text-secondary">
            <h2 className="font-display text-[26px] text-black">Slik har vi gjort det</h2>
            <p>
              Nullpunktet er regjeringens forslag til statsbudsjett for {data.aar}. Hvert parti er plassert etter hva
              det foreslår i sitt eget alternative budsjett. Der vi ikke har funnet noe forslag, står partiet som
              «som regjeringen».
            </p>
            <p>
              Prislappene er hentet fra partiene som foreslår tiltaket. Der et tiltak starter midt i året, har vi
              regnet om til et helt år når det står «i året».
            </p>
            <p>
              Prosenten til slutt viser hvor likt svarene dine er partiets forslag. Vil dere samme vei like langt,
              er det 100 prosent på det spørsmålet. Vil dere hver deres vei, er det 0. Spørsmål der vi ikke kjenner
              partiets forslag, teller ikke med.
            </p>
            <p>
              <strong className="font-semibold text-black">FrP er usikkert.</strong> Vi har ikke lest FrPs eget
              dokument ennå. Plasseringene er hentet fra NTBs omtale, og to av spørsmålene er ikke omtalt der.
            </p>
            <h3 className="pt-2 font-display text-[19px] text-black">Kilder</h3>
            <ul className="space-y-1 text-[14.5px]">
              {Object.values(data.kilder).map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
