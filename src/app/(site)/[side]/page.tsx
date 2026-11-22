import type { Metadata } from "next";
import { notFound } from "next/navigation";
import KarusellSide from "@/components/KarusellSide";
import Klosser from "@/components/klosser/Klosser";
import { hentAlleKaruseller, lesKarusell } from "@/lib/karuseller";
import { hentAlleSider, lesSide } from "@/lib/sider";

// Sider på toppnivå: valgogpolitikk.no/<adresse>.
// Adressen er enten en karusellside (content/karuseller) eller en side bygd av
// byggeklosser (content/sider). Karusellsider vinner hvis begge finnes.
// Bare adresser som finnes i filene blir sider; alt annet gir 404.
export const dynamicParams = false;
export const revalidate = 3600;

// Adresser som allerede brukes av faste sider.
const OPPTATT = new Set(["kilder", "innlegg", "tema", "kommer-snart", "kontrollsenter", "klosser", "api", "bilder", "skraablikk", "statsbudsjett", "trappa"]);

export function generateStaticParams() {
  const slugs = new Set([
    ...hentAlleKaruseller().map((k) => k.slug),
    ...hentAlleSider().map((s) => s.slug),
  ]);
  return [...slugs].filter((s) => !OPPTATT.has(s)).map((side) => ({ side }));
}

export async function generateMetadata({ params }: { params: Promise<{ side: string }> }): Promise<Metadata> {
  const { side } = await params;
  const k = lesKarusell(side);
  if (k) {
    return {
      title: `${k.tittel} — valg og politikk`,
      description: k.ingress,
      robots: k.utkast ? { index: false, follow: false } : undefined,
      openGraph: { images: k.slides[0]?.bilde ? [k.slides[0].bilde] : undefined },
    };
  }
  const s = lesSide(side);
  if (!s) return {};
  return {
    title: `${s.tittel} — valg og politikk`,
    description: s.beskrivelse || undefined,
    robots: s.utkast ? { index: false, follow: false } : undefined,
  };
}

export default async function Side({ params }: { params: Promise<{ side: string }> }) {
  const { side } = await params;
  const k = lesKarusell(side);
  if (k) return <KarusellSide k={k} />;

  const s = lesSide(side);
  if (!s) notFound();
  return (
    <>
      {s.utkast && (
        <div className="border-b border-amber-300 bg-amber-50 px-6 py-3">
          <p className="mx-auto max-w-[1100px] text-[13px] text-amber-900">
            <strong>Utkast.</strong> Siden er ikke ferdig og vises ikke i søkemotorer.
          </p>
        </div>
      )}
      <Klosser seksjoner={s.seksjoner} />
    </>
  );
}
