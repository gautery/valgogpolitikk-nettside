"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Lenke } from "@/lib/sider";
import { lenkeUtSporing } from "@/lib/hendelser";

function MenyLenke({ lenke, className }: { lenke: Lenke; className: string }) {
  const href = lenke.lenke || "/";
  return /^https?:\/\//.test(href) ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...lenkeUtSporing(href)}>
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
    <header className="sticky top-0 z-50 border-b border-black bg-white">
      <div className="mx-auto flex h-16 max-w-[1100px] items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <Image src="/bilder/logo.png" alt="" width={36} height={36} className="rounded-[6px]" priority />
          <span className="font-display text-[19px] text-text-primary">valg og politikk</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {meny.map((m) => (
            <MenyLenke
              key={m.tekst}
              lenke={m}
              className="text-[15px] font-semibold text-text-primary underline-offset-4 hover:underline"
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
