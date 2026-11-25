import { delingsStorrelse, delingsType, lagDelingsbilde } from "@/lib/delingsbilde";

export const alt = "valg og politikk";
export const size = delingsStorrelse;
export const contentType = delingsType;

export default function Bilde() {
  return lagDelingsbilde({
    overlinje: "Kilder",
    tittel: "Nytt fra kildene",
    undertekst: "Rapporter, tall og løpende nytt fra SSB, regjeringen, Stortinget og andre offentlige kilder.",
  });
}
