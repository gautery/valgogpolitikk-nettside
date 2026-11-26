// Konfetti som faller når siden åpnes. Ren CSS, uten skript.
// Bitene er pynt og skjules for skjermlesere. De vises ikke for dem som har
// bedt om mindre bevegelse (se .konfetti i globals.css).

const FARGER = ["#000000", "#ffffff", "#e4007c", "#ff65c5", "#f5c542"];

// Faste «tilfeldige» tall, slik at siden blir lik hver gang den bygges.
function tall(i: number, salt: number) {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export default function Konfetti({ antall = 44, stor = false }: { antall?: number; stor?: boolean }) {
  return (
    <div className={`konfetti ${stor ? "konfetti-stor" : ""}`} aria-hidden="true">
      {Array.from({ length: antall }, (_, i) => {
        const bredde = (stor ? 9 : 7) + Math.round(tall(i, 1) * (stor ? 9 : 6));
        return (
          <span
            key={i}
            style={{
              left: `${(tall(i, 2) * 100).toFixed(1)}%`,
              width: bredde,
              height: Math.round(bredde * (0.4 + tall(i, 3) * 0.9)),
              background: FARGER[i % (stor ? FARGER.length : 3)],
              borderRadius: i % 4 === 0 ? "50%" : 0,
              animationDuration: `${((stor ? 3.2 : 2.6) + tall(i, 4) * (stor ? 3.4 : 2.2)).toFixed(2)}s`,
              animationDelay: `${(tall(i, 5) * (stor ? 3.2 : 1.3)).toFixed(2)}s`,
              ["--sving" as string]: `${Math.round((tall(i, 6) - 0.5) * (stor ? 320 : 160))}px`,
              ["--snurr" as string]: `${Math.round(360 + tall(i, 7) * 1080)}deg`,
            }}
          />
        );
      })}
    </div>
  );
}
