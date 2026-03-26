"use client";

import type { CSSProperties } from "react";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Save,
  ChevronLeft,
  Globe,
  Loader2,
  CheckCircle2,
  Monitor,
  Tablet as TabletIcon,
  Smartphone,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ContentStatus,
  type ContentStatus as ContentStatusValue,
} from "@/lib/cms-enums";

interface FullPageEditorProps {
  initialPage: any;
}

type DeviceMode = "mobile" | "tablet" | "desktop";

export function FullPageEditor({ initialPage }: FullPageEditorProps) {
  const router = useRouter();
  const [page, setPage] = useState(initialPage);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<
    "idle" | "saving" | "success" | "error"
  >("idle");
  const [device, setDevice] = useState<DeviceMode>("desktop");

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const pageRef = useRef(page);
  pageRef.current = page;

  const postToIframe = useCallback((p: typeof page) => {
    const w = iframeRef.current?.contentWindow;
    if (!w || !p) return;
    w.postMessage(
      { type: "CMS_PAGE_PREVIEW", page: p },
      window.location.origin
    );
  }, []);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.origin !== window.location.origin) return;
      if (e.data?.type === "CMS_PAGE_CHILD_UPDATE" && e.data.updates) {
        setPage((prev: any) => ({ ...prev, ...e.data.updates }));
      }
      if (e.data?.type === "CMS_PREVIEW_READY") {
        postToIframe(pageRef.current);
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [postToIframe]);

  useEffect(() => {
    const t = setTimeout(() => postToIframe(page), 220);
    return () => clearTimeout(t);
  }, [page, postToIframe]);

  const handleSave = async (status?: ContentStatusValue) => {
    try {
      setSaving(true);
      setSaveStatus("saving");

      const updateData = {
        ...page,
        status: status || page.status,
      };

      const res = await fetch(`/api/cms/pages/${page.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!res.ok) throw new Error("Failed to save page");

      const updatedPage = await res.json();
      setPage(updatedPage);
      setSaveStatus("success");
      setTimeout(() => setSaveStatus("idle"), 3000);
    } catch (error) {
      console.error("Error saving page:", error);
      setSaveStatus("error");
    } finally {
      setSaving(false);
    }
  };

  const frameStyle: CSSProperties =
    device === "desktop"
      ? {
          width: "100%",
          height: "100%",
          minHeight: "min(1600px, calc(100vh - 7.5rem))",
        }
      : {
          width: device === "mobile" ? 390 : 768,
          maxWidth: "100%",
          minHeight: "min(1200px, calc(100vh - 8rem))",
          height: "auto",
        };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-slate-100">
      <header className="z-50 flex h-14 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-3 shadow-sm sm:h-16 sm:px-6">
        <div className="flex min-w-0 items-center gap-2 md:gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/admin/pages")}
            className="shrink-0 text-slate-500 hover:text-navy"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />
          <div className="min-w-0 flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Editing
            </span>
            <div className="flex items-center gap-2">
              <h1 className="max-w-[100px] truncate text-sm font-bold text-navy sm:max-w-[200px]">
                {page.title}
              </h1>
              <span
                className={cn(
                  "shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-tighter",
                  page.status === "PUBLISHED"
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                )}
              >
                {page.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-3">
          {saveStatus === "success" && (
            <div className="hidden items-center text-xs font-medium text-green-600 sm:flex animate-in fade-in slide-in-from-right-2">
              <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
              Saved
            </div>
          )}

          <Button
            variant="outline"
            size="icon"
            onClick={() => handleSave(ContentStatus.DRAFT)}
            disabled={saving}
            className="border-slate-200 text-slate-600 hover:bg-slate-50 sm:hidden"
            title="Save draft"
          >
            <Save className={cn("h-4 w-4", saving && "animate-spin")} />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSave(ContentStatus.DRAFT)}
            disabled={saving}
            className="hidden border-slate-200 text-slate-600 hover:bg-slate-50 sm:inline-flex"
          >
            <Save className={cn("mr-2 h-4 w-4", saving && "animate-spin")} />
            Draft
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => handleSave(ContentStatus.PUBLISHED)}
            disabled={saving}
            className="bg-navy px-3 text-white shadow-md hover:bg-navy/90 sm:px-6"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin sm:mr-2" />
            ) : (
              <Globe className="mr-0 h-4 w-4 sm:mr-2" />
            )}
            <span className="hidden sm:inline">Publish</span>
          </Button>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        {/* Main preview — full remaining width */}
        <div className="order-1 flex min-h-0 min-w-0 flex-1 flex-col bg-slate-200/60 lg:order-1">
          <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-slate-200/80 bg-slate-100/90 px-3 py-2 backdrop-blur-sm">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Live preview
              </p>
              <p className="hidden text-[11px] text-slate-400 sm:block">
                Device width controls breakpoints inside the iframe.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1 rounded-lg border border-slate-200 bg-white p-0.5 shadow-sm">
              <Button
                type="button"
                variant={device === "mobile" ? "secondary" : "ghost"}
                size="sm"
                className="h-8 gap-1 px-2 text-xs"
                onClick={() => setDevice("mobile")}
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Mobile</span>
              </Button>
              <Button
                type="button"
                variant={device === "tablet" ? "secondary" : "ghost"}
                size="sm"
                className="h-8 gap-1 px-2 text-xs"
                onClick={() => setDevice("tablet")}
              >
                <TabletIcon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Tablet</span>
              </Button>
              <Button
                type="button"
                variant={device === "desktop" ? "secondary" : "ghost"}
                size="sm"
                className="h-8 gap-1 px-2 text-xs"
                onClick={() => setDevice("desktop")}
              >
                <Monitor className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Desktop</span>
              </Button>
            </div>
          </div>

          <div className="custom-scrollbar flex min-h-0 flex-1 items-start justify-center overflow-auto p-2 sm:p-4">
            <iframe
              ref={iframeRef}
              title="Page preview"
              src={`/admin/preview-canvas/${page.id}`}
              className={cn(
                "shrink-0 rounded-lg border border-slate-300 bg-navy shadow-lg",
                device === "desktop" ? "w-full max-w-none" : "mx-auto"
              )}
              style={frameStyle}
              onLoad={() => postToIframe(pageRef.current)}
            />
          </div>
        </div>

        {/* Sidebar — page & SEO (right on large screens) */}
        <aside
          className={cn(
            "order-2 flex max-h-[42vh] w-full shrink-0 flex-col border-t border-slate-200 bg-white lg:order-2 lg:max-h-none lg:h-full lg:w-[min(100vw,22rem)] lg:border-l lg:border-t-0 xl:w-96"
          )}
        >
          <div className="custom-scrollbar space-y-5 overflow-y-auto p-4 pb-8">
            <div>
              <h2 className="mb-3 text-[11px] font-bold uppercase tracking-wider text-mid-blue">
                Page
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Page title
                  </Label>
                  <Input
                    value={page.title}
                    onChange={(e) =>
                      setPage({ ...page, title: e.target.value })
                    }
                    className="h-10 border-slate-200 bg-white font-medium focus:border-navy focus:ring-navy"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    URL slug
                  </Label>
                  <Input
                    value={page.slug}
                    onChange={(e) =>
                      setPage({ ...page, slug: e.target.value })
                    }
                    className="h-10 border-slate-200 bg-white font-medium focus:border-navy focus:ring-navy"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Template
                  </Label>
                  <select
                    value={page.template || ""}
                    onChange={(e) =>
                      setPage({ ...page, template: e.target.value })
                    }
                    className="h-10 w-full cursor-pointer rounded-md border border-slate-200 bg-white px-3 text-sm font-medium focus:border-navy focus:ring-navy"
                  >
                    <option value="home">Home</option>
                    <option value="about">About</option>
                    <option value="framework">Framework</option>
                    <option value="services">Services</option>
                    <option value="contact">Contact</option>
                    <option value="insights">Insights</option>
                    <option value="blank">Blank</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-mid-blue">
                SEO (search & social)
              </p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Meta title (optional)
                  </Label>
                  <Input
                    value={String(
                      (page.metadata as Record<string, string> | null)
                        ?.seoTitle ?? ""
                    )}
                    onChange={(e) =>
                      setPage({
                        ...page,
                        metadata: {
                          ...(typeof page.metadata === "object" &&
                          page.metadata
                            ? page.metadata
                            : {}),
                          seoTitle: e.target.value,
                        },
                      })
                    }
                    className="h-10 border-slate-200 bg-white"
                    placeholder="Defaults to page title"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Meta description
                  </Label>
                  <Textarea
                    value={String(
                      (page.metadata as Record<string, string> | null)
                        ?.seoDescription ?? ""
                    )}
                    onChange={(e) =>
                      setPage({
                        ...page,
                        metadata: {
                          ...(typeof page.metadata === "object" &&
                          page.metadata
                            ? page.metadata
                            : {}),
                          seoDescription: e.target.value,
                        },
                      })
                    }
                    className="min-h-[100px] border-slate-200 bg-white text-sm"
                    placeholder="Google / social preview text"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Social image URL (optional)
                  </Label>
                  <Input
                    value={String(
                      (page.metadata as Record<string, string> | null)
                        ?.ogImage ?? ""
                    )}
                    onChange={(e) =>
                      setPage({
                        ...page,
                        metadata: {
                          ...(typeof page.metadata === "object" &&
                          page.metadata
                            ? page.metadata
                            : {}),
                          ogImage: e.target.value,
                        },
                      })
                    }
                    className="h-10 border-slate-200 bg-white"
                    placeholder="https://…"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-5">
              <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-mid-blue">
                Site navigation
              </p>
              <p className="mb-4 text-[11px] leading-relaxed text-slate-500">
                Published pages only on the live site. Preview below reflects your
                toggles immediately.
              </p>
              <label className="mb-3 flex cursor-pointer items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/90 p-3">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-mid-blue focus:ring-mid-blue"
                  checked={
                    (page.metadata as Record<string, unknown> | null)
                      ?.showInNav === true
                  }
                  onChange={(e) =>
                    setPage({
                      ...page,
                      metadata: {
                        ...(typeof page.metadata === "object" && page.metadata
                          ? page.metadata
                          : {}),
                        showInNav: e.target.checked,
                      },
                    })
                  }
                />
                <span className="text-xs font-semibold text-navy">
                  Show in main navigation
                </span>
              </label>
              <div className="mb-4 grid grid-cols-1 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-slate-500">
                    Nav label (optional)
                  </Label>
                  <Input
                    value={String(
                      (page.metadata as Record<string, unknown> | null)
                        ?.navLabel ?? ""
                    )}
                    onChange={(e) =>
                      setPage({
                        ...page,
                        metadata: {
                          ...(typeof page.metadata === "object" &&
                          page.metadata
                            ? page.metadata
                            : {}),
                          navLabel: e.target.value || undefined,
                        },
                      })
                    }
                    className="h-9 border-slate-200 bg-white text-sm"
                    placeholder="Page title"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-slate-500">
                    Nav sort order
                  </Label>
                  <Input
                    type="number"
                    value={
                      (page.metadata as Record<string, unknown> | null)
                        ?.navOrder != null
                        ? String(
                            (page.metadata as Record<string, unknown>)
                              .navOrder
                          )
                        : ""
                    }
                    onChange={(e) => {
                      const raw = e.target.value.trim();
                      setPage({
                        ...page,
                        metadata: {
                          ...(typeof page.metadata === "object" &&
                          page.metadata
                            ? page.metadata
                            : {}),
                          navOrder:
                            raw === "" ? undefined : Number(raw),
                        },
                      });
                    }}
                    className="h-9 border-slate-200 bg-white text-sm"
                    placeholder="100"
                  />
                </div>
              </div>
              <label className="mb-3 flex cursor-pointer items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/90 p-3">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 rounded border-slate-300 text-mid-blue focus:ring-mid-blue"
                  checked={
                    (page.metadata as Record<string, unknown> | null)
                      ?.showInFooter === true
                  }
                  onChange={(e) =>
                    setPage({
                      ...page,
                      metadata: {
                        ...(typeof page.metadata === "object" && page.metadata
                          ? page.metadata
                          : {}),
                        showInFooter: e.target.checked,
                      },
                    })
                  }
                />
                <span className="text-xs font-semibold text-navy">
                  Show in footer (Navigation column)
                </span>
              </label>
              <div className="grid grid-cols-1 gap-3">
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-slate-500">
                    Footer label (optional)
                  </Label>
                  <Input
                    value={String(
                      (page.metadata as Record<string, unknown> | null)
                        ?.footerLabel ?? ""
                    )}
                    onChange={(e) =>
                      setPage({
                        ...page,
                        metadata: {
                          ...(typeof page.metadata === "object" &&
                          page.metadata
                            ? page.metadata
                            : {}),
                          footerLabel: e.target.value || undefined,
                        },
                      })
                    }
                    className="h-9 border-slate-200 bg-white text-sm"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] font-bold uppercase text-slate-500">
                    Footer sort order
                  </Label>
                  <Input
                    type="number"
                    value={
                      (page.metadata as Record<string, unknown> | null)
                        ?.footerOrder != null
                        ? String(
                            (page.metadata as Record<string, unknown>)
                              .footerOrder
                          )
                        : ""
                    }
                    onChange={(e) => {
                      const raw = e.target.value.trim();
                      setPage({
                        ...page,
                        metadata: {
                          ...(typeof page.metadata === "object" &&
                          page.metadata
                            ? page.metadata
                            : {}),
                          footerOrder:
                            raw === "" ? undefined : Number(raw),
                        },
                      });
                    }}
                    className="h-9 border-slate-200 bg-white text-sm"
                    placeholder="100"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
