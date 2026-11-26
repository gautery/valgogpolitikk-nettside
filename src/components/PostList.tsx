"use client";

import { useState, useMemo } from "react";
import type { Post } from "@/types/post";
import { CATEGORIES } from "@/types/post";
import PostCard from "./PostCard";
import NewsletterForm from "./NewsletterForm";

interface PostListProps {
  posts: Post[];
  sidebarEkstra?: React.ReactNode;
  om?: { tittel: string; tekst: string };
  /** På /analyser er «Analyser» sidens hovedoverskrift. */
  hovedoverskrift?: boolean;
}

export default function PostList({ posts, sidebarEkstra, om, hovedoverskrift }: PostListProps) {
  const Tittel = hovedoverskrift ? "h1" : "h2";
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const ingressWords = 30;

  const filtered = useMemo(() => {
    let result = posts;
    if (activeCategory !== "all") {
      result = result.filter((p) => p.category === activeCategory);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.summary.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (sortBy === "oldest") {
      result = [...result].reverse();
    }
    return result;
  }, [posts, activeCategory, searchQuery, sortBy]);

  const categoryCount = (catId: string) =>
    posts.filter((p) => catId === "all" || p.category === catId).length;

  return (
    <div className="px-6 py-12">
    <div className="mx-auto flex max-w-[1100px] flex-col gap-12 lg:flex-row">
      {/* Sidebar */}
      <aside className="flex w-full flex-shrink-0 flex-col gap-6 lg:sticky lg:top-24 lg:w-[280px] lg:self-start">
        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Søk i innlegg …"
          aria-label="Søk i innlegg"
          className="w-full rounded-[6px] border border-black bg-white px-3.5 py-2.5 text-[15px] text-black outline-none placeholder:text-text-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        />

        {/* Categories */}
        <div>
          <h2 className="mb-2 text-[15px] font-extrabold">Tema</h2>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              aria-pressed={activeCategory === cat.id}
              className={`flex w-full items-center justify-between border-l-[3px] py-1.5 pl-3 pr-1 text-left text-[15px] ${
                activeCategory === cat.id
                  ? "border-black font-bold text-black"
                  : "border-transparent text-text-secondary hover:text-black"
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[11px] font-medium ${
                activeCategory === cat.id ? "text-black" : "text-text-muted"
              }`}>
                {categoryCount(cat.id)}
              </span>
            </button>
          ))}
        </div>

        {sidebarEkstra}

        {/* Sort */}
        <div>
          <h2 className="mb-2 text-[15px] font-extrabold">Rekkefølge</h2>
          <div className="flex gap-1.5">
            {(["newest", "oldest"] as const).map((val) => (
              <button
                key={val}
                onClick={() => setSortBy(val)}
                aria-pressed={sortBy === val}
                className={`flex-1 rounded-[6px] border border-black px-2.5 py-2 text-[14px] font-semibold ${
                  sortBy === val ? "bg-black text-white" : "bg-white text-black hover:bg-surface"
                }`}
              >
                {val === "newest" ? "Nyeste" : "Eldste"}
              </button>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <NewsletterForm />

        {/* About */}
        {om?.tekst && (
          <div className="border-t border-black pt-4">
            {om.tittel && (
              <h2 className="mb-2 text-[15px] font-extrabold">{om.tittel}</h2>
            )}
            <p className="m-0 text-[14px] leading-relaxed text-text-secondary">{om.tekst}</p>
          </div>
        )}
      </aside>

      {/* Post Feed */}
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="mb-6 flex items-baseline justify-between gap-4">
          <Tittel className="font-display text-[30px] leading-tight sm:text-[36px]">Analyser</Tittel>
          <p className="text-[14px] text-text-muted" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "analyse" : "analyser"}
            {activeCategory !== "all" && ` i ${CATEGORIES.find((c) => c.id === activeCategory)?.label}`}
          </p>
        </div>

        {filtered.map((post) => (
          <PostCard key={post.slug} post={post} ingressWords={ingressWords} />
        ))}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-text-muted">
            <div className="text-sm">Ingen innlegg funnet.</div>
            <div className="mt-1 text-xs text-text-muted">
              Prøv en annen kategori eller søkeord.
            </div>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
