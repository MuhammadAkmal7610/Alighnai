import { ModernCMS } from "@/lib/modern-cms";
import { InfoType } from "@/lib/cms-enums";
import {
  buildRootThemeCss,
  extractThemeBlock,
  resolveFaviconUrl,
  resolveLogoUrl,
  type SiteThemeBlock,
} from "@/lib/site-theme";

export async function getSiteSettingsRow() {
  return ModernCMS.getInfo(InfoType.SETTINGS);
}

export function themeCssFromMetadata(metadata: unknown): string {
  return buildRootThemeCss(extractThemeBlock(metadata));
}

export function brandingFromMetadata(metadata: unknown): {
  logoUrl: string;
  faviconUrl?: string;
  theme: SiteThemeBlock | undefined;
} {
  return {
    logoUrl: resolveLogoUrl(metadata),
    faviconUrl: resolveFaviconUrl(metadata),
    theme: extractThemeBlock(metadata),
  };
}
