// Velger mørk eller hvit tekst oppå en farge, slik at kontrasten blir god nok
// (WCAG). Brukes på kategorimerker der innlegget selv bestemmer bakgrunnsfargen.

function luminans(hex: string): number | null {
  const m = hex.trim().match(/^#?([0-9a-f]{6})$/i);
  if (!m) return null;
  const kanaler = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255);
  const [r, g, b] = kanaler.map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function tekstPaa(bakgrunn?: string): string {
  const l = bakgrunn ? luminans(bakgrunn) : null;
  if (l === null) return "#ffffff";
  const motHvit = 1.05 / (l + 0.05);
  const motBlekk = (l + 0.05) / (luminans("#1a1a2e")! + 0.05);
  return motHvit >= motBlekk ? "#ffffff" : "#1a1a2e";
}
