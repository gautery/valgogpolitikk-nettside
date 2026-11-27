import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import Link from "next/link";
import { getAllSlugs, getPostBySlug } from "@/lib/posts";
import { mdxComponents } from "@/components/MdxComponents";
import { CATEGORIES } from "@/types/post";
import type { Metadata } from "next";
import { SKJULT_FOR_SOK } from "@/lib/utkast";

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
    // Eksempelinnlegg fra prototypen: skjult for søkemotorer til Gaute har lagt inn egne tekster.
    robots: SKJULT_FOR_SOK,
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
      <div className="border-b border-black px-6 py-12 md:py-16">
        <div className="mx-auto max-w-[740px]">
          <Link
            href="/analyser"
            className="mb-8 inline-block text-[15px] font-semibold text-black underline underline-offset-4 hover:text-accent-dark"
          >
            Alle analyser
          </Link>

          <p className="mb-4 text-[15px] text-text-muted">
            <span className="font-semibold text-black">{category?.label}</span>, {formatDate(post.date)}, {post.readTime}
          </p>

          <h1 className="mb-6 font-display text-[38px] leading-[1.05] text-black sm:text-[48px]">{post.title}</h1>

          <p className="text-[19px] leading-[1.55] text-text-secondary">{post.summary}</p>
        </div>
      </div>

      {/* Article body */}
      <article className="mx-auto max-w-[740px] px-6 py-10">
        <div>{content}</div>

        {/* Sources */}
        {post.sources && post.sources.length > 0 && (
          <div className="mt-12 border-t border-black pt-6">
            <div className="mb-3 text-[11px] font-semibold text-text-muted">
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
              className="rounded-[6px] bg-surface px-3 py-1 text-[13px] font-medium text-text-secondary"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-12 border-t border-black pt-6">
          <Link
            href="/analyser"
            className="inline-block rounded-[6px] bg-black px-6 py-3.5 text-[16px] font-semibold text-white hover:bg-text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Se flere analyser
          </Link>
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
