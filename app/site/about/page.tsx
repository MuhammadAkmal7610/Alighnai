import type { Metadata } from "next";
import { ModernCMS } from "@/lib/modern-cms";
import { InfoType } from "@prisma/client";
import { PageRenderer } from "@/components/cms/PageRenderer";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about AlignAI by ByteStream Strategies — our mission, expertise, and commitment to responsible enterprise AI governance.",
};

export default async function AboutPage() {
  // Fetch from CMS Page
  const page = await ModernCMS.getPageBySlug('about');
  
  // Fetch from ABOUT info as fallback/complement
  const aboutInfo = await ModernCMS.getInfo(InfoType.ABOUT);
  const infoData = (aboutInfo?.metadata as any) || {};

  // Merge metadata and pass to renderer
  const pageToRender = {
    ...page,
    slug: 'about',
    metadata: { ...infoData, ...(page?.metadata as any || {}) }
  };

  return <PageRenderer page={pageToRender} />;
}
