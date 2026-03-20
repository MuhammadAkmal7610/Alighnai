import type { Metadata } from "next";
import { ModernCMS } from "@/lib/modern-cms";
import { InfoType } from "@prisma/client";
import { PageRenderer } from "@/components/cms/PageRenderer";

export const metadata: Metadata = {
  title: "Enterprise AI Governance & Strategy",
  description:
    "AlignAI by ByteStream Strategies helps enterprises deploy AI responsibly with governance frameworks, decision visibility, and strategic advisory.",
};

export default async function HomePage() {
  // Fetch from CMS Page first
  const page = await ModernCMS.getPageBySlug('home');
  
  // Fetch from SETTINGS info as fallback/complement
  const settingsInfo = await ModernCMS.getInfo(InfoType.SETTINGS);
  const settingsData = (settingsInfo?.metadata as any) || {};

  // If page doesn't exist, we'll pass a mock/empty one to PageRenderer which handles defaults
  const pageToRender = page || { slug: 'home', metadata: settingsData };

  return <PageRenderer page={pageToRender} />;
}
