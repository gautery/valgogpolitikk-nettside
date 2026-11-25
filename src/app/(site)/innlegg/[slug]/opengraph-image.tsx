import { delingsStorrelse, delingsType, lagDelingsbilde } from "@/lib/delingsbilde";
import { getPostBySlug } from "@/lib/posts";

export const alt = "valg og politikk";
export const size = delingsStorrelse;
export const contentType = delingsType;

export default async function Bilde({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPostBySlug(slug);
  return lagDelingsbilde({ overlinje: p?.category, tittel: p?.title ?? "valg og politikk", undertekst: p?.summary });
}
