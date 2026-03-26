import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import type { Session } from "next-auth";

export type CmsAuthResult =
  | { ok: true; session: Session }
  | { ok: false; response: NextResponse };

export async function cmsAuth(): Promise<CmsAuthResult> {
  const session = await auth();
  if (!session?.user?.id && !session?.user?.email) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  return { ok: true, session };
}

/**
 * JWT may carry a stale user id (e.g. after DB reseed). Resolve a valid `users.id` for FK fields, or undefined.
 */
export async function resolveSessionAuthorId(
  session: Session
): Promise<string | undefined> {
  const rawId = session.user?.id;
  const email = session.user?.email?.trim();
  if (rawId) {
    const byId = await prisma.user.findUnique({
      where: { id: rawId },
      select: { id: true },
    });
    if (byId) return byId.id;
  }
  if (email) {
    const byEmail = await prisma.user.findFirst({
      where: { email: { equals: email, mode: "insensitive" } },
      select: { id: true },
    });
    if (byEmail) return byEmail.id;
  }
  return undefined;
}
