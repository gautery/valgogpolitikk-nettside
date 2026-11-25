"use client";

import { useEffect, useRef, useState } from "react";

// Viser en graf fra Datawrapper. Gaute limer inn lenken til grafen i Pages CMS.
// Vi henter alltid siste publiserte versjon, så grafen oppdateres på nettsiden
// når den endres og publiseres på nytt i Datawrapper.

export default function DatawrapperGraf({ id, tittel }: { id: string; tittel: string }) {
  const ramme = useRef<HTMLIFrameElement>(null);
  const [hoyde, setHoyde] = useState(400);

  // Datawrapper sender høyden på grafen, slik at rammen passer på mobil og PC.
  useEffect(() => {
    function mottak(e: MessageEvent) {
      if (e.source !== ramme.current?.contentWindow) return;
      const h = e.data?.["datawrapper-height"]?.[id];
      if (typeof h === "number" && h > 0) setHoyde(h);
    }
    window.addEventListener("message", mottak);
    return () => window.removeEventListener("message", mottak);
  }, [id]);

  return (
    <iframe
      ref={ramme}
      title={tittel}
      aria-label={tittel}
      src={`https://datawrapper.dwcdn.net/${id}/`}
      scrolling="no"
      loading="lazy"
      className="block w-full min-w-full border-0"
      style={{ height: hoyde }}
    />
  );
}
