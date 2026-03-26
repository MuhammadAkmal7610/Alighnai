import { NextResponse } from "next/server"
import { getSiteNavExtrasDetailedFromDb } from "@/lib/site-nav"

/** Public: published pages with nav/footer flags — for site layout (prefer server import) and preview iframe. */
export async function GET() {
  try {
    const { navExtras, footerExtras } = await getSiteNavExtrasDetailedFromDb()
    return NextResponse.json({
      navDetailed: navExtras,
      footerDetailed: footerExtras,
    })
  } catch {
    return NextResponse.json({ navDetailed: [], footerDetailed: [] })
  }
}
