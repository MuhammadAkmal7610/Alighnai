import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { ModernCMS } from "@/lib/modern-cms";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function CMSPreviewPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const slugPath = slug.join("/");

  let title = "";
  let content = "";
  let type = "PAGE";
  let status = "DRAFT";
  let updatedAt = new Date();

  const page = await ModernCMS.getPageBySlug(slugPath);
  if (page) {
    title = page.title;
    content = page.content;
    status = page.status;
    updatedAt = page.updatedAt;
  } else {
    if (slug[0] === "insights") {
      const insightSlug = slug.slice(1).join("/");
      const post = await ModernCMS.getContentBySlug(insightSlug, {
        publishedOnly: false,
      });
      if (post) {
        title = post.title;
        content = post.content;
        type = post.type;
        status = post.status;
        updatedAt = post.updatedAt;
      } else {
        notFound();
      }
    } else {
      notFound();
    }
  }

  const looksLikeHtml =
    content.trim().startsWith("<") || /<\/?[a-z][\s\S]*>/i.test(content);

  const escapeHtml = (s: string) =>
    s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");

  const bodyHtml = looksLikeHtml
    ? content
    : `<p>${escapeHtml(content).replace(/\n/g, "<br/>")}</p>`;

  return (
    <div className="flex min-h-screen flex-col bg-slate-100">
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex min-w-0 flex-wrap items-center gap-3 sm:gap-4">
            <Button variant="outline" size="sm" className="shrink-0 border-slate-200" asChild>
              <Link href="/admin/content" className="gap-1.5">
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Content</span>
              </Link>
            </Button>
            <div className="hidden h-8 w-px bg-slate-200 sm:block" />
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-bold text-navy">Internal preview</p>
              <Badge
                variant={status === "PUBLISHED" ? "default" : "secondary"}
                className="shrink-0 text-[10px]"
              >
                {status}
              </Badge>
            </div>
          </div>
          <div className="flex flex-col items-end gap-0.5 text-right text-[11px] text-slate-500">
            <span className="font-medium text-slate-600">
              {type.replace(/_/g, " ")}
            </span>
            <time dateTime={updatedAt.toISOString()}>
              Updated {new Date(updatedAt).toLocaleString()}
            </time>
          </div>
        </div>
      </header>

      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <article className="mx-auto max-w-3xl rounded-xl border border-slate-200 bg-white px-6 py-10 shadow-sm sm:px-10 sm:py-12">
          <p className="text-[11px] font-bold uppercase tracking-wider text-mid-blue">
            {type.replace(/_/g, " ")}
          </p>
          <h2 className="mt-2 text-3xl font-bold leading-tight tracking-tight text-navy sm:text-4xl">
            {title}
          </h2>
          <div
            className="prose prose-slate mt-8 max-w-none prose-headings:text-navy prose-a:text-mid-blue prose-strong:text-navy"
            dangerouslySetInnerHTML={{ __html: bodyHtml }}
          />
        </article>
      </main>
    </div>
  );
}
