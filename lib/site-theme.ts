/**
 * Site branding / theme stored on `Info` row `SETTINGS.metadata.theme`.
 * Applied via `:root` CSS variables (see `buildRootThemeCss`).
 */

export const DEFAULT_LOGO_URL = "/brand/logo-bg-black.png";

export type SiteThemeColors = {
  navy?: string;
  deepBlue?: string;
  midBlue?: string;
  cyan?: string;
  slate?: string;
  lightSlate?: string;
  offWhite?: string;
  /** Footer band (e.g. #08162e) */
  footerBg?: string;
};

export type SiteThemeAssets = {
  logoUrl?: string;
  faviconUrl?: string;
};

/** Hero panel + decorative triangle (::before) — maps to CSS variables in `globals.css` */
export type SiteThemeHeroDecor = {
  /** Hero panel background (default #0c1e39) */
  panelBg?: string;
  /** Grid line color in repeating gradients (default rgba(99,188,231,0.045)) */
  gridLine?: string;
  triangleRight?: string;
  triangleBottom?: string;
  triangleBorderLeft?: string;
  triangleBorderRight?: string;
  /** e.g. 500px — height of the triangle “blade” */
  triangleBorderBottomWidth?: string;
  triangleColor?: string;
  /** Used with `.hero-panel.dark-shape-override` */
  triangleColorDark?: string;
  /** ::after scanlines opacity 0–1 */
  scanOpacity?: string;
};

export type SiteThemeBlock = {
  colors?: SiteThemeColors;
  assets?: SiteThemeAssets;
  heroDecor?: SiteThemeHeroDecor;
};

const DEFAULT_COLORS: Required<SiteThemeColors> = {
  navy: "#0C1E39",
  deepBlue: "#274185",
  midBlue: "#407BB7",
  cyan: "#63BCE7",
  slate: "#84899A",
  lightSlate: "#C8CDD8",
  offWhite: "#F4F6F9",
  footerBg: "#08162e",
};

const DEFAULT_HERO: Required<SiteThemeHeroDecor> = {
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
};

function record(meta: unknown): Record<string, unknown> {
  if (!meta || typeof meta !== "object") return {};
  return meta as Record<string, unknown>;
}

/** Reads `metadata.theme` from SETTINGS Info row */
export function extractThemeBlock(metadata: unknown): SiteThemeBlock | undefined {
  const m = record(metadata).theme;
  if (!m || typeof m !== "object") return undefined;
  return m as SiteThemeBlock;
}

export function resolveLogoUrl(metadata: unknown): string {
  const t = extractThemeBlock(metadata);
  const url = t?.assets?.logoUrl?.trim();
  if (url) return url;
  return DEFAULT_LOGO_URL;
}

export function resolveFaviconUrl(metadata: unknown): string | undefined {
  const t = extractThemeBlock(metadata);
  const url = t?.assets?.faviconUrl?.trim();
  return url || undefined;
}

export function buildRootThemeCss(theme: SiteThemeBlock | undefined): string {
  const c = { ...DEFAULT_COLORS, ...theme?.colors };
  const h = { ...DEFAULT_HERO, ...theme?.heroDecor };

  const lines: string[] = [
    `--color-navy: ${c.navy};`,
    `--color-deep-blue: ${c.deepBlue};`,
    `--color-mid-blue: ${c.midBlue};`,
    `--color-cyan: ${c.cyan};`,
    `--color-slate: ${c.slate};`,
    `--color-light-slate: ${c.lightSlate};`,
    `--color-off-white: ${c.offWhite};`,
    `--color-footer-bg: ${c.footerBg};`,
    `--hero-panel-bg: ${h.panelBg};`,
    `--hero-grid-line: ${h.gridLine};`,
    `--hero-triangle-right: ${h.triangleRight};`,
    `--hero-triangle-bottom: ${h.triangleBottom};`,
    `--hero-triangle-border-left: ${h.triangleBorderLeft};`,
    `--hero-triangle-border-right: ${h.triangleBorderRight};`,
    `--hero-triangle-border-bottom-width: ${h.triangleBorderBottomWidth};`,
    `--hero-triangle-color: ${h.triangleColor};`,
    `--hero-triangle-color-dark: ${h.triangleColorDark};`,
    `--hero-scan-opacity: ${h.scanOpacity};`,
  ];

  return `:root {\n  ${lines.join("\n  ")}\n}`;
}
