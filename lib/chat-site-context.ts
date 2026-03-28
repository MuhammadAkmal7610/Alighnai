import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { ContentStatus, InfoType } from "@/lib/cms-enums";

const MAX_CONTEXT_CHARS = 12_000;

function stripHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function appendSection(
  parts: string[],
  budget: { remaining: number },
  block: string
): void {
  if (budget.remaining <= 0 || !block.trim()) return;
  const slice = block.length <= budget.remaining ? block : `${block.slice(0, budget.remaining - 1)}…`;
  parts.push(slice);
  budget.remaining -= slice.length;
}

async function buildSiteContextRaw(): Promise<string> {
  try {
    const [pages, posts, infos] = await Promise.all([
      prisma.page.findMany({
        where: { status: ContentStatus.PUBLISHED },
        select: { title: true, slug: true, content: true },
        orderBy: { updatedAt: "desc" },
        take: 35,
      }),
      prisma.content.findMany({
        where: { status: ContentStatus.PUBLISHED },
        select: {
          title: true,
          slug: true,
          excerpt: true,
          content: true,
          type: true,
        },
        orderBy: [{ publishedAt: "desc" }, { updatedAt: "desc" }],
        take: 45,
      }),
      prisma.info.findMany({
        where: {
          isPublic: true,
          NOT: { type: InfoType.SETTINGS },
        },
        select: { type: true, title: true, content: true },
      }),
    ]);

    const parts: string[] = [];
    const budget = { remaining: MAX_CONTEXT_CHARS };

    for (const p of pages) {
      const body = stripHtml(p.content).slice(0, 2500);
      const line = `Page "${p.title}" (/${p.slug}): ${body}`;
      appendSection(parts, budget, line + "\n\n");
      if (budget.remaining <= 0) break;
    }

    for (const c of posts) {
      const excerpt = c.excerpt ? stripHtml(c.excerpt) : "";
      const body = stripHtml(c.content).slice(0, 1800);
      const line = `Content "${c.title}" [${c.type}] (/${c.slug})${excerpt ? ` — ${excerpt}` : ""}: ${body}`;
      appendSection(parts, budget, line + "\n\n");
      if (budget.remaining <= 0) break;
    }

    for (const i of infos) {
      const body = stripHtml(i.content).slice(0, 2000);
      const line = `Info ${i.type} "${i.title}": ${body}`;
      appendSection(parts, budget, line + "\n\n");
      if (budget.remaining <= 0) break;
    }

    return parts.join("").trim();
  } catch (e) {
    console.error("[chat-site-context] failed to load CMS excerpts:", e);
    return "";
  }
}

const getCachedSiteContextInner = unstable_cache(
  buildSiteContextRaw,
  ["alignai-chat-site-context-v1"],
  { revalidate: 300 }
);

/** Cached public-site text for chat grounding (revalidates every 5 minutes). */
export function getCachedSiteContextForChat(): Promise<string> {
  return getCachedSiteContextInner();
}
