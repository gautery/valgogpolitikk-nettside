"use client";

import { useState } from "react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.ok) {
        setStatus("success");
      } else {
        setErrorMsg(data.error || "Noe gikk galt.");
        setStatus("error");
      }
    } catch {
      setErrorMsg("Kunne ikke koble til serveren.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg border border-accent-green/30 bg-accent-green/5 p-5 text-center">
        <div className="mb-1 text-lg text-accent-green">&#10003;</div>
        <div className="text-[13px] font-semibold text-accent-green">Påmeldt!</div>
        <div className="mt-1 text-[11px] text-text-muted">
          Du får beskjed når nye analyser publiseres.
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg bg-accent p-5"
    >
      <div className="mb-1 text-[12px] font-semibold uppercase tracking-wider text-white/70">
        Nyhetsbrev
      </div>
      <div className="mb-4 text-[13px] leading-relaxed text-white/85">
        Få nye analyser rett i innboksen.
      </div>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="din@epost.no"
          className="min-w-0 flex-1 rounded-md border border-white/20 bg-white/10 px-3 py-2.5 text-[13px] text-white outline-none placeholder:text-white/40 focus:border-white/40 focus:bg-white/15"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="whitespace-nowrap rounded-md bg-white px-4 py-2.5 text-[13px] font-semibold text-accent transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === "loading" ? "..." : "Meld på"}
        </button>
      </div>
      {status === "error" && (
        <div className="mt-2 text-[11px] text-white/70">{errorMsg}</div>
      )}
    </form>
  );
}
