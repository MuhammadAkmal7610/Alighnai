import type { Metadata } from "next";
import { ModernCMS } from "@/lib/modern-cms";
import { PageRenderer } from "@/components/cms/PageRenderer";

export const metadata: Metadata = {
  title: "AlignAI Governance Framework",
  description:
    "Governance architecture for the layer where AI actually changes enterprise behaviour.",
};

export default async function FrameworkPage() {
  const page = await ModernCMS.getPageBySlug('framework');
  
  if (!page) {
    return <div>Page not found</div>;
  }

  return <PageRenderer page={page} />;
}
