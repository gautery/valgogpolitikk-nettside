import Image from "next/image";
import { erEkstern, lesInnstillinger } from "@/lib/sider";

// Teksten i bunnen redigeres i Pages CMS under «Innstillinger».
export default function Footer() {
  const { bunntekst } = lesInnstillinger();

  return (
    <footer className="border-t border-black bg-white px-6 py-12">
      <div className="mx-auto max-w-[1100px]">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center gap-3">
              <Image src="/bilder/logo.png" alt="" width={32} height={32} className="rounded-[6px]" />
              <span className="font-display text-[17px] text-text-primary">valg og politikk</span>
            </div>
            {bunntekst.beskrivelse && (
              <p className="max-w-xs text-[14px] leading-relaxed text-text-muted">{bunntekst.beskrivelse}</p>
            )}
          </div>

          {/* Links */}
          {bunntekst.grupper.length > 0 && (
            <div className="flex gap-12">
              {bunntekst.grupper.map((g) => (
                <div key={g.overskrift}>
                  <div className="mb-3 text-[13px] font-semibold text-text-muted">
                    {g.overskrift}
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {g.lenker.map((l) =>
                      l.lenke ? (
                        <a
                          key={l.tekst}
                          href={l.lenke}
                          {...(erEkstern(l.lenke) ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                          className="text-[14px] text-text-primary underline-offset-4 hover:underline"
                        >
                          {l.tekst}
                        </a>
                      ) : (
                        <span key={l.tekst} className="text-[14px] text-text-secondary">
                          {l.tekst}
                        </span>
                      )
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {bunntekst.merknad && (
          <div className="mt-10 border-t border-border pt-6 text-[11px] text-text-muted">{bunntekst.merknad}</div>
        )}
      </div>
    </footer>
  );
}
