"use client";

import { hierarchy, treemap, treemapSquarify } from "d3-hierarchy";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BPost, Budsjett, BudsjettOversikt, Historikk } from "@/lib/statsbudsjett";
import { verdiKart } from "@/lib/statsbudsjett-felles";

// ── Formatering ────────────────────────────────────────────────

const nf1 = new Intl.NumberFormat("nb-NO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const nf0 = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 });

/** Beløp i millioner kroner -> «2 286,8 mrd. kr» / «523 mill. kr». */
export function kr(mill: number) {
  const a = Math.abs(mill);
  if (a >= 1000) return `${nf1.format(mill / 1000)} mrd. kr`;
  if (a >= 10) return `${nf0.format(mill)} mill. kr`;
  return `${nf1.format(mill)} mill. kr`;
}
function mrd(mill: number) {
  return nf0.format(Math.round(mill / 1000));
}
function prosent(del: number, hel: number) {
  if (!hel) return "–";
  const p = (del / hel) * 100;
  return p < 0.1 ? "<0,1 %" : `${nf1.format(p)} %`;
}
function endring(nå: number, før?: number) {
  if (før === undefined || før === 0) return "Ny";
  const p = ((nå - før) / Math.abs(før)) * 100;
  if (Math.abs(p) < 0.05) return "0,0 %";
  return `${p > 0 ? "+" : "−"}${nf1.format(Math.abs(p))} %`;
}

// ── Hierarki: formål → programkategori → kapittel → post ─────

type Node = {
  key: string; // f.eks. "omr:29", "kat:2970", "kap:2670", "post:2670-71"
  navn: string;
  undertekst?: string;
  verdi: number;
  barn: Node[];
  kapitler: number[];
};

function byggTre(poster: BPost[]): Node {
  const rot: Node = { key: "rot", navn: "Alle utgifter", verdi: 0, barn: [], kapitler: [] };
  const finn = (forelder: Node, key: string, navn: string, undertekst?: string) => {
    let n = forelder.barn.find((b) => b.key === key);
    if (!n) {
      n = { key, navn, undertekst, verdi: 0, barn: [], kapitler: [] };
      forelder.barn.push(n);
    }
    return n;
  };
  for (const p of poster) {
    if (p.b === 0) continue;
    const omr = finn(rot, `omr:${p.omr_id}`, p.omr);
    const kat = finn(omr, `kat:${p.kat_id}`, p.kat);
    const kap = finn(kat, `kap:${p.kap}`, p.kap_navn, `Kap. ${p.kap}`);
    const post = finn(kap, `post:${p.kap}-${p.post}`, p.post_navn, `Kap. ${p.kap} post ${String(p.post).padStart(2, "0")}`);
    for (const n of [rot, omr, kat, kap, post]) n.verdi += p.b;
    for (const n of [rot, omr, kat, kap]) if (!n.kapitler.includes(p.kap)) n.kapitler.push(p.kap);
  }
  const sorter = (n: Node) => {
    n.barn.sort((a, b) => b.verdi - a.verdi);
    n.barn.forEach(sorter);
  };
  sorter(rot);
  return rot;
}

/** Hopper over nivåer med bare ett barn, så man slipper unødvendige klikk. */
function utvidSti(rot: Node, sti: string[]): string[] {
  const ut = [...sti];
  let n = følgSti(rot, ut);
  while (n.barn.length === 1 && n.barn[0].barn.length > 0) {
    n = n.barn[0];
    ut.push(n.key);
  }
  return ut;
}

function følgSti(rot: Node, sti: string[]): Node {
  let n = rot;
  for (const k of sti) {
    const neste = n.barn.find((b) => b.key === k);
    if (!neste) break;
    n = neste;
  }
  return n;
}

function gyldigSti(rot: Node, sti: string[]): string[] {
  const ut: string[] = [];
  let n = rot;
  for (const k of sti) {
    const neste = n.barn.find((b) => b.key === k);
    if (!neste) break;
    ut.push(k);
    n = neste;
  }
  return ut;
}

// ── Komponenten ────────────────────────────────────────────────

type Props = {
  oversikt: BudsjettOversikt[];
  start: Budsjett;
  startForrige: { tittel: string; kart: Record<string, number> } | null;
  historikk: Historikk;
};

export default function Statsbudsjett({ oversikt, start, startForrige, historikk }: Props) {
  const [budsjett, setBudsjett] = useState(start);
  const [forrige, setForrige] = useState(startForrige);
  const [laster, setLaster] = useState(false);
  const [sti, setSti] = useState<string[]>([]);

  const tre = useMemo(() => byggTre(budsjett.utgifter), [budsjett]);
  const forrigeKart = forrige?.kart ?? null;
  const node = følgSti(tre, sti);
  const stiNoder = useMemo(() => {
    const ut: Node[] = [tre];
    let n = tre;
    for (const k of sti) {
      const neste = n.barn.find((b) => b.key === k);
      if (!neste) break;
      ut.push(neste);
      n = neste;
    }
    return ut;
  }, [tre, sti]);

  const hentJson = async (id: string) => {
    const r = await fetch(`/data/statsbudsjett/${id}.json`);
    if (!r.ok) throw new Error(id);
    return (await r.json()) as Budsjett;
  };

  const forrigeIdFor = useCallback(
    (o: { aar: number }) => oversikt.find((x) => x.aar === o.aar - 1 && x.versjon === "vedtatt")?.id ?? null,
    [oversikt]
  );

  const byttBudsjett = useCallback(
    async (id: string, nySti?: string[]) => {
      const o = oversikt.find((x) => x.id === id);
      if (!o) return;
      setLaster(true);
      try {
        const fid = forrigeIdFor(o);
        const [b, f] = await Promise.all([hentJson(id), fid ? hentJson(fid) : Promise.resolve(null)]);
        setBudsjett(b);
        setForrige(f ? { tittel: f.tittel, kart: verdiKart(f.utgifter) } : null);
        setSti((gammel) => gyldigSti(byggTre(b.utgifter), nySti ?? gammel));
      } finally {
        setLaster(false);
      }
    },
    [oversikt, forrigeIdFor]
  );

  // Les valg fra adressen ved oppstart, så visninger kan deles som lenke.
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const b = q.get("b");
    const s = q.get("sti")?.split(",").filter(Boolean) ?? [];
    if (b && b !== start.id && oversikt.some((o) => o.id === b)) byttBudsjett(b, s);
    else if (s.length) setSti(gyldigSti(tre, s));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const q = new URLSearchParams();
    if (budsjett.id !== start.id) q.set("b", budsjett.id);
    if (sti.length) q.set("sti", sti.join(","));
    const s = q.toString();
    window.history.replaceState(null, "", s ? `?${s}` : window.location.pathname);
  }, [budsjett.id, sti, start.id]);

  // Flytt fokus til lista når man går inn eller ut i budsjettet, så tastatur- og skjermleserbrukere følger med.
  const listeOverskrift = useRef<HTMLHeadingElement>(null);
  const førsteGang = useRef(true);
  useEffect(() => {
    if (førsteGang.current) {
      førsteGang.current = false;
      return;
    }
    listeOverskrift.current?.focus({ preventScroll: true });
  }, [sti]);

  const gåInn = (n: Node) => {
    if (n.barn.length === 0) return;
    setSti((s) => utvidSti(tre, [...s, n.key]));
  };

  const valgtOversikt = oversikt.find((o) => o.id === budsjett.id)!;
  const sortertOversikt = [...oversikt].sort((a, b) => b.aar - a.aar || (a.versjon === "forslag" ? -1 : 1));

  return (
    <div className={laster ? "opacity-60 transition-opacity" : "transition-opacity"} aria-busy={laster}>
      {/* Topp */}
      <div className="border-b border-border bg-hero px-6 py-12 md:py-14">
        <div className="mx-auto max-w-[1100px]">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-4 w-1 rounded-full bg-rosa" />
            <span className="text-[13px] font-medium text-white/50">Statsbudsjettet</span>
          </div>
          <h1 className="max-w-[720px] font-display text-3xl leading-tight text-white sm:text-4xl lg:text-[44px] lg:leading-[1.15]">
            Hva pengene går til, og hvor de kommer fra
          </h1>
          <p className="mt-5 max-w-[640px] text-[17px] leading-relaxed text-white/75">
            {budsjett.versjon === "forslag" ? "Regjeringen foreslår" : "Stortinget vedtok"} å bruke{" "}
            <strong className="font-semibold text-white">{mrd(budsjett.sum_utgifter)} milliarder kroner</strong> i{" "}
            {budsjett.aar}. {mrd(budsjett.sum_inntekter)} milliarder kommer fra skatter, avgifter og andre inntekter,
            og <strong className="font-semibold text-white">{mrd(budsjett.fra_oljefondet)} milliarder</strong> fra
            oljefondet.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <label htmlFor="velg-budsjett" className="text-[14px] text-white/60">
              Vis
            </label>
            <select
              id="velg-budsjett"
              value={budsjett.id}
              onChange={(e) => byttBudsjett(e.target.value)}
              className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-[14px] font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {sortertOversikt.map((o) => (
                <option key={o.id} value={o.id} className="text-text-primary">
                  {o.tittel}
                </option>
              ))}
            </select>
            {laster && <span className="text-[13px] text-white/60">Henter tall …</span>}
          </div>
        </div>
      </div>

      {/* Utgifter */}
      <section aria-labelledby="utgifter" className="px-6 py-12">
        <div className="mx-auto max-w-[1100px]">
          <h2 id="utgifter" className="font-display text-2xl sm:text-[28px]">
            Hva pengene går til
          </h2>
          <p className="mt-2 max-w-[640px] text-[15px] leading-relaxed text-text-secondary">
            Størrelsen på hver rute viser hvor mye penger som går dit. Klikk på en rute eller i lista for å se hva
            den består av.
          </p>

          <Brødsmuler noder={stiNoder} onVelg={(i) => setSti(sti.slice(0, i))} />

          <Kart node={node} total={tre.verdi} onVelg={gåInn} />

          <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_340px]">
            <Liste
              overskriftRef={listeOverskrift}
              node={node}
              total={tre.verdi}
              forrigeKart={forrigeKart}
              forrigeTittel={forrige?.tittel}
              onVelg={gåInn}
            />
            <Utvikling node={node} oversikt={oversikt} historikk={historikk} valgt={valgtOversikt} />
          </div>
        </div>
      </section>

      {/* Inntekter */}
      <Inntekter budsjett={budsjett} />

      {/* Om tallene */}
      <section aria-labelledby="om-tallene" className="border-t border-border px-6 py-12">
        <div className="mx-auto max-w-[1100px]">
          <h2 id="om-tallene" className="font-display text-2xl">
            Slik er tallene regnet
          </h2>
          <div className="mt-4 max-w-[680px] space-y-4 text-[15.5px] leading-[1.75] text-text-secondary">
            <p>
              Tallene viser statsbudsjettet utenom petroleumsvirksomheten og lånetransaksjonene, slik
              Finansdepartementet selv framstiller det. Inntekter og utgifter fra olje- og gassvirksomheten går rett
              inn i oljefondet. Det som hentes ut av fondet for å dekke underskuddet, vises som en egen inntekt:
              overføringen fra oljefondet.
            </p>
            <p>
              Utgiftene omfatter alle kapitler under 3000, uten postene 90–99 (utlån, gjeldsavdrag og aksjer), uten
              kapittel 2440 (statens direkte økonomiske engasjement i petroleumsvirksomheten) og uten kapittel 2800
              (overføring til oljefondet). Inntektene omfatter kapitlene 3000–5999 på samme måte, uten
              petroleumsinntektene (kapittel 5440, 5507, 5508, 5509 og 5685) og overføringen fra fondet (kapittel
              5800).
            </p>
            <p>
              Beløpene er i løpende kroner og er ikke justert for prisvekst. Inndelingen i formål og kapitler kan
              endre seg fra år til år, så sammenligninger over mange år bør leses med forsiktighet.
            </p>
            <p>
              Kilde for {budsjett.tittel.toLowerCase()}:{" "}
              <a
                href={budsjett.kilde_lenke}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-text-primary underline decoration-border-light underline-offset-[3px] hover:text-accent"
              >
                {budsjett.kilde}
              </a>
              . Tidligere år:{" "}
              <a
                href="https://statsregnskapet.dfo.no/last-ned"
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-text-primary underline decoration-border-light underline-offset-[3px] hover:text-accent"
              >
                DFØ, bevilgningshistorikk
              </a>
              .{" "}
              <a
                href={`/data/statsbudsjett/${budsjett.id}.json`}
                className="font-medium text-text-primary underline decoration-border-light underline-offset-[3px] hover:text-accent"
              >
                Last ned tallene
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

