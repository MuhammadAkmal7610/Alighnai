import type { Metadata } from "next"

export function metadataRecord(meta: unknown): Record<string, unknown> {
  if (meta && typeof meta === "object" && !Array.isArray(meta)) {
    return meta as Record<string, unknown>
  }
  return {}
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function clip(text: string, max: number): string {
  const t = text.trim()
  if (t.length <= max) return t
  const cut = t.slice(0, max)
  const last = cut.lastIndexOf(" ")
  return (last > 40 ? cut.slice(0, last) : cut) + "…"
}

/** Public page (Prisma Page) — uses metadata.seoTitle, seoDescription, ogImage */
export function resolvePageSeo(page: {
  title: string
  content?: string | null
  metadata?: unknown
}): { title: string; description: string } {
  const m = metadataRecord(page.metadata)
  const title =
    (typeof m.seoTitle === "string" && m.seoTitle.trim()) ||
    (typeof m.metaTitle === "string" && m.metaTitle.trim()) ||
    page.title
  const descFromMeta =
    (typeof m.seoDescription === "string" && m.seoDescription.trim()) ||
    (typeof m.metaDescription === "string" && m.metaDescription.trim()) ||
    (typeof m.description === "string" && m.description.trim())
  const fromContent = page.content
    ? clip(stripHtml(page.content), 160)
    : ""
  const description =
    descFromMeta ||
    fromContent ||
    `Learn more about ${page.title}.`
  return {
    title,
    description: clip(stripHtml(description), 320),
  }
}

export function pageToNextMetadata(
  page: { title: string; content?: string | null; metadata?: unknown } | null,
  fallbacks: { title: string; description: string }
): Metadata {
  if (!page) {
    return { title: fallbacks.title, description: fallbacks.description }
  }
  const { title, description } = resolvePageSeo(page)
  const m = metadataRecord(page.metadata)
  const ogImage =
    typeof m.ogImage === "string" && m.ogImage.trim() ? m.ogImage.trim() : undefined
  return {
    title,
    description,
    ...(ogImage
      ? { openGraph: { title, description, images: [{ url: ogImage }] } }
      : {}),
  }
}

/** Blog / Content — metadata.seoTitle, seoDescription; fallback excerpt & body */
export function resolveContentSeo(post: {
  title: string
  excerpt?: string | null
  content?: string | null
  metadata?: unknown
}): { title: string; description: string } {
  const m = metadataRecord(post.metadata)
  const title =
    (typeof m.seoTitle === "string" && m.seoTitle.trim()) ||
    (typeof m.metaTitle === "string" && m.metaTitle.trim()) ||
    post.title
  const excerptPlain = post.excerpt ? stripHtml(post.excerpt) : ""
  const descFromMeta =
    (typeof m.seoDescription === "string" && m.seoDescription.trim()) ||
    (typeof m.metaDescription === "string" && m.metaDescription.trim())
  const fromContent = post.content
    ? clip(stripHtml(post.content), 160)
    : ""
  const description =
    descFromMeta || excerptPlain || fromContent || `Read ${post.title}.`
  return { title, description: clip(description, 320) }
}

export function contentToNextMetadata(
  post: {
    title: string
    excerpt?: string | null
    content?: string | null
    metadata?: unknown
  } | null,
  fallbacks: Metadata
): Metadata {
  if (!post) return fallbacks
  const { title, description } = resolveContentSeo(post)
  const m = metadataRecord(post.metadata)
  const ogImage =
    typeof m.ogImage === "string" && m.ogImage.trim() ? m.ogImage.trim() : undefined
  return {
    title,
    description,
    ...(ogImage
      ? { openGraph: { title, description, images: [{ url: ogImage }] } }
      : {}),
  }
}
