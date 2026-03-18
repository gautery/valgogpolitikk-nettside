export interface PostSource {
  name: string;
  url?: string;
}

export interface PostFrontmatter {
  title: string;
  slug: string;
  date: string;
  category: string;
  tags: string[];
  accentColor: string;
  summary: string;
  sources: PostSource[];
  image?: string;
  draft?: boolean;
}

export interface Post extends PostFrontmatter {
  content: string;
  readTime: string;
}

export interface Category {
  id: string;
  label: string;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  { id: "all", label: "Alle innlegg", emoji: "\u{1F4CA}" },
  { id: "skatt", label: "Skatt & avgifter", emoji: "\u{1F4B0}" },
  { id: "arbeid", label: "Arbeid & sysselsetting", emoji: "\u{1F477}" },
  { id: "ulikhet", label: "Ulikhet & mobilitet", emoji: "\u{1F4C8}" },
  { id: "velferd", label: "Velferd & privatisering", emoji: "\u{1F3E5}" },
  { id: "sammenligning", label: "Internasjonalt", emoji: "\u{1F30D}" },
  { id: "faktasjekk", label: "Faktasjekk", emoji: "\u{1F50D}" },
];
