import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { getPost, getPosts } from "@/lib/posts";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Fallback to mock data for static generation
  return [
    { slug: 'why-ai-governance-matters-now' },
    { slug: 'decision-visibility-assessment-explained' }
  ];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

export default async function InsightPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);
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
            {(post.categories || []).map((category) => (
              <span key={category.title} className="rounded-btn bg-deep-blue px-3 py-1 text-xs font-medium text-light-slate">
                {category.title}
              </span>
            ))}
            <time dateTime={post.publishedAt} className="text-sm text-slate">
              {new Date(post.publishedAt).toLocaleDateString("en-US", {
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
            <PortableText
              value={post.content}
              components={{
                block: {
                  h2: ({ children }) => (
                    <h2 className="mt-8 mb-4 text-2xl font-semibold text-navy">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="mt-6 mb-3 text-xl font-semibold text-navy">{children}</h3>
                  ),
                  normal: ({ children }) => (
                    <p className="mt-4 leading-relaxed text-slate">{children}</p>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="mt-4 border-l-4 border-cyan pl-4 italic text-slate">{children}</blockquote>
                  ),
                },
                list: {
                  bullet: ({ children }) => (
                    <ul className="mt-4 list-disc space-y-2 pl-6 text-slate">{children}</ul>
                  ),
                  number: ({ children }) => (
                    <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate">{children}</ol>
                  ),
                },
                marks: {
                  link: ({ children, value }) => (
                    <a
                      href={value.href}
                      className="text-mid-blue underline hover:text-deep-blue"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  strong: ({ children }) => (
                    <strong className="font-semibold text-navy">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic">{children}</em>
                  ),
                  code: ({ children }) => (
                    <code className="rounded bg-off-white px-1 py-0.5 text-sm font-mono text-navy">{children}</code>
                  ),
                },
              }}
            />
          </div>
        </article>
      </section>

      <div className="section-divider" />

      <CTASection />
    </>
  );
}
