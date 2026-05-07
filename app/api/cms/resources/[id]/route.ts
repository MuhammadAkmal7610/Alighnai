import { NextResponse } from "next/server";
import { z } from "zod";
import { cmsAuth } from "@/lib/cms-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const patchSchema = z
  .object({
    title: z.string().min(1).max(300).optional(),
    description: z.string().max(4000).optional().nullable(),
    fileUrl: z.string().url().max(2000).optional(),
    sortOrder: z.number().int().min(0).max(9999).optional(),
    published: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, {
    message: "No fields to update",
  });

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await cmsAuth();
  if (!authResult.ok) return authResult.response;

  const { id } = await params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { error: first?.message || "Invalid data" },
      { status: 400 }
    );
  }

  const data: Record<string, unknown> = {};
  if (parsed.data.title !== undefined) data.title = parsed.data.title.trim();
  if (parsed.data.description !== undefined)
    data.description = parsed.data.description?.trim() || null;
  if (parsed.data.fileUrl !== undefined)
    data.fileUrl = parsed.data.fileUrl.trim();
  if (parsed.data.sortOrder !== undefined) data.sortOrder = parsed.data.sortOrder;
  if (parsed.data.published !== undefined) data.published = parsed.data.published;

  try {
    const updated = await prisma.clientResource.update({
      where: { id },
      data,
    });
    return NextResponse.json({
      resource: {
        ...updated,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
      },
    });
  } catch (error: unknown) {
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? String((error as { code?: string }).code)
        : "";
    if (code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error(`[cms/resources/${id}][PATCH]`, error);
    return NextResponse.json(
      { error: "Failed to update resource", details: msg },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await cmsAuth();
  if (!authResult.ok) return authResult.response;

  const { id } = await params;
  try {
    await prisma.clientResource.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const code =
      typeof error === "object" && error !== null && "code" in error
        ? String((error as { code?: string }).code)
        : "";
    if (code === "P2025") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error(`[cms/resources/${id}][DELETE]`, error);
    return NextResponse.json(
      { error: "Failed to delete resource", details: msg },
      { status: 500 }
    );
  }
}
