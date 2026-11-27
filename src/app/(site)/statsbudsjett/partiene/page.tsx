import type { Metadata } from "next";
import Link from "next/link";
import { SKJULT_FOR_SOK, UTKAST } from "@/lib/utkast";
import { hentPartibudsjett, PROVEDATA } from "@/lib/partibudsjett";
import { belop, iOrd, medFortegn, prosent, spenn } from "@/lib/partibudsjett-felles";
import Uenighet, { type UenighetRad } from "@/components/partibudsjett/Uenighet";
import { Kilde, ROT, Utkastlinje } from "@/components/partibudsjett/Felles";

export const metadata: Metadata = {
  title: "Hva ville partiene endret i statsbudsjettet? — valg og politikk",
  description:
    "Partienes alternative statsbudsjetter, område for område og parti for parti. Regjeringens forslag er nullpunktet.",
  robots: UTKAST.partibudsjett ? SKJULT_FOR_SOK : undefined,
};

export default function PartieneSide() {
  const data = hentPartibudsjett();
  const kort = Object.fromEntries(data.partier.map((p) => [p.id, p.kort]));
  const skatt = data.omrader.find((o) => o.retning === "skatt");

  const rader: UenighetRad[] = data.omrader.map((o) => {
    const s = spenn(o);
    return {
      slug: o.slug,
      navn: o.navn,
      dekker: o.dekker,
      kroner: s.kroner,
      andel: s.andel,
      spennTekst: belop(s.kroner),
      andelTekst: prosent(s.andel).replace("+", ""),
      // Når alle partiene ligger på samme side, er regjeringens forslag det ene ytterpunktet.
      fraTil:
        s.kroner === 0
          ? "Alle partiene foreslo det samme som regjeringen."
          : `Fra ${s.lavest.v > 0 ? "regjeringens forslag" : `${iOrd(o, s.lavest.avvik)} (${kort[s.lavest.id]})`} til ${
              s.hoyest.v < 0 ? "regjeringens forslag" : `${iOrd(o, s.hoyest.avvik)} (${kort[s.hoyest.id]})`
            }.`,
      min: s.min,
      maks: s.maks,
      punkter: s.liste.map((l) => l.v),
      gulBok: o.gul_bok,
    };
  });

  const partier = data.partier.map((p) => {
    const utgifter = data.omrader
      .filter((o) => o.retning === "utgift" || o.retning === "netto")
      .map((o) => ({ o, a: o.avvik[p.id] }))
      .sort((a, b) => b.a - a.a);
    return { p, netto: data.sum.avvik[p.id], pluss: utgifter[0], kutt: utgifter[utgifter.length - 1] };
  });

  return (
    <>
      <Utkastlinje provedata={PROVEDATA} aar={data.aar} />

      <div className="border-b border-black bg-white px-6 py-14 md:py-20">
        <div className="mx-auto max-w-[1100px]">
          <p className="mb-5 text-[15px] font-semibold text-black">Statsbudsjettet {data.aar}</p>
          <h1 className="max-w-[760px] font-display text-[42px] leading-[1.02] text-black sm:text-[56px]">
            Hva ville partiene endret?
          </h1>
          <p className="mt-6 max-w-[560px] text-[18px] leading-[1.55] text-text-secondary">
            Hvert parti på Stortinget lager sitt eget forslag til statsbudsjett. Her er regjeringens forslag
            nullpunktet, og du ser hvor langt hvert parti ville gått fra det. Trykk på et område eller et parti
            for å se detaljene.
          </p>
          <nav aria-label="Gå rett til et parti" className="mt-8">
            <ul className="flex flex-wrap gap-2">
              {data.partier.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`${ROT}/${p.id}`}
                    className="inline-block rounded-md border border-black bg-white px-3.5 py-2 text-[14.5px] font-semibold text-black hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {p.kort}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <section aria-labelledby="uenighet" className="px-6 py-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="max-w-[720px]">
            <h2 id="uenighet" className="font-display text-[28px] leading-[1.1] sm:text-[34px]">
              Dette er partiene mest uenige om
            </h2>
            <p className="mt-3 mb-7 text-[16px] leading-relaxed text-text-secondary">
              Avstanden mellom partiene som står lengst fra hverandre, på hvert av de {data.omrader.length} områdene
              Stortinget deler budsjettet inn i.
            </p>
            <Uenighet rader={rader} base={ROT} />
          </div>
        </div>
      </section>

      <section aria-labelledby="partier" className="border-t border-border bg-surface px-6 py-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="max-w-[720px]">
            <h2 id="partier" className="font-display text-[28px] leading-[1.1] sm:text-[34px]">
              Parti for parti
            </h2>
            <p className="mt-3 text-[16px] leading-relaxed text-text-secondary">
              Hva hvert parti ville endret mest, sammenlignet med regjeringens forslag.
            </p>
            <ul className="mt-7 border-t border-black">
              {partier.map(({ p, netto, pluss, kutt }) => (
                <li key={p.id} className="border-b border-border-light">
                  <Link
                    href={`${ROT}/${p.id}`}
                    className="group block py-5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <h3 className="font-display text-[24px] leading-none text-black group-hover:underline group-hover:underline-offset-[4px]">
                      {p.navn}
                    </h3>
                    <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 text-[14.5px] leading-snug">
                      {skatt && (
                        <>
                          <dt className="text-text-muted">Skatt</dt>
                          <dd className="text-text-primary">{iOrd(skatt, skatt.avvik[p.id])}</dd>
                        </>
                      )}
                      {pluss.a > 0 && (
                        <>
                          <dt className="text-text-muted">Størst pluss</dt>
                          <dd className="text-text-primary">
                            {pluss.o.navn}, {medFortegn(pluss.a)}
                          </dd>
                        </>
                      )}
                      {kutt.a < 0 && (
                        <>
                          <dt className="text-text-muted">Størst kutt</dt>
                          <dd className="text-text-primary">
                            {kutt.o.navn}, {medFortegn(kutt.a)}
                          </dd>
                        </>
                      )}
                      <dt className="text-text-muted">Til sammen</dt>
                      <dd className="text-text-primary">
                        {netto === 0 ? "som regjeringen" : `${belop(netto)} ${netto > 0 ? "mer" : "mindre"} enn regjeringen, netto`}
                      </dd>
                    </dl>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[13.5px] leading-relaxed text-text-muted">
              Arbeiderpartiet og Senterpartiet har ingen egen kolonne i tabellen. De står bak flertallets forslag
              sammen med Rødt.
            </p>
            <Kilde data={data} />
          </div>
        </div>
      </section>
    </>
  );
}
