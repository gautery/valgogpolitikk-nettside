import type { Metadata } from "next";
import OffentligSektor from "@/components/offentlig-sektor/OffentligSektor";
import { hentOffentligSektor, lesOffentligSektorTekst } from "@/lib/offentlig-sektor";

// Tallene ligger i public/data/offentlig-sektor og lages med scripts/offentlig_sektor.py.
// Teksten ligger i content/offentlig-sektor.yml og redigeres i Pages CMS.

export function generateMetadata(): Metadata {
  const t = lesOffentligSektorTekst();
  return {
    title: `${t.tittel} — valg og politikk`,
    description: t.beskrivelse,
    robots: t.utkast ? { index: false, follow: false } : undefined,
  };
}

export default function OffentligSektorSide() {
  return <OffentligSektor data={hentOffentligSektor()} tekst={lesOffentligSektorTekst()} />;
}
