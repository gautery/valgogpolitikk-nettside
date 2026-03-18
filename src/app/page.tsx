import { getAllPosts } from "@/lib/posts";
import PostList from "@/components/PostList";
import BookSpines from "@/components/BookSpines";

export default function Home() {
  const posts = getAllPosts();

  return (
    <>
      {/* Hero */}
      <div className="border-b border-border bg-hero px-6 py-16 md:py-20">
        <div className="mx-auto max-w-[1100px]">
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <div className="h-4 w-1 rounded-full bg-accent" />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
                  @valgogpolitikk
                </span>
              </div>
              <h1 className="mb-4 max-w-[560px] font-[family-name:var(--font-playfair)] text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-[44px] lg:leading-[1.15]">
                Norsk politikk med tall og kilder
              </h1>
              <p className="max-w-[460px] text-[15px] leading-relaxed text-white/55">
                Datadrevne analyser av skatt, arbeid, ulikhet og velferd.
                Alt med OECD, SSB og Eurostat som kilde.
              </p>
            </div>
            {/* Book spines decoration */}
            <BookSpines className="hidden h-24 w-auto opacity-40 md:block" />
          </div>
        </div>
      </div>

      {/* Post listing with sidebar */}
      <PostList posts={posts} />
    </>
  );
}
