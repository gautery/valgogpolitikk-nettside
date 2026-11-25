import Link from "next/link";
import { CATEGORIES } from "@/types/post";
import type { Post } from "@/types/post";

// Ett innlegg i lista på forsiden: tittel, kort ingress og kildene. Ingen kort med
// ramme, bare en strek over, som en innholdsfortegnelse.

export default function PostCard({ post, ingressWords }: { post: Post; ingressWords: number }) {
  const ord = post.summary.split(" ");
  const ingress = ord.length > ingressWords ? ord.slice(0, ingressWords).join(" ") + " …" : post.summary;
  const kategori = CATEGORIES.find((c) => c.id === post.category);
  const kilder = (post.sources ?? []).map((s) => s.name).filter(Boolean);

  return (
    <article className="border-t border-black pt-5 pb-8">
      <p className="text-[14px] text-text-muted">
        <span className="font-semibold text-black">{kategori?.label}</span>, {formatDate(post.date)}
      </p>
      <h2 className="mt-2 font-display text-[28px] leading-[1.1] sm:text-[32px]">
        <Link
          href={`/innlegg/${post.slug}`}
          className="text-black underline-offset-[5px] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
        >
          {post.title}
        </Link>
      </h2>
      <p className="mt-3 max-w-[640px] text-[16.5px] leading-[1.65] text-text-secondary">{ingress}</p>
      {kilder.length > 0 && (
        <p className="mt-3 text-[13.5px] text-text-muted">
          <span className="font-semibold text-text-secondary">Kilder:</span> {kilder.slice(0, 3).join(", ")}
          {kilder.length > 3 ? ` og ${kilder.length - 3} til` : ""}
        </p>
      )}
    </article>
  );
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString("nb-NO", { day: "numeric", month: "long", year: "numeric" });
}
