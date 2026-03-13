import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { getPosts, getFeaturedPosts } from "@/lib/posts";
import { BlogCard } from "@/components/BlogCard";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Articles and analysis on enterprise AI governance, compliance, risk management, and the AlignAI framework.",
};

export default async function InsightsPage() {
  const posts = await getPosts();
  const featuredPosts = await getFeaturedPosts();

  const formatDate = (value: string) =>
    new Date(value)
      .toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
      .toUpperCase();

  return (
    <>
      <section className="hero-panel pt-32 pb-20 md:pb-24">
        <div className="container-main">
          <p className="hero-kicker">Thought Leadership</p>
          <h1 className="mt-6 max-w-3xl text-4xl leading-[1.08] text-white md:text-6xl">
            AI governance thinking.
            <span className="block text-cyan">Grounded in research.</span>
          </h1>
          <p className="mt-7 max-w-prose text-sm leading-relaxed text-light-slate">
            Perspectives on the governance gap, regulatory exposure, and what
            enterprise AI accountability actually requires.
          </p>
        </div>
      </section>

      <div className="section-divider" />

      <section className="bg-off-white py-20">
        <div className="container-main">
          <p className="hero-kicker text-mid-blue">Latest Posts</p>

          <div className="mt-7 grid gap-0 border border-[#d9deea] bg-white md:grid-cols-3">
            {featuredPosts.map((post, index) => (
              <article
                key={post._id}
                className={`p-5 ${
                  index === 0
                    ? "border-t-2 border-t-cyan"
                    : "border-t-2 border-t-transparent border-l border-l-[#e4e8f1]"
                }`}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-slate">
                  {formatDate(post.publishedAt)}
                  {post.featured && (
                    <span className="ml-2 rounded-btn bg-[#d9e7f8] px-1.5 py-0.5 text-[10px] font-semibold text-mid-blue">
                      Featured
                    </span>
                  )}
                </p>
                <h2 className="mt-3 text-2xl font-semibold leading-tight text-navy">
                  {post.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate">{post.excerpt}</p>
                <Link
                  href={`/insights/${post.slug.current}`}
                  className="mt-5 inline-block text-sm font-semibold text-mid-blue hover:text-deep-blue"
                >
                  Read more →
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-14 border-t border-light-slate pt-9">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-mid-blue">
              · All Posts
            </p>

            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard
                  key={post._id}
                  title={post.title}
                  date={post.publishedAt}
                  tag={post.categories[0]?.title || "Insights"}
                  excerpt={post.excerpt}
                  slug={post.slug.current}
                  featured={post.featured}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
        <CTASection />
    </>
  );
}
