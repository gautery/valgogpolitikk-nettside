import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TestBanner from "@/components/TestBanner";

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
    <html lang="no" className={`${inter.variable} ${playfair.variable} antialiased`}>
      <body className="min-h-screen bg-background font-sans text-text-primary">
        <TestBanner />
        <Header />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
