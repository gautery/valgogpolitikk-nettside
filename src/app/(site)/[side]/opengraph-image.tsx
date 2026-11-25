import { delingsStorrelse, delingsType, lagDelingsbilde } from "@/lib/delingsbilde";
import { lesKarusell } from "@/lib/karuseller";
import { lesSide } from "@/lib/sider";

export const alt = "valg og politikk";
export const size = delingsStorrelse;
export const contentType = delingsType;

export default async function Bilde({ params }: { params: Promise<{ side: string }> }) {
  const { side } = await params;
  const k = lesKarusell(side);
  if (k) return lagDelingsbilde({ overlinje: "Karusell", tittel: k.tittel, undertekst: k.ingress, bilde: k.slides[0]?.bilde });
  const s = lesSide(side);
  return lagDelingsbilde({ tittel: s?.tittel ?? "valg og politikk", undertekst: s?.beskrivelse });
}
