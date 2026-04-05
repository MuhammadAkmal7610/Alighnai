import type { Session } from "next-auth";
import { UserRole } from "@/lib/cms-enums";

export function isClientRole(role: string | undefined): boolean {
  return role === UserRole.CLIENT;
}

export function assertClientSession(session: Session | null): session is Session & {
  user: { id: string; email: string; role: string };
} {
  return Boolean(
    session?.user?.id &&
      session.user.email &&
      isClientRole(session.user.role)
  );
}
