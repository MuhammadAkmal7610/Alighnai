"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const NAV_LINKS = [
  { href: "/site", label: "Home" },
  { href: "/site/framework", label: "The Framework" },
  { href: "/site/services", label: "Assessment" },
  { href: "/site/about", label: "About" },
  { href: "/site/insights", label: "Insights" },
  { href: "/site/contact", label: "Contact" },
];

export function Header() {
  const pathname = usePathname();
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
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        mobileOpen ? "bg-navy" : "bg-navy/80 backdrop-blur-md border-b border-white/5"
      }`}
    >
      <div className="container-main flex h-[80px] items-center justify-between">
        <Link
          href="/site"
          className="transition-opacity hover:opacity-80"
          aria-label="AlignAI home"
        >
          <Image
            src="/brand/logo-bg-black.png"
            alt="AlignAI Logo"
            width={160}
            height={40}
            className="h-8 w-auto md:h-9"
            priority
          />
        </Link>

        <nav className="hidden md:block" aria-label="Primary navigation">
          <ul className="flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`text-[11px] font-bold uppercase tracking-[0.15em] transition-all duration-200 ${isActive(link.href)
                      ? "text-white border-b-2 border-cyan pb-1"
                      : "text-slate hover:text-white pb-1 border-b-2 border-transparent"
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
