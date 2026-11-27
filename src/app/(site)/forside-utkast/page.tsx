import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Klosser from "@/components/klosser/Klosser";
import { lesForsideUtkast } from "@/lib/sider";
import { SKJULT_FOR_SOK } from "@/lib/utkast";

// Forslag til ny forside, satt sammen av de samme byggeklossene som forsiden.
// Innholdet ligger i content/forside-utkast.md. Godkjenner Gaute forslaget, flyttes
// seksjonene over i content/forside.md, og denne siden og filen slettes.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Utkast til ny forside — valg og politikk",
  robots: SKJULT_FOR_SOK,
};

export default function ForsideUtkast() {
  const side = lesForsideUtkast();
  if (!side) notFound();
  return (
    <>
      <div className="bg-amber-100 px-6 py-2 text-[14px] text-amber-900">
        <div className="mx-auto max-w-[1100px]">
          Utkast til ny forside.{" "}
          <Link href="/" className="font-semibold underline underline-offset-2">
            Se dagens forside
          </Link>
        </div>
      </div>
      <Klosser seksjoner={side.seksjoner} />
    </>
  );
}
