import type { Metadata } from "next";
import BookSpines from "@/components/BookSpines";

export const metadata: Metadata = {
  title: "valg og politikk — kommer snart",
  description: "Norsk politikk med tall og kilder. Nettsiden kommer snart.",
  robots: { index: false, follow: false },
};

export default function KommerSnart() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-hero px-6 text-center">
      <BookSpines className="mb-8 h-16 w-auto" />
      <div className="mb-4 flex items-center gap-2">
        <div className="h-4 w-1 rounded-full bg-rosa" />
        <span className="text-[11px] font-semibold uppercase tracking-widest text-white/50">
          @valgogpolitikk
        </span>
      </div>
      <h1 className="mb-4 font-[family-name:var(--font-playfair)] text-4xl font-bold leading-tight text-white sm:text-5xl">
        Kommer snart
      </h1>
      <p className="mb-10 max-w-[420px] text-[15px] leading-relaxed text-white/70">
        Norsk politikk med tall og kilder.
      </p>
      <div className="flex gap-3">
        <a
          href="https://instagram.com/valgogpolitikk"
          className="rounded-md bg-accent px-5 py-3 text-[13px] font-semibold text-white hover:opacity-90"
        >
          Instagram
        </a>
        <a
          href="https://tiktok.com/@valgogpolitikk"
          className="rounded-md border border-white/30 px-5 py-3 text-[13px] font-semibold text-white hover:bg-white/10"
        >
          TikTok
        </a>
      </div>
    </main>
  );
}
