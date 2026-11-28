import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { Kloss } from "@/lib/klosser";

// Sider bygd av byggeklosser. Forsiden ligger i content/forside.md,
// andre sider i content/sider/<adresse>.md. Alt redigeres i Pages CMS.

const INNHOLD = path.join(process.cwd(), "content");

export type Side = {
  slug: string;
  tittel: string;
  beskrivelse: string;
  utkast: boolean;
  /** «kommentar» gir kommentaroppsettet. Sider med adresse som begynner på «kommentar-» får det også. */
  mal: string;
  seksjoner: Kloss[];
};

function lesFil(fil: string, slug: string): Side | null {
  if (!fs.existsSync(fil)) return null;
  const { data } = matter(fs.readFileSync(fil, "utf-8"));
  return {
    slug,
    tittel: data.tittel ?? "",
    beskrivelse: data.beskrivelse ?? "",
    utkast: data.utkast === true,
    mal: data.mal === "kommentar" || slug.startsWith("kommentar-") ? "kommentar" : "",
    seksjoner: (data.seksjoner ?? []).filter((s: Kloss | null) => s && s.type),
  };
}

export function lesForside(): Side {
  return (
    lesFil(path.join(INNHOLD, "forside.md"), "") ?? {
      slug: "",
      tittel: "",
      beskrivelse: "",
      utkast: false,
      mal: "",
      seksjoner: [],
    }
  );
}

export function lesSide(slug: string): Side | null {
  return lesFil(path.join(INNHOLD, "sider", `${slug}.md`), slug);
}

export function hentAlleSider(): Side[] {
  const dir = path.join(INNHOLD, "sider");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => lesSide(f.replace(/\.md$/, "")))
    .filter((s): s is Side => s !== null);
}

// ── Innstillinger: meny, bunntekst og «Om»-boksen ───────────────

export type Lenke = { tekst: string; lenke?: string };
export type Innstillinger = {
  meny: Lenke[];
  bunntekst: {
    beskrivelse: string;
    grupper: { overskrift: string; lenker: Lenke[] }[];
    merknad: string;
  };
  om: { tittel: string; tekst: string };
};

export function lesInnstillinger(): Innstillinger {
  const fil = path.join(INNHOLD, "innstillinger.yml");
  const data = fs.existsSync(fil) ? matter(`---\n${fs.readFileSync(fil, "utf-8")}\n---`).data : {};
  return {
    meny: (data.meny ?? []).filter((l: Lenke | null) => l && l.tekst),
    bunntekst: {
      beskrivelse: data.bunntekst?.beskrivelse ?? "",
      grupper: (data.bunntekst?.grupper ?? []).map((g: { overskrift?: string; lenker?: Lenke[] }) => ({
        overskrift: g?.overskrift ?? "",
        lenker: (g?.lenker ?? []).filter((l) => l && l.tekst),
      })),
      merknad: data.bunntekst?.merknad ?? "",
    },
    om: { tittel: data.om?.tittel ?? "", tekst: data.om?.tekst ?? "" },
  };
}

/**
 * Siden en intern lenke peker på («/kommentar-budsjettavtalen»), med tittelen slik den står øverst på siden.
 * Brukes der en sak lenker til en tilknyttet sak, så tittelen bare må endres ett sted.
 */
export function tilknyttetSide(lenke?: string): { tittel: string; utkast: boolean } | null {
  const slug = (lenke ?? "").trim().replace(/^\//, "").replace(/\/$/, "");
  if (!slug || slug.includes("/")) return null;
  const side = lesSide(slug);
  if (!side) return null;
  const topp = side.seksjoner.find((k) => k.type === "toppfelt");
  return { tittel: (topp && "tittel" in topp && topp.tittel) || side.tittel, utkast: side.utkast };
}

/** «Kommentar: Er dette …» → «Er dette …» når merkelappen foran allerede sier «Kommentar». */
export function utenMerke(tittel: string, merke: string) {
  const m = merke.trim().toLowerCase();
  const t = tittel.trim();
  if (!m || !t.toLowerCase().startsWith(m)) return t;
  const rest = t.slice(m.length).replace(/^\s*[:–—-]\s*/, "");
  return rest && rest !== t.slice(m.length) ? rest : t;
}

export function erEkstern(lenke?: string) {
  return !!lenke && /^https?:\/\//.test(lenke);
}
