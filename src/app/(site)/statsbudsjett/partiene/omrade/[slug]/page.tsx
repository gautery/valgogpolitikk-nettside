import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SKJULT_FOR_SOK, UTKAST } from "@/lib/utkast";
import { hentPartibudsjett, PROVEDATA } from "@/lib/partibudsjett";
import { akseTekst, belop, iOrd, prosent, spenn, vist } from "@/lib/partibudsjett-felles";
import { Akse, Kilde, ROT, Stolpe, Tilbake, Utkastlinje } from "@/components/partibudsjett/Felles";

export const dynamicParams = false;

export function generateStaticParams() {
  return hentPartibudsjett().omrader.map((o) => ({ slug: o.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = hentPartibudsjett();
  const o = data.omrader.find((x) => x.slug === slug);
  if (!o) return {};
  return {
    title: `${o.navn}: hva ville partiene endret i statsbudsjettet ${data.aar}? — valg og politikk`,
    description: `Hvor mye hvert parti ville endret på ${o.navn.toLowerCase()} i statsbudsjettet for ${data.aar}, sammenlignet med regjeringens forslag.`,
    robots: UTKAST.partibudsjett ? SKJULT_FOR_SOK : undefined,
  };
}

export default async function OmradeSide({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = hentPartibudsjett();
  const o = data.omrader.find((x) => x.slug === slug);
  if (!o) notFound();

  const s = spenn(o);
  const rader = data.partier
    .map((p) => ({ p, avvik: o.avvik[p.id], v: vist(o, o.avvik[p.id]) }))
    .sort((a, b) => b.v - a.v);
  const [venstre, hoyre] = akseTekst(o);
  const inntekt = o.gul_bok < 0;

  // Neste område i lista, sortert etter uenighet i kroner.
  const rekke = [...data.omrader].sort((a, b) => spenn(b).kroner - spenn(a).kroner);
  const neste = rekke[(rekke.findIndex((x) => x.slug === o.slug) + 1) % rekke.length];

  return (
    <>
      <Utkastlinje provedata={PROVEDATA} aar={data.aar} />

      <div className="border-b border-black bg-white px-6 py-14 md:py-20">
        <div className="mx-auto max-w-[1100px]">
          <Tilbake aar={data.aar} />
          <h1 className="max-w-[760px] font-display text-[42px] leading-[1.02] text-black sm:text-[56px]">{o.navn}</h1>
          <p className="mt-6 max-w-[560px] text-[18px] leading-[1.55] text-text-secondary">
            {o.retning === "skatt" ? (
              <>
                Regjeringen foreslo skatter og avgifter på{" "}
                <strong className="font-semibold text-black">{belop(o.gul_bok)}</strong> i {data.aar}.
              </>
            ) : inntekt ? (
              <>
                På dette området får staten inn mer enn den bruker. Regjeringen foreslo en netto inntekt på{" "}
                <strong className="font-semibold text-black">{belop(o.gul_bok)}</strong> i {data.aar}.
              </>
            ) : (
              <>
                Regjeringen foreslo <strong className="font-semibold text-black">{belop(o.gul_bok)}</strong> til dette
                området i {data.aar}
                {o.dekker ? `, som dekker ${o.dekker}` : ""}.
              </>
            )}{" "}
            Slik ville partiene endret det.
          </p>
        </div>
      </div>

      <section aria-labelledby="partiene" className="px-6 py-12">
        <div className="mx-auto max-w-[1100px]">
          <div className="max-w-[720px]">
            <h2 id="partiene" className="font-display text-[28px] leading-[1.1] sm:text-[34px]">
              {s.kroner === 0 ? "Her er partiene enige" : `${belop(s.kroner)} mellom ytterpunktene`}
            </h2>
            <p className="mt-3 mb-8 text-[16px] leading-relaxed text-text-secondary">
              {s.kroner === 0
                ? "Ingen av partiene foreslo et annet beløp enn regjeringen."
                : `Det tilsvarer ${prosent(s.andel).replace("+", "")} av det regjeringen foreslo. Trykk på et parti for å se resten av budsjettet deres.`}
            </p>

            <Akse venstre={venstre} hoyre={hoyre} min={s.min} maks={s.maks} />
            <ul className="border-t border-black">
              {rader.map(({ p, avvik, v }) => (
                <li key={p.id} className="border-b border-border">
                  <Link
                    href={`${ROT}/${p.id}`}
                    className="group block py-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    <div className="flex items-baseline justify-between gap-4">
                      <span className="font-display text-[19px] leading-none text-black group-hover:underline group-hover:underline-offset-[4px]">
                        {p.kort}
                      </span>
                      <span className="text-right text-[14.5px] font-medium leading-snug tabular-nums text-black">
                        {iOrd(o, avvik, true)}
                      </span>
                    </div>
                    <div className="mt-3">
                      <Stolpe v={v} min={s.min} maks={s.maks} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {data.flertall && o.flertall !== null && (
              <p className="mt-5 text-[14.5px] leading-relaxed text-text-secondary">
                Flertallet i finanskomiteen ({data.flertall.replace("A,", "Ap,").replace(" R", " Rødt")}) endte på{" "}
                {iOrd(o, o.flertall)}
                {o.flertall === 0 ? "" : " enn regjeringens forslag"}.
              </p>
            )}
            {o.retning === "netto" && (
              <p className="mt-3 text-[13.5px] leading-relaxed text-text-muted">
                Området har både utgifter og inntekter. Tallene viser nettoen: pluss betyr høyere utgifter eller lavere
                inntekter.
              </p>
            )}
            <Kilde data={data} />
          </div>
        </div>
      </section>

      <nav aria-label="Videre" className="border-t border-border bg-surface px-6 py-10">
        <div className="mx-auto flex max-w-[1100px] flex-wrap gap-3">
          <Link
            href={`${ROT}/omrade/${neste.slug}`}
            className="inline-block rounded-md bg-black px-5 py-3 text-[15px] font-semibold text-white hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Neste område: {neste.navn}
          </Link>
          <Link
            href={ROT}
            className="inline-block rounded-md border border-black bg-white px-5 py-3 text-[15px] font-semibold text-black hover:bg-black hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Alle områdene
          </Link>
        </div>
      </nav>
    </>
  );
}
