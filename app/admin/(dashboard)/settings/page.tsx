"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Globe,
  Lock,
  Save,
  Server,
  ShieldCheck,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CMS_H1, CMS_PAGE_HEADER, CMS_PAGE_SHELL } from "@/lib/cms-page-shell";
import type { SiteThemeBlock } from "@/lib/site-theme";

type InfoRow = {
  id?: string;
  type: string;
  title?: string;
  content?: string;
  metadata?: Record<string, unknown>;
};

const emptyTheme = (): SiteThemeBlock => ({
  colors: {
    navy: "#0C1E39",
    deepBlue: "#274185",
    midBlue: "#407BB7",
    cyan: "#63BCE7",
    slate: "#84899A",
    lightSlate: "#C8CDD8",
    offWhite: "#F4F6F9",
    footerBg: "#08162e",
  },
  assets: {
    logoUrl: "",
    faviconUrl: "",
  },
  heroDecor: {
    panelBg: "#0c1e39",
    gridLine: "rgba(99, 188, 231, 0.045)",
    triangleRight: "-50px",
    triangleBottom: "130px",
    triangleBorderLeft: "250px",
    triangleBorderRight: "250px",
    triangleBorderBottomWidth: "500px",
    triangleColor: "rgba(99, 188, 231, 0.18)",
    triangleColorDark: "rgba(8, 21, 44, 0.85)",
    scanOpacity: "0.35",
  },
});

