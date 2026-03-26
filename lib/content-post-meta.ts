import type { Metadata } from "next"
import { auth } from "@/auth"
import { ModernCMS } from "@/lib/modern-cms"
import { contentToNextMetadata } from "@/lib/seo-metadata"

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

export async function getPublishedContentMetadata(
  slug: string,
  searchParams: Promise<Record<string, string | string[] | undefined>> | undefined,
  fallbacks: Metadata
): Promise<Metadata> {
  const sp = searchParams ? await searchParams : {}
  const preview = isPreview(sp)

  let post = await ModernCMS.getContentBySlug(slug, { publishedOnly: true })

  if (preview) {
    const session = await auth()
    if (session?.user?.id) {
      post = await ModernCMS.getContentBySlug(slug, { publishedOnly: false })
    }
  }

  if (!post) {
    return {
      title: "Article not found",
      robots: { index: false, follow: false },
    }
  }

  if (preview && post) {
    return {
      ...contentToNextMetadata(post, fallbacks),
      robots: { index: false, follow: false },
    }
  }

  return contentToNextMetadata(post, fallbacks)
}
