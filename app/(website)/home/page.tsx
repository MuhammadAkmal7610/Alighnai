import type { Metadata } from "next";
import Link from "next/link";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "Enterprise AI Governance & Strategy",
  description:
    "AlignAI by ByteStream Strategies helps enterprises deploy AI responsibly with governance frameworks, decision visibility, and strategic advisory.",
};

const PROBLEMS = [
  {
    title: "The Decision Influence Layer",
    description:
      "Before your teams make any decision, AI has already shaped what information they see. That layer is entirely ungoverned in most enterprises.",
  },
  {
    title: "Governance Without Architecture",
    description:
      "Most organizations have AI policies, not AI governance architecture. Policy tells people what is allowed. Architecture defines ownership and accountability.",
  },
  {
    title: "Regulatory Exposure Is Accelerating",
    description:
      "DSFI, BO, Fair Housing algorithmic screening, the EU AI Act, and casemark doctrine are converging on AI decision accountability.",
  },
  {
    title: "The Entry Point Is Visibility",
    description:
      "You cannot govern what you cannot see. The first step is mapping where AI is influencing decisions across your enterprise.",
  },
];

const CREDENTIALS = [
  "PhD - Carleton University",
  "MBA - University of Ottawa",
  "PMP Certified",
  "30+ Years Enterprise",
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="hero-panel pt-28 pb-14 md:pt-32 md:pb-16 relative">
        <div className="container-main relative z-10">
          <p className="hero-kicker mb-6">Enterprise AI Governance Architecture</p>
          <h1 className="hero-title max-w-[900px] text-[32px] leading-[1.08] md:text-[66px]">
            AI is already influencing<br className="hidden md:block" /> decisions in your organization.
          </h1>
          <p className="hero-highlight mt-2 max-w-[900px] text-[26px] leading-[1.12] md:text-[48px] md:max-w-[800px]">
            Most enterprises have no governance over that layer.
          </p>
          <p className="mt-6 max-w-[540px] text-sm leading-snug text-light-slate md:text-base md:max-w-[530px]">
            AlignAI governs the AI Decision Influence Layer — the environment created by AI systems before humans make decisions. Built for enterprise. Grounded in doctoral research.
          </p>
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
              {CREDENTIALS.map((item) => (
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
        {/* Optional: subtle background grid lines could be handled via global styles or background-image, not in markup */}
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
            {PROBLEMS.map((problem, index) => (
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
