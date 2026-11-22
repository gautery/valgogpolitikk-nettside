import fs from "fs";
import path from "path";
import type { TrappaData } from "./trappa-felles";

export function hentTrappa(): TrappaData {
  const fil = path.join(process.cwd(), "public", "data", "trappa", "trappa.json");
  return JSON.parse(fs.readFileSync(fil, "utf-8")) as TrappaData;
}
