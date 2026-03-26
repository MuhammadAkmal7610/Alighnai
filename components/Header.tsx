"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { DEFAULT_LOGO_URL } from "@/lib/site-theme";

const NAV_LINKS = [
  { href: "/site", label: "Home" },
  { href: "/site/framework", label: "The Framework" },
  { href: "/site/services", label: "Services" },
  { href: "/site/about", label: "About" },
  { href: "/site/insights", label: "Insights" },
  { href: "/site/contact", label: "Contact" },
];

export type HeaderNavLink = { href: string; label: string };

interface HeaderProps {
  className?: string; // Allow overriding fixed positioning for editor
  pathname?: string; // Allow overriding pathname for editor preview
  /** When true (e.g. CMS iframe preview), nav links do not navigate — avoids leaving the editor */
  suppressNavigation?: boolean;
  /** Appended after core links — from CMS page metadata (showInNav) */
  extraNavLinks?: HeaderNavLink[];
  /** Admin → Settings → Branding */
  logoUrl?: string;
}

export function Header({
  className,
  pathname: propPathname,
  suppressNavigation,
  extraNavLinks = [],
  logoUrl = DEFAULT_LOGO_URL,
}: HeaderProps) {
  const currentPathname = usePathname();
  const effectivePathname = propPathname || currentPathname;
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  function isActive(href: string) {
    if (href === "/site") return effectivePathname === "/site";
    return effectivePathname.startsWith(href);
  }

  const coreHrefs = new Set(NAV_LINKS.map((l) => l.href));
  const extrasFiltered = extraNavLinks.filter((l) => !coreHrefs.has(l.href));
  const navLinks: HeaderNavLink[] = [
    ...NAV_LINKS.map((l) => ({ href: l.href, label: l.label })),
    ...extrasFiltered,
  ];

  return (
    <header
      className={cn(
        "z-50",
        className ||
          (mobileOpen
            ? "fixed left-0 right-0 top-0 bg-navy"
            : "fixed left-0 right-0 top-0 border-b border-white/10 bg-navy/80 backdrop-blur-md transition-colors duration-300")
      )}
    >
      <div
        className={cn(
          "container-main relative flex h-[80px] items-center justify-between",
          mobileOpen && "z-[70] bg-navy"
        )}
      >
        <Link
          href="/site"
          className="flex items-center gap-4 transition-opacity hover:opacity-80"
          aria-label="ByteStream Strategies home"
          onClick={suppressNavigation ? (e) => e.preventDefault() : undefined}
        >
          <Image
            src={logoUrl}
            alt="AlignAI Logo"
            width={140}
            height={35}
            className="h-14 w-auto"
            priority
          />
        </Link>

        <nav className="hidden md:block" aria-label="Primary navigation">
          <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative pb-1 text-[13px] font-semibold uppercase tracking-[0.07em] transition-colors ${isActive(link.href)
                      ? "text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-cyan"
                      : "text-light-slate hover:text-white"
                    }`}
                  onClick={suppressNavigation ? (e) => e.preventDefault() : undefined}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {mobileOpen ? (
              <>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-menu"
          className="fixed inset-0 z-[60] flex flex-col bg-navy pt-[80px] md:hidden"
          style={{ backgroundColor: "#0C1E39" }}
          aria-label="Mobile navigation"
        >
          <ul className="flex min-h-0 flex-1 flex-col items-center justify-center gap-10 px-6 py-10 pb-[max(2.5rem,env(safe-area-inset-bottom))]">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-xl font-bold uppercase tracking-widest ${isActive(link.href) ? "text-cyan" : "text-white"
                    }`}
                  onClick={(e) => {
                    if (suppressNavigation) e.preventDefault();
                    setMobileOpen(false);
                  }}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
