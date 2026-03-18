import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import ClientChart from "./ClientChart";

function SourceList({
  sources,
}: {
  sources: Array<{ name: string; url?: string }>;
}) {
  return (
    <div className="mt-8 rounded-md border border-border bg-surface p-5">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-text-muted">
        Kilder
      </div>
      {sources.map((s, i) => (
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
  );
}

function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-md border-l-4 border-accent-blue bg-accent-blue/5 px-5 py-4 text-[14px] leading-relaxed text-text-secondary">
      {children}
    </div>
  );
}

export const mdxComponents: MDXComponents = {
  h1: (props) => (
    <h1
      className="mb-4 mt-10 font-[family-name:var(--font-playfair)] text-2xl font-bold text-text-primary"
      {...props}
    />
  ),
  h2: (props) => (
    <h2
      className="mb-3 mt-8 font-[family-name:var(--font-playfair)] text-xl font-bold text-text-primary"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mb-2 mt-6 text-lg font-semibold text-text-primary"
      {...props}
    />
  ),
  p: (props) => (
    <p className="mb-4 text-[15px] leading-[1.8] text-text-secondary" {...props} />
  ),
  a: (props) => (
    <a
      className="font-medium text-accent-blue underline decoration-accent-blue/30 underline-offset-2 hover:decoration-accent-blue"
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  ul: (props) => (
    <ul
      className="mb-4 ml-5 list-disc space-y-1.5 text-[15px] leading-[1.8] text-text-secondary"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mb-4 ml-5 list-decimal space-y-1.5 text-[15px] leading-[1.8] text-text-secondary"
      {...props}
    />
  ),
  blockquote: (props) => (
    <blockquote
      className="my-6 border-l-3 border-border-light pl-5 text-[15px] italic text-text-muted"
      {...props}
    />
  ),
  code: (props) => (
    <code
      className="rounded bg-surface px-1.5 py-0.5 text-[13px] text-accent-red"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="my-6 overflow-x-auto rounded-md border border-border bg-surface p-5 text-[13px]"
      {...props}
    />
  ),
  img: (props) => (
    <Image
      className="my-6 rounded-md"
      src={props.src || ""}
      alt={props.alt || ""}
      width={800}
      height={450}
      style={{ width: "100%", height: "auto" }}
    />
  ),
  table: (props) => (
    <div className="my-6 overflow-x-auto">
      <table
        className="w-full border-collapse text-[14px] text-text-secondary"
        {...props}
      />
    </div>
  ),
  th: (props) => (
    <th
      className="border border-border bg-surface px-4 py-2.5 text-left text-[12px] font-semibold uppercase tracking-wider text-text-muted"
      {...props}
    />
  ),
  td: (props) => (
    <td className="border border-border px-4 py-2.5 text-[13px]" {...props} />
  ),
  // Custom components
  Chart: ClientChart,
  SourceList,
  Callout,
};
