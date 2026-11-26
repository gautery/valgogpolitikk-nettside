// Fyrverkeri på feiringssiden. Ren CSS: en rakett stiger opp og sprekker i
// en sky av gnister. Pynt, skjult for skjermlesere, og vises ikke for dem
// som har bedt om mindre bevegelse (se .fyrverkeri i globals.css).

const FARGER = ["#ff65c5", "#f5c542", "#ffffff", "#e4007c", "#7fe0ff"];

function tall(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export default function Fyrverkeri({ runde = 0, antall = 7 }: { runde?: number; antall?: number }) {
  return (
    <div className="fyrverkeri" aria-hidden="true">
      {Array.from({ length: antall }, (_, s) => {
        const n = runde * 31 + s;
        const x = 6 + tall(n, 1) * 88;
        const y = 8 + tall(n, 2) * 50;
        const start = s * 0.38 + tall(n, 3) * 0.3;
        const farge = FARGER[(s + runde) % FARGER.length];
        const farge2 = FARGER[(s + runde + 1) % FARGER.length];
        // Noen smell er store og blir hengende lenger, resten er små og raske.
        const stor = s % 3 === 0;
        const radius = stor ? 270 + tall(n, 4) * 150 : 120 + tall(n, 4) * 130;
        const gnister = stor ? 90 : 46;
        return (
          <div key={s} className={stor ? "smell smell-stor" : "smell"} style={{ left: `${x.toFixed(1)}%`, top: `${y.toFixed(1)}%` }}>
            <i className="rakett" style={{ background: farge, animationDelay: `${start.toFixed(2)}s` }} />
            {Array.from({ length: gnister }, (_, g) => {
              // Ujevn vinkel og lengde, så smellet blir en sky av gnister og ikke en ring.
              const vinkel = (g / gnister) * Math.PI * 2 + tall(n * 50 + g, 5) * 0.5;
              const r = radius * (0.2 + tall(n * 50 + g, 8) * 0.8);
              return (
                <span
                  key={g}
                  style={{
                    background: g % 3 === 0 ? farge2 : farge,
                    color: g % 3 === 0 ? farge2 : farge,
                    animationDelay: `${(start + 0.6).toFixed(2)}s`,
                    animationDuration: `${(stor ? 2.4 + tall(n * 50 + g, 9) * 1.2 : 0.8 + tall(n * 50 + g, 9) * 0.6).toFixed(2)}s`,
                    ["--dx" as string]: `${Math.round(Math.cos(vinkel) * r)}px`,
                    ["--dy" as string]: `${Math.round(Math.sin(vinkel) * r)}px`,
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
