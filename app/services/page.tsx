import type { Metadata } from "next";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Services",
  description:
    "AlignAI offers AI governance advisory, decision visibility assessments, compliance mapping, implementation support, and ongoing monitoring.",
};

const PROCESS_STEPS = [
  {
    number: 1,
    title: "Discovery & Assessment",
    description:
      "We audit your current AI landscape — models, data pipelines, decision points, and stakeholder impact.",
  },
  {
    number: 2,
    title: "Gap Analysis",
    description:
      "Map existing practices against the AlignAI Framework to identify governance, compliance, and transparency gaps.",
  },
  {
    number: 3,
    title: "Strategy Development",
    description:
      "Design a tailored governance roadmap with prioritized actions, ownership assignments, and timelines.",
  },
  {
    number: 4,
    title: "Implementation Support",
    description:
      "Hands-on guidance to integrate governance structures into engineering workflows, review processes, and reporting.",
  },
  {
    number: 5,
    title: "Monitoring & Iteration",
    description:
      "Establish continuous monitoring dashboards and periodic review cycles to sustain governance over time.",
  },
];

const DELIVERABLES = [
  {
    title: "AI Decision Visibility Assessment",
    description:
      "A comprehensive evaluation of how AI decisions are made, documented, and communicated within your organization.",
  },
  {
    title: "Governance Framework Blueprint",
    description:
      "A custom governance framework document aligned to your industry, regulatory requirements, and organizational structure.",
  },
  {
    title: "Compliance Readiness Report",
    description:
      "Detailed mapping of your AI systems against EU AI Act, NIST AI RMF, and relevant sector-specific regulations.",
  },
  {
    title: "Risk & Impact Assessment",
    description:
      "Systematic identification and scoring of AI-specific risks with prioritized mitigation recommendations.",
  },
  {
    title: "Executive Briefing Package",
    description:
      "Board-ready materials that communicate AI governance posture, risks, and strategic recommendations.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="bg-navy pt-32 pb-20">
        <div className="container-main">
          <h1 className="max-w-3xl text-4xl text-white md:text-5xl">
            Services
          </h1>
          <p className="mt-6 max-w-prose text-lg text-light-slate">
            From initial assessment to ongoing governance, we provide the
            strategic advisory and implementation support enterprises need.
          </p>
        </div>
      </section>

      <div className="section-divider" />

      <section className="bg-off-white py-20">
        <div className="container-main">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Process Steps */}
            <div>
              <h2 className="text-2xl text-navy md:text-3xl">Our Process</h2>
              <ol className="mt-10 space-y-10">
                {PROCESS_STEPS.map((step) => (
                  <li key={step.number} className="flex gap-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mid-blue font-heading text-sm font-bold text-white">
                      {step.number}
                    </span>
                    <div>
                      <h3 className="font-semibold text-navy">{step.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* Deliverables */}
            <div>
              <h2 className="text-2xl text-navy md:text-3xl">Deliverables</h2>
              <ul className="mt-10 space-y-8">
                {DELIVERABLES.map((item) => (
                  <li
                    key={item.title}
                    className="border-l-2 border-mid-blue pl-5"
                  >
                    <h3 className="font-semibold text-navy">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-slate">
                      {item.description}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      <CTASection />
    </>
  );
}
