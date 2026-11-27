import { delingsStorrelse, delingsType, lagDelingsbilde } from "@/lib/delingsbilde";

export const alt = "valg og politikk";
export const size = delingsStorrelse;
export const contentType = delingsType;

export default function Bilde() {
  return lagDelingsbilde({
    tittel: "Norsk politikk med tall og kilder",
    undertekst: "Analyser av norsk politikk, i hovedsak skatt, ulikhet og velferd.",
  });
}
