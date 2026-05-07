import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Sidebar } from "@/components/cms/ModernSidebar";
import { UserRole } from "@/lib/cms-enums";

export default async function CMSLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id || !session.user.email) {
    redirect("/admin/login");
  }

  if (session.user.role === UserRole.CLIENT) {
    redirect("/portal");
  }

  return <Sidebar>{children}</Sidebar>;
}
