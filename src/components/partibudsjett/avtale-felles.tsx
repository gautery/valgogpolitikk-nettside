// Felles for budsjettavtalen: typene, hvem som vant en sak, og merkene i tavla.
// Brukes av siden (Avtale.tsx) og av hovedsaken på forsiden (Klosser.tsx).

export type Utfall = "fikk det" | "fikk noe" | "fikk ikke";
export type Krav = { parti: string; krav: string; utfall: Utfall };
export type AvtaleSak = { tittel: string; avtalen: string; regjeringen: string; krav: Krav[] };

export const REKKEFOLGE = ["Sp", "SV", "Rødt"];
export const KOLONNER = "grid grid-cols-[minmax(0,1fr)_repeat(3,38px)] items-center";
const liste = (a: string[]) => a.join(", ").replace(/, ([^,]*)$/, " og $1");

// Hvem vant saken: Ap når avtalen lar regjeringens forslag stå, ellers partiene som fikk noe.
export function vinner(s: AvtaleSak): { ap: boolean; tekst: string } {
  const med = (u: Utfall) =>
    s.krav.filter((k) => k.utfall === u).map((k) => k.parti).sort((a, b) => REKKEFOLGE.indexOf(a) - REKKEFOLGE.indexOf(b));
  const fullt = med("fikk det");
  const noe = med("fikk noe");
  if (fullt.length + noe.length === 0) return { ap: true, tekst: "Ap fikk viljen sin" };
  const deler = [];
  if (fullt.length) deler.push(`${liste(fullt)} fikk fullt gjennomslag`);
  if (noe.length) deler.push(`${liste(noe)} fikk noe gjennomslag`);
  return { ap: false, tekst: deler.join(". ") };
}

// Merket i tavla: fylt sirkel = fikk det, halv = fikk noe, tom = fikk ikke, strek = ingen krav med.
export function Merke({ u }: { u?: Utfall }) {
  if (!u) return <span aria-hidden="true" className="block h-px w-2.5 bg-text-muted" />;
  return (
    <svg aria-hidden="true" viewBox="0 0 18 18" className="h-[18px] w-[18px]">
      {u === "fikk noe" && <path d="M9 2a7 7 0 0 0 0 14z" fill="#000" />}
      <circle
        cx="9"
        cy="9"
        r="7"
        fill={u === "fikk det" ? "#000" : "none"}
        stroke={u === "fikk ikke" ? "#5f5f5f" : "#000"}
        strokeWidth="1.5"
      />
    </svg>
  );
}

// Innholdet i én rad: saken og ett merke per parti. Raden selv (knapp eller vanlig linje) lager den som bruker den.
export function RadInnhold({ s }: { s: AvtaleSak }) {
  const utfall = (parti: string) => s.krav.find((k) => k.parti === parti)?.utfall;
  return (
    <>
      <span className="pr-3 text-[15px] font-semibold leading-snug text-black">
        {s.tittel}
        <span className="sr-only">. {vinner(s).tekst}.</span>
      </span>
      {REKKEFOLGE.map((p) => (
        <span key={p} className="flex justify-center">
          <Merke u={utfall(p)} />
          <span className="sr-only">
            {p}: {utfall(p) ?? "ingen krav med"}.
          </span>
        </span>
      ))}
    </>
  );
}

export function Tegnforklaring({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-x-5 gap-y-2 text-[13.5px] ${className}`}>
      <li className="flex items-center gap-1.5">
        <Merke u="fikk det" /> Fikk det
      </li>
      <li className="flex items-center gap-1.5">
        <Merke u="fikk noe" /> Fikk noe
      </li>
      <li className="flex items-center gap-1.5">
        <Merke u="fikk ikke" /> Fikk ikke
      </li>
      <li className="flex items-center gap-1.5">
        <span aria-hidden="true" className="h-[14px] w-[22px] bg-[#ffd1ee] outline outline-1 outline-border-light" /> Ap fikk viljen sin
      </li>
    </ul>
  );
}
