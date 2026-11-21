"use client";

import { useMemo, useState } from "react";
import type { Kildeoversikt, Sak } from "@/lib/kilder";

const TEMAFARGER: Record<string, string> = {
  Skatt: "#c1121f",
  "Ulikhet og fordeling": "#7048e8",
  "Markedsmakt og konkurranse": "#a61e4d",
  "Offentlige finanser": "#1a1a2e",
  "Arbeid og trygd": "#2d6a4f",
  Bolig: "#8a5a00",
  "Energi og strøm": "#b35c00",
  "EU og EØS": "#1864ab",
  "Velferd og privatisering": "#c2410c",
};

const MND = ["jan", "feb", "mar", "apr", "mai", "jun", "jul", "aug", "sep", "okt", "nov", "des"];
const DAGER = ["søndag", "mandag", "tirsdag", "onsdag", "torsdag", "fredag", "lørdag"];
const PER_SIDE = 60;

function oslo(iso: string) {
  return new Date(new Date(iso).toLocaleString("en-US", { timeZone: "Europe/Oslo" }));
}

function dagNavn(d: Date) {
  const dag = DAGER[d.getDay()];
  return `${dag[0].toUpperCase()}${dag.slice(1)} ${d.getDate()}. ${MND[d.getMonth()]}`;
}

