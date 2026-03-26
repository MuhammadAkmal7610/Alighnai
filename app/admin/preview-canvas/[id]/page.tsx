"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageRenderer } from "@/components/cms/PageRenderer";
import {
  mergePreviewFooterExtras,
  mergePreviewNavExtras,
  type SiteNavLinkWithOrder,
} from "@/lib/site-nav-preview";

export default function PreviewCanvasPage() {
  const params = useParams();
  const id = params.id as string;
  const [page, setPage] = useState<Record<string, unknown> | null>(null);
  const [publishedNav, setPublishedNav] = useState<SiteNavLinkWithOrder[]>(
    []
  );
  const [publishedFooter, setPublishedFooter] = useState<
    SiteNavLinkWithOrder[]
  >([]);
  const [logoUrl, setLogoUrl] = useState<string>("/brand/logo-bg-black.png");

  useEffect(() => {
    fetch("/api/site/branding")
      .then((r) => r.json())
      .then((d: { logoUrl?: string }) => {
        if (typeof d.logoUrl === "string" && d.logoUrl.length > 0) {
          setLogoUrl(d.logoUrl);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "CMS_PAGE_PREVIEW" && e.data.page) {
        setPage(e.data.page);
      }
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "CMS_PREVIEW_READY", id }, window.location.origin);
    return () => window.removeEventListener("message", onMsg);
  }, [id]);

  useEffect(() => {
    fetch("/api/site/nav-links")
      .then((r) => r.json())
      .then((d: { navDetailed?: SiteNavLinkWithOrder[]; footerDetailed?: SiteNavLinkWithOrder[] }) => {
        setPublishedNav(Array.isArray(d.navDetailed) ? d.navDetailed : []);
        setPublishedFooter(
          Array.isArray(d.footerDetailed) ? d.footerDetailed : []
        );
      })
      .catch(() => {
        setPublishedNav([]);
        setPublishedFooter([]);
      });
  }, []);

  const previewNavExtras = useMemo(() => {
    if (!page?.slug) return [];
    return mergePreviewNavExtras(publishedNav, {
      slug: String(page.slug),
      title: String(page.title ?? ""),
      metadata: page.metadata,
    });
  }, [page, publishedNav]);

  const previewFooterExtras = useMemo(() => {
    if (!page?.slug) return [];
    return mergePreviewFooterExtras(publishedFooter, {
      slug: String(page.slug),
      title: String(page.title ?? ""),
      metadata: page.metadata,
    });
  }, [page, publishedFooter]);

  const notifyParent = useCallback((updates: Record<string, unknown>) => {
    window.parent.postMessage(
      { type: "CMS_PAGE_CHILD_UPDATE", updates },
      window.location.origin
    );
  }, []);

  if (!page) {
    return (
      <div className="flex min-h-[240px] items-center justify-center bg-navy text-sm text-light-slate">
        Waiting for editor…
      </div>
    );
  }

  const slug = page.slug as string;
  const pathname = slug === "home" ? "/site" : `/site/${slug}`;

  return (
    <div className="dark-site-theme min-h-screen bg-navy">
      <Header
        className="sticky top-0 z-40 border-b border-white/5 bg-navy/90 backdrop-blur-md"
        pathname={pathname}
        suppressNavigation
        extraNavLinks={previewNavExtras}
        logoUrl={logoUrl}
      />
      <main id="main-content">
        <PageRenderer
          page={page}
          isEditing
          logoUrl={logoUrl}
          onContentChange={(content) => notifyParent({ content })}
          onMetadataChange={(metadata) => notifyParent({ metadata })}
        />
      </main>
      <Footer suppressNavigation extraNavLinks={previewFooterExtras} logoUrl={logoUrl} />
    </div>
  );
}
