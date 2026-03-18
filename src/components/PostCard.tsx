"use client";

import Link from "next/link";
import { CATEGORIES } from "@/types/post";
import type { Post } from "@/types/post";

interface PostCardProps {
  post: Post;
  expanded: boolean;
  onToggle: () => void;
  ingressWords: number;
}

export default function PostCard({
  post,
  expanded,
  onToggle,
  ingressWords,
}: PostCardProps) {
  const words = post.summary.split(" ");
  const truncated =
    words.length > ingressWords
      ? words.slice(0, ingressWords).join(" ") + " \u2026"
      : post.summary;

  const category = CATEGORIES.find((c) => c.id === post.category);

  return (
    <article
      className="group cursor-pointer overflow-hidden rounded-lg border border-border bg-white transition-all hover:border-border-light hover:shadow-[0_4px_16px_rgba(0,0,0,0.05)]"
      onClick={onToggle}
    >
      <div className="p-6">
        {/* Meta */}
        <div className="mb-3 flex flex-wrap items-center gap-2.5 text-[12px]">
          <span
            className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
            style={{ background: post.accentColor }}
          >
            {category?.label}
          </span>
          <span className="text-text-muted">{formatDate(post.date)}</span>
          <span className="text-text-faint">&middot;</span>
          <span className="text-text-muted">{post.readTime}</span>
        </div>

        {/* Title */}
        <h2 className="mb-2.5 font-[family-name:var(--font-playfair)] text-[22px] font-bold leading-snug text-text-primary transition-colors group-hover:text-accent sm:text-[24px]">
          {post.title}
        </h2>

        {/* Summary */}
        <p className="text-[14px] leading-[1.7] text-text-secondary">
          {expanded ? post.summary : truncated}
        </p>

        {/* Expanded content */}
        {expanded && (
          <div className="mt-5 border-t border-border pt-5">
            {/* Sources */}
            {post.sources && post.sources.length > 0 && (
              <div className="mb-4 rounded-md bg-surface p-4">
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
                  Kilder
                </div>
                {post.sources.map((s, i) => (
                  <div
                    key={i}
                    className="text-[12px] leading-relaxed text-text-secondary"
                  >
                    {s.url ? (
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline decoration-text-faint underline-offset-2 hover:decoration-text-primary"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {s.name}
                      </a>
                    ) : (
                      s.name
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Tags */}
            <div className="mb-4 flex flex-wrap gap-1.5">
              {post.tags.map((t, i) => (
                <span
                  key={i}
                  className="rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium text-text-muted"
                >
                  {t}
                </span>
              ))}
            </div>

            {/* Read full post link */}
            <Link
              href={`/innlegg/${post.slug}`}
              className="inline-flex items-center gap-1 text-[13px] font-semibold text-accent hover:underline"
              onClick={(e) => e.stopPropagation()}
            >
              Les hele analysen &rarr;
            </Link>
          </div>
        )}

        {/* Toggle indicator */}
        {!expanded && (
          <div className="mt-3 text-[12px] font-medium text-accent">
            Les mer &darr;
          </div>
        )}
      </div>
    </article>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("nb-NO", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}
