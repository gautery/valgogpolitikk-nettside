import BookSpines from "./BookSpines";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface px-6 py-12">
      <div className="mx-auto max-w-[1100px]">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center gap-3">
              <BookSpines className="h-6 w-auto opacity-60" />
              <div className="h-4 w-px bg-border" />
              <span className="text-sm font-bold text-text-primary">valg og politikk</span>
            </div>
            <p className="max-w-xs text-xs leading-relaxed text-text-muted">
              Datadrevet analyse av norsk politikk. Posisjonert til venstre,
              men alltid med kilder.
            </p>
          </div>

          {/* Links */}
          <div className="flex gap-12">
            <div>
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Følg oss
              </div>
              <div className="flex flex-col gap-2">
                <a href="https://instagram.com/valgogpolitikk" target="_blank" rel="noopener noreferrer" className="text-xs text-text-secondary hover:text-accent transition-colors">Instagram</a>
                <a href="https://tiktok.com/@valgogpolitikk" target="_blank" rel="noopener noreferrer" className="text-xs text-text-secondary hover:text-accent transition-colors">TikTok</a>
              </div>
            </div>
            <div>
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                Kilder
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-xs text-text-secondary">OECD</span>
                <span className="text-xs text-text-secondary">SSB</span>
                <span className="text-xs text-text-secondary">Eurostat</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-[11px] text-text-faint">
          Alle analyser basert på offentlig tilgjengelig data. Ikke finansiell eller juridisk rådgivning.
        </div>
      </div>
    </footer>
  );
}
