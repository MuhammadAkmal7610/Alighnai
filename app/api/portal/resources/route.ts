import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { assertClientSession } from "@/lib/portal-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  if (!assertClientSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const items = await prisma.clientResource.findMany({
      where: { published: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      select: {
        id: true,
        title: true,
        description: true,
        fileUrl: true,
        createdAt: true,
      },
    });
    return NextResponse.json({ resources: items });
  } catch (e) {
    console.error("[portal/resources]", e);
    return NextResponse.json(
      { error: "Failed to load resources" },
      { status: 500 }
    );
  }
}
