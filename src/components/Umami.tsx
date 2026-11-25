import Script from "next/script";

// Besøksstatistikk fra Umami Cloud (cloud.umami.is). Bruker ikke informasjonskapsler.
// Lim inn «Website ID» fra Umami her (Settings → Websites → Edit). ID-en er ikke hemmelig:
// den står synlig i kildekoden til alle nettsider som bruker Umami.
// Så lenge feltet er tomt, lastes ingenting.
const UMAMI_WEBSITE_ID = "560c4faf-5541-4442-863c-c896fad6d76c";

export default function Umami() {
  if (!UMAMI_WEBSITE_ID) return null;
  return (
    <Script
      src="https://cloud.umami.is/script.js"
      data-website-id={UMAMI_WEBSITE_ID}
      // Telles bare på det ekte domenet, ikke på demoadressen eller forhåndsvisninger.
      data-domains="valgogpolitikk.no,www.valgogpolitikk.no"
      strategy="afterInteractive"
    />
  );
}
