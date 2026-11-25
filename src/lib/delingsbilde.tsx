import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Delingsbildene (1200 × 630) som vises når noen deler en lenke på Facebook,
// Messenger, Slack, LinkedIn osv. Lages automatisk fra tittelen på siden,
// så de oppdateres når teksten endres i Pages CMS.

export const delingsStorrelse = { width: 1200, height: 630 };
export const delingsType = "image/png";

const BLEKK = "#1a1a2e";
const AKSENT = "#c92a62";

async function skrifter() {
  const mappe = path.join(process.cwd(), "src/assets/fonts");
  const [playfair, inter, interHalvfet] = await Promise.all([
    readFile(path.join(mappe, "playfair-display-latin-700-normal.woff")),
    readFile(path.join(mappe, "inter-latin-400-normal.woff")),
    readFile(path.join(mappe, "inter-latin-600-normal.woff")),
  ]);
  return [
    { name: "Playfair", data: playfair, weight: 700 as const, style: "normal" as const },
    { name: "Inter", data: inter, weight: 400 as const, style: "normal" as const },
    { name: "Inter", data: interHalvfet, weight: 600 as const, style: "normal" as const },
  ];
}

/** Leser et bilde fra public/ (f.eks. første slide i en karusell) og gjør det om til PNG. */
async function lesBilde(offentligSti?: string): Promise<string | null> {
  if (!offentligSti || !offentligSti.startsWith("/")) return null;
  try {
    const fil = path.join(process.cwd(), "public", offentligSti);
    const png = await sharp(fil).resize({ height: 630 }).png().toBuffer();
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch {
    return null;
  }
}

/** Profilbildet fra Instagram (bokryggene), brukt som lite merke ved domenenavnet. */
async function lesMerke(): Promise<string | null> {
  try {
    const png = await readFile(path.join(process.cwd(), "src/app/icon.png"));
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch {
    return null;
  }
}

function kort(tekst: string, maks: number) {
  const t = tekst.trim();
  return t.length > maks ? `${t.slice(0, maks - 1).trimEnd()}…` : t;
}

export async function lagDelingsbilde({
  overlinje,
  tittel,
  undertekst,
  bilde,
}: {
  overlinje?: string;
  tittel: string;
  undertekst?: string;
  /** Sti i public/, f.eks. /bilder/karuseller/x/01.webp. Vises til høyre. */
  bilde?: string;
}) {
  const [slide, merke] = await Promise.all([lesBilde(bilde), lesMerke()]);
  const tittelKort = kort(tittel || "valg og politikk", 90);
  const tittelStr = tittelKort.length > 55 ? 54 : tittelKort.length > 30 ? 64 : 76;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: BLEKK }}>
        <div style={{ width: 12, height: "100%", background: AKSENT }} />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "64px 64px 52px 60px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {overlinje && (
              <div style={{ display: "flex", alignItems: "center", marginBottom: 28 }}>
                <div style={{ width: 6, height: 24, background: AKSENT, borderRadius: 3, marginRight: 14 }} />
                <div
                  style={{
                    fontFamily: "Inter",
                    fontWeight: 600,
                    fontSize: 22,
                    letterSpacing: 3,
                    color: "rgba(255,255,255,0.6)",
                    textTransform: "uppercase",
                  }}
                >
                  {overlinje}
                </div>
              </div>
            )}
            <div style={{ fontFamily: "Playfair", fontWeight: 700, fontSize: tittelStr, lineHeight: 1.12, color: "#fff" }}>
              {tittelKort}
            </div>
            {undertekst && (
              <div
                style={{
                  marginTop: 24,
                  fontFamily: "Inter",
                  fontSize: 26,
                  lineHeight: 1.45,
                  color: "rgba(255,255,255,0.7)",
                }}
              >
                {kort(undertekst, 140)}
              </div>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            {merke && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={merke} alt="" width={44} height={44} style={{ borderRadius: 8, marginRight: 16 }} />
            )}
            <div style={{ fontFamily: "Inter", fontWeight: 600, fontSize: 24, color: "#fff" }}>valgogpolitikk.no</div>
          </div>
        </div>
        {slide && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={slide} alt="" height={630} style={{ height: 630 }} />
        )}
      </div>
    ),
    { ...delingsStorrelse, fonts: await skrifter() },
  );
}
