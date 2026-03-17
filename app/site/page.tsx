import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { ModernCMS } from "@/lib/modern-cms";
import { InfoType } from "@prisma/client";

export const metadata: Metadata = {
  title: "Enterprise AI Governance & Strategy",
  description:
    "AlignAI by ByteStream Strategies helps enterprises deploy AI responsibly with governance frameworks, decision visibility, and strategic advisory.",
};

export default async function HomePage() {
  // Fetch from CMS Page first
  const page = await ModernCMS.getPageBySlug('home');
  const pageData = (page?.metadata as any) || {};

  // Then fetch from SETTINGS info as fallback/complement
  const settingsInfo = await ModernCMS.getInfo(InfoType.SETTINGS);
  const settingsData = (settingsInfo?.metadata as any) || {};
  
  // Merge data (CMS Page metadata takes precedence)
  const data = { ...settingsData, ...pageData };

  const hero = data.hero || {
    kicker: 'Enterprise AI Governance Architecture',
    title: 'AI is already influencing decisions in your organization.',
    highlight: 'Most enterprises have no governance over that layer.',
    description: 'AlignAI governs the AI Decision Influence Layer — the environment created by AI systems before humans make decisions. Built for enterprise. Grounded in doctoral research.'
  };

  const problems = data.problems || [];
  const credentials = data.credentials || [];

  return (
    <>
      {/* Hero */}
      <section className="hero-panel pt-28 pb-14 md:pt-32 md:pb-16 relative">
        <div className="container-main relative z-10">
          <p className="hero-kicker mb-6">{hero.kicker}</p>
          <h1 className="hero-title max-w-[900px] text-[32px] leading-[1.08] md:text-[66px]">
            {hero.title}
          </h1>
          <p className="hero-highlight mt-2 max-w-[900px] text-[26px] leading-[1.12] md:text-[48px] md:max-w-[800px]">
            {hero.highlight}
          </p>
          <p className="mt-6 max-w-[540px] text-sm leading-snug text-light-slate md:text-base md:max-w-[530px]">
            {hero.description}
          </p>
          
          {/* CMS Content Rendering */}
          {page?.content && (
            <div className="mt-8 prose prose-invert max-w-none text-light-slate">
              <div dangerouslySetInnerHTML={{ __html: page.content }} />
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/framework"
              className="inline-block rounded-btn bg-mid-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan"
            >
              Explore the framework →
            </Link>
            <Link
              href="/contact"
              className="inline-block rounded-btn border border-mid-blue bg-transparent px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-mid-blue"
              style={{ backgroundColor: "transparent" }}>
              Start a conversation →
            </Link>
          </div>

          <div className="mt-16">
            <ul className="flex flex-wrap items-center gap-2">
              <li className="text-[10px] font-medium uppercase tracking-[0.16em] text-light-slate">
                FOUNDER CREDENTIALS
              </li>
              {credentials.map((item: string) => (
                <li
                  key={item}
                  className="rounded-btn border border-deep-blue bg-[#173053] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.08em] text-light-slate"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Governance Gap */}
      <section className="bg-off-white py-20">
        <div className="container-main">
          <p className="hero-kicker text-mid-blue">The Governance Gap</p>
          <h2 className="mt-3 max-w-2xl text-4xl leading-tight text-navy md:text-5xl">
            Every major AI governance framework is focused on the wrong layer.
          </h2>
          <p className="mt-5 max-w-[600px] text-base text-slate">
            NIST, ISO 42001, and the EU AI Act focus on models, training data,
            and compliance outputs. They do not govern where AI actually changes
            enterprise behavior.
          </p>

          
          <div className="mt-12 grid sm:grid-cols-2">
            {problems.map((problem: any, index: number) => (
              <div
                key={problem.title}
                className="border border-off-white bg-white px-7 py-10"
              >
              <span className="mb-2 block text-xs font-medium tracking-wide text-light-slate">
                {(index + 1).toString().padStart(2, "0")}
              </span>
                <h3 className="text-lg text-navy">{problem.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate">
                  {problem.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      <CTASection />
    </>
  );
}
