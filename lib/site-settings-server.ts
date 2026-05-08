import "server-only";

import { ModernCMS } from "@/lib/modern-cms";
import { InfoType } from "@/lib/cms-enums";
import {
  parseSiteSettings,
  DEFAULT_SITE_SETTINGS,
  type SiteSettings,
} from "@/lib/site-settings";

/**
 * Read parsed site settings from the SETTINGS Info row. Never throws — falls
 * back to defaults if the database is unreachable or the row doesn't exist.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const row = await ModernCMS.getInfo(InfoType.SETTINGS);
    return parseSiteSettings(row?.metadata);
  } catch {
    return DEFAULT_SITE_SETTINGS;
  }
}
