import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { CTASection } from "@/components/CTASection"
import { InsightsPageView } from "@/components/site/InsightsPageView"
import { ContentStatus } from "@/lib/cms-enums"
import { buildCmsInsightsBundle } from "@/lib/insights-from-content"
import type { InsightContentRow } from "@/lib/insights-from-content"
import { ModernCMS } from "@/lib/modern-cms"
import { getCmsPageMetadata } from "@/lib/site-page-meta"

const FALLBACK = {
  title: "Insights",
  description:
    "Articles and analysis on enterprise AI governance, compliance, risk management, and the AlignAI framework.",
}

function isPreview(
  sp: Record<string, string | string[] | undefined> | undefined
): boolean {
  if (!sp) return false
  const raw = sp.preview
  return (
    raw === "1" ||
    raw === "true" ||
    (Array.isArray(raw) && (raw[0] === "1" || raw[0] === "true"))
  )
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  return getCmsPageMetadata("insights", searchParams, FALLBACK)
}

export default async function InsightsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const sp = searchParams ? await searchParams : {}
  const preview = isPreview(sp)

  if (preview) {
    const session = await auth()
    if (!session?.user?.id) notFound()
  }

  const page = await ModernCMS.getPageBySlug("insights", {
    publishedOnly: !preview,
  })
  if (!page) notFound()
  if (!preview && page.status !== "PUBLISHED") notFound()

  const meta = (page.metadata as Record<string, unknown> | null) ?? {}

  const rawPosts = await ModernCMS.getContents(
    preview
      ? { take: 60 }
      : { status: ContentStatus.PUBLISHED, take: 60 }
  )
  const posts = preview
    ? rawPosts.filter(
        (p) =>
          p.status === ContentStatus.DRAFT || p.status === ContentStatus.PUBLISHED
      )
    : rawPosts
  const cmsInsights = buildCmsInsightsBundle(posts as InsightContentRow[])

  return (
    <>
      <InsightsPageView metadata={meta} cmsInsights={cmsInsights} />
      <CTASection />
    </>
  )
}
