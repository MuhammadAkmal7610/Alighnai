import type { Metadata } from "next";
import { ModernCMS } from "@/lib/modern-cms";
import { PageRenderer } from "@/components/cms/PageRenderer";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with AlignAI by ByteStream Strategies to discuss enterprise AI governance and strategic advisory.",
};

export default async function ContactPage() {
  // Fetch from CMS Page
  const page = await ModernCMS.getPageBySlug('contact');
  
  if (!page) {
    return (
        <div className="bg-navy min-h-screen flex items-center justify-center text-white">
            <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
                <p>The Contact page content could not be loaded from the CMS.</p>
            </div>
        </div>
    );
  }

  return <PageRenderer page={page} />;
}
