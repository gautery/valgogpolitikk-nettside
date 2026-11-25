import { delingsStorrelse, delingsType, lagDelingsbilde } from "@/lib/delingsbilde";
import { lesTema } from "@/lib/tema";

export const alt = "valg og politikk";
export const size = delingsStorrelse;
export const contentType = delingsType;

export default async function Bilde({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = lesTema(slug);
  return lagDelingsbilde({ overlinje: "Tema", tittel: t?.tittel ?? "valg og politikk", undertekst: t?.ingress });
}
