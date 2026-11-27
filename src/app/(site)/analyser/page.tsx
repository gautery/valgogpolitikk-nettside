import type { Metadata } from "next";
import PostList from "@/components/PostList";
import { getAllPosts } from "@/lib/posts";
import { lesInnstillinger } from "@/lib/sider";
import { SKJULT_FOR_SOK } from "@/lib/utkast";

// Alle analysene, med søk, temavelger og sortering.
// Innleggene er eksempler fra prototypen. Siden står ikke i menyen og er skjult for søkemotorer
// til Gaute har lagt inn egne tekster.

export const metadata: Metadata = {
  title: "Analyser — valg og politikk",
  description: "Alle analysene fra valgogpolitikk, med søk og tema. Kilden står under hvert tall.",
  robots: SKJULT_FOR_SOK,
};

export default function Analyser() {
  return <PostList posts={getAllPosts()} om={lesInnstillinger().om} hovedoverskrift />;
}
