import { delingsStorrelse, delingsType, lagDelingsbilde } from "@/lib/delingsbilde";

export const alt = "valg og politikk";
export const size = delingsStorrelse;
export const contentType = delingsType;

export default function Bilde() {
  return lagDelingsbilde({
    tittel: "Tall. Kilder. Analyse.",
    undertekst: "Datadrevet analyse av norsk politikk: skatt, arbeid, ulikhet og velferd.",
  });
}
