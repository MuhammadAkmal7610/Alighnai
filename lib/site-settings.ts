/**
 * Reader / typed shape for editable site-wide settings stored on the
 * `Info` row where `type = SETTINGS` (`metadata` JSON column).
 *
 * Falls back to sensible defaults so the public site keeps working even
 * if the SETTINGS row is missing or some keys haven't been edited yet.
 *
 * Keep this file Pure (no `prisma` import) so it can be imported from both
 * client and server. The actual DB read lives in
 * `lib/site-settings-server.ts`.
 */

export type SocialPlatform =
  | "linkedin"
  | "twitter"
  | "x"
  | "youtube"
  | "github"
  | "instagram"
  | "facebook"
  | "website"
  | "email";

export type SocialLink = {
  platform: SocialPlatform;
  label: string;
  url: string;
};

export type NavItem = {
  label: string;
  href: string;
  openInNewTab?: boolean;
  hidden?: boolean;
};

export type CtaButton = {
  label: string;
  href: string;
  openInNewTab?: boolean;
};

export type ContactInfo = {
  email?: string;
  phone?: string;
  location?: string;
};

export type FooterLink = {
  label: string;
  href: string;
  openInNewTab?: boolean;
};

export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

export type FooterConfig = {
  description: string;
  address: string;
  columns: FooterColumn[];
  showClientAccess: boolean;
  copyright: string;
  legalNote: string;
};

export type LoaderConfig = {
  title: string;
  subtitle: string;
};

export type NavConfig = {
  items: NavItem[];
  cta?: CtaButton;
};

export type SiteSettings = {
  contact: ContactInfo;
  socials: SocialLink[];
  nav: NavConfig;
  footer: FooterConfig;
  loader: LoaderConfig;
};

export const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: "Home", href: "/site" },
  { label: "The Framework", href: "/site/framework" },
  { label: "Services", href: "/site/services" },
  { label: "About", href: "/site/about" },
  { label: "Insights", href: "/site/insights" },
  { label: "Contact", href: "/site/contact" },
];

export const DEFAULT_CONTACT: ContactInfo = {
  email: "bburke@bytestream.ca",
  location: "Ottawa, ON",
};

export const DEFAULT_SOCIALS: SocialLink[] = [
  {
    platform: "linkedin",
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/brian-burke-ai/",
  },
];

export const DEFAULT_FOOTER: FooterConfig = {
  description:
    "Governance architecture for AI-influenced enterprise decisions.",
  address: "ByteStream Strategies Inc., Ottawa, ON",
  columns: [],
  showClientAccess: true,
  copyright: "© 2026 ByteStream Strategies Inc.",
  legalNote:
    "AlignAI is a proprietary framework developed by ByteStream Strategies Inc.",
};

export const DEFAULT_LOADER: LoaderConfig = {
  title: "AlignAI",
  subtitle: "Loading…",
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  contact: DEFAULT_CONTACT,
  socials: DEFAULT_SOCIALS,
  nav: { items: DEFAULT_NAV_ITEMS },
  footer: DEFAULT_FOOTER,
  loader: DEFAULT_LOADER,
};

function obj(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}

function str(value: unknown, fallback: string): string {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed) return trimmed;
  }
  return fallback;
}

function strOpt(value: unknown): string | undefined {
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (trimmed) return trimmed;
  }
  return undefined;
}

function bool(value: unknown, fallback: boolean): boolean {
  if (typeof value === "boolean") return value;
  return fallback;
}

const VALID_PLATFORMS: ReadonlySet<SocialPlatform> = new Set([
  "linkedin",
  "twitter",
  "x",
  "youtube",
  "github",
  "instagram",
  "facebook",
  "website",
  "email",
]);

function normalizePlatform(value: unknown): SocialPlatform {
  if (typeof value === "string") {
    const lower = value.toLowerCase().trim() as SocialPlatform;
    if (VALID_PLATFORMS.has(lower)) return lower;
  }
  return "website";
}

function parseNavItems(raw: unknown): NavItem[] {
  if (!Array.isArray(raw)) return [];
  const items: NavItem[] = [];
  for (const r of raw) {
    const o = obj(r);
    const label = str(o.label, "");
    const href = str(o.href, "");
    if (!label || !href) continue;
    items.push({
      label,
      href,
      openInNewTab: bool(o.openInNewTab, false),
      hidden: bool(o.hidden, false),
    });
  }
  return items;
}

