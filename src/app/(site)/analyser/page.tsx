import type { Metadata } from "next";
import PostList from "@/components/PostList";
import { getAllPosts } from "@/lib/posts";
import { lesInnstillinger } from "@/lib/sider";

// Alle analysene, med søk, temavelger og sortering.

export const metadata: Metadata = {
  title: "Analyser — valg og politikk",
  description: "Alle analysene fra valgogpolitikk, med søk og tema. Kilden står under hvert tall.",
};

export default function Analyser() {
  return <PostList posts={getAllPosts()} om={lesInnstillinger().om} hovedoverskrift />;
}
