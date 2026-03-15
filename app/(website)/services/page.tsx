import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Services",
  description:
    "The AI Decision Visibility Assessment is a structured 4–6 week engagement covering one business domain.",
};

const PROCESS_STEPS = [
  {
    number: 1,
    title: "Scoping & Domain Selection",
    description:
      "Define the business domain, key AI systems in scope, and stakeholder group.",
  },
  {
    number: 2,
    title: "Decision Influence Mapping",
    description:
      "Structured sessions to identify every point where AI shapes decisions.",
  },
  {
    number: 3,
    title: "Gap Analysis & Classification",
    description:
      "Evaluate current governance against what the influence map requires.",
  },
  {
    number: 4,
    title: "Deliverable Production",
    description:
      "Produce decision register, risk classification, and governance architecture outputs.",
  },
  {
    number: 5,
    title: "Executive Readout",
    description:
      "Present findings, ownership structure, and implementation roadmap.",
  },
];

const DELIVERABLES = [
  {
    title: "AI Decision Influence Map",
    description:
      "A structured register of every location where AI is shaping decisions within the domain scope.",
  },
  {
    title: "Governance Gap Analysis",
    description:
      "A documented assessment of what governance architecture exists versus what the influence map requires.",
  },
  {
    title: "Ownership and Accountability Matrix",
    description:
      "Named owners and accountability assignments for each AI-influenced decision domain identified.",
  },
  {
    title: "Risk Classification Register",
    description:
      "Tiered risk classification of all AI decision touchpoints based on operational and regulatory exposure.",
  },
  {
    title: "Governance Architecture Roadmap",
    description:
      "A sequenced roadmap for closing identified governance gaps with implementation priorities.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <section className="hero-panel min-h-[72vh] pt-28 pb-16 md:min-h-[85vh] md:pt-36 md:pb-24">
        <div className="container-main">
          <p className="hero-kicker">The Entry Point</p>
          <h1 className="mt-6 max-w-4xl text-4xl leading-[1.05] text-white sm:text-5xl md:text-[74px]">
            The AI Decision Visibility
            <span className="block text-cyan">Assessment.</span>
          </h1>
          <p className="mt-8 max-w-prose text-[16px] leading-[1.7] text-light-slate">
            A 4-6 week structured engagement covering one business domain.
            Stands alone as a governance diagnostic, or becomes the foundation
            for broader architecture work.
          </p>
        </div>
      </section>

      <div className="section-divider" />

      <section className="bg-off-white py-20">
        <div className="container-main">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-14">
            {/* Process Steps */}
            <div>
              <p className="hero-kicker text-mid-blue">The Engagement</p>
              <h2 className="mt-4 text-2xl leading-tight text-navy">
                A structured engagement. A standing deliverable.
              </h2>
              <p className="mt-6 max-w-prose text-[15px] leading-relaxed text-slate">
                The Assessment is delivered through ByteStream Strategies. No
                platform required. No implementation prerequisite. Applicable
                regardless of what AI systems you currently use.
              </p>
              <p className="mt-4 max-w-prose text-[15px] leading-relaxed text-slate">
                It stands alone as a governance diagnostic, or it becomes the
                foundation for broader architecture work under the AlignAI
                framework.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-btn border border-light-slate bg-mid-blue/5 px-3 py-1 text-xs font-medium text-slate">4-6 weeks</span>
                <span className="rounded-btn border border-light-slate bg-mid-blue/5 px-3 py-1 text-xs font-medium text-slate">One business domain</span>
                <span className="rounded-btn border border-light-slate bg-mid-blue/5 px-3 py-1 text-xs font-medium text-slate">Fixed scope</span>
                <span className="rounded-btn border border-light-slate bg-mid-blue/5 px-3 py-1 text-xs font-medium text-slate">Five deliverables</span>
                <span className="rounded-btn border border-light-slate bg-mid-blue/5 px-3 py-1 text-xs font-medium text-slate">Platform-agnostic</span>
              </div>

              <p className="hero-kicker mt-10 text-xl text-mid-blue">How It Works</p>
              <ol className="mt-6 border-light-slate">
                {PROCESS_STEPS.map((step, index) => (
                  <li key={step.number} className={`border-light-slate py-5 ${index > 0 ? "border-t" : ""}`}>
                    <div className="flex gap-4">
                      <span className="mt-0.5 font-heading text-[18px] font-bold text-mid-blue">
                        {step.number.toString().padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="text-xl font-semibold text-navy">
                          {step.title}
                        </h3>
                        <p className="mt-1 text-sm leading-relaxed text-slate">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ol>

              <Link
                href="/contact"
                className="mt-8 inline-flex rounded-btn bg-mid-blue px-10 py-4 text-base font-semibold text-white transition-colors hover:bg-deep-blue"
              >
                Start a conversation →
              </Link>
            </div>

            {/* Deliverables */}
            <div>
              <p className="hero-kicker text-mid-blue">Five Deliverables</p>
              <h2 className="mt-4 text-4xl text-navy">Deliverables</h2>
              <ul className="mt-6 space-y-1">
                {DELIVERABLES.map((item, index) => (
                  <li
                    key={item.title}
                    className={`grid grid-cols-[44px_1fr] gap-1 border-l-[3px] border-mid-blue bg-[#e9edf3] px-4 py-5 
                      `}
                  >
                    <span className="pt-0.5 text-xs font-semibold text-mid-blue">
                      {(index + 1).toString().padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-xl font-semibold text-navy">{item.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-slate">{item.description}</p>
                    </div>
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
