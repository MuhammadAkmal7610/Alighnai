function metadataRecord(meta: unknown): Record<string, unknown> {
  if (meta && typeof meta === "object" && !Array.isArray(meta)) {
    return meta as Record<string, unknown>
  }
  return {}
}

export type InsightListCard = {
  slug: string
  date: string
  badge: string
  title: string
  excerpt: string
}

export type InsightSampleBlock = {
  slug: string
  title: string
  date: string
  tag: string
  author: string
  paragraphs: string[]
}

export type CmsInsightsBundle = {
  cards: InsightListCard[]
  sample: InsightSampleBlock | null
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

export type InsightContentRow = {
  slug: string
  title: string
  excerpt: string | null
  content: string
  publishedAt: Date | null
  featured: boolean
  metadata: unknown
  category: { name: string } | null
  author: { name: string | null; email: string | null } | null
}

export function contentRowToInsightCard(row: InsightContentRow): InsightListCard {
  const m = metadataRecord(row.metadata)
  const badge =
    (typeof m.listBadge === "string" && m.listBadge.trim()) ||
    (row.featured ? "Featured" : "") ||
    row.category?.name ||
    ""
  const date =
    row.publishedAt instanceof Date && !Number.isNaN(row.publishedAt.getTime())
      ? row.publishedAt.toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  const excerptRaw = row.excerpt
    ? stripHtml(row.excerpt)
    : stripHtml(row.content || "")
  const excerpt =
    excerptRaw.length > 300
      ? `${excerptRaw.slice(0, 297).trim()}…`
      : excerptRaw
  return {
    slug: row.slug,
    date,
    badge,
    title: row.title,
    excerpt,
  }
}

function paragraphizeFromHtml(html: string): string[] {
  const plain = stripHtml(html)
  if (!plain) return []
  const chunks = plain
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 5)
  return chunks.length ? chunks : [plain.slice(0, 500)]
}

export function contentRowToInsightSample(row: InsightContentRow): InsightSampleBlock {
  const m = metadataRecord(row.metadata)
  const tag =
    (typeof m.sampleTag === "string" && m.sampleTag.trim()) ||
    (typeof m.tag === "string" && m.tag.trim()) ||
    row.category?.name ||
    "Insights"
  const author =
    row.author?.name ||
    row.author?.email?.split("@")[0] ||
    "Author"
  const date =
    row.publishedAt instanceof Date && !Number.isNaN(row.publishedAt.getTime())
      ? row.publishedAt.toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10)
  return {
    slug: row.slug,
    title: row.title,
    date,
    tag,
    author,
    paragraphs: paragraphizeFromHtml(row.content || ""),
  }
}

export function buildCmsInsightsBundle(rows: InsightContentRow[]): CmsInsightsBundle {
  const cards = rows.map(contentRowToInsightCard)
  if (!rows[0]) return { cards, sample: null }
  const sample = contentRowToInsightSample(rows[0])
  return {
    cards,
    sample: sample.paragraphs.length > 0 ? sample : null,
  }
}

/** Client-side: API returns ISO date strings */
export function apiPostToInsightRow(post: Record<string, unknown>): InsightContentRow {
  const publishedAt = post.publishedAt
  const pubDate =
    typeof publishedAt === "string"
      ? new Date(publishedAt)
      : publishedAt instanceof Date
        ? publishedAt
        : null
  const category = post.category as { name?: string } | null | undefined
  const author = post.author as { name?: string | null; email?: string | null } | null | undefined
  return {
    slug: String(post.slug ?? ""),
    title: String(post.title ?? ""),
    excerpt: post.excerpt != null ? String(post.excerpt) : null,
    content: String(post.content ?? ""),
    publishedAt: pubDate && !Number.isNaN(pubDate.getTime()) ? pubDate : null,
    featured: Boolean(post.featured),
    metadata: post.metadata,
    category: category?.name ? { name: category.name } : null,
    author: author
      ? { name: author.name ?? null, email: author.email ?? null }
      : null,
  }
}

export function buildCmsInsightsFromApiPosts(
  posts: Record<string, unknown>[]
): CmsInsightsBundle {
  const rows = posts.map(apiPostToInsightRow).filter((r) => r.slug)
  return buildCmsInsightsBundle(rows)
}
