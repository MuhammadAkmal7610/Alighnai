import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { ModernCMS } from "@/lib/modern-cms";
import { PageRenderer } from "@/components/cms/PageRenderer";
import { LoginCard } from "@/components/LoginCard";
import { getCmsPageMetadata } from "@/lib/site-page-meta";
import { getSiteSettingsRow, brandingFromMetadata } from "@/lib/site-theme-server";

const FALLBACK = {
  title: "Client Access",
  description:
    "Secure client portal for AlignAI by ByteStream Strategies project access.",
};

function isPreview(
  sp: Record<string, string | string[] | undefined> | undefined
): boolean {
  if (!sp) return false;
  const raw = sp.preview;
  return (
    raw === "1" ||
    raw === "true" ||
    (Array.isArray(raw) && (raw[0] === "1" || raw[0] === "true"))
  );
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  return getCmsPageMetadata("client-access", searchParams, FALLBACK);
}

export default async function ClientAccessPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = searchParams ? await searchParams : {};
  const preview = isPreview(sp);

  if (preview) {
    const session = await auth();
    if (!session?.user?.id) notFound();
  }

  const [page, settings] = await Promise.all([
    ModernCMS.getPageBySlug("client-access", {
      publishedOnly: !preview,
    }),
    getSiteSettingsRow().catch(() => null),
  ]);
  const logoUrl = brandingFromMetadata(settings?.metadata).logoUrl;

  if (page && (preview || page.status === "PUBLISHED")) {
    return <PageRenderer page={page} logoUrl={logoUrl} />;
  }

  return (
    <section className="hero-panel flex min-h-screen items-center justify-center pt-16">
      <div className="container-main py-14">
        <LoginCard logoUrl={logoUrl} clientPortalSignIn />
      </div>
    </section>
  );
}
