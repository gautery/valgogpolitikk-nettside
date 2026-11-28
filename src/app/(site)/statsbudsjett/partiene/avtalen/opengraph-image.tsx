import { delingsStorrelse, delingsType, lagDelingsbilde } from "@/lib/delingsbilde";

export const alt = "Budsjettavtalen: hvem fikk viljen sin?";
export const size = delingsStorrelse;
export const contentType = delingsType;

export default function Bilde() {
  return lagDelingsbilde({
    overlinje: "Statsbudsjettet 2027",
    tittel: "Budsjettavtalen: hvem fikk viljen sin?",
  });
}
