"use client";

import { useState, useMemo } from "react";
import type { Post } from "@/types/post";
import { CATEGORIES } from "@/types/post";
import PostCard from "./PostCard";
import NewsletterForm from "./NewsletterForm";

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [ingressWords, setIngressWords] = useState(30);

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
    <div className="mx-auto flex max-w-[1100px] flex-col gap-10 px-6 py-10 lg:flex-row">
      {/* Sidebar */}
      <aside className="flex w-full flex-shrink-0 flex-col gap-6 lg:sticky lg:top-24 lg:w-[280px] lg:self-start">
        {/* Search */}
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Søk i innlegg …"
          className="w-full rounded-md border border-border bg-white px-3.5 py-2.5 text-[13px] text-text-primary outline-none placeholder:text-text-faint focus:border-text-muted focus:ring-1 focus:ring-text-muted/20"
        />

        {/* Categories */}
        <div>
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Kategorier
          </div>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex w-full items-center justify-between rounded-md px-3 py-2 text-left text-[13px] transition-colors ${
                activeCategory === cat.id
                  ? "bg-accent text-white font-medium"
                  : "text-text-secondary hover:bg-surface"
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[11px] font-medium ${
                activeCategory === cat.id ? "text-white/60" : "text-text-faint"
              }`}>
                {categoryCount(cat.id)}
              </span>
            </button>
          ))}
        </div>

        {/* Sort */}
        <div>
          <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
            Sortering
          </div>
          <div className="flex gap-1.5">
            {(["newest", "oldest"] as const).map((val) => (
              <button
                key={val}
                onClick={() => setSortBy(val)}
                className={`flex-1 rounded-md border px-2.5 py-1.5 text-[12px] font-medium transition-colors ${
                  sortBy === val
                    ? "border-accent bg-accent text-white"
                    : "border-border text-text-muted hover:border-text-muted"
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
        <div className="rounded-md border border-border bg-surface p-5">
          <div className="mb-2 text-[13px] font-semibold text-text-primary">
            Om @valgogpolitikk
          </div>
          <p className="m-0 text-[12px] leading-relaxed text-text-secondary">
            Datadrevet analyse av norsk politikk. Posisjonert til venstre, men
            alltid med kilder. Alt innhold basert på offentlig statistikk
            fra OECD, SSB, Eurostat og forskningslitteratur.
          </p>
        </div>
      </aside>

      {/* Post Feed */}
      <main className="flex min-w-0 flex-1 flex-col gap-5">
        <div className="mb-1 text-[12px] font-medium text-text-muted">
          {filtered.length} {filtered.length === 1 ? "analyse" : "analyser"}
          {activeCategory !== "all" &&
            ` i ${CATEGORIES.find((c) => c.id === activeCategory)?.label}`}
        </div>

        {filtered.map((post) => (
          <PostCard
            key={post.slug}
            post={post}
            expanded={expandedPost === post.slug}
            onToggle={() =>
              setExpandedPost(expandedPost === post.slug ? null : post.slug)
            }
            ingressWords={ingressWords}
          />
        ))}

        {filtered.length === 0 && (
          <div className="py-16 text-center text-text-muted">
            <div className="mb-3 text-3xl">🔍</div>
            <div className="text-sm">Ingen innlegg funnet.</div>
            <div className="mt-1 text-xs text-text-faint">
              Prøv en annen kategori eller søkeord.
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