function mergeTheme(raw: unknown): SiteThemeBlock {
  const base = emptyTheme();
  if (!raw || typeof raw !== "object") return base;
  const t = raw as SiteThemeBlock;
  return {
    colors: { ...base.colors, ...t.colors },
    assets: { ...base.assets, ...t.assets },
    heroDecor: { ...base.heroDecor, ...t.heroDecor },
  };
}

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [settingsRow, setSettingsRow] = useState<InfoRow | null>(null);
  const [siteName, setSiteName] = useState("AlignAI");
  const [theme, setTheme] = useState<SiteThemeBlock>(emptyTheme);

  const load = useCallback(async () => {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/cms/info");
      if (!res.ok) throw new Error("Failed to load settings");
      const rows: InfoRow[] = await res.json();
      const settings = rows.find((r) => r.type === "SETTINGS");
      setSettingsRow(settings ?? null);
      const meta = settings?.metadata;
      if (meta && typeof meta === "object") {
        const m = meta as Record<string, unknown>;
        if (typeof m.siteName === "string") setSiteName(m.siteName);
        setTheme(mergeTheme((m as { theme?: unknown }).theme));
      }
    } catch (e) {
      setMessage({
        type: "err",
        text: e instanceof Error ? e.message : "Could not load settings",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleSaveBranding() {
    if (!settingsRow) {
      setMessage({ type: "err", text: "SETTINGS record not found. Run DB seed." });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      const prevMeta =
        settingsRow.metadata && typeof settingsRow.metadata === "object"
          ? { ...(settingsRow.metadata as Record<string, unknown>) }
          : {};
      const assets = {
        ...theme.assets,
        logoUrl: theme.assets?.logoUrl?.trim() || undefined,
        faviconUrl: theme.assets?.faviconUrl?.trim() || undefined,
      };
      const nextMeta = {
        ...prevMeta,
        siteName,
        theme: {
          ...theme,
          assets,
        },
      };
      const res = await fetch("/api/cms/info/SETTINGS", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: settingsRow.title ?? "Site settings",
          content: settingsRow.content ?? "",
          metadata: nextMeta,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.details || err.error || "Save failed");
      }
      const updated = await res.json();
      setSettingsRow({
        type: "SETTINGS",
        title: updated.title,
        content: updated.content,
        metadata: updated.metadata,
      });
      setMessage({
        type: "ok",
        text: "Branding saved. Refresh the public site to see colors and hero shape updates.",
      });
    } catch (e) {
      setMessage({
        type: "err",
        text: e instanceof Error ? e.message : "Save failed",
      });
    } finally {
      setSaving(false);
    }
  }

  const c = theme.colors ?? {};
  const h = theme.heroDecor ?? {};
  const a = theme.assets ?? {};

  function setColor<K extends keyof NonNullable<SiteThemeBlock["colors"]>>(
    key: K,
    value: string
  ) {
    setTheme((t) => ({
      ...t,
      colors: { ...t.colors, [key]: value },
    }));
  }

  function setHero<K extends keyof NonNullable<SiteThemeBlock["heroDecor"]>>(
    key: K,
    value: string
  ) {
    setTheme((t) => ({
      ...t,
      heroDecor: { ...t.heroDecor, [key]: value },
    }));
  }

  return (
    <div className={CMS_PAGE_SHELL}>
      <div className={CMS_PAGE_HEADER}>
        <div className="min-w-0">
          <h1 className={CMS_H1}>Settings</h1>
          <p className="mt-1 font-medium text-slate-500">
            Global platform preferences and public site branding (colors, logo, hero decoration)
          </p>
        </div>
      </div>

      {message && (
        <p
          className={cn(
            "mb-6 rounded-lg border px-4 py-3 text-sm font-medium",
            message.type === "ok"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-red-200 bg-red-50 text-red-900"
          )}
        >
          {message.text}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="lg:col-span-2 bg-white border-slate-200 shadow-sm overflow-hidden rounded-xl">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-navy flex items-center gap-2 font-bold">
              <Palette className="h-5 w-5 text-mid-blue" />
              Site branding &amp; theme
            </CardTitle>
            <CardDescription className="text-slate-500 font-medium">
              Stored on the SETTINGS info record as <code className="text-xs">metadata.theme</code>. Drives
              Tailwind palette via CSS variables, header/footer logo, favicon, and hero triangle positioning.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-8">
            {loading ? (
              <p className="text-sm text-slate-500">Loading…</p>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-navy">Site name (metadata)</Label>
                    <Input
                      value={siteName}
                      onChange={(e) => setSiteName(e.target.value)}
                      className="bg-white border-slate-200 text-navy h-11 rounded-lg"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-navy">Logo image URL</Label>
                    <Input
                      placeholder="/brand/logo-bg-black.png or https://…"
                      value={a.logoUrl ?? ""}
                      onChange={(e) =>
                        setTheme((t) => ({
                          ...t,
                          assets: { ...t.assets, logoUrl: e.target.value },
                        }))
                      }
                      className="bg-white border-slate-200 text-navy h-11 rounded-lg font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-sm font-bold text-navy">Favicon URL</Label>
                    <Input
                      placeholder="/favicon.ico"
                      value={a.faviconUrl ?? ""}
                      onChange={(e) =>
                        setTheme((t) => ({
                          ...t,
                          assets: { ...t.assets, faviconUrl: e.target.value },
                        }))
                      }
                      className="bg-white border-slate-200 text-navy h-11 rounded-lg font-mono text-sm"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-navy mb-3">Palette (hex)</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(
                      [
                        ["navy", "Navy"],
                        ["deepBlue", "Deep blue"],
                        ["midBlue", "Mid blue"],
                        ["cyan", "Cyan"],
                        ["slate", "Slate"],
                        ["lightSlate", "Light slate"],
                        ["offWhite", "Off white"],
                        ["footerBg", "Footer bg"],
                      ] as const
                    ).map(([key, label]) => (
                      <div key={key} className="space-y-1">
                        <Label className="text-xs font-semibold text-slate-600">{label}</Label>
                        <Input
                          value={(c as Record<string, string | undefined>)[key] ?? ""}
                          onChange={(e) => setColor(key, e.target.value)}
                          className="h-9 font-mono text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-navy mb-3">
                    Hero panel &amp; triangle (absolute decoration)
                  </h3>
                  <p className="text-xs text-slate-500 mb-4">
                    Use CSS lengths (e.g. <code>-50px</code>, <code>130px</code>) and rgba for colors.{" "}
                    <code>triangleColor</code> is the large cyan wedge;{" "}
                    <code>triangleColorDark</code> is used when a section sets{" "}
                    <code>dark-shape-override</code> on the hero.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(
                      [
                        ["panelBg", "Panel background"],
                        ["gridLine", "Grid line (rgba)"],
                        ["triangleRight", "Triangle right"],
                        ["triangleBottom", "Triangle bottom"],
                        ["triangleBorderLeft", "Triangle border-left width"],
                        ["triangleBorderRight", "Triangle border-right width"],
                        ["triangleBorderBottomWidth", "Triangle border-bottom width"],
                        ["triangleColor", "Triangle fill (rgba)"],
                        ["triangleColorDark", "Triangle dark override (rgba)"],
                        ["scanOpacity", "Scan overlay opacity (0–1)"],
                      ] as const
                    ).map(([key, label]) => (
                      <div key={key} className="space-y-1">
                        <Label className="text-xs font-semibold text-slate-600">{label}</Label>
                        <Input
                          value={(h as Record<string, string | undefined>)[key] ?? ""}
                          onChange={(e) => setHero(key, e.target.value)}
                          className="h-9 font-mono text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  type="button"
                  className="bg-navy text-white hover:bg-navy/90 shadow-md gap-2 px-6"
                  disabled={saving || !settingsRow}
                  onClick={handleSaveBranding}
                >
                  <Save className="w-4 h-4" />
                  {saving ? "Saving…" : "Save branding"}
                </Button>
              </>
            )}
          </CardContent>
        </Card>


      </div>
    </div>
  );
}
