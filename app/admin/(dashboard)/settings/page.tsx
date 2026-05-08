"use client";

import {
  useCallback,
  useEffect,
  useState,
  type DragEvent,
} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  GripVertical,
  Layout,
  Loader2,
  Palette,
  Plus,
  Save,
  Share2,
  Trash2,
  PanelTop,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CMS_H1, CMS_PAGE_HEADER, CMS_PAGE_SHELL } from "@/lib/cms-page-shell";
import type { SiteThemeBlock } from "@/lib/site-theme";
import {
  DEFAULT_CONTACT,
  DEFAULT_FOOTER,
  DEFAULT_LOADER,
  DEFAULT_NAV_ITEMS,
  DEFAULT_SOCIALS,
  defaultSocialLabel,
  parseSiteSettings,
  type ContactInfo,
  type FooterColumn,
  type FooterConfig,
  type LoaderConfig,
  type NavConfig,
  type NavItem,
  type SocialLink,
  type SocialPlatform,
} from "@/lib/site-settings";

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

const SOCIAL_PLATFORMS: { value: SocialPlatform; label: string }[] = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "twitter", label: "X / Twitter" },
  { value: "youtube", label: "YouTube" },
  { value: "github", label: "GitHub" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "website", label: "Website" },
  { value: "email", label: "Email" },
];

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savingSection, setSavingSection] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const [settingsRow, setSettingsRow] = useState<InfoRow | null>(null);
  const [siteName, setSiteName] = useState("AlignAI");
  const [theme, setTheme] = useState<SiteThemeBlock>(emptyTheme);
  const [nav, setNav] = useState<NavConfig>({ items: DEFAULT_NAV_ITEMS });
  const [footer, setFooter] = useState<FooterConfig>(DEFAULT_FOOTER);
  const [contact, setContact] = useState<ContactInfo>(DEFAULT_CONTACT);
  const [socials, setSocials] = useState<SocialLink[]>(DEFAULT_SOCIALS);
  const [loader, setLoader] = useState<LoaderConfig>(DEFAULT_LOADER);

  // Drag state for nav items list
  const [navDragId, setNavDragId] = useState<number | null>(null);
  const [navDragOver, setNavDragOver] = useState<number | null>(null);

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
      const parsed = parseSiteSettings(meta);
      setNav(parsed.nav);
      setFooter(parsed.footer);
      setContact(parsed.contact);
      setSocials(parsed.socials);
      setLoader(parsed.loader);
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

  async function persistMetadata(
    nextMeta: Record<string, unknown>,
    successMessage: string,
    sectionId?: string
  ) {
    if (!settingsRow) {
      setMessage({ type: "err", text: "SETTINGS record not found. Run DB seed." });
      return;
    }
    setSaving(true);
    if (sectionId) setSavingSection(sectionId);
    setMessage(null);
    try {
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
      setMessage({ type: "ok", text: successMessage });
    } catch (e) {
      setMessage({
        type: "err",
        text: e instanceof Error ? e.message : "Save failed",
      });
    } finally {
      setSaving(false);
      setSavingSection(null);
    }
  }

  function currentMeta(): Record<string, unknown> {
    return settingsRow?.metadata && typeof settingsRow.metadata === "object"
      ? { ...(settingsRow.metadata as Record<string, unknown>) }
      : {};
  }

  async function handleSaveBranding() {
    const prevMeta = currentMeta();
    const assets = {
      ...theme.assets,
      logoUrl: theme.assets?.logoUrl?.trim() || undefined,
      faviconUrl: theme.assets?.faviconUrl?.trim() || undefined,
    };
    const nextMeta = {
      ...prevMeta,
      siteName,
      theme: { ...theme, assets },
    };
    await persistMetadata(
      nextMeta,
      "Branding saved. Refresh the public site to see colors and hero shape updates.",
      "branding"
    );
  }

  async function handleSaveNav() {
    const cleanedItems = nav.items
      .map((i) => ({
        label: i.label.trim(),
        href: i.href.trim(),
        openInNewTab: i.openInNewTab || undefined,
        hidden: i.hidden || undefined,
      }))
      .filter((i) => i.label && i.href);
    const cta = nav.cta;
    const cleanedCta =
      cta && cta.label.trim() && cta.href.trim()
        ? {
            label: cta.label.trim(),
            href: cta.href.trim(),
            openInNewTab: cta.openInNewTab || undefined,
          }
        : undefined;
    const nextMeta = {
      ...currentMeta(),
      nav: { items: cleanedItems, cta: cleanedCta },
    };
    await persistMetadata(nextMeta, "Navigation saved.", "nav");
  }

  async function handleSaveFooter() {
    const cleanedColumns: FooterColumn[] = footer.columns
      .map((c) => ({
        title: c.title.trim(),
        links: c.links
          .map((l) => ({
            label: l.label.trim(),
            href: l.href.trim(),
            openInNewTab: l.openInNewTab || undefined,
          }))
          .filter((l) => l.label && l.href),
      }))
      .filter((c) => c.title);
    const nextMeta = {
      ...currentMeta(),
      footer: {
        description: footer.description.trim(),
        address: footer.address.trim(),
        columns: cleanedColumns,
        showClientAccess: footer.showClientAccess,
        copyright: footer.copyright.trim(),
        legalNote: footer.legalNote.trim(),
      },
    };
    await persistMetadata(nextMeta, "Footer saved.", "footer");
  }

  async function handleSaveSocials() {
    const cleanedSocials = socials
      .map((s) => ({
        platform: s.platform,
        label: s.label.trim() || defaultSocialLabel(s.platform),
        url: s.url.trim(),
      }))
      .filter((s) => s.url);
    const nextMeta = {
      ...currentMeta(),
      socials: cleanedSocials,
      contact: {
        email: contact.email?.trim() || undefined,
        phone: contact.phone?.trim() || undefined,
        location: contact.location?.trim() || undefined,
      },
    };
    await persistMetadata(nextMeta, "Socials & contact saved.", "socials");
  }

  async function handleSaveLoader() {
    const nextMeta = {
      ...currentMeta(),
      loader: {
        title: loader.title.trim() || DEFAULT_LOADER.title,
        subtitle: loader.subtitle.trim() || DEFAULT_LOADER.subtitle,
      },
    };
    await persistMetadata(nextMeta, "Loader saved.", "loader");
  }

  // Nav item helpers
  function updateNavItem(index: number, patch: Partial<NavItem>) {
    setNav((n) => ({
      ...n,
      items: n.items.map((it, i) => (i === index ? { ...it, ...patch } : it)),
    }));
  }
  function removeNavItem(index: number) {
    setNav((n) => ({
      ...n,
      items: n.items.filter((_, i) => i !== index),
    }));
  }
  function addNavItem() {
    setNav((n) => ({
      ...n,
      items: [...n.items, { label: "New link", href: "/site/" }],
    }));
  }

  function handleNavDragStart(e: DragEvent<HTMLDivElement>, idx: number) {
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(idx));
    setNavDragId(idx);
  }
  function handleNavDragOver(e: DragEvent<HTMLDivElement>, idx: number) {
    if (navDragId === null || navDragId === idx) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setNavDragOver(idx);
  }
  function handleNavDrop(e: DragEvent<HTMLDivElement>, idx: number) {
    e.preventDefault();
    if (navDragId === null || navDragId === idx) {
      setNavDragId(null);
      setNavDragOver(null);
      return;
    }
    setNav((n) => {
      const next = [...n.items];
      const [moved] = next.splice(navDragId, 1);
      next.splice(idx, 0, moved);
      return { ...n, items: next };
    });
    setNavDragId(null);
    setNavDragOver(null);
  }
  function handleNavDragEnd() {
    setNavDragId(null);
    setNavDragOver(null);
  }

  // Socials helpers
  function updateSocial(index: number, patch: Partial<SocialLink>) {
    setSocials((arr) =>
      arr.map((s, i) => (i === index ? { ...s, ...patch } : s))
    );
  }
  function removeSocial(index: number) {
    setSocials((arr) => arr.filter((_, i) => i !== index));
  }
  function addSocial() {
    setSocials((arr) => [
      ...arr,
      { platform: "linkedin", label: "LinkedIn", url: "" },
    ]);
  }

  // Footer column helpers
  function updateColumn(index: number, patch: Partial<FooterColumn>) {
    setFooter((f) => ({
      ...f,
      columns: f.columns.map((c, i) => (i === index ? { ...c, ...patch } : c)),
    }));
  }
  function removeColumn(index: number) {
    setFooter((f) => ({
      ...f,
      columns: f.columns.filter((_, i) => i !== index),
    }));
  }
  function addColumn() {
    setFooter((f) => ({
      ...f,
      columns: [...f.columns, { title: "Column", links: [] }],
    }));
  }
  function updateColumnLink(
    colIdx: number,
    linkIdx: number,
    patch: Partial<FooterColumn["links"][number]>
  ) {
    setFooter((f) => ({
      ...f,
      columns: f.columns.map((c, ci) =>
        ci === colIdx
          ? {
              ...c,
              links: c.links.map((l, li) =>
                li === linkIdx ? { ...l, ...patch } : l
              ),
            }
          : c
      ),
    }));
  }
  function addColumnLink(colIdx: number) {
    setFooter((f) => ({
      ...f,
      columns: f.columns.map((c, ci) =>
        ci === colIdx
          ? { ...c, links: [...c.links, { label: "Link", href: "/" }] }
          : c
      ),
    }));
  }
  function removeColumnLink(colIdx: number, linkIdx: number) {
    setFooter((f) => ({
      ...f,
      columns: f.columns.map((c, ci) =>
        ci === colIdx
          ? { ...c, links: c.links.filter((_, li) => li !== linkIdx) }
          : c
      ),
    }));
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
            Branding, navigation, footer, socials and loader for the public site
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

      {loading ? (
        <p className="text-sm text-slate-500">
          <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
          Loading…
        </p>
      ) : (
        <Tabs defaultValue="branding" className="w-full">
          <TabsList className="mb-6 flex h-auto w-full flex-wrap justify-start gap-1 bg-slate-100 p-1">
            <TabsTrigger value="branding" className="gap-2">
              <Palette className="h-3.5 w-3.5" />
              Branding
            </TabsTrigger>
            <TabsTrigger value="nav" className="gap-2">
              <PanelTop className="h-3.5 w-3.5" />
              Navigation
            </TabsTrigger>
            <TabsTrigger value="footer" className="gap-2">
              <Layout className="h-3.5 w-3.5" />
              Footer
            </TabsTrigger>
            <TabsTrigger value="socials" className="gap-2">
              <Share2 className="h-3.5 w-3.5" />
              Socials &amp; contact
            </TabsTrigger>
            <TabsTrigger value="loader" className="gap-2">
              <Loader2 className="h-3.5 w-3.5" />
              Loader
            </TabsTrigger>
          </TabsList>

          {/* BRANDING ============================================== */}
          <TabsContent value="branding">
            <Card className="bg-white border-slate-200 shadow-sm overflow-hidden rounded-xl">
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
                  {savingSection === "branding" ? "Saving…" : "Save branding"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* NAVIGATION ============================================ */}
          <TabsContent value="nav">
            <Card className="bg-white border-slate-200 shadow-sm overflow-hidden rounded-xl">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-navy flex items-center gap-2 font-bold">
                  <PanelTop className="h-5 w-5 text-mid-blue" />
                  Header navigation
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium">
                  Drag rows to reorder. Items also drive the footer's main nav list.
                  Empty list falls back to the original 6 defaults.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  {nav.items.map((item, idx) => (
                    <div
                      key={`${idx}`}
                      draggable
                      onDragStart={(e) => handleNavDragStart(e, idx)}
                      onDragOver={(e) => handleNavDragOver(e, idx)}
                      onDrop={(e) => handleNavDrop(e, idx)}
                      onDragEnd={handleNavDragEnd}
                      className={cn(
                        "flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-3 transition-colors sm:flex-row sm:items-center",
                        navDragId === idx && "opacity-40",
                        navDragOver === idx && "bg-cyan/10"
                      )}
                    >
                      <div
                        className="flex h-9 w-9 shrink-0 cursor-grab items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-400 hover:text-navy active:cursor-grabbing"
                        title="Drag to reorder"
                      >
                        <GripVertical className="h-4 w-4" />
                      </div>
                      <Input
                        value={item.label}
                        onChange={(e) => updateNavItem(idx, { label: e.target.value })}
                        placeholder="Label"
                        className="h-9 border-slate-200 sm:w-44"
                      />
                      <Input
                        value={item.href}
                        onChange={(e) => updateNavItem(idx, { href: e.target.value })}
                        placeholder="/site/path or https://…"
                        className="h-9 flex-1 border-slate-200 font-mono text-xs"
                      />
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                        <Switch
                          checked={!!item.openInNewTab}
                          onCheckedChange={(v) =>
                            updateNavItem(idx, { openInNewTab: Boolean(v) })
                          }
                        />
                        New tab
                      </label>
                      <label className="flex items-center gap-2 text-xs font-medium text-slate-600">
                        <Switch
                          checked={!!item.hidden}
                          onCheckedChange={(v) =>
                            updateNavItem(idx, { hidden: Boolean(v) })
                          }
                        />
                        Hidden
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 border-slate-200 p-0 text-slate-400 hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                        onClick={() => removeNavItem(idx)}
                        title="Remove"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="border-slate-200 gap-2"
                  onClick={addNavItem}
                >
                  <Plus className="h-4 w-4" />
                  Add link
                </Button>

                <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                  <p className="text-sm font-bold text-navy">Optional CTA button</p>
                  <p className="text-xs text-slate-500">
                    Renders to the right of the nav. Leave empty to hide.
                  </p>
                  <div className="grid gap-3 sm:grid-cols-[1fr_2fr_auto]">
                    <Input
                      value={nav.cta?.label ?? ""}
                      onChange={(e) =>
                        setNav((n) => ({
                          ...n,
                          cta: {
                            ...(n.cta || { href: "" }),
                            label: e.target.value,
                          },
                        }))
                      }
                      placeholder="Label (e.g. Book a call)"
                      className="h-10 border-slate-200"
                    />
                    <Input
                      value={nav.cta?.href ?? ""}
                      onChange={(e) =>
                        setNav((n) => ({
                          ...n,
                          cta: {
                            ...(n.cta || { label: "" }),
                            href: e.target.value,
                          },
                        }))
                      }
                      placeholder="/site/contact or https://…"
                      className="h-10 border-slate-200 font-mono text-xs"
                    />
                    <label className="flex items-center gap-2 px-2 text-xs font-medium text-slate-600">
                      <Switch
                        checked={!!nav.cta?.openInNewTab}
                        onCheckedChange={(v) =>
                          setNav((n) => ({
                            ...n,
                            cta: {
                              ...(n.cta || { label: "", href: "" }),
                              openInNewTab: Boolean(v),
                            },
                          }))
                        }
                      />
                      New tab
                    </label>
                  </div>
                </div>

                <Button
                  type="button"
                  className="bg-navy text-white hover:bg-navy/90 shadow-md gap-2 px-6"
                  disabled={saving || !settingsRow}
                  onClick={handleSaveNav}
                >
                  <Save className="w-4 h-4" />
                  {savingSection === "nav" ? "Saving…" : "Save navigation"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FOOTER ================================================ */}
          <TabsContent value="footer">
            <Card className="bg-white border-slate-200 shadow-sm overflow-hidden rounded-xl">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-navy flex items-center gap-2 font-bold">
                  <Layout className="h-5 w-5 text-mid-blue" />
                  Footer content
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium">
                  Description, address, optional link columns, copyright and legal note. Socials live in the next tab.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-navy">Description</Label>
                    <Textarea
                      rows={3}
                      value={footer.description}
                      onChange={(e) =>
                        setFooter((f) => ({ ...f, description: e.target.value }))
                      }
                      className="resize-none border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-navy">Address line</Label>
                    <Textarea
                      rows={3}
                      value={footer.address}
                      onChange={(e) =>
                        setFooter((f) => ({ ...f, address: e.target.value }))
                      }
                      className="resize-none border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-navy">Copyright</Label>
                    <Input
                      value={footer.copyright}
                      onChange={(e) =>
                        setFooter((f) => ({ ...f, copyright: e.target.value }))
                      }
                      className="h-10 border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-navy">Legal note</Label>
                    <Input
                      value={footer.legalNote}
                      onChange={(e) =>
                        setFooter((f) => ({ ...f, legalNote: e.target.value }))
                      }
                      className="h-10 border-slate-200"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 rounded-md border border-slate-200 bg-slate-50/60 px-3 py-2">
                  <Switch
                    checked={footer.showClientAccess}
                    onCheckedChange={(v) =>
                      setFooter((f) => ({ ...f, showClientAccess: Boolean(v) }))
                    }
                  />
                  <span className="text-sm font-medium text-navy">
                    Show "Client Access" link in default contact column
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-navy">Custom link columns</p>
                      <p className="text-xs text-slate-500">
                        When at least one column is added, the default contact column is replaced by these.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-slate-200 gap-2"
                      onClick={addColumn}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add column
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {footer.columns.map((col, ci) => (
                      <div
                        key={ci}
                        className="rounded-lg border border-slate-200 bg-slate-50/40 p-3"
                      >
                        <div className="mb-3 flex items-center gap-2">
                          <Input
                            value={col.title}
                            onChange={(e) =>
                              updateColumn(ci, { title: e.target.value })
                            }
                            placeholder="Column title"
                            className="h-9 border-slate-200 sm:max-w-xs"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="ml-auto h-8 w-8 border-slate-200 p-0 text-slate-400 hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                            onClick={() => removeColumn(ci)}
                            title="Remove column"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          {col.links.map((link, li) => (
                            <div
                              key={li}
                              className="flex flex-col gap-2 rounded-md border border-slate-200 bg-white p-2 sm:flex-row sm:items-center"
                            >
                              <Input
                                value={link.label}
                                onChange={(e) =>
                                  updateColumnLink(ci, li, {
                                    label: e.target.value,
                                  })
                                }
                                placeholder="Label"
                                className="h-9 border-slate-200 sm:w-40"
                              />
                              <Input
                                value={link.href}
                                onChange={(e) =>
                                  updateColumnLink(ci, li, {
                                    href: e.target.value,
                                  })
                                }
                                placeholder="/path or https://…"
                                className="h-9 flex-1 border-slate-200 font-mono text-xs"
                              />
                              <label className="flex items-center gap-2 px-2 text-xs font-medium text-slate-600">
                                <Switch
                                  checked={!!link.openInNewTab}
                                  onCheckedChange={(v) =>
                                    updateColumnLink(ci, li, {
                                      openInNewTab: Boolean(v),
                                    })
                                  }
                                />
                                New tab
                              </label>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-8 w-8 border-slate-200 p-0 text-slate-400 hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                                onClick={() => removeColumnLink(ci, li)}
                                title="Remove link"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="border-slate-200 gap-2"
                            onClick={() => addColumnLink(ci)}
                          >
                            <Plus className="h-3.5 w-3.5" />
                            Add link
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  type="button"
                  className="bg-navy text-white hover:bg-navy/90 shadow-md gap-2 px-6"
                  disabled={saving || !settingsRow}
                  onClick={handleSaveFooter}
                >
                  <Save className="w-4 h-4" />
                  {savingSection === "footer" ? "Saving…" : "Save footer"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SOCIALS & CONTACT ===================================== */}
          <TabsContent value="socials">
            <Card className="bg-white border-slate-200 shadow-sm overflow-hidden rounded-xl">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-navy flex items-center gap-2 font-bold">
                  <Share2 className="h-5 w-5 text-mid-blue" />
                  Social links &amp; contact
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium">
                  Social icons appear in the footer. Contact info populates the default contact column and Client Portal CTA.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-8">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-navy">Contact email</Label>
                    <Input
                      value={contact.email ?? ""}
                      onChange={(e) =>
                        setContact((c) => ({ ...c, email: e.target.value }))
                      }
                      placeholder="hello@example.com"
                      className="h-10 border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-navy">Phone (optional)</Label>
                    <Input
                      value={contact.phone ?? ""}
                      onChange={(e) =>
                        setContact((c) => ({ ...c, phone: e.target.value }))
                      }
                      placeholder="+1 555 555 5555"
                      className="h-10 border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-navy">Location</Label>
                    <Input
                      value={contact.location ?? ""}
                      onChange={(e) =>
                        setContact((c) => ({ ...c, location: e.target.value }))
                      }
                      placeholder="Ottawa, ON"
                      className="h-10 border-slate-200"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-navy">Social links</p>
                      <p className="text-xs text-slate-500">
                        Used in the footer. Pick a platform — icon is auto-mapped.
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-slate-200 gap-2"
                      onClick={addSocial}
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add social
                    </Button>
                  </div>

                  <div className="space-y-2">
                    {socials.map((s, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col gap-2 rounded-md border border-slate-200 bg-white p-2 sm:flex-row sm:items-center"
                      >
                        <Select
                          value={s.platform}
                          onValueChange={(v) =>
                            updateSocial(idx, {
                              platform: v as SocialPlatform,
                              label:
                                s.label && s.label !== defaultSocialLabel(s.platform)
                                  ? s.label
                                  : defaultSocialLabel(v as SocialPlatform),
                            })
                          }
                        >
                          <SelectTrigger className="h-9 border-slate-200 sm:w-44">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SOCIAL_PLATFORMS.map((p) => (
                              <SelectItem key={p.value} value={p.value}>
                                {p.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          value={s.label}
                          onChange={(e) =>
                            updateSocial(idx, { label: e.target.value })
                          }
                          placeholder="Label"
                          className="h-9 border-slate-200 sm:w-44"
                        />
                        <Input
                          value={s.url}
                          onChange={(e) => updateSocial(idx, { url: e.target.value })}
                          placeholder="https://… or email"
                          className="h-9 flex-1 border-slate-200 font-mono text-xs"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 border-slate-200 p-0 text-slate-400 hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                          onClick={() => removeSocial(idx)}
                          title="Remove"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  type="button"
                  className="bg-navy text-white hover:bg-navy/90 shadow-md gap-2 px-6"
                  disabled={saving || !settingsRow}
                  onClick={handleSaveSocials}
                >
                  <Save className="w-4 h-4" />
                  {savingSection === "socials" ? "Saving…" : "Save socials & contact"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* LOADER ================================================ */}
          <TabsContent value="loader">
            <Card className="bg-white border-slate-200 shadow-sm overflow-hidden rounded-xl">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100">
                <CardTitle className="text-navy flex items-center gap-2 font-bold">
                  <Loader2 className="h-5 w-5 text-mid-blue" />
                  Page loader
                </CardTitle>
                <CardDescription className="text-slate-500 font-medium">
                  Shown while pages are loading. Title falls back to the brand logo when set.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-navy">Title (used if no logo)</Label>
                    <Input
                      value={loader.title}
                      onChange={(e) =>
                        setLoader((l) => ({ ...l, title: e.target.value }))
                      }
                      className="h-10 border-slate-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-navy">Subtitle</Label>
                    <Input
                      value={loader.subtitle}
                      onChange={(e) =>
                        setLoader((l) => ({ ...l, subtitle: e.target.value }))
                      }
                      placeholder="Loading…"
                      className="h-10 border-slate-200"
                    />
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-8">
                  <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    Preview
                  </p>
                  <div className="flex flex-col items-center justify-center gap-6 rounded-md bg-white py-10">
                    <h2 className="font-heading text-xl font-bold text-slate-900">
                      {loader.title}
                    </h2>
                    <div className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900" />
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
                      {loader.subtitle}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  className="bg-navy text-white hover:bg-navy/90 shadow-md gap-2 px-6"
                  disabled={saving || !settingsRow}
                  onClick={handleSaveLoader}
                >
                  <Save className="w-4 h-4" />
                  {savingSection === "loader" ? "Saving…" : "Save loader"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
