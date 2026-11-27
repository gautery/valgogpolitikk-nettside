import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import Umami from "@/components/Umami";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  // Gjør adressene til delingsbilder o.l. fullstendige (https://www.valgogpolitikk.no/...).
  metadataBase: new URL("https://www.valgogpolitikk.no"),
  title: "valg og politikk — Norsk politikk med tall og kilder",
  description:
    "Analyser av norsk politikk, i hovedsak skatt, ulikhet og velferd. Jeg leser rapportene slik at du slipper.",
  openGraph: {
    title: "valg og politikk",
    description: "Norsk politikk med tall og kilder: skatt, ulikhet og velferd.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nb" className={`${inter.variable} antialiased`}>
      <body className="min-h-screen bg-background font-sans text-text-primary">
        {children}
        <Analytics />
        <Umami />
      </body>
    </html>
  );
}
