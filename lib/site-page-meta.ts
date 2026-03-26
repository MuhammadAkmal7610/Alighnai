import type { Metadata } from "next"
import { auth } from "@/auth"
import { ModernCMS } from "@/lib/modern-cms"
import { pageToNextMetadata } from "@/lib/seo-metadata"

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

/** generateMetadata helper: published SEO; with ?preview=1 + session uses latest draft. */
export async function getCmsPageMetadata(
  slug: string,
  searchParams: Promise<Record<string, string | string[] | undefined>> | undefined,
  fallbacks: { title: string; description: string }
): Promise<Metadata> {
  const sp = searchParams ? await searchParams : {}
  const preview = isPreview(sp)

  let page = await ModernCMS.getPageBySlug(slug, { publishedOnly: true })

  if (preview) {
    const session = await auth()
    if (session?.user?.id) {
      const draftOrPublished = await ModernCMS.getPageBySlug(slug, {
        publishedOnly: false,
      })
      page = draftOrPublished
    }
  }

  if (preview && page) {
    return {
      ...pageToNextMetadata(page, fallbacks),
      robots: { index: false, follow: false },
    }
  }

  return pageToNextMetadata(page, fallbacks)
}
