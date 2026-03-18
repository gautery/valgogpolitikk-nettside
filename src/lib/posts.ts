import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import type { Post, PostFrontmatter } from "@/types/post";

const CONTENT_DIR = path.join(process.cwd(), "content", "innlegg");

export function getAllPosts(): Post[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files
    .map((filename) => {
      const filePath = path.join(CONTENT_DIR, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(fileContent);
      const frontmatter = data as PostFrontmatter;

      if (frontmatter.draft) return null;

      return {
        ...frontmatter,
        slug: frontmatter.slug || filename.replace(/\.mdx$/, ""),
        content,
        readTime: readingTime(content).text.replace("read", "lesing"),
      } as Post;
    })
    .filter((p): p is Post => p !== null);

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getPostBySlug(slug: string): Post | null {
  const posts = getAllPosts();
  return posts.find((p) => p.slug === slug) || null;
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}
