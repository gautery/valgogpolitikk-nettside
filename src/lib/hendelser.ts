// Hendelser til Umami: teller handlinger, ikke bare sidevisninger.
// Vi sender aldri hva folk skriver inn (f.eks. inntekten i kalkulatoren),
// bare at handlingen skjedde. Gjør ingenting hvis Umami ikke er lastet.

declare global {
  interface Window {
    umami?: { track: (navn: string, data?: Record<string, string | number>) => void };
  }
}

export function sporHendelse(navn: string, data?: Record<string, string | number>) {
  if (typeof window === "undefined") return;
  try {
    window.umami?.track(navn, data);
  } catch {
    // Statistikk skal aldri ødelegge siden.
  }
}

/** Egenskaper for Umamis klikksporing på lenker ut av siden. */
export function lenkeUtSporing(href: string) {
  try {
    return { "data-umami-event": "lenke-ut", "data-umami-event-til": new URL(href).hostname.replace(/^www\./, "") };
  } catch {
    return {};
  }
}
