import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import Link from "next/link";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";
import { mdxComponents } from "@/components/MdxComponents";
import { CATEGORIES } from "@/types/post";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: `${post.title} — valg og politikk`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      type: "article",
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.content,
    components: mdxComponents,
  });

  const category = CATEGORIES.find((c) => c.id === post.category);

  return (
    <>
      {/* Article header */}
      <div className="border-b border-border bg-surface px-6 py-12 md:py-16">
        <div className="mx-auto max-w-[740px]">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-1 text-[12px] font-medium text-text-muted hover:text-text-primary transition-colors"
          >
            ← Tilbake til alle analyser
          </Link>

          {/* Meta */}
          <div className="mb-4 flex flex-wrap items-center gap-2 text-[12px]">
            <span
              className="rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
              style={{ background: post.accentColor }}
            >
              {category?.label}
            </span>
            <span className="text-text-muted">{formatDate(post.date)}</span>
            <span className="text-text-faint">·</span>
            <span className="text-text-muted">{post.readTime}</span>
          </div>

          {/* Title */}
          <h1 className="mb-5 font-[family-name:var(--font-playfair)] text-3xl font-bold leading-tight text-text-primary sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
            {post.title}
          </h1>

          {/* Summary */}
          <p className="text-[16px] leading-relaxed text-text-secondary">
            {post.summary}
          </p>
        </div>
      </div>

      {/* Article body */}
      <article className="mx-auto max-w-[740px] px-6 py-10">
        <div>{content}</div>

        {/* Sources */}
        {post.sources && post.sources.length > 0 && (
          <div className="mt-12 rounded-md border border-border bg-surface p-6">
            <div className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
              Kilder
            </div>
            {post.sources.map((s, i) => (
              <div key={i} className="text-[13px] leading-relaxed text-text-secondary">
                {s.url ? (
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:text-text-primary"
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
        <div className="mt-6 flex flex-wrap gap-1.5">
          {post.tags.map((t, i) => (
            <span
              key={i}
              className="rounded-full border border-border bg-surface px-3 py-1 text-[11px] font-medium text-text-secondary"
            >
              {t}
            </span>
          ))}
        </div>
      </article>
    </>
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
