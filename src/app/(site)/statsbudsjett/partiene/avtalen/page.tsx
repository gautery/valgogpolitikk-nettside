import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Metadata } from "next";
import { SKJULT_FOR_SOK, UTKAST } from "@/lib/utkast";
import { AAR, TYPETILFELLE_AAR } from "@/lib/partibudsjett";
import Avtale, { type AvtaleSak } from "@/components/partibudsjett/Avtale";
import { Tilbake, Utkastlinje } from "@/components/partibudsjett/Felles";

// Budsjettavtalen mot partienes egne alternative budsjetter. All tekst ligger i
// content/budsjettavtalen.yml og redigeres i Pages CMS (se .pages.yml).

type Innhold = {
  topp: { tittel: string; ingress: string };
  viktigste: { overskrift: string; punkter: { tittel: string; tekst: string }[] };
  saker: { overskrift: string; liste: AvtaleSak[] };
  metode: { overskrift: string; tekst: string };
  kilder: string[];
};

function les(): Innhold {
  const fil = path.join(process.cwd(), "content", "budsjettavtalen.yml");
  return matter(`---\n${fs.readFileSync(fil, "utf-8")}\n---`).data as Innhold;
}
// Tom linje i teksten gir nytt avsnitt.
const avsnitt = (t: string) => (t ?? "").split(/\n\s*\n/).map((a) => a.trim()).filter(Boolean);

export const metadata: Metadata = {
  title: "Budsjettavtalen for 2027: hvem fikk viljen sin? — valg og politikk",
  description:
    "Budsjettavtalen mellom Ap, Sp, SV og Rødt sammenlignet sak for sak med det Sp, SV og Rødt foreslo i sine egne alternative statsbudsjetter.",
  robots: UTKAST.partibudsjett ? SKJULT_FOR_SOK : undefined,
};

export default function AvtaleSide() {
  const d = les();
  // Saker uten krav eller med tomme felt skal ikke velte siden mens de redigeres.
  const saker = (d.saker?.liste ?? []).filter((s) => s?.tittel).map((s) => ({ ...s, krav: (s.krav ?? []).filter((k) => k?.parti) }));

  return (
    <>
      <Utkastlinje provedata={false} aar={TYPETILFELLE_AAR} />

      <div className="border-b border-black bg-white px-6 py-14 md:py-20">
        <div className="mx-auto max-w-[1100px]">
          <Tilbake aar={AAR} lenke={`Parti for parti: rammene i budsjettene for ${AAR}`} />
          <h1 className="max-w-[760px] font-display text-[42px] leading-[1.02] text-black sm:text-[56px]">{d.topp.tittel}</h1>
          <div className="mt-6 max-w-[620px] space-y-4 text-[18px] leading-[1.55] text-text-secondary">
            {avsnitt(d.topp.ingress).map((a) => (
              <p key={a}>{a}</p>
            ))}
          </div>
        </div>
      </div>

      <section className="border-b border-black bg-white px-6 py-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="max-w-[720px]">
            <h2 className="font-display text-[28px] leading-[1.1] text-black sm:text-[34px]">{d.viktigste.overskrift}</h2>
            <ul className="mt-5 space-y-3.5 text-[16px] leading-[1.55] text-text-secondary">
              {(d.viktigste.punkter ?? []).map((p) => (
                <li key={p.tittel}>
                  <strong className="font-semibold text-black">{p.tittel}</strong> {p.tekst}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-black bg-white px-6 py-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="max-w-[720px]">
            <h2 className="font-display text-[28px] leading-[1.1] text-black sm:text-[34px]">{d.saker.overskrift}</h2>
            <div className="mt-6">
              <Avtale saker={saker} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface px-6 py-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="max-w-[720px] space-y-4 text-[15.5px] leading-[1.6] text-text-secondary">
            <h2 className="font-display text-[26px] text-black">{d.metode.overskrift}</h2>
            {avsnitt(d.metode.tekst).map((a) => (
              <p key={a}>{a}</p>
            ))}
            <h3 className="pt-2 font-display text-[19px] text-black">Kilder</h3>
            <ul className="space-y-1 text-[14.5px]">
              {(d.kilder ?? []).map((k) => (
                <li key={k}>{k}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
