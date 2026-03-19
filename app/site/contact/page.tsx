import type { Metadata } from "next";
import { ModernCMS } from "@/lib/modern-cms";
import { InfoType } from "@/lib/cms-enums";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with AlignAI by ByteStream Strategies to discuss enterprise AI governance and strategic advisory.",
};

export default async function ContactPage() {
  // Fetch from CMS Page
  const page = await ModernCMS.getPageBySlug('contact');
  const pageData = (page?.metadata as any) || {};

  // Fetch from CONTACT info as fallback/complement
  const contactInfo = await ModernCMS.getInfo(InfoType.CONTACT);
  const infoData = (contactInfo?.metadata as any) || {};

  // Merge data
  const data = { ...infoData, ...pageData };

  const email = data.email || "bburke@bytestream.ca";
  const linkedin = data.linkedin || "https://www.linkedin.com/";
  const description = data.description || "No forms, no demos, no sales calls. A direct conversation about whether there is a fit.";
  const subtext = data.subtext || "If you are working on AI governance architecture - or trying to understand whether you should be - this is the conversation to have. Reach out directly. No intake form, no scheduling tool, no SDR.";

  return (
    <section className="hero-panel flex min-h-screen items-center pt-16">
      <div className="container-main py-20 text-center">
        <p className="hero-kicker justify-center">ByteStream Strategies</p>
        <h1 className="mt-8 text-4xl text-white md:text-6xl">Start a conversation.</h1>
        
        {/* CMS Content Rendering */}
        {page?.content && (
          <div className="mt-8 prose prose-invert mx-auto max-w-none text-light-slate text-center">
            <div dangerouslySetInnerHTML={{ __html: page.content }} />
          </div>
        )}

        <p className="mx-auto mt-6 max-w-[520px] text-lg leading-relaxed text-light-slate">
          {description}
        </p>
        <a
          href={`mailto:${email}`}
          className="mt-12 inline-block border-b border-deep-blue pb-1 text-2xl font-semibold text-white transition-colors hover:text-cyan md:text-4xl"
        >
          {email}
        </a>

        <p className="mx-auto mt-14 max-w-[520px] text-[15px] leading-[1.8] text-light-slate">
          {subtext}
        </p>

        <div className="mt-10 text-[15px] text-light-slate">
          You can also find Brian on{" "}
          <a
            href={linkedin}
            target="_blank"
            rel="noreferrer"
            className="underline decoration-mid-blue/60 underline-offset-2 text-mid-blue hover:text-white"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
