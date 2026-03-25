import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Articles and analysis on enterprise AI governance, compliance, risk management, and the AlignAI framework.",
};

export default function InsightsPage() {
  const latestPosts = [
    {
      slug: "why-ai-governance-matters-now",
      date: "2026-03-06",
      badge: "Featured",
      title: "The Governance Layer Nobody Built",
      excerpt:
        "Every major AI governance framework focuses on the model. NIST, ISO 42001, the EU AI Act - all of them. None of them govern where AI actually changes enterprise behaviour.",
    },
    {
      slug: "ai-governance-for-financial-services",
      date: "2026-03-08",
      badge: "Real Estate",
      title: "Your Yardi System Is Making Decisions. Who Owns Them?",
      excerpt:
        "If your organization runs Yardi, MRI, or a comparable property management platform, AI is already embedded in your operations. The governance question most organizations cannot yet answer.",
    },
    {
      slug: "decision-visibility-assessment-explained",
      date: "2026-03-01",
      badge: "",
      title: "The Decision Your AI Made This Morning",
      excerpt:
        "Before your first meeting today, AI had already made several decisions on your behalf. Not suggestions. Decisions. The question is whether you know which ones.",
    },
  ];

  const samplePost = {
    slug: "why-ai-governance-matters-now",
    title: "The Governance Layer Nobody Built",
    date: "2026-03-06",
    tag: "AI Governance",
    paragraphs: [
      "Every major AI governance framework in circulation focuses on the model. NIST AI RMF, ISO 42001, the EU AI Act, the proposed Canadian AIDA - all of them are fundamentally concerned with how models are built, trained, documented, and audited.",
      "That is not the wrong thing to govern. But it is not where AI is actually changing enterprise behaviour.",
    ],
  };

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
            {latestPosts.map((post, index) => (
              <article
                key={post.slug}
                className={`p-5 ${
                  index === 0
                    ? "border-t-2 border-t-cyan"
                    : "border-t-2 border-t-transparent border-l border-l-[#e4e8f1]"
                }`}
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-slate">
                  {formatDate(post.date)}
                  {post.badge && (
                    <span className="ml-2 rounded-btn bg-[#d9e7f8] px-1.5 py-0.5 text-[10px] font-semibold text-mid-blue">
                      {post.badge}
                    </span>
                  )}
                </p>
                <h2 className="mt-3 text-2xl font-semibold leading-tight text-navy">
                  {post.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate">{post.excerpt}</p>
                <Link
                  href={`/insights/${post.slug}`}
                  className="mt-5 inline-block text-sm font-semibold text-mid-blue hover:text-deep-blue"
                >
                  Read on LinkedIn →
                </Link>
              </article>
            ))}
          </div>

          <div className="mt-14 border-t border-light-slate pt-9">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-mid-blue">
              · Single Post Template (Sample Layout)
            </p>

            <article className="mt-6 max-w-[760px]">
              <h2 className="text-3xl leading-tight text-navy md:text-4xl">{samplePost.title}</h2>
              <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                <span className="text-[#7b8392]">Brian Burke</span>
                <span className="text-[#7b8392]">•</span>
                <time dateTime={samplePost.date} className="text-[#7b8392]">
                  {formatDate(samplePost.date)}
                </time>
                <span className="rounded-btn bg-[#d9e7f8] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.05em] text-mid-blue">
                  {samplePost.tag}
                </span>
              </div>
              <div className="mt-7 border-t border-[#cfd7e6] pt-7">
                {samplePost.paragraphs.map((paragraph, index) => (
                    <p key={`${samplePost.slug}-${index}-${paragraph.slice(0, 24)}`} className="mb-4 text-[15px] leading-[1.72] text-[#6f7785]">
                      {paragraph}
                    </p>
                  ))}
                <Link
                  href={`/insights/${samplePost.slug}`}
                  className="text-[15px] font-semibold text-mid-blue hover:text-deep-blue"
                >
                  † Full post content continues here. This demonstrates the single
                  post template layout.
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>
        <CTASection />
    </>
  );
}
