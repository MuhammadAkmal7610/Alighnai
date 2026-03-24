import type { Metadata } from "next";
import { ModernCMS } from "@/lib/modern-cms";
import { PageRenderer } from "@/components/cms/PageRenderer";

export const metadata: Metadata = {
  title: "Services",
  description:
    "The AI Decision Visibility Assessment is a structured 4–6 week engagement covering one business domain.",
};

export default async function ServicesPage() {
  // Fetch from CMS Page
  const page = await ModernCMS.getPageBySlug('services');
  
  if (!page) {
    return (
        <div className="bg-navy min-h-screen flex items-center justify-center text-white">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
                <p>The Services page content could not be loaded from the CMS.</p>
            </div>
        </div>
    );
  }

  return <PageRenderer page={page} />;
}
