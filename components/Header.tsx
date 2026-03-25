"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";


const NAV_LINKS = [
  { href: "/site", label: "Home" },
  { href: "/site/framework", label: "The Framework" },
  { href: "/site/services", label: "Services" },
  { href: "/site/about", label: "About" },
  { href: "/site/insights", label: "Insights" },
  { href: "/site/contact", label: "Contact" },
];

interface HeaderProps {
  className?: string; // Allow overriding fixed positioning for editor
  pathname?: string;  // Allow overriding pathname for editor preview
}

export function Header({ className, pathname: propPathname }: HeaderProps) {
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

  return (
    <header
      className={cn(
        "z-50 transition-all duration-300",
        className || (mobileOpen ? "fixed top-0 left-0 right-0 bg-navy" : "fixed top-0 left-0 right-0 bg-navy/80 backdrop-blur-md border-b border-white/10")
      )}
    >
      <div className="container-main flex h-[80px] items-center justify-between">
        <Link
          href="/site"
          className="flex items-center gap-4 transition-opacity hover:opacity-80"
          aria-label="AlignAI home"
        >
          <Image
            src="/brand/logo-bg-black.png"
            alt="AlignAI Logo"
            width={140}
            height={35}
            className="h-7 w-auto"
            priority
          />
        </Link>

        <nav className="hidden md:block" aria-label="Primary navigation">
          <ul className="flex items-center gap-6">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative pb-1 text-[13px] font-semibold uppercase tracking-[0.07em] transition-colors ${isActive(link.href)
                      ? "text-white after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-cyan"
                      : "text-light-slate hover:text-white"
                    }`}
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
          className="fixed inset-x-0 top-[80px] bottom-0 z-[60] bg-navy md:hidden"
          aria-label="Mobile navigation"
        >
          <ul className="flex min-h-full flex-col items-center justify-center gap-10 px-6 py-10">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-xl font-bold uppercase tracking-widest ${isActive(link.href) ? "text-cyan" : "text-white"
                    }`}
                  onClick={() => setMobileOpen(false)}
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
