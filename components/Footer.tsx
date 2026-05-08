"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Facebook,
  Github,
  Globe,
  Instagram,
  Linkedin,
  Mail,
  Twitter,
  Youtube,
} from "lucide-react";
import { DEFAULT_LOGO_URL } from "@/lib/site-theme";
import {
  DEFAULT_CONTACT,
  DEFAULT_FOOTER,
  DEFAULT_NAV_ITEMS,
  DEFAULT_SOCIALS,
  type ContactInfo,
  type FooterConfig,
  type NavItem,
  type SocialLink,
  type SocialPlatform,
} from "@/lib/site-settings";

export type FooterNavLink = { href: string; label: string };

interface FooterProps {
  /** When true (e.g. CMS iframe preview), internal links do not navigate */
  suppressNavigation?: boolean;
  /**
   * Per-page extras (pages with `metadata.showInFooter`). Appended after
   * the configured `navItems`.
   */
  extraNavLinks?: FooterNavLink[];
  /** Primary footer navigation list (mirrors Header by default) */
  navItems?: NavItem[];
  /** Editable description / address copy */
  footer?: FooterConfig;
  /** Contact email/phone/location */
  contact?: ContactInfo;
  /** Repeatable socials (LinkedIn, X, etc.) */
  socials?: SocialLink[];
  logoUrl?: string;
}

function socialIcon(platform: SocialPlatform) {
  switch (platform) {
    case "linkedin":
      return Linkedin;
    case "twitter":
    case "x":
      return Twitter;
    case "youtube":
      return Youtube;
    case "github":
      return Github;
    case "instagram":
      return Instagram;
    case "facebook":
      return Facebook;
    case "email":
      return Mail;
    case "website":
    default:
      return Globe;
  }
}

function socialHref(s: SocialLink): string {
  if (s.platform === "email" && !/^mailto:/i.test(s.url)) {
    return `mailto:${s.url}`;
  }
  return s.url;
}

export function Footer({
  suppressNavigation,
  extraNavLinks = [],
  navItems,
  footer = DEFAULT_FOOTER,
  contact = DEFAULT_CONTACT,
  socials = DEFAULT_SOCIALS,
  logoUrl = DEFAULT_LOGO_URL,
}: FooterProps = {}) {
  const baseItems = (
    navItems && navItems.length ? navItems : DEFAULT_NAV_ITEMS
  ).filter((i) => !i.hidden);
  const baseHrefs = new Set(baseItems.map((l) => l.href));
  const extrasFiltered = extraNavLinks.filter((l) => !baseHrefs.has(l.href));
  const footerNavLinks: NavItem[] = [
    ...baseItems,
    ...extrasFiltered.map((l) => ({ label: l.label, href: l.href })),
  ];

  const columns = footer.columns ?? [];
  const hasCustomColumns = columns.length > 0;
  const contactEmail = contact.email?.trim();
  const showClientAccess = footer.showClientAccess !== false;

  return (
    <footer className="bg-footer-bg text-light-slate">
      <div className="container-main py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="max-w-[300px]">
            <Link
              href="/site"
              className="font-heading text-base font-bold text-white"
              aria-label="Site home"
              onClick={suppressNavigation ? (e) => e.preventDefault() : undefined}
            >
              <Image
                src={logoUrl}
                alt="Site logo"
                width={160}
                height={40}
                className="h-14 w-auto"
              />
            </Link>
            {footer.description ? (
              <p className="mt-3 text-sm leading-relaxed text-slate">
                {footer.description}
                <span className="ml-2 inline-block text-xs text-slate">✦</span>
              </p>
            ) : null}
            {footer.address ? (
              <p className="mt-3 text-sm leading-relaxed text-slate">
                {footer.address}
              </p>
            ) : null}
            {socials.length ? (
              <ul className="mt-5 flex flex-wrap items-center gap-3">
                {socials.map((s, i) => {
                  const Icon = socialIcon(s.platform);
                  return (
                    <li key={`${s.platform}-${s.url}-${i}`}>
                      <a
                        href={socialHref(s)}
                        target={s.platform === "email" ? undefined : "_blank"}
                        rel={s.platform === "email" ? undefined : "noreferrer"}
                        aria-label={s.label}
                        title={s.label}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-slate transition-colors hover:border-white/30 hover:text-white"
                      >
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : null}
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
                    target={link.openInNewTab ? "_blank" : undefined}
                    rel={link.openInNewTab ? "noopener noreferrer" : undefined}
                    className="text-zinc-500 transition-colors hover:text-white"
                    onClick={
                      suppressNavigation ? (e) => e.preventDefault() : undefined
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="md:justify-self-end space-y-4">
            {hasCustomColumns ? (
              <div className="grid gap-8 sm:grid-cols-2">
                {columns.map((col, ci) => (
                  <div key={`${col.title}-${ci}`} className="space-y-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate">
                      {col.title}
                    </p>
                    <ul className="space-y-3 text-sm">
                      {col.links.map((link, li) => (
                        <li key={`${link.label}-${li}`}>
                          <Link
                            href={link.href}
                            target={link.openInNewTab ? "_blank" : undefined}
                            rel={
                              link.openInNewTab ? "noopener noreferrer" : undefined
                            }
                            className="text-zinc-500 transition-colors hover:text-white"
                            onClick={
                              suppressNavigation
                                ? (e) => e.preventDefault()
                                : undefined
                            }
                          >
                            {link.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate">
                  Contact
                </p>
                {contactEmail ? (
                  <a
                    href={`mailto:${contactEmail}`}
                    className="block text-sm text-zinc-500 transition-colors hover:text-white"
                  >
                    {contactEmail}
                  </a>
                ) : null}
                {contact.phone ? (
                  <a
                    href={`tel:${contact.phone.replace(/\s+/g, "")}`}
                    className="block text-sm text-zinc-500 transition-colors hover:text-white"
                  >
                    {contact.phone}
                  </a>
                ) : null}
                {showClientAccess ? (
                  <Link
                    href="/site/client-access"
                    className="inline-block text-sm text-zinc-500 transition-colors hover:text-white"
                    onClick={
                      suppressNavigation ? (e) => e.preventDefault() : undefined
                    }
                  >
                    Client Access
                  </Link>
                ) : null}
              </>
            )}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-deep-blue pt-6 text-xs text-slate md:flex-row md:items-center md:justify-between">
          {footer.copyright ? <div>{footer.copyright}</div> : <div />}
          {footer.legalNote ? (
            <div>
              <span>✦</span> {footer.legalNote}
            </div>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
