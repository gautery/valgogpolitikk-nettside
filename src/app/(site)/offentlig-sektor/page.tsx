import type { Metadata } from "next";
import OffentligSektor from "@/components/offentlig-sektor/OffentligSektor";
import { hentOffentligSektor, hentStatsbudsjettTall, lesOffentligSektorTekst } from "@/lib/offentlig-sektor";
import { fyll } from "@/lib/trappa-tekst";

// Tallene ligger i public/data/offentlig-sektor og lages med scripts/offentlig_sektor.py.
// Teksten ligger i content/offentlig-sektor.yml og redigeres i Pages CMS.
// Siden lenker til /statsbudsjett og bruker tall derfra (se hentStatsbudsjettTall).

export function generateMetadata(): Metadata {
  const t = lesOffentligSektorTekst();
  return {
    title: `${t.tittel} — valg og politikk`,
    description: t.beskrivelse,
    robots: t.utkast ? { index: false, follow: false } : undefined,
  };
}

const nf0 = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 });

export default function OffentligSektorSide() {
  const data = hentOffentligSektor();
  const sb = hentStatsbudsjettTall(data.aar);
  const tekst = lesOffentligSektorTekst();

  // Ord i krøllparentes i teksten byttes ut med tall. Lista står også i Pages CMS.
  const verdier: Record<string, string> = {
    aar: String(data.aar),
    statsbudsjett_aar: sb ? String(sb.aar) : "",
    statsbudsjett_mrd: sb ? nf0.format(sb.utgifter_mrd) : "",
    kdd_mrd: sb ? nf0.format(sb.kdd_mrd) : "",
    kommune_egne_mrd: nf0.format(data.kommunene.egne_mrd),
    kommune_fra_staten_mrd: nf0.format(data.kommunene.fra_staten_mrd),
    kommune_inntekter_mrd: nf0.format(data.kommunene.inntekter_mrd),
  };
  const utfylt = {
    ...tekst,
    seksjoner: tekst.seksjoner.map((s) => ({
      ...s,
      avsnitt: s.avsnitt.map((a) => ({ ...a, tekst: fyll(a.tekst, verdier) })),
    })),
  };

  return <OffentligSektor data={data} tekst={utfylt} statsbudsjett={sb} />;
}
