import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TestBanner from "@/components/TestBanner";
import { lesInnstillinger } from "@/lib/sider";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TestBanner />
      <Header meny={lesInnstillinger().meny} />
      {children}
      <Footer />
    </>
  );
}
