import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { getSiteNavExtrasFromDb } from "@/lib/site-nav";
import { getSiteSettingsRow, brandingFromMetadata } from "@/lib/site-theme-server";
import { getSiteSettings } from "@/lib/site-settings-server";
import { visibleNavItems } from "@/lib/site-settings";

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ navExtras, footerExtras }, settings, siteSettings] = await Promise.all([
    getSiteNavExtrasFromDb(),
    getSiteSettingsRow().catch(() => null),
    getSiteSettings(),
  ]);
  const logoUrl = brandingFromMetadata(settings?.metadata).logoUrl;
  const navItems = visibleNavItems(siteSettings.nav);

  return (
    <div className="dark-site-theme min-h-screen">
      <Header
        navItems={navItems}
        cta={siteSettings.nav.cta}
        extraNavLinks={navExtras}
        logoUrl={logoUrl}
      />
      <main id="main-content">{children}</main>
      <Footer
        navItems={navItems}
        extraNavLinks={footerExtras}
        footer={siteSettings.footer}
        contact={siteSettings.contact}
        socials={siteSettings.socials}
        logoUrl={logoUrl}
      />
      <ChatWidget />
    </div>
  );
}
