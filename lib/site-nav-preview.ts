/**
 * Pure nav merge helpers — safe to import from Client Components (no Prisma / Node fs).
 */

export type SiteNavLink = {
  href: string
  label: string
}

export type SiteNavLinkWithOrder = SiteNavLink & { order: number }

function meta(m: unknown): Record<string, unknown> {
  return m && typeof m === "object" ? (m as Record<string, unknown>) : {}
}

export function hrefForPageSlug(slug: string): string {
  return slug === "home" ? "/site" : `/site/${slug}`
}

export function sortNavLinks(items: SiteNavLinkWithOrder[]): SiteNavLink[] {
  return [...items]
    .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label))
    .map(({ href, label }) => ({ href, label }))
}

export function mergePreviewNavExtras(
  published: SiteNavLinkWithOrder[],
  page: { slug: string; title: string; metadata?: unknown }
): SiteNavLink[] {
  const href = hrefForPageSlug(page.slug)
  const md = meta(page.metadata)
  const label = String(md.navLabel || page.title)
  const order = Number(md.navOrder ?? 100)
  const show = md.showInNav === true

  const rest = published.filter((l) => l.href !== href)
  if (!show) return sortNavLinks(rest)

  return sortNavLinks([...rest, { href, label, order }])
}

export function mergePreviewFooterExtras(
  published: SiteNavLinkWithOrder[],
  page: { slug: string; title: string; metadata?: unknown }
): SiteNavLink[] {
  const href = hrefForPageSlug(page.slug)
  const md = meta(page.metadata)
  const label = String(md.footerLabel || md.navLabel || page.title)
  const order = Number(md.footerOrder ?? md.navOrder ?? 100)
  const show = md.showInFooter === true

  const rest = published.filter((l) => l.href !== href)
  if (!show) return sortNavLinks(rest)

  return sortNavLinks([...rest, { href, label, order }])
}
