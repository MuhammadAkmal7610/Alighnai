"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PageRenderer } from "@/components/cms/PageRenderer";

export default function PreviewCanvasPage() {
  const params = useParams();
  const id = params.id as string;
  const [page, setPage] = useState<Record<string, unknown> | null>(null);

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
      />
      <main id="main-content">
        <PageRenderer
          page={page}
          isEditing
          onContentChange={(content) => notifyParent({ content })}
          onMetadataChange={(metadata) => notifyParent({ metadata })}
        />
      </main>
      <Footer suppressNavigation />
    </div>
  );
}