// ── Brødsmuler ─────────────────────────────────────────────────

function Brødsmuler({ noder, onVelg }: { noder: Node[]; onVelg: (i: number) => void }) {
  return (
    <nav aria-label="Hvor du er i budsjettet" className="mt-6 mb-3">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px]">
        {noder.map((n, i) => {
          const sist = i === noder.length - 1;
          return (
            <li key={n.key} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true" className="text-text-faint">/</span>}
              {sist ? (
                <span aria-current="page" className="font-semibold text-text-primary">
                  {n.navn}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => onVelg(i)}
                  className="text-text-secondary underline decoration-border-light underline-offset-[3px] hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                >
                  {n.navn}
                </button>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ── Kartet (treemap) ───────────────────────────────────────────

function Kart({ node, total, onVelg }: { node: Node; total: number; onVelg: (n: Node) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [str, setStr] = useState({ b: 0, h: 0 });
  const [tips, setTips] = useState<{ x: number; y: number; n: Node } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => {
      const b = Math.round(e.contentRect.width);
      setStr({ b, h: b < 640 ? Math.round(b * 1.15) : Math.min(560, Math.round(b * 0.52)) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const ruter = useMemo(() => {
    if (!str.b || node.barn.length === 0) return [];
    const rot = hierarchy<{ barn?: Node[]; n?: Node }>({ barn: node.barn }, (d) =>
      d.barn ? d.barn.map((n) => ({ n })) : undefined
    ).sum((d) => (d.n ? Math.max(d.n.verdi, 0) : 0));
    treemap<{ barn?: Node[]; n?: Node }>().tile(treemapSquarify.ratio(1.3)).size([str.b, str.h]).paddingInner(2).round(true)(rot);
    return rot.leaves().map((l) => {
      const r = l as unknown as { x0: number; x1: number; y0: number; y1: number; data: { n: Node } };
      return { n: r.data.n, x: r.x0, y: r.y0, b: r.x1 - r.x0, h: r.y1 - r.y0 };
    });
  }, [node, str]);

  return (
    <div ref={ref} className="relative w-full" style={{ height: str.h || 480 }} onMouseLeave={() => setTips(null)}>
      {/* Kartet er et visuelt supplement: lista under har samme innhold og brukes med tastatur og skjermleser. */}
      <div aria-hidden="true">
        {ruter.map(({ n, x, y, b, h }) => {
          const kanKlikkes = n.barn.length > 0;
          const stor = b > 200 && h > 110;
          const visNavn = b > 96 && h > 40;
          const visBelop = h > 64 && b > (stor ? 150 : 104);
          return (
            <div
              key={n.key}
              onClick={() => onVelg(n)}
              onMouseMove={(e) => {
                const r = ref.current!.getBoundingClientRect();
                setTips({ x: e.clientX - r.left, y: e.clientY - r.top, n });
              }}
              className={`absolute overflow-hidden rounded-[3px] bg-surface-light p-2.5 transition-colors ${
                kanKlikkes ? "cursor-pointer hover:bg-accent-light" : "hover:bg-border"
              }`}
              style={{ left: x, top: y, width: b, height: h }}
            >
              {visNavn && (
                <>
                  <div
                    lang="nb"
                    className={`font-medium leading-snug text-text-primary [hyphens:auto] ${stor ? "text-[15px]" : "text-[12.5px]"}`}
                    style={{ display: "-webkit-box", WebkitLineClamp: h > 100 ? 3 : h > 70 ? 2 : 1, WebkitBoxOrient: "vertical", overflow: "hidden" }}
                  >
                    {n.navn}
                  </div>
                  {visBelop && (
                    <div
                      className={`mt-1 whitespace-nowrap font-display text-text-primary ${
                        stor ? "text-[24px]" : "text-[15px]"
                      }`}
                    >
                      {kr(n.verdi)}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
        {tips && (
          <div
            className="pointer-events-none absolute z-10 w-max max-w-[280px] rounded-md bg-text-primary px-3 py-2 text-[13px] leading-snug text-white shadow-lg"
            style={{
              left: Math.min(tips.x + 14, (str.b || 0) - 290),
              top: tips.y + 16,
            }}
          >
            <div className="font-semibold">{tips.n.navn}</div>
            {tips.n.undertekst && <div className="text-white/60">{tips.n.undertekst}</div>}
            <div className="mt-1">
              {kr(tips.n.verdi)} <span className="text-white/60">({prosent(tips.n.verdi, total)} av alle utgifter)</span>
            </div>
            {tips.n.barn.length > 0 && <div className="mt-1 text-white/60">Klikk for å se hva det består av</div>}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Lista (tilgjengelig versjon av kartet) ─────────────────────

function Liste({
  overskriftRef,
  node,
  total,
  forrigeKart,
  forrigeTittel,
  onVelg,
}: {
  overskriftRef: React.RefObject<HTMLHeadingElement | null>;
  node: Node;
  total: number;
  forrigeKart: Record<string, number> | null;
  forrigeTittel?: string;
  onVelg: (n: Node) => void;
}) {
  const maks = node.barn[0]?.verdi ?? 1;
  return (
    <div className="min-w-0">
      <h3 ref={overskriftRef} tabIndex={-1} className="text-[17px] font-semibold text-text-primary outline-none">
        {node.key === "rot" ? "Utgifter etter formål" : node.navn}
        <span className="ml-2 font-normal text-text-muted">{kr(node.verdi)}</span>
      </h3>
      <table className="mt-4 w-full border-collapse text-[14px]">
        <caption className="sr-only">
          {node.navn}, fordelt på {node.barn.length} deler. Beløp, andel av alle utgifter og endring fra{" "}
          {forrigeTittel ?? "året før"}.
        </caption>
        <thead>
          <tr className="border-b border-text-primary text-left text-[12.5px] text-text-muted">
            <th scope="col" className="py-2 pr-3 font-medium">
              Navn
            </th>
            <th scope="col" className="py-2 pr-3 text-right font-medium">
              Beløp
            </th>
            <th scope="col" className="hidden py-2 pr-3 text-right font-medium sm:table-cell">
              Andel
            </th>
            {forrigeKart && (
              <th scope="col" className="py-2 text-right font-medium">
                <span className="sr-only">Endring fra {forrigeTittel}</span>
                <span aria-hidden="true">Endring</span>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {node.barn.map((n) => (
            <tr key={n.key} className="border-b border-border align-top">
              <th scope="row" className="py-2.5 pr-3 text-left font-normal">
                {n.barn.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => onVelg(n)}
                    className="text-left font-medium text-text-primary underline decoration-border-light underline-offset-[3px] hover:text-accent hover:decoration-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
                  >
                    {n.navn}
                  </button>
                ) : (
                  <span className="text-text-primary">{n.navn}</span>
                )}
                {n.undertekst && <div className="text-[12px] text-text-muted">{n.undertekst}</div>}
                <div className="mt-1.5 h-[5px] rounded-r-[3px] bg-text-primary/80" style={{ width: `${Math.max((n.verdi / maks) * 100, 0.5)}%` }} aria-hidden="true" />
              </th>
              <td className="whitespace-nowrap py-2.5 pr-3 text-right tabular-nums text-text-primary">{kr(n.verdi)}</td>
              <td className="hidden whitespace-nowrap py-2.5 pr-3 text-right tabular-nums text-text-secondary sm:table-cell">
                {prosent(n.verdi, total)}
              </td>
              {forrigeKart && (
                <td className="whitespace-nowrap py-2.5 text-right tabular-nums text-text-secondary">
                  {endring(n.verdi, forrigeKart[n.key])}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {forrigeKart && forrigeTittel && (
        <p className="mt-3 text-[12.5px] text-text-muted">
          Endring er regnet fra {forrigeTittel.charAt(0).toLowerCase() + forrigeTittel.slice(1)}, i løpende kroner.
        </p>
      )}
    </div>
  );
}

// ── Utvikling over tid ─────────────────────────────────────────

function Utvikling({
  node,
  oversikt,
  historikk,
  valgt,
}: {
  node: Node;
  oversikt: BudsjettOversikt[];
  historikk: Historikk;
  valgt: BudsjettOversikt;
}) {
  const [aktiv, setAktiv] = useState<string | null>(null);

  // Vedtatte budsjett for alle år, pluss det valgte forslaget hvis det er et forslag.
  const budsjetter = oversikt
    .filter((o) => o.versjon === "vedtatt" || o.id === valgt.id)
    .sort((a, b) => a.aar - b.aar || (a.versjon === "vedtatt" ? -1 : 1));

  const verdiFor = (id: string): number | undefined => {
    if (node.key === "rot") return oversikt.find((o) => o.id === id)?.sum_utgifter;
    if (node.key.startsWith("omr:")) return historikk.formal[node.key.slice(4)]?.verdier[id];
    // Programkategori, kapittel og post: summer kapitlene som hører til.
    let sum = 0;
    let fant = false;
    for (const k of node.kapitler) {
      const v = historikk.kapittel[String(k)]?.verdier[id];
      if (v !== undefined) {
        sum += v;
        fant = true;
      }
    }
    return fant ? sum : undefined;
  };

  const punkter = budsjetter
    .map((o) => ({ o, v: verdiFor(o.id) }))
    .filter((p): p is { o: BudsjettOversikt; v: number } => p.v !== undefined && p.v > 0);
  if (punkter.length < 2) return <div />;
  const maks = Math.max(...punkter.map((p) => p.v));
  const gjelderKapittel = node.key.startsWith("post:");
  const vist = punkter.find((p) => p.o.id === aktiv) ?? punkter.find((p) => p.o.id === valgt.id) ?? punkter[punkter.length - 1];

  return (
    <figure className="min-w-0">
      <figcaption>
        <h3 className="text-[17px] font-semibold text-text-primary">Utvikling over tid</h3>
        <p className="mt-1 text-[13px] leading-relaxed text-text-muted">
          {(gjelderKapittel ? `Hele kapittel ${node.kapitler[0]}` : node.key === "rot" ? "Alle utgifter" : node.navn).replace(/\.$/, "")}.
          Vedtatt budsjett hvert år, i løpende kroner.
        </p>
      </figcaption>
      <div className="mt-4 text-[14px] text-text-primary" aria-live="polite">
        <span className="font-semibold">{vist.o.tittel}:</span> {kr(vist.v)}
      </div>
      <ul className="mt-3 flex h-[180px] items-end gap-[2px] border-b border-border" onMouseLeave={() => setAktiv(null)}>
        {punkter.map(({ o, v }) => {
          const valgtStolpe = o.id === valgt.id;
          return (
            <li key={o.id} className="flex h-full flex-1 items-end justify-center">
              <button
                type="button"
                onMouseEnter={() => setAktiv(o.id)}
                onFocus={() => setAktiv(o.id)}
                onBlur={() => setAktiv(null)}
                aria-label={`${o.tittel}: ${kr(v)}`}
                className="group flex h-full w-full items-end justify-center focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-accent"
              >
                <span
                  className={`block w-full max-w-[22px] rounded-t-[4px] ${
                    valgtStolpe ? "bg-accent" : o.versjon === "forslag" ? "bg-accent/50" : "bg-text-primary/70 group-hover:bg-text-primary"
                  }`}
                  style={{ height: `${(v / maks) * 100}%` }}
                />
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-1.5 flex justify-between text-[12px] tabular-nums text-text-muted">
        <span>{punkter[0].o.aar}</span>
        <span>{punkter[punkter.length - 1].o.aar}</span>
      </div>
    </figure>
  );
}

// ── Inntekter ──────────────────────────────────────────────────

function Inntekter({ budsjett }: { budsjett: Budsjett }) {
  const grupper = useMemo(() => {
    const m = new Map<string, { navn: string; verdi: number; kapitler: Map<number, { navn: string; verdi: number }> }>();
    for (const p of budsjett.inntekter) {
      const g = p.gruppe ?? "Andre inntekter";
      if (!m.has(g)) m.set(g, { navn: g, verdi: 0, kapitler: new Map() });
      const gr = m.get(g)!;
      gr.verdi += p.b;
      const k = gr.kapitler.get(p.kap) ?? { navn: p.kap_navn, verdi: 0 };
      k.verdi += p.b;
      gr.kapitler.set(p.kap, k);
    }
    return [...m.values()].sort((a, b) => b.verdi - a.verdi);
  }, [budsjett]);

  const total = budsjett.sum_inntekter + budsjett.fra_oljefondet;
  const rader = [
    ...grupper.map((g) => ({ ...g, olje: false })),
    { navn: "Overføring fra oljefondet", verdi: budsjett.fra_oljefondet, kapitler: null, olje: true },
  ].sort((a, b) => b.verdi - a.verdi);
  const maks = rader[0].verdi;

  return (
    <section aria-labelledby="inntekter" className="border-t border-border bg-surface px-6 py-12">
      <div className="mx-auto max-w-[1100px]">
        <h2 id="inntekter" className="font-display text-2xl sm:text-[28px]">
          Hvor pengene kommer fra
        </h2>
        <p className="mt-2 max-w-[640px] text-[15px] leading-relaxed text-text-secondary">
          {kr(total)} i alt. Overføringen fra oljefondet dekker det som mangler når skatter, avgifter og andre
          inntekter ikke strekker til.
        </p>
        <ul className="mt-8 max-w-[860px]">
          {rader.map((r) => (
            <li key={r.navn} className="border-t border-border py-3">
              <div className="flex items-baseline justify-between gap-4">
                <span className="text-[15px] font-medium text-text-primary">{r.navn}</span>
                <span className="whitespace-nowrap text-[15px] tabular-nums text-text-primary">
                  {kr(r.verdi)} <span className="ml-1 text-[13px] text-text-muted">{prosent(r.verdi, total)}</span>
                </span>
              </div>
              <div
                aria-hidden="true"
                className={`mt-2 h-[10px] rounded-r-[4px] ${r.olje ? "bg-accent" : "bg-text-primary/75"}`}
                style={{ width: `${(r.verdi / maks) * 100}%` }}
              />
              {r.kapitler && r.kapitler.size > 1 && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-[13px] text-text-muted hover:text-text-primary">
                    {r.kapitler.size > 15 ? "Se de 15 største kapitlene" : "Se kapitlene"}
                  </summary>
                  <ul className="mt-2 space-y-1 pl-4 text-[13.5px]">
                    {[...r.kapitler.entries()]
                      .sort((a, b) => b[1].verdi - a[1].verdi)
                      .slice(0, 15)
                      .map(([kap, k]) => (
                        <li key={kap} className="flex justify-between gap-4 text-text-secondary">
                          <span>
                            {k.navn} <span className="text-text-muted">(kap. {kap})</span>
                          </span>
                          <span className="whitespace-nowrap tabular-nums">{kr(k.verdi)}</span>
                        </li>
                      ))}
                  </ul>
                </details>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
