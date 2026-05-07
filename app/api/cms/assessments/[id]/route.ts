import { NextResponse } from "next/server";
import { z } from "zod";
import { cmsAuth, cmsAuthAdmin } from "@/lib/cms-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const ALLOWED_STATUS = [
  "SUBMITTED",
  "IN_REVIEW",
  "CONTACTED",
  "ARCHIVED",
] as const;

const patchSchema = z.object({
  status: z.enum(ALLOWED_STATUS),
});

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await cmsAuth();
  if (!authResult.ok) return authResult.response;

  const { id } = await params;
  try {
    const row = await prisma.assessmentIntake.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, email: true, name: true } },
      },
    });
    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({
      assessment: {
        id: row.id,
        status: row.status,
        createdAt: row.createdAt.toISOString(),
        updatedAt: row.updatedAt.toISOString(),
        user: row.user,
        payload: row.payload,
      },
    });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error(`[cms/assessments/${id}][GET]`, error);
    return NextResponse.json(
      { error: "Failed to fetch assessment", details: msg },
      { status: 500 }
    );
  }
}

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
    return NextResponse.json(
      { error: "Invalid status value" },
      { status: 400 }
    );
  }

  try {
    const updated = await prisma.assessmentIntake.update({
      where: { id },
      data: { status: parsed.data.status },
      include: {
        user: { select: { id: true, email: true, name: true } },
      },
    });
    return NextResponse.json({
      assessment: {
        id: updated.id,
        status: updated.status,
        createdAt: updated.createdAt.toISOString(),
        updatedAt: updated.updatedAt.toISOString(),
        user: updated.user,
        payload: updated.payload,
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
    console.error(`[cms/assessments/${id}][PATCH]`, error);
    return NextResponse.json(
      { error: "Failed to update assessment", details: msg },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await cmsAuthAdmin();
  if (!authResult.ok) return authResult.response;

  const { id } = await params;
  try {
    await prisma.assessmentIntake.delete({ where: { id } });
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
    console.error(`[cms/assessments/${id}][DELETE]`, error);
    return NextResponse.json(
      { error: "Failed to delete assessment", details: msg },
      { status: 500 }
    );
  }
}
