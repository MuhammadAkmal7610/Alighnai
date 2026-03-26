import { ContentStatus } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import {
  hrefForPageSlug,
  sortNavLinks,
  type SiteNavLink,
  type SiteNavLinkWithOrder,
} from "./site-nav-preview"

export type { SiteNavLink, SiteNavLinkWithOrder }

function meta(m: unknown): Record<string, unknown> {
  return m && typeof m === "object" ? (m as Record<string, unknown>) : {}
}

function rowToNavItem(
  p: { slug: string; title: string; metadata: unknown },
  labelKey: "navLabel" | "footerLabel"
): SiteNavLinkWithOrder {
  const md = meta(p.metadata)
  const fallback =
    labelKey === "footerLabel"
      ? String(md.footerLabel || md.navLabel || p.title)
      : String(md.navLabel || p.title)
  return {
    href: hrefForPageSlug(p.slug),
    label: fallback,
    order: Number(
      labelKey === "footerLabel"
        ? md.footerOrder ?? md.navOrder ?? 100
        : md.navOrder ?? 100
    ),
  }
}

async function loadNavExtrasDetailed(): Promise<{
  navDetailed: SiteNavLinkWithOrder[]
  footerDetailed: SiteNavLinkWithOrder[]
}> {
  const rows = await prisma.page.findMany({
    where: { status: ContentStatus.PUBLISHED },
    select: { slug: true, title: true, metadata: true },
  })

  const navRaw: SiteNavLinkWithOrder[] = []
  const footerRaw: SiteNavLinkWithOrder[] = []

  for (const p of rows) {
    const m = meta(p.metadata)
    if (m.showInNav === true) navRaw.push(rowToNavItem(p, "navLabel"))
    if (m.showInFooter === true) footerRaw.push(rowToNavItem(p, "footerLabel"))
  }

  return { navDetailed: navRaw, footerDetailed: footerRaw }
}

/** Published pages only — used by site layout. */
export async function getSiteNavExtrasFromDb(): Promise<{
  navExtras: SiteNavLink[]
  footerExtras: SiteNavLink[]
}> {
  try {
    const { navDetailed, footerDetailed } = await loadNavExtrasDetailed()
    return {
      navExtras: sortNavLinks(navDetailed),
      footerExtras: sortNavLinks(footerDetailed),
    }
  } catch {
    return { navExtras: [], footerExtras: [] }
  }
}

/** Detailed list (with order) for preview iframe merge (API route). */
export async function getSiteNavExtrasDetailedFromDb(): Promise<{
  navExtras: SiteNavLinkWithOrder[]
  footerExtras: SiteNavLinkWithOrder[]
}> {
  try {
    const { navDetailed, footerDetailed } = await loadNavExtrasDetailed()
    return { navExtras: navDetailed, footerExtras: footerDetailed }
  } catch {
    return { navExtras: [], footerExtras: [] }
  }
}
