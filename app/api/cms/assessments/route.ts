import { NextResponse } from "next/server";
import { cmsAuth } from "@/lib/cms-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function GET() {
  const authResult = await cmsAuth();
  if (!authResult.ok) return authResult.response;

  try {
    if (!process.env.DATABASE_URL?.trim()) {
      return NextResponse.json({ assessments: [] });
    }

    const rows = await prisma.assessmentIntake.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, email: true, name: true },
        },
      },
    });

    const assessments = rows.map((r) => ({
      id: r.id,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
      user: r.user,
      payload: r.payload,
    }));

    return NextResponse.json({ assessments });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("[cms/assessments][GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch assessments", details: msg },
      { status: 500 }
    );
  }
}
