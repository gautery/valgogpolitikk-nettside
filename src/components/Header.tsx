"use client";

import { useState } from "react";
import Link from "next/link";
import BookSpines from "./BookSpines";
import type { Lenke } from "@/lib/sider";

function MenyLenke({ lenke, className }: { lenke: Lenke; className: string }) {
  const href = lenke.lenke || "/";
  return /^https?:\/\//.test(href) ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {lenke.tekst}
    </a>
  ) : (
    <Link href={href} className={className}>
      {lenke.tekst}
    </Link>
  );
}

export default function Header({ meny }: { meny: Lenke[] }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <BookSpines className="h-8 w-auto" />
          <div className="h-6 w-px bg-border" />
          <span className="text-[16px] font-bold tracking-tight text-text-primary">
            valg og politikk
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {meny.map((m) => (
            <MenyLenke
              key={m.tekst}
              lenke={m}
              className="text-[13px] font-medium text-text-secondary hover:text-accent transition-colors"
            />
          ))}
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-text-secondary md:hidden"
          aria-label="Meny"
          aria-expanded={menuOpen}
        >
          {menuOpen ? "\u2715" : "\u2630"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {meny.map((m) => (
              <MenyLenke key={m.tekst} lenke={m} className="text-sm text-text-secondary" />
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
