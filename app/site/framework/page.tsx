import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";
import { ModernCMS } from "@/lib/modern-cms";

export const metadata: Metadata = {
  title: "AlignAI Governance Framework",
  description:
    "Governance architecture for the layer where AI actually changes enterprise behaviour.",
};

export default async function FrameworkPage() {
  const page = await ModernCMS.getPageBySlug('framework');
  const data = (page?.metadata as any) || {};

  const hero = data.hero || {
    kicker: 'The Framework',
    title: 'Governance architecture for the layer most frameworks miss.',
    description: 'AlignAI defines the structural controls for the AI decision environment your organization has already created - but policies, not coherent architecture.'
  };

  const pillars = data.pillars || [];
  const modelLayers = data.modelLayers || [];

  return (
    <>
      {/* Hero */}
      <section className="hero-panel md:h-screen md:pt-32 pb-20">
        <div className="container-main mt-32">
          <p className="hero-kicker">{hero.kicker}</p>
          <h1 className="mt-5 max-w-3xl text-4xl text-white md:text-6xl">
            {hero.title}
          </h1>
          <p className="mt-6 max-w-prose text-base text-light-slate">
            {hero.description}
          </p>

          {/* CMS Content Rendering */}
          {page?.content && (
            <div className="mt-8 prose prose-invert max-w-none text-light-slate">
              <div dangerouslySetInnerHTML={{ __html: page.content }} />
            </div>
          )}
        </div>
      </section>

      <div className="section-divider" />

      {/* Timeline */}
      <section className="bg-navy py-20">
        <div className="container-main">
          <p className="hero-kicker">Five Governance Pillars</p>
          <h2 className="mt-4 max-w-3xl text-4xl leading-[1.03] text-white md:text-6xl">
            Not a checklist. Not a policy. An architecture.
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-light-slate">
            Each pillar addresses a structural gap in how enterprises govern
            AI-influenced decisions. Together they form a complete governance
            architecture for the decision influence layer.
          </p>

          <div className="relative mt-12 max-w-5xl">
            <ol>
              {pillars.map((pillar: any) => (
                <li
                  key={pillar.number}
                  className="relative grid gap-4 md:grid-cols-[240px_1fr] md:items-start"
                >
                  <div className="md:pr-6 md:text-right md:pt-8">
                    <p className="text-[10px] font-semibold tracking-[0.07em] text-cyan">
                      {pillar.number}
                    </p>
                    <h3 className="mt-2 text-xl font-semibold leading-tight text-white">
                      {pillar.title}
                    </h3>
                  </div>

                  <p className="max-w-3xl relative border-l-2 border-l-deep-blue border-t border-b border-t-[#12335a] border-b-[#12335a] py-8 pl-8 text-[15px] leading-relaxed text-light-slate first:border-t first:border-t-[#12335a]">
                    <span
                      className="z-10 absolute -left-2 top-0 p-0 mx-auto mt-9 flex h-3.5 w-3.5 items-center justify-center rounded-full border-[3px] border-cyan bg-navy"
                      aria-hidden="true"
                    >
                      <span className="block h-2 w-2 rounded-full bg-navy" />
                    </span>
                    {pillar.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Conceptual Model */}
      <section className="bg-off-white py-20">
        <div className="container-main">
          <p className="hero-kicker text-mid-blue">The Conceptual Model</p>
          <h2 className="mt-3 max-w-2xl text-4xl text-navy md:text-5xl">
            Where AlignAI sits in the enterprise AI stack.
          </h2>
          <p className="mt-4 max-w-prose text-sm text-slate">
            A practical view of how governance architecture integrates with AI
            systems, decision environments, and executive oversight.
          </p>

          <div className="relative mt-10 max-w-4xl">
            <div
              className="absolute left-8 top-12 bottom-10 hidden w-[3px] bg-[#1e4f89] md:block"
              aria-hidden="true"
            />
            <div className="space-y-7 max-w-2xl">
              {modelLayers.map((layer: any) => (
                <div
                  key={layer.label}
                  className="relative border-l-[3px] border-mid-blue bg-[#dde8f3] px-8 py-6 md:ml-2"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.07em] text-cyan">
                    {layer.label}
                  </p>
                  <p className="mt-2 text-base font-semibold text-mid-blue md:text-lg">
                    {layer.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Link
            href="/contact"
            className="mt-10 inline-flex w-full max-w-[360px] items-center justify-center rounded-btn bg-mid-blue px-6 py-4 text-sm font-semibold tracking-[0.03em] text-white transition-colors hover:bg-deep-blue"
          >
            See how an assessment works →
          </Link>
        </div>
      </section>

      <CTASection />
    </>
  );
}
