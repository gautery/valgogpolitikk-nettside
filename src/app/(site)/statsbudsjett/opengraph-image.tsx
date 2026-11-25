import { delingsStorrelse, delingsType, lagDelingsbilde } from "@/lib/delingsbilde";

export const alt = "valg og politikk";
export const size = delingsStorrelse;
export const contentType = delingsType;

export default function Bilde() {
  return lagDelingsbilde({
    overlinje: "Statsbudsjettet",
    tittel: "Hva pengene går til, og hvor de kommer fra",
  });
}