function parseCta(raw: unknown): CtaButton | undefined {
  const o = obj(raw);
  const label = strOpt(o.label);
  const href = strOpt(o.href);
  if (!label || !href) return undefined;
  return {
    label,
    href,
    openInNewTab: bool(o.openInNewTab, false),
  };
}

function parseSocials(raw: unknown): SocialLink[] {
  if (!Array.isArray(raw)) return [];
  const out: SocialLink[] = [];
  for (const r of raw) {
    const o = obj(r);
    const url = strOpt(o.url);
    if (!url) continue;
    const platform = normalizePlatform(o.platform);
    const label = str(o.label, defaultSocialLabel(platform));
    out.push({ platform, label, url });
  }
  return out;
}

export function defaultSocialLabel(platform: SocialPlatform): string {
  switch (platform) {
    case "linkedin":
      return "LinkedIn";
    case "twitter":
    case "x":
      return "X";
    case "youtube":
      return "YouTube";
    case "github":
      return "GitHub";
    case "instagram":
      return "Instagram";
    case "facebook":
      return "Facebook";
    case "email":
      return "Email";
    case "website":
    default:
      return "Website";
  }
}

function parseFooterLinks(raw: unknown): FooterLink[] {
  if (!Array.isArray(raw)) return [];
  const out: FooterLink[] = [];
  for (const r of raw) {
    const o = obj(r);
    const label = str(o.label, "");
    const href = str(o.href, "");
    if (!label || !href) continue;
    out.push({ label, href, openInNewTab: bool(o.openInNewTab, false) });
  }
  return out;
}

function parseFooterColumns(raw: unknown): FooterColumn[] {
  if (!Array.isArray(raw)) return [];
  const out: FooterColumn[] = [];
  for (const r of raw) {
    const o = obj(r);
    const title = str(o.title, "");
    if (!title) continue;
    out.push({ title, links: parseFooterLinks(o.links) });
  }
  return out;
}

function parseFooter(raw: unknown): FooterConfig {
  const o = obj(raw);
  return {
    description: str(o.description, DEFAULT_FOOTER.description),
    address: str(o.address, DEFAULT_FOOTER.address),
    columns: parseFooterColumns(o.columns),
    showClientAccess: bool(o.showClientAccess, DEFAULT_FOOTER.showClientAccess),
    copyright: str(o.copyright, DEFAULT_FOOTER.copyright),
    legalNote: str(o.legalNote, DEFAULT_FOOTER.legalNote),
  };
}

function parseContact(raw: unknown): ContactInfo {
  const o = obj(raw);
  return {
    email: strOpt(o.email) ?? DEFAULT_CONTACT.email,
    phone: strOpt(o.phone),
    location: strOpt(o.location) ?? DEFAULT_CONTACT.location,
  };
}

function parseLoader(raw: unknown): LoaderConfig {
  const o = obj(raw);
  return {
    title: str(o.title, DEFAULT_LOADER.title),
    subtitle: str(o.subtitle, DEFAULT_LOADER.subtitle),
  };
}

function parseNav(raw: unknown): NavConfig {
  const o = obj(raw);
  const items = parseNavItems(o.items);
  return {
    items: items.length ? items : DEFAULT_NAV_ITEMS,
    cta: parseCta(o.cta),
  };
}

/**
 * Parse settings from the raw `Info[SETTINGS].metadata` JSON. Always returns
 * a fully-populated `SiteSettings` object — missing keys fall back to defaults.
 */
export function parseSiteSettings(metadata: unknown): SiteSettings {
  const m = obj(metadata);
  const socials = parseSocials(m.socials);
  return {
    contact: parseContact(m.contact),
    socials: socials.length ? socials : DEFAULT_SOCIALS,
    nav: parseNav(m.nav),
    footer: parseFooter(m.footer),
    loader: parseLoader(m.loader),
  };
}

/** Visible (non-hidden) nav items, preserving order. */
export function visibleNavItems(nav: NavConfig): NavItem[] {
  return nav.items.filter((i) => !i.hidden);
}
