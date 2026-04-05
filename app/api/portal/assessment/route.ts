import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { assertClientSession } from "@/lib/portal-auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const assessmentSchema = z.object({
  organizationName: z.string().min(1).max(500),
  contactName: z.string().min(1).max(200),
  contactEmail: z.string().email().max(320),
  roleTitle: z.string().max(200).optional().nullable(),
  primaryGoals: z.string().min(1).max(8000),
  timeline: z.string().max(500).optional().nullable(),
  currentAiUse: z.string().max(8000).optional().nullable(),
  additionalNotes: z.string().max(8000).optional().nullable(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!assertClientSession(session)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = assessmentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  try {
    const row = await prisma.assessmentIntake.create({
      data: {
        userId: session.user.id,
        payload: parsed.data as object,
        status: "SUBMITTED",
      },
    });
    return NextResponse.json({
      ok: true,
      id: row.id,
      message: "Your intake has been submitted. We will follow up shortly.",
    });
  } catch (e) {
    console.error("[portal/assessment]", e);
    return NextResponse.json(
      { error: "Could not save submission" },
      { status: 500 }
    );
  }
}
