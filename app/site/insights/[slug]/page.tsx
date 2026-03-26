import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { notFound } from "next/navigation";
import { ModernCMS } from "@/lib/modern-cms";
import { ContentStatus } from "@/lib/cms-enums";
import { auth } from "@/auth";
import { getPublishedContentMetadata } from "@/lib/content-post-meta";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export async function generateStaticParams() {
  const posts = await ModernCMS.getContents({ status: ContentStatus.PUBLISHED });
  return posts.map((post: { slug: string }) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return getPublishedContentMetadata(slug, searchParams, {
    title: "Insights",
    description: "AlignAI insights and articles.",
  });
}

export default async function InsightPostPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = (await searchParams) ?? {};
  const pv = sp.preview;
  const preview =
    pv === "1" ||
    pv === "true" ||
    (Array.isArray(pv) && (pv[0] === "1" || pv[0] === "true"));
  if (preview) {
    const session = await auth();
    if (!session?.user?.id) notFound();
  }
  const post = await ModernCMS.getContentBySlug(slug, {
    publishedOnly: !preview,
  });
  if (!post) notFound();

  const formatDate = (value: string) =>
    new Date(value)
      .toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
      .toUpperCase();

  const formatContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
        const text = paragraph.replace(/\*\*/g, '');
        return (
          <h3 key={index} className="mt-8 mb-3 font-semibold text-navy">
            {text}
          </h3>
        );
      }
      if (paragraph.startsWith('**')) {
        const parts = paragraph.split('**');
        return (
          <p key={index} className="mt-4 leading-relaxed text-slate">
            <strong className="text-navy">{parts[1]}</strong>
            {parts[2]}
          </p>
        );
      }
      if (/^\d+\./.test(paragraph)) {
        const items = paragraph.split('\n').filter(Boolean);
        return (
          <ol
            key={index}
            className="mt-4 list-decimal space-y-1 pl-6 text-slate"
          >
            {items.map((item, i) => (
              <li key={i}>{item.replace(/^\d+\.\s*/, '')}</li>
            ))}
          </ol>
        );
      }
      return (
        <p key={index} className="mt-4 leading-relaxed text-slate">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <>
      {preview ? (
        <div className="border-b border-amber-600/40 bg-amber-100 px-4 py-2 text-center text-sm font-semibold text-amber-950">
          Draft preview (authenticated). Visitors still only see published posts at this URL without{" "}
          <code className="rounded bg-amber-200/80 px-1">?preview=1</code>.
        </div>
      ) : null}
      <section className="bg-navy pt-32 pb-16">
        <div className="container-main">
          <Link
            href="/site/insights"
            className="inline-flex items-center text-sm font-semibold text-mid-blue hover:text-cyan transition-colors"
          >
            &larr; All Insights
          </Link>
          <h1 className="mt-6 max-w-3xl text-3xl text-white md:text-4xl">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-4">
            <span className="rounded-btn bg-deep-blue px-3 py-1 text-xs font-medium text-light-slate">
              {post.category?.name || 'Uncategorized'}
            </span>
            <time dateTime={post.publishedAt?.toISOString()} className="text-sm text-slate">
              {post.publishedAt ? formatDate(post.publishedAt.toISOString()) : 'N/A'}
            </time>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      <section className="bg-white py-16">
        <article className="container-main">
          <div className="mx-auto max-w-prose">
            {formatContent(post.content)}
          </div>
        </article>
      </section>

      <div className="section-divider" />

      <CTASection />
    </>
  );
}
