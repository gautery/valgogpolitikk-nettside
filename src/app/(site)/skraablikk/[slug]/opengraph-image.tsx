import { delingsStorrelse, delingsType, lagDelingsbilde } from "@/lib/delingsbilde";
import { lesSkraablikk } from "@/lib/skraablikk";

export const alt = "valg og politikk";
export const size = delingsStorrelse;
export const contentType = delingsType;

export default async function Bilde({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = lesSkraablikk(slug);
  return lagDelingsbilde({ overlinje: "Skråblikk", tittel: s?.tittel ?? "valg og politikk", undertekst: s?.ingress, bilde: s?.slides[0]?.bilde });
}
