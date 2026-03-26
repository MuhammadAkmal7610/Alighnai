"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { CMSEditor } from "@/components/cms/CMSEditor"
import type { CmsInsightsBundle, InsightListCard, InsightSampleBlock } from "@/lib/insights-from-content"
import { buildCmsInsightsFromApiPosts } from "@/lib/insights-from-content"

const DEFAULT_HERO = {
  kicker: "Thought Leadership",
  title:
    'AI governance thinking.<span class="block text-cyan">Grounded in research.</span>',
  description:
    "Perspectives on the governance gap, regulatory exposure, and what enterprise AI accountability actually requires.",
}

const DEFAULT_LATEST_POSTS: InsightListCard[] = [
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
]

const DEFAULT_SAMPLE: InsightSampleBlock = {
  slug: "why-ai-governance-matters-now",
  title: "The Governance Layer Nobody Built",
  date: "2026-03-06",
  tag: "AI Governance",
  author: "Brian Burke",
  paragraphs: [
    "Every major AI governance framework in circulation focuses on the model. NIST AI RMF, ISO 42001, the EU AI Act, the proposed Canadian AIDA - all of them are fundamentally concerned with how models are built, trained, documented, and audited.",
    "That is not the wrong thing to govern. But it is not where AI is actually changing enterprise behaviour.",
  ],
}

function formatDate(value: string) {
  return new Date(value)
    .toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase()
}

type InsightsPageViewProps = {
  metadata?: Record<string, unknown> | null
  /** From server: published (or all in preview) CMS posts — drives listing + sample */
  cmsInsights?: CmsInsightsBundle
  isEditing?: boolean
  onMetadataChange?: (metadata: Record<string, unknown>) => void
}

