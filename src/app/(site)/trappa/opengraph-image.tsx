import { delingsStorrelse, delingsType, lagDelingsbilde } from "@/lib/delingsbilde";

export const alt = "valg og politikk";
export const size = delingsStorrelse;
export const contentType = delingsType;

export default function Bilde() {
  return lagDelingsbilde({
    overlinje: "Trappa til toppen",
    tittel: "Hvor står du i inntektstrappa?",
    undertekst: "Se hvor mye du må tjene for å være blant de 10, 1 og 0,1 prosent med høyest inntekt.",
  });
}
