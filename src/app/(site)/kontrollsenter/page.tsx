"use client";

import { useState } from "react";

const PASSORD = "valgogpolitikk2026";

export default function Kontrollsenter() {
  const [input, setInput] = useState("");
  const [autentisert, setAutentisert] = useState(false);

  if (!autentisert) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-sm flex-col items-center justify-center px-6">
        <h1 className="mb-6 font-[family-name:var(--font-playfair)] text-2xl font-bold">
          Kontrollsenter
        </h1>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input === PASSORD) setAutentisert(true);
          }}
          className="flex w-full flex-col gap-3"
        >
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Passord"
            className="rounded-md border border-border px-4 py-3 text-sm outline-none focus:border-accent"
          />
          <button
            type="submit"
            className="rounded-md bg-accent px-4 py-3 text-sm font-semibold text-white hover:opacity-90"
          >
            Logg inn
          </button>
          {input.length > 0 && input !== PASSORD && (
            <p className="text-center text-xs text-text-muted">
              Hint: sjekk kildekoden eller sp&oslash;r Claude
            </p>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[900px] px-6 py-10">
      <div className="mb-8">
        <h1 className="mb-2 font-[family-name:var(--font-playfair)] text-3xl font-bold">
          Kontrollsenter
        </h1>
        <p className="text-sm text-text-muted">
          Oversikt over nettsiden og bes&oslash;ksstatistikk
        </p>
      </div>

      {/* Analytics */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-border bg-white p-6">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Bes&oslash;ksstatistikk
          </div>
          <p className="mb-4 text-sm text-text-secondary">
            Vercel Analytics sporer automatisk sidevisninger, unike bes&oslash;kende,
            og hvilke sider som er mest popul&aelig;re.
          </p>
          <a
            href="https://vercel.com/gauterys-projects/valgogpolitikk-nettside/analytics"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md bg-accent px-4 py-2.5 text-[13px] font-semibold text-white hover:opacity-90"
          >
            &Aring;pne Vercel Analytics &rarr;
          </a>
        </div>

        <div className="rounded-lg border border-border bg-white p-6">
          <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Deployment
          </div>
          <p className="mb-4 text-sm text-text-secondary">
            Se status p&aring; siste deploy, byggetid, og eventuelle feil.
          </p>
          <a
            href="https://vercel.com/gauterys-projects/valgogpolitikk-nettside"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 rounded-md border border-border px-4 py-2.5 text-[13px] font-semibold text-text-primary hover:bg-surface"
          >
            &Aring;pne Vercel Dashboard &rarr;
          </a>
        </div>
      </div>

      {/* Site overview */}
      <div className="mb-8">
        <h2 className="mb-4 font-[family-name:var(--font-playfair)] text-xl font-bold">
          Sideoversikt
        </h2>
        <div className="overflow-hidden rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface text-left">
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Side
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  URL
                </th>
                <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <SideRad
                navn="Forside"
                url="/"
                status="live"
              />
              <SideRad
                navn="Norge har IKKE verdens h&oslash;yeste skatter"
                url="/innlegg/norge-har-ikke-verdens-hoyeste-skatter"
                status="live"
              />
              <SideRad
                navn="&laquo;Trygda Norge&raquo; er en myte"
                url="/innlegg/trygda-norge-er-en-myte"
                status="live"
              />
              <SideRad
                navn="Great Gatsby-kurven"
                url="/innlegg/great-gatsby-kurven"
                status="live"
              />
              <SideRad
                navn="Sverige pr&oslash;vde H&oslash;yres modell"
                url="/innlegg/sverige-provde-hoyres-modell"
                status="live"
              />
              <SideRad
                navn="Danmark vil innf&oslash;re formuesskatt"
                url="/innlegg/danmark-vil-innfore-formuesskatt"
                status="live"
              />
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="mb-4 font-[family-name:var(--font-playfair)] text-xl font-bold">
          Hurtiglenker
        </h2>
        <div className="flex flex-wrap gap-3">
          <a
            href="https://github.com/gautery/valgogpolitikk-nettside"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-border px-4 py-2.5 text-[13px] font-medium text-text-secondary hover:bg-surface"
          >
            GitHub-repo
          </a>
          <a
            href="https://instagram.com/valgogpolitikk"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-border px-4 py-2.5 text-[13px] font-medium text-text-secondary hover:bg-surface"
          >
            Instagram
          </a>
          <a
            href="https://tiktok.com/@valgogpolitikk"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-border px-4 py-2.5 text-[13px] font-medium text-text-secondary hover:bg-surface"
          >
            TikTok
          </a>
        </div>
      </div>
    </div>
  );
}

function SideRad({
  navn,
  url,
  status,
}: {
  navn: string;
  url: string;
  status: "live" | "utkast";
}) {
  return (
    <tr className="border-t border-border">
      <td className="px-4 py-3 font-medium text-text-primary">{navn}</td>
      <td className="px-4 py-3">
        <a
          href={`https://valgogpolitikk-nettside.vercel.app${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline"
        >
          {url}
        </a>
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-semibold ${
            status === "live"
              ? "bg-accent-green/10 text-accent-green"
              : "bg-accent-orange/10 text-accent-orange"
          }`}
        >
          {status === "live" ? "Live" : "Utkast"}
        </span>
      </td>
    </tr>
  );
}
