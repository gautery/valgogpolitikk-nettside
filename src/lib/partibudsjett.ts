import fs from "fs";
import path from "path";
import type { Partibudsjett } from "./partibudsjett-felles";

// Datafila lages av scripts/partibudsjett.py fra finansinnstillingen (Innst. 2 S)
// og ligger i public/data/partibudsjett.

const DIR = path.join(process.cwd(), "public", "data", "partibudsjett");

// Året som vises. Byttes når årets finansinnstilling er lest inn.
export const AAR = 2026;
// Sant så lenge siden viser fjorårets tall som prøve.
export const PROVEDATA = true;

export function hentPartibudsjett(aar = AAR): Partibudsjett {
  return JSON.parse(fs.readFileSync(path.join(DIR, `${aar}.json`), "utf-8")) as Partibudsjett;
}
