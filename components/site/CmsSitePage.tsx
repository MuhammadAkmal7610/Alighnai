import { notFound } from "next/navigation"
import { auth } from "@/auth"
import { ModernCMS } from "@/lib/modern-cms"
import { PageRenderer } from "@/components/cms/PageRenderer"

type SearchParams = Promise<Record<string, string | string[] | undefined>>

/**
 * Renders a CMS Page by slug for public /site routes. Use ?preview=1 (signed-in) to view drafts.
 */
export async function CmsSitePage({
  slug,
  searchParams,
}: {
  slug: string
  searchParams?: SearchParams
}) {
  const sp = searchParams ? await searchParams : {}
  const raw = sp?.preview
  const preview =
    raw === "1" || raw === "true" || (Array.isArray(raw) && raw[0] === "1")

  if (preview) {
    const session = await auth()
    if (!session?.user?.id) notFound()
  }

  const page = await ModernCMS.getPageBySlug(slug, { publishedOnly: !preview })
  if (!page) notFound()
  if (!preview && page.status !== "PUBLISHED") notFound()

  return <PageRenderer page={page} />
}
