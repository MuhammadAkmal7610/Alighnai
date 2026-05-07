import { NextResponse } from "next/server";
import { z } from "zod";
import { cmsAuth } from "@/lib/cms-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const createSchema = z.object({
  title: z.string().min(1).max(300),
  description: z.string().max(4000).optional().nullable(),
  fileUrl: z.string().url().max(2000),
  sortOrder: z.number().int().min(0).max(9999).optional(),
  published: z.boolean().optional(),
});

export async function GET() {
  const authResult = await cmsAuth();
  if (!authResult.ok) return authResult.response;

  try {
    if (!process.env.DATABASE_URL?.trim()) {
      return NextResponse.json({ resources: [] });
    }
    const rows = await prisma.clientResource.findMany({
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({
      resources: rows.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
        updatedAt: r.updatedAt.toISOString(),
      })),
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[cms/resources][GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch resources", details: msg },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authResult = await cmsAuth();
  if (!authResult.ok) return authResult.response;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message || "Invalid data" },
      { status: 400 }
    );
  }

  try {
    const created = await prisma.clientResource.create({
      data: {
        title: parsed.data.title.trim(),
        description: parsed.data.description?.trim() || null,
        fileUrl: parsed.data.fileUrl.trim(),
        sortOrder: parsed.data.sortOrder ?? 0,
        published: parsed.data.published ?? true,
      },
    });
    return NextResponse.json(
      {
        resource: {
          ...created,
          createdAt: created.createdAt.toISOString(),
          updatedAt: created.updatedAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[cms/resources][POST]", error);
    return NextResponse.json(
      { error: "Failed to create resource", details: msg },
      { status: 500 }
    );
  }
}
