import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChatWidget } from "@/components/ChatWidget";
import { getSiteNavExtrasFromDb } from "@/lib/site-nav";
import { getSiteSettingsRow, brandingFromMetadata } from "@/lib/site-theme-server";

export default async function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [{ navExtras, footerExtras }, settings] = await Promise.all([
    getSiteNavExtrasFromDb(),
    getSiteSettingsRow().catch(() => null),
  ]);
  const logoUrl = brandingFromMetadata(settings?.metadata).logoUrl;

  return (
    <div className="dark-site-theme min-h-screen">
      <Header extraNavLinks={navExtras} logoUrl={logoUrl} />
      <main id="main-content">{children}</main>
      <Footer extraNavLinks={footerExtras} logoUrl={logoUrl} />
      <ChatWidget />
    </div>
  );
}
