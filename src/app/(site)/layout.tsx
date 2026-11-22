import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TestBanner from "@/components/TestBanner";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <TestBanner />
      <Header />
      {children}
      <Footer />
    </>
  );
}
