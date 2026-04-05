import { LoginCard } from "@/components/LoginCard";
import { getSiteSettingsRow, brandingFromMetadata } from "@/lib/site-theme-server";

export const metadata = {
  title: "Client portal sign-in | AlignAI",
  description: "Secure sign-in for AlignAI client resources and assessment intake.",
};

export default async function PortalLoginPage() {
  const settings = await getSiteSettingsRow().catch(() => null);
  const logoUrl = brandingFromMetadata(settings?.metadata).logoUrl;

  return (
    <section className="hero-panel flex min-h-screen items-center justify-center pt-16">
      <div className="container-main py-14">
        <LoginCard logoUrl={logoUrl} clientPortalSignIn />
      </div>
    </section>
  );
}
