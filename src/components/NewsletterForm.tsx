"use client";

import { useState } from "react";
import { sporHendelse } from "@/lib/hendelser";

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
        sporHendelse("nyhetsbrev-pamelding");
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
      className="rounded-[10px] bg-rosa p-5"
    >
      <div className="mb-1 text-[17px] font-extrabold text-black">
        Nyhetsbrev
      </div>
      <div className="mb-4 text-[14px] leading-relaxed text-black">
        Få nye analyser rett i innboksen.
      </div>
      <div className="flex gap-2">
        <input
          type="email"
          aria-label="E-postadresse"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="din@epost.no"
          className="min-w-0 flex-1 rounded-md border border-hero/25 bg-white px-3 py-2.5 text-[13px] text-hero outline-none placeholder:text-text-muted focus:border-hero focus-visible:outline-2 focus-visible:outline-hero"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="whitespace-nowrap rounded-md bg-black px-4 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === "loading" ? "..." : "Meld på"}
        </button>
      </div>
      {status === "error" && (
        <div className="mt-2 text-[11px] text-hero">{errorMsg}</div>
      )}
    </form>
  );
}
