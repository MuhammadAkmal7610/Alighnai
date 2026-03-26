import { NextResponse } from "next/server";
import { ModernCMS } from "@/lib/modern-cms";
import { cmsAuthAdmin } from "@/lib/cms-auth";
import type { UserRole as UserRoleT } from "@/lib/cms-enums";
import { UserRole } from "@/lib/cms-enums";

const ROLES = new Set<string>(Object.values(UserRole));

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await cmsAuthAdmin();
  if (!authResult.ok) return authResult.response;

  const { id } = await params;
  try {
    const body = await request.json();
    const payload: Partial<{
      name: string;
      bio: string | null;
      role: UserRoleT;
    }> = {};
    if (typeof body.name === "string") payload.name = body.name.trim();
    if (body.bio === null || typeof body.bio === "string") payload.bio = body.bio;
    if (typeof body.role === "string") {
      if (!ROLES.has(body.role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }
      payload.role = body.role as UserRoleT;
    }

    if (Object.keys(payload).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const updated = await ModernCMS.updateUser(id, payload);
    return NextResponse.json({ user: updated });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Update failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await cmsAuthAdmin();
  if (!authResult.ok) return authResult.response;

  const { id } = await params;
  if (id === authResult.session.user?.id) {
    return NextResponse.json(
      { error: "You cannot delete your own account" },
      { status: 400 }
    );
  }

  try {
    await ModernCMS.deleteUser(id);
    return NextResponse.json({ ok: true });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Delete failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
