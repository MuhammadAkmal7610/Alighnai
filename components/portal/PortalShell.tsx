"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { LayoutDashboard, FileStack, ClipboardList, LogOut } from "lucide-react";

const nav = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard, key: "dashboard" },
  { href: "/portal/resources", label: "Resources", icon: FileStack, key: "resources" },
  { href: "/portal/assessment", label: "Assessment intake", icon: ClipboardList, key: "assessment" },
] as const;

export function PortalShell({
  children,
  current,
}: {
  children: React.ReactNode;
  current: (typeof nav)[number]["key"];
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="flex items-center gap-3">
            <img src="/brand/logo-bg-white.png" alt="AlignAI" className="h-14 w-auto" />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Client portal
              </p>
            </div>
          </div>
          <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
            {nav.map((item) => {
              const active =
                item.key === current ||
                (item.href !== "/portal" && pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-navy text-white"
                      : "text-slate-600 hover:bg-slate-100 hover:text-navy"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </Link>
              );
            })}
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/portal/login" })}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
