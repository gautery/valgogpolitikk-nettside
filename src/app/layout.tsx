import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Umami from "@/components/Umami";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  // Gjør adressene til delingsbilder o.l. fullstendige (https://www.valgogpolitikk.no/...).
  metadataBase: new URL("https://www.valgogpolitikk.no"),
  title: "valg og politikk — Tall. Kilder. Analyse.",
  description:
    "Datadrevet analyse av norsk politikk. Skatt, arbeid, ulikhet og velferd med OECD, SSB og Eurostat som kilde.",
  openGraph: {
    title: "valg og politikk",
    description:
      "Datadrevet analyse av norsk politikk med tall og kilder.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb" className={`${inter.variable} ${playfair.variable} antialiased`}>
      <body className="min-h-screen bg-background font-sans text-text-primary">
        {children}
        <Analytics />
        <Umami />
      </body>
    </html>
  );
}
