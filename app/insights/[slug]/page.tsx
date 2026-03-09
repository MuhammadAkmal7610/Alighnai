import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import posts from "@/data/posts.json";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function InsightPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <>
      <section className="bg-navy pt-32 pb-16">
        <div className="container-main">
          <Link
            href="/insights"
            className="text-sm text-light-slate transition-colors hover:text-white"
          >
            &larr; All Insights
          </Link>
          <h1 className="mt-6 max-w-3xl text-3xl text-white md:text-4xl">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-4">
            <span className="rounded-btn bg-deep-blue px-3 py-1 text-xs font-medium text-light-slate">
              {post.tag}
            </span>
            <time dateTime={post.date} className="text-sm text-slate">
              {new Date(post.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      <section className="bg-white py-16">
        <article className="container-main">
          <div className="mx-auto max-w-prose">
            {post.content.split("\n\n").map((paragraph, idx) => {
              if (paragraph.startsWith("**") && paragraph.endsWith("**")) {
                const text = paragraph.replace(/\*\*/g, "");
                return (
                  <h3 key={idx} className="mt-8 mb-3 font-semibold text-navy">
                    {text}
                  </h3>
                );
              }
              if (paragraph.startsWith("**")) {
                const parts = paragraph.split("**");
                return (
                  <p key={idx} className="mt-4 leading-body text-slate">
                    <strong className="text-navy">{parts[1]}</strong>
                    {parts[2]}
                  </p>
                );
              }
              if (/^\d+\./.test(paragraph)) {
                const items = paragraph.split("\n").filter(Boolean);
                return (
                  <ol
                    key={idx}
                    className="mt-4 list-decimal space-y-1 pl-6 text-slate"
                  >
                    {items.map((item, i) => (
                      <li key={i}>{item.replace(/^\d+\.\s*/, "")}</li>
                    ))}
                  </ol>
                );
              }
              return (
                <p key={idx} className="mt-4 leading-body text-slate">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </article>
      </section>

      <div className="section-divider" />

      <CTASection />
    </>
  );
}
