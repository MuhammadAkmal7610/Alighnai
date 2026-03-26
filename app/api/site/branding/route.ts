import { NextResponse } from "next/server";
import { getSiteSettingsRow, brandingFromMetadata } from "@/lib/site-theme-server";

/** Public: logo + favicon URLs for preview iframe and clients */
export async function GET() {
  try {
    const row = await getSiteSettingsRow();
    const b = brandingFromMetadata(row?.metadata);
    return NextResponse.json({
      logoUrl: b.logoUrl,
      faviconUrl: b.faviconUrl ?? null,
    });
  } catch {
    return NextResponse.json({ logoUrl: "/brand/logo-bg-black.png", faviconUrl: null });
  }
}
