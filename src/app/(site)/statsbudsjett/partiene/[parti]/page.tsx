import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SKJULT_FOR_SOK, UTKAST } from "@/lib/utkast";
import { hentPartibudsjett, PROVEDATA } from "@/lib/partibudsjett";
import { belop, genitiv, iOrd, medFortegn, type Omrade } from "@/lib/partibudsjett-felles";
import { Akse, Kilde, ROT, Stolpe, Tilbake, Utkastlinje } from "@/components/partibudsjett/Felles";

export const dynamicParams = false;

export function generateStaticParams() {
  return hentPartibudsjett().partier.map((p) => ({ parti: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ parti: string }> }): Promise<Metadata> {
  const { parti } = await params;
  const data = hentPartibudsjett();
  const p = data.partier.find((x) => x.id === parti);
  if (!p) return {};
  return {
    title: `Hva ville ${p.navn} endret i statsbudsjettet ${data.aar}? — valg og politikk`,
    description: `${genitiv(p.navn)} forslag til statsbudsjett for ${data.aar}, sammenlignet med regjeringens: de største plussene og kuttene.`,
    robots: UTKAST.partibudsjett ? SKJULT_FOR_SOK : undefined,
  };
}

function Liste({ rader, parti, min, maks }: { rader: Omrade[]; parti: string; min: number; maks: number }) {
  return (
    <ul className="border-t border-black">
      {rader.map((o) => (
        <li key={o.slug} className="border-b border-border">
          <Link
            href={`${ROT}/omrade/${o.slug}`}
            className="group block py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            <div className="flex items-baseline justify-between gap-4">
              <span className="text-[16px] font-semibold leading-snug text-black group-hover:underline group-hover:underline-offset-[3px]">
                {o.navn}
              </span>
              <span className="shrink-0 whitespace-nowrap text-[15px] font-semibold tabular-nums text-black">
                {medFortegn(o.avvik[parti])}
              </span>
            </div>
            <div className="mt-3">
              <Stolpe v={o.avvik[parti]} min={min} maks={maks} />
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default async function PartiSide({ params }: { params: Promise<{ parti: string }> }) {
  const { parti } = await params;
  const data = hentPartibudsjett();
  const p = data.partier.find((x) => x.id === parti);
  if (!p) notFound();

  const skatt = data.omrader.find((o) => o.retning === "skatt");
  const netto = data.sum.avvik[p.id];
  const utgifter = data.omrader
    .filter((o) => o.retning === "utgift" || o.retning === "netto")
    .sort((a, b) => b.avvik[p.id] - a.avvik[p.id]);
  const pluss = utgifter.filter((o) => o.avvik[p.id] > 0).slice(0, 5);
  const kutt = utgifter
    .filter((o) => o.avvik[p.id] < 0)
    .reverse()
    .slice(0, 5);
  const uendret = utgifter.filter((o) => o.avvik[p.id] === 0).length;
  const min = Math.min(0, ...utgifter.map((o) => o.avvik[p.id]));
  const maks = Math.max(0, ...utgifter.map((o) => o.avvik[p.id]));
  const andre = data.partier.filter((x) => x.id !== p.id);

  return (
    <>
      <Utkastlinje provedata={PROVEDATA} aar={data.aar} />

      <div className="border-b border-black bg-white px-6 py-14 md:py-20">
        <div className="mx-auto max-w-[1100px]">
          <Tilbake aar={data.aar} />
          <h1 className="max-w-[760px] font-display text-[42px] leading-[1.02] text-black sm:text-[56px]">
            Hva ville {p.kort} endret?
          </h1>
          <p className="mt-6 max-w-[560px] text-[18px] leading-[1.55] text-text-secondary">
            {genitiv(p.navn)} eget forslag til statsbudsjett for {data.aar}, sammenlignet med regjeringens. Trykk på et
            område for å se hvor de andre partiene står.
          </p>
        </div>
      </div>

      <section aria-labelledby="hovedtall" className="bg-surface px-6 py-12">
        <div className="mx-auto max-w-[1100px]">
          <h2 id="hovedtall" className="sr-only">
            Hovedtall
          </h2>
          <dl className="grid max-w-[720px] gap-x-10 gap-y-8 sm:grid-cols-2">
            {skatt && (
              <div className="border-t border-black pt-4">
                <dt className="text-[14.5px] text-text-secondary">Skatter og avgifter</dt>
                <dd className="mt-1 font-display text-[40px] leading-none text-black">
                  {skatt.avvik[p.id] === 0 ? "0" : belop(skatt.avvik[p.id]).replace(" kr", "")}
                </dd>
                <dd className="mt-2 text-[14.5px] leading-snug text-text-secondary">
                  {skatt.avvik[p.id] === 0
                    ? "Samme nivå som regjeringen."
                    : `${skatt.avvik[p.id] > 0 ? "lavere" : "høyere"} skatter og avgifter enn regjeringen foreslo.`}{" "}
                  <Link href={`${ROT}/omrade/${skatt.slug}`} className="font-medium text-black underline underline-offset-[3px] hover:text-accent">
                    Se alle partiene
                  </Link>
                </dd>
              </div>
            )}
            <div className="border-t border-black pt-4">
              <dt className="text-[14.5px] text-text-secondary">Til sammen</dt>
              <dd className="mt-1 font-display text-[40px] leading-none text-black">
                {netto === 0 ? "0" : belop(netto).replace(" kr", "")}
              </dd>
              <dd className="mt-2 text-[14.5px] leading-snug text-text-secondary">
                {netto === 0
                  ? "Samme sum som regjeringen."
                  : `${netto > 0 ? "mer" : "mindre"} enn regjeringen, når utgifter og inntekter er regnet sammen.`}
              </dd>
            </div>
          </dl>
        </div>
      </section>

      <section aria-labelledby="pluss" className="px-6 py-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="max-w-[720px]">
            <h2 id="pluss" className="font-display text-[28px] leading-[1.1] sm:text-[34px]">
              Her ville {p.kort} brukt mer
            </h2>
            {pluss.length ? (
              <div className="mt-6">
                <Akse venstre="Mindre enn regjeringen" hoyre="Mer enn regjeringen" min={min} maks={maks} />
                <Liste rader={pluss} parti={p.id} min={min} maks={maks} />
              </div>
            ) : (
              <p className="mt-4 text-[16px] text-text-secondary">{p.kort} foreslo ikke mer penger på noe område.</p>
            )}

            <h2 id="kutt" className="mt-14 font-display text-[28px] leading-[1.1] sm:text-[34px]">
              Her ville {p.kort} brukt mindre
            </h2>
            {kutt.length ? (
              <div className="mt-6">
                <Akse venstre="Mindre enn regjeringen" hoyre="Mer enn regjeringen" min={min} maks={maks} />
                <Liste rader={kutt} parti={p.id} min={min} maks={maks} />
              </div>
            ) : (
              <p className="mt-4 text-[16px] text-text-secondary">{p.kort} foreslo ikke kutt på noe område.</p>
            )}

            <details className="mt-10 border-y border-border">
              <summary className="cursor-pointer py-4 text-[15.5px] font-semibold text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent">
                Vis alle {data.omrader.length} områdene
              </summary>
              <table className="mb-5 w-full text-left text-[14.5px]">
                <caption className="sr-only">
                  {p.navn}: avvik fra regjeringens forslag på hvert område
                </caption>
                <thead>
                  <tr className="border-b border-black text-[13px] text-text-muted">
                    <th scope="col" className="py-2 pr-3 font-medium">
                      Område
                    </th>
                    <th scope="col" className="py-2 text-right font-medium">
                      Avvik fra regjeringen
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.omrader.map((o) => (
                    <tr key={o.slug} className="border-b border-border">
                      <th scope="row" className="py-2.5 pr-3 font-normal">
                        <Link href={`${ROT}/omrade/${o.slug}`} className="underline decoration-border-light underline-offset-[3px] hover:text-accent">
                          {o.navn}
                        </Link>
                      </th>
                      <td className="py-2.5 text-right tabular-nums">{iOrd(o, o.avvik[p.id])}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
            {uendret > 0 && (
              <p className="mt-4 text-[13.5px] text-text-muted">
                På {uendret} {uendret === 1 ? "område" : "områder"} foreslo {p.kort} samme beløp som regjeringen.
              </p>
            )}
            <Kilde data={data} />
          </div>
        </div>
      </section>

      <nav aria-labelledby="andre" className="border-t border-border bg-surface px-6 py-10">
        <div className="mx-auto max-w-[1100px]">
          <h2 id="andre" className="font-display text-[22px]">
            Se et annet parti
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {andre.map((x) => (
              <li key={x.id}>
                <Link
                  href={`${ROT}/${x.id}`}
                  className="inline-block rounded-md border border-black bg-white px-3.5 py-2 text-[14.5px] font-semibold text-black hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {x.kort}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}
