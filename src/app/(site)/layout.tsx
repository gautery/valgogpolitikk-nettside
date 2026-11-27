import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { lesInnstillinger } from "@/lib/sider";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <a
        href="#innhold"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-white focus:px-4 focus:py-3 focus:text-[14px] focus:font-semibold focus:text-text-primary focus:shadow-lg focus:outline-2 focus:outline-accent"
      >
        Hopp til innholdet
      </a>
      <Header meny={lesInnstillinger().meny} />
      <main id="innhold" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <Footer />
    </>
  );
}
