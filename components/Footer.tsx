"use client";

import Image from "next/image";
import Link from "next/link";
import { DEFAULT_LOGO_URL } from "@/lib/site-theme";

export type FooterNavLink = { href: string; label: string };

const BASE_FOOTER_NAV: FooterNavLink[] = [
  { href: "/site", label: "Home" },
  { href: "/site/framework", label: "The Framework" },
  { href: "/site/services", label: "Services" },
  { href: "/site/about", label: "About" },
  { href: "/site/insights", label: "Insights" },
  { href: "/site/contact", label: "Contact" },
];

interface FooterProps {
  /** When true (e.g. CMS iframe preview), internal links do not navigate */
  suppressNavigation?: boolean;
  /** Appended after core links — from CMS (showInFooter) */
  extraNavLinks?: FooterNavLink[];
  logoUrl?: string;
}

export function Footer({
  suppressNavigation,
  extraNavLinks = [],
  logoUrl = DEFAULT_LOGO_URL,
}: FooterProps = {}) {
  const baseHrefs = new Set(BASE_FOOTER_NAV.map((l) => l.href));
  const extrasFiltered = extraNavLinks.filter((l) => !baseHrefs.has(l.href));
  const footerNavLinks: FooterNavLink[] = [
    ...BASE_FOOTER_NAV,
    ...extrasFiltered,
  ];
  return (
    <footer className="bg-footer-bg text-light-slate">
      <div className="container-main py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="max-w-[300px]">
            <Link
              href="/site"
              className="font-heading text-base font-bold text-white"
              aria-label="ByteStream Strategies home"
              onClick={suppressNavigation ? (e) => e.preventDefault() : undefined}
            >
              <Image
                src={logoUrl}
                alt="AlignAI"
                width={160}
                height={40}
                className="h-14 w-auto"
              />
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-slate">
              Governance architecture for AI-influenced enterprise decisions.
              <span className="ml-2 inline-block text-xs text-slate">✦</span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-slate">
              ByteStream Strategies Inc., Ottawa, ON
            </p>
          </div>

          <nav aria-label="Footer navigation" className="md:justify-self-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate">
              Navigation
            </p>
            <ul className="mt-3 space-y-5 text-sm">
              {footerNavLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-500 transition-colors hover:text-white"
                    onClick={suppressNavigation ? (e) => e.preventDefault() : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:justify-self-end space-y-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate">
              Contact
            </p>
            <a
              href="mailto:bburke@bytestream.ca"
              className=" block text-sm hover:text-white text-zinc-500 transition-colors"
            >
              bburke@bytestream.ca
            </a>
            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noreferrer"
              className=" block text-sm hover:text-white text-zinc-500 transition-colors"
            >
              LinkedIn
            </a>
            <Link
              href="/site/client-access"
              className=" inline-block text-sm hover:text-white text-zinc-500 transition-colors"
              onClick={suppressNavigation ? (e) => e.preventDefault() : undefined}
            >
              Client Access
            </Link>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-deep-blue pt-6 text-xs text-slate md:flex-row md:items-center md:justify-between">
          <div>
            © 2026 ByteStream Strategies Inc.
          </div>

          <div>
            <span>✦</span> AlignAI is a proprietary framework developed by ByteStream Strategies Inc.
          </div>

        </div>
      </div>
    </footer>
  );
}