export default function KildeListe({ data }: { data: Kildeoversikt }) {
  const [temaer, setTemaer] = useState<Set<string>>(new Set());
  const [sok, setSok] = useState("");
  const [kategori, setKategori] = useState("");
  const [bareViktige, setBareViktige] = useState(false);
  const [antall, setAntall] = useState(PER_SIDE);

  const kategorier = useMemo(
    () => [...new Set(data.saker.map((s) => s.kategori))].sort(),
    [data.saker]
  );

  const filtrert = useMemo(() => {
    const q = sok.trim().toLowerCase();
    return data.saker.filter(
      (s) =>
        (!temaer.size || s.temaer.some((t) => temaer.has(t))) &&
        (!kategori || s.kategori === kategori) &&
        (!bareViktige || s.viktig) &&
        (!q || `${s.tittel} ${s.ingress} ${s.kilde}`.toLowerCase().includes(q))
    );
  }, [data.saker, temaer, sok, kategori, bareViktige]);

  const grupper = useMemo(() => {
    const ut: { dag: string; saker: Sak[] }[] = [];
    for (const s of filtrert.slice(0, antall)) {
      const dag = dagNavn(oslo(s.dato));
      if (ut.at(-1)?.dag !== dag) ut.push({ dag, saker: [] });
      ut.at(-1)!.saker.push(s);
    }
    return ut;
  }, [filtrert, antall]);

  function vekslTema(t: string) {
    const ny = new Set(temaer);
    if (ny.has(t)) ny.delete(t);
    else ny.add(t);
    setTemaer(ny);
    setAntall(PER_SIDE);
  }

  const oppdatert = oslo(data.oppdatert);
  const feilende = data.status.filter((s) => !s.ok);

  return (
    <div className="mx-auto max-w-[1100px] px-6 py-10">
      {/* Filtre */}
      <div className="mb-8 flex flex-col gap-4 border-b border-border pb-6">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrer på tema">
          {Object.entries(TEMAFARGER).map(([t, farge]) => {
            const aktiv = temaer.has(t);
            return (
              <button
                key={t}
                type="button"
                aria-pressed={aktiv}
                onClick={() => vekslTema(t)}
                style={{ borderColor: farge, color: aktiv ? "#fff" : farge, background: aktiv ? farge : "#fff" }}
                className="rounded-full border-[1.5px] px-3 py-1.5 text-[12px] font-semibold transition-colors"
              >
                {t}
              </button>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="sr-only" htmlFor="kildesok">Søk</label>
          <input
            id="kildesok"
            type="search"
            value={sok}
            onChange={(e) => { setSok(e.target.value); setAntall(PER_SIDE); }}
            placeholder="Søk i titler og ingresser …"
            className="min-w-[220px] flex-1 rounded-md border border-border px-4 py-2.5 text-sm outline-none focus:border-accent"
          />
          <label className="sr-only" htmlFor="kildekategori">Kategori</label>
          <select
            id="kildekategori"
            value={kategori}
            onChange={(e) => { setKategori(e.target.value); setAntall(PER_SIDE); }}
            className="rounded-md border border-border bg-white px-3 py-2.5 text-sm"
          >
            <option value="">Alle kategorier</option>
            {kategorier.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
          <label className="flex items-center gap-2 text-sm text-text-secondary">
            <input
              type="checkbox"
              checked={bareViktige}
              onChange={(e) => { setBareViktige(e.target.checked); setAntall(PER_SIDE); }}
            />
            Bare ★ viktige
          </label>
        </div>
      </div>

      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_300px]">
        {/* Saker */}
        <div>
          {grupper.length === 0 && (
            <p className="text-sm italic text-text-muted">Ingen saker passer filteret.</p>
          )}
          {grupper.map((g) => (
            <section key={g.dag} className="mb-8">
              <h2 className="mb-2 border-b border-border pb-2 font-[family-name:var(--font-playfair)] text-xl font-bold">
                {g.dag}
              </h2>
              <ol>
                {g.saker.map((s) => (
                  <li key={s.id} className="border-b border-border py-4 last:border-0">
                    <a
                      href={s.lenke}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[15px] font-semibold leading-snug text-text-primary hover:text-accent hover:underline"
                    >
                      {s.tittel}
                    </a>
                    {s.ingress && (
                      <p className="mt-1 text-[14px] leading-relaxed text-text-secondary">{s.ingress}</p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 text-[12px] text-text-muted">
                      {s.viktig && <span className="font-bold text-accent" aria-label="Viktig">★</span>}
                      <span>{s.kilde}</span>
                      {s.type && s.type !== "Nyhet" && (
                        <span className="font-semibold text-text-primary">{s.type}</span>
                      )}
                      {s.temaer.map((t) => (
                        <span
                          key={t}
                          className="rounded px-1.5 py-0.5 text-[11px] font-semibold text-white"
                          style={{ background: TEMAFARGER[t] ?? "#555" }}
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </li>
                ))}
              </ol>
            </section>
          ))}
          {filtrert.length > antall && (
            <button
              type="button"
              onClick={() => setAntall(antall + PER_SIDE)}
              className="rounded-md bg-hero px-5 py-3 text-[13px] font-semibold text-white hover:opacity-90"
            >
              Vis flere
            </button>
          )}
        </div>

        {/* Sidekolonne */}
        <aside className="order-first flex flex-col gap-5 lg:order-none">
          <div className="rounded-lg border border-border bg-surface p-5">
            <h2 className="mb-3 font-[family-name:var(--font-playfair)] text-lg font-bold">
              Kommer fra SSB
            </h2>
            {data.kalender.length === 0 ? (
              <p className="text-sm italic text-text-muted">Ingenting relevant de neste ukene.</p>
            ) : (
              <ul className="text-[13.5px]">
                {data.kalender.map((k) => {
                  const [, m, d] = k.dato.split("-");
                  return (
                    <li key={k.dato + k.tittel} className="border-t border-border py-2 first:border-0">
                      <span className="mr-1.5 font-semibold text-accent">{+d}. {MND[+m - 1]}</span>
                      <a href={k.lenke} target="_blank" rel="noopener noreferrer" className="text-text-secondary hover:underline">
                        {k.tittel}
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <div className="rounded-lg border border-border bg-surface p-5 text-[13px] leading-relaxed text-text-secondary">
            <h2 className="mb-2 font-[family-name:var(--font-playfair)] text-lg font-bold text-text-primary">
              Om oversikten
            </h2>
            <p className="mb-2">
              Sist oppdatert {oppdatert.getDate()}. {MND[oppdatert.getMonth()]} kl.{" "}
              {String(oppdatert.getHours()).padStart(2, "0")}:{String(oppdatert.getMinutes()).padStart(2, "0")}.
              ★ betyr NOU, stortingsmelding, proposisjon eller Riksrevisjonen.
            </p>
            <p className="mb-2">
              {feilende.length
                ? `⚠️ ${feilende.length} av ${data.status.length} kilder svarte ikke sist.`
                : `Alle ${data.status.length} kildene svarte normalt.`}
            </p>
            <p className="flex flex-wrap gap-x-4">
              <a href="https://raw.githubusercontent.com/gautery/kildeoverv-kning/main/docs/feed.xml" className="font-semibold text-accent hover:underline">
                RSS
              </a>
              <a href="https://github.com/gautery/kildeoverv-kning" className="font-semibold text-accent hover:underline">
                Kildeliste
              </a>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