export function InsightsPageView({
  metadata,
  cmsInsights: cmsInsightsProp,
  isEditing,
  onMetadataChange,
}: InsightsPageViewProps) {
  const data = (metadata || {}) as Record<string, any>
  const [editingField, setEditingField] = useState<string | null>(null)
  const [remoteBundle, setRemoteBundle] = useState<CmsInsightsBundle | null>(null)
  const [remoteLoading, setRemoteLoading] = useState(cmsInsightsProp === undefined)

  useEffect(() => {
    if (cmsInsightsProp !== undefined) return
    let cancelled = false
    const url = "/api/cms/posts?take=60"
    fetch(url)
      .then((r) => (r.ok ? r.json() : { posts: [] }))
      .then((data: { posts?: Record<string, unknown>[] }) => {
        if (cancelled) return
        const posts = data.posts || []
        setRemoteBundle(buildCmsInsightsFromApiPosts(posts))
      })
      .catch(() => {
        if (!cancelled) setRemoteBundle({ cards: [], sample: null })
      })
      .finally(() => {
        if (!cancelled) setRemoteLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [cmsInsightsProp])

  const cmsBundle = cmsInsightsProp ?? remoteBundle

  const heroRaw = data.hero && typeof data.hero === "object" ? data.hero : {}
  const hero = {
    kicker: heroRaw.kicker ?? DEFAULT_HERO.kicker,
    title: heroRaw.title ?? DEFAULT_HERO.title,
    description: heroRaw.description ?? DEFAULT_HERO.description,
  }

  const patchHero = (updates: Record<string, string>) => {
    onMetadataChange?.({
      ...data,
      hero: { ...heroRaw, ...updates },
    })
  }

  const useDynamicList = cmsBundle !== null
  const latestPosts: InsightListCard[] = useDynamicList
    ? cmsBundle.cards
    : Array.isArray(data.latestPosts) && data.latestPosts.length > 0
      ? (data.latestPosts as InsightListCard[])
      : DEFAULT_LATEST_POSTS

  const sp = data.samplePost && typeof data.samplePost === "object" ? data.samplePost : {}
  const metadataSample: InsightSampleBlock = {
    ...DEFAULT_SAMPLE,
    ...sp,
    paragraphs:
      Array.isArray(sp.paragraphs) && sp.paragraphs.length > 0
        ? sp.paragraphs
        : DEFAULT_SAMPLE.paragraphs,
    author: typeof sp.author === "string" && sp.author ? sp.author : DEFAULT_SAMPLE.author,
  }

  const samplePost: InsightSampleBlock | null = useDynamicList
    ? cmsBundle.sample
    : metadataSample

  const showSampleBlock =
    samplePost !== null && samplePost.paragraphs && samplePost.paragraphs.length > 0

  return (
    <>
      <section className="hero-panel pt-32 pb-20 md:pb-24">
        <div className="container-main">
          {isEditing && editingField === "insights.kicker" ? (
            <div>
              <CMSEditor
                variant="ghost"
                content={hero.kicker}
                onChange={(val) => patchHero({ kicker: val })}
                onDone={() => setEditingField(null)}
                placeholder="Kicker"
              />
            </div>
          ) : (
            <p
              className={cn(
                "hero-kicker",
                isEditing &&
                  "cursor-edit rounded px-1 transition-all hover:ring-1 hover:ring-cyan/30"
              )}
              onDoubleClick={() => isEditing && setEditingField("insights.kicker")}
              dangerouslySetInnerHTML={{ __html: hero.kicker }}
            />
          )}

          {isEditing && editingField === "insights.title" ? (
            <div className="mt-6 max-w-3xl">
              <CMSEditor
                variant="ghost"
                content={hero.title}
                onChange={(val) => patchHero({ title: val })}
                onDone={() => setEditingField(null)}
                placeholder="Headline (HTML allowed for accent line)"
              />
            </div>
          ) : (
            <h1
              className={cn(
                "mt-6 max-w-3xl text-4xl leading-[1.08] text-white md:text-6xl",
                isEditing &&
                  "cursor-edit rounded px-1 transition-all hover:ring-1 hover:ring-cyan/30"
              )}
              onDoubleClick={() => isEditing && setEditingField("insights.title")}
              dangerouslySetInnerHTML={{ __html: hero.title }}
            />
          )}

          {isEditing && editingField === "insights.description" ? (
            <div className="mt-7 max-w-prose">
              <CMSEditor
                variant="ghost"
                content={hero.description}
                onChange={(val) => patchHero({ description: val })}
                onDone={() => setEditingField(null)}
                placeholder="Intro"
              />
            </div>
          ) : (
            <p
              className={cn(
                "mt-7 max-w-prose text-sm leading-relaxed text-light-slate",
                isEditing &&
                  "cursor-edit rounded px-1 transition-all hover:ring-1 hover:ring-cyan/30"
              )}
              onDoubleClick={() => isEditing && setEditingField("insights.description")}
              dangerouslySetInnerHTML={{ __html: hero.description }}
            />
          )}
        </div>
      </section>

      <div className="section-divider" />

      <section className="bg-off-white py-20">
        <div className="container-main">
          <p className="hero-kicker text-mid-blue">Latest Posts</p>
          {isEditing && cmsInsightsProp === undefined && remoteLoading ? (
            <p className="mt-6 text-sm text-slate">Loading posts from Content…</p>
          ) : null}

          <div className="mt-7 grid gap-0 border border-[#d9deea] bg-white md:grid-cols-3 md:items-stretch">
            {latestPosts.length === 0 ? (
              <div className="col-span-full p-10 text-center text-sm text-slate">
                No articles yet. Publish posts from{" "}
                <span className="font-semibold text-navy">Admin → Content</span> to show them here.
              </div>
            ) : (
              latestPosts.map((post, index) => {
                const col = index % 3
                const row = Math.floor(index / 3)
                const postCardBorders = cn(
                  // Mobile (1 col): horizontal rule between stacked cards
                  index === 0 && "border-t-2 border-t-cyan",
                  index > 0 && "border-t border-t-[#e4e8f1]",
                  // md: 3-column grid — row divider + column dividers
                  "md:border-t-0 md:border-l-0",
                  row === 0 && col === 0 && "md:border-t-2 md:border-t-cyan",
                  row === 0 &&
                    col > 0 &&
                    "md:border-t-2 md:border-t-transparent md:border-l md:border-l-[#e4e8f1]",
                  row >= 1 && "md:border-t md:border-t-[#e4e8f1]",
                  row >= 1 && col > 0 && "md:border-l md:border-l-[#e4e8f1]"
                )
                return (
                <article
                  key={post.slug}
                  className={cn("flex flex-col p-5", postCardBorders)}
                >
                  <p className="text-[11px] font-semibold uppercase tracking-[0.05em] text-slate">
                    {formatDate(post.date)}
                    {post.badge ? (
                      <span className="ml-2 rounded-btn bg-[#d9e7f8] px-1.5 py-0.5 text-[10px] font-semibold text-mid-blue">
                        {post.badge}
                      </span>
                    ) : null}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold leading-tight text-navy">{post.title}</h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate">{post.excerpt}</p>
                  <Link
                    href={`/site/insights/${post.slug}`}
                    className="mt-auto pt-5 inline-block text-sm font-semibold text-mid-blue hover:text-deep-blue"
                  >
                    Read article →
                  </Link>
                </article>
                )
              })
            )}
          </div>

          {showSampleBlock && samplePost ? (
            <div className="mt-14 border-t border-light-slate pt-9">
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-mid-blue">
                · Featured layout (first post)
              </p>

              <article className="mt-6 max-w-[760px]">
                <h2 className="text-3xl leading-tight text-navy md:text-4xl">{samplePost.title}</h2>
                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
                  <span className="text-[#7b8392]">{samplePost.author}</span>
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
                    <p
                      key={`${samplePost.slug}-${index}-${paragraph.slice(0, 24)}`}
                      className="mb-4 text-[15px] leading-[1.72] text-[#6f7785]"
                    >
                      {paragraph}
                    </p>
                  ))}
                  <Link
                    href={`/site/insights/${samplePost.slug}`}
                    className="text-[15px] font-semibold text-mid-blue hover:text-deep-blue"
                  >
                    Read full article →
                  </Link>
                </div>
              </article>
            </div>
          ) : null}
        </div>
      </section>
    </>
  )
}
