import Image from "next/image";
import { getSiteSettings } from "@/lib/site-settings-server";
import { getSiteSettingsRow, brandingFromMetadata } from "@/lib/site-theme-server";

export default async function Loading() {
  const [siteSettings, settingsRow] = await Promise.all([
    getSiteSettings(),
    getSiteSettingsRow().catch(() => null),
  ]);
  const { logoUrl } = brandingFromMetadata(settingsRow?.metadata);
  const { title, subtitle } = siteSettings.loader;

  return (
    <div className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-6">
        {logoUrl ? (
          <Image
            src={logoUrl}
            alt={title}
            width={120}
            height={32}
            className="h-10 w-auto opacity-90"
            priority
          />
        ) : (
          <h2 className="font-heading text-xl font-bold text-slate-900">
            {title}
          </h2>
        )}

        <div
          className="h-7 w-7 animate-spin rounded-full border-2 border-slate-200 border-t-slate-900"
          role="status"
          aria-label="Loading"
        />

        {subtitle ? (
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
            {subtitle}
          </p>
        ) : null}
      </div>
    </div>
  );
}
