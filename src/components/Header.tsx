"use client";

import { useState } from "react";
import Link from "next/link";
import BookSpines from "./BookSpines";

export default function Header() {
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
          <Link
            href="/"
            className="text-[13px] font-medium text-text-secondary hover:text-accent transition-colors"
          >
            Analyser
          </Link>
          <a
            href="https://instagram.com/valgogpolitikk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-medium text-text-secondary hover:text-accent transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://tiktok.com/@valgogpolitikk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[13px] font-medium text-text-secondary hover:text-accent transition-colors"
          >
            TikTok
          </a>
        </nav>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex h-9 w-9 items-center justify-center rounded-md text-text-secondary md:hidden"
          aria-label="Meny"
        >
          {menuOpen ? "\u2715" : "\u2630"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="border-t border-border px-6 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <Link href="/" className="text-sm text-text-secondary">
              Analyser
            </Link>
            <a
              href="https://instagram.com/valgogpolitikk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-secondary"
            >
              Instagram
            </a>
            <a
              href="https://tiktok.com/@valgogpolitikk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-secondary"
            >
              TikTok
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
