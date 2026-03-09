import type { Metadata } from "next";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "AlignAI Governance Framework",
  description:
    "The AlignAI Framework provides five governance pillars for enterprise AI: Transparency, Accountability, Compliance, Risk Management, and Continuous Monitoring.",
};

const PILLARS = [
  {
    number: "01",
    title: "Transparency & Explainability",
    description:
      "Ensure every AI-driven decision can be explained to stakeholders, regulators, and end-users in clear, non-technical terms.",
  },
  {
    number: "02",
    title: "Accountability Structures",
    description:
      "Define clear ownership, escalation paths, and responsibility matrices for AI systems across the organization.",
  },
  {
    number: "03",
    title: "Regulatory Compliance",
    description:
      "Map AI operations to current and emerging regulatory frameworks including EU AI Act, NIST AI RMF, and sector-specific requirements.",
  },
  {
    number: "04",
    title: "Risk Assessment & Management",
    description:
      "Implement systematic risk identification, scoring, and mitigation strategies tailored to AI-specific failure modes.",
  },
  {
    number: "05",
    title: "Continuous Monitoring",
    description:
      "Establish ongoing performance tracking, drift detection, and governance reporting to maintain alignment over time.",
  },
];

export default function FrameworkPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy pt-32 pb-20">
        <div className="container-main">
          <h1 className="max-w-3xl text-4xl text-white md:text-5xl">
            The AlignAI Governance Framework
          </h1>
          <p className="mt-6 max-w-prose text-lg text-light-slate">
            Five pillars that form a comprehensive approach to enterprise AI
            governance, from initial assessment through continuous monitoring.
          </p>
        </div>
      </section>

      <div className="section-divider" />

      {/* Timeline */}
      <section className="bg-off-white py-20">
        <div className="container-main">
          <div className="relative mx-auto max-w-2xl">
            <div
              className="absolute left-6 top-0 bottom-0 w-px bg-mid-blue md:left-8"
              aria-hidden="true"
            />
            <ol className="space-y-16">
              {PILLARS.map((pillar) => (
                <li key={pillar.number} className="relative pl-16 md:pl-20">
                  <span
                    className="absolute left-0 top-0 flex h-12 w-12 items-center justify-center rounded-full bg-mid-blue font-heading text-sm font-bold text-white md:h-16 md:w-16 md:text-base"
                    aria-hidden="true"
                  >
                    {pillar.number}
                  </span>
                  <h3 className="text-xl font-semibold text-navy">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 max-w-prose text-sm leading-relaxed text-slate">
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
      <section className="bg-white py-20">
        <div className="container-main text-center">
          <h2 className="text-3xl text-navy">Conceptual Model</h2>
          <p className="mx-auto mt-4 max-w-prose text-slate">
            The AlignAI framework operates as an integrated cycle — each pillar
            reinforces the others to create a self-sustaining governance system.
          </p>
          <div className="mx-auto mt-12 max-w-xl">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {PILLARS.map((pillar) => (
                <div
                  key={pillar.number}
                  className="rounded-btn border border-light-slate bg-off-white p-4 text-center"
                >
                  <span className="block font-heading text-2xl font-bold text-mid-blue">
                    {pillar.number}
                  </span>
                  <span className="mt-1 block text-xs font-medium text-navy">
                    {pillar.title}
                  </span>
                </div>
              ))}
              <div className="flex items-center justify-center rounded-btn border border-cyan bg-navy p-4 text-center">
                <span className="text-xs font-medium text-cyan">
                  Continuous Cycle
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      <CTASection />
    </>
  );
}
