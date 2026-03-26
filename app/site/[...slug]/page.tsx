import type { Metadata } from "next"
import { CmsSitePage } from "@/components/site/CmsSitePage"
import { getCmsPageMetadata } from "@/lib/site-page-meta"

export default async function CMSPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}) {
  const { slug } = await params
  const slugPath = Array.isArray(slug) ? slug.join("/") : String(slug)
  return <CmsSitePage slug={slugPath} searchParams={searchParams} />
}

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string[] }>
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  const { slug } = await params
  const slugPath = Array.isArray(slug) ? slug.join("/") : String(slug)
  return getCmsPageMetadata(slugPath, searchParams, {
    title: "AlignAI",
    description: "Enterprise AI governance and strategy.",
  })
}
