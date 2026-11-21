// Henter oversikten fra kildeovervåkningen (github.com/gautery/kildeoverv-kning).
// Den oppdateres hver time der; her mellomlagres den i en time.

const KILDE_URL =
  "https://raw.githubusercontent.com/gautery/kildeoverv-kning/main/docs/saker.json";

const MAKS_DAGER = 60;

export type Sak = {
  id: string;
  tittel: string;
  lenke: string;
  ingress: string;
  kilde: string;
  kategori: string;
  type: string;
  dato: string;
  viktig: boolean;
  temaer: string[];
};

export type KalenderPost = {
  dato: string;
  tittel: string;
  lenke: string;
  temaer: string[];
};

export type KildeStatus = { navn: string; ok: boolean; feil: string | null };

export type Kildeoversikt = {
  oppdatert: string;
  saker: Sak[];
  kalender: KalenderPost[];
  status: KildeStatus[];
};

export async function hentKildeoversikt(): Promise<Kildeoversikt | null> {
  try {
    const res = await fetch(KILDE_URL, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = (await res.json()) as Kildeoversikt;
    const grense = Date.now() - MAKS_DAGER * 24 * 60 * 60 * 1000;
    return {
      ...data,
      saker: data.saker.filter((s) => new Date(s.dato).getTime() >= grense),
      kalender: data.kalender.filter((k) => k.temaer.length > 0).slice(0, 15),
    };
  } catch {
    return null;
  }
}
