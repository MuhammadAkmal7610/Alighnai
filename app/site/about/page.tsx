import type { Metadata } from "next";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about AlignAI by ByteStream Strategies — our mission, expertise, and commitment to responsible enterprise AI governance.",
};

const CREDENTIALS = [
  "PhD",
  "MBA",
  "PMP",
  "30+ Years Enterprise",
];

export default function AboutPage() {
  return (
    <>
      <section className="hero-panel min-h-[65vh] pt-28 pb-16 md:min-h-[80vh] md:pt-40 md:pb-24">
        <div className="container-main">
          <p className="hero-kicker">The Founder</p>
          <h1 className="mt-6 max-w-4xl text-4xl leading-[1.06] text-white md:text-6xl">
            Built from doctoral research.
            <span className="block text-cyan">
              Delivered with 30 years of enterprise experience.
            </span>
          </h1>
        </div>
      </section>

      <div className="section-divider" />

      <section className="bg-off-white py-20">
        <div className="container-main">
          <div className="grid gap-12 lg:grid-cols-[260px_1fr] lg:gap-14">
            {/* Photo Placeholder */}
            <div className="flex items-start justify-start">
              <div className="flex aspect-[3/4] w-full max-w-[250px] items-center justify-center rounded-btn bg-deep-blue">
                <div className="text-center text-light-slate">
                  <svg
                    className="mx-auto mb-3"
                    width="34"
                    height="34"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 12a5 5 0 1 0-5-5 5 5 0 0 0 5 5Zm0 2c-4.33 0-8 2.17-8 5v1h16v-1c0-2.83-3.67-5-8-5Z" />
                  </svg>
                  <p className="text-xs">Headshot</p>
                  <p className="text-xs">to be supplied</p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div>
              <div className="flex flex-wrap gap-2">
                {CREDENTIALS.map((cred) => (
                  <span
                    key={cred}
                    className="rounded-btn border border-light-slate bg-navy px-3 py-1 text-[11px] font-semibold text-white"
                  >
                    {cred}
                  </span>
                ))}
              </div>

              <h2 className="mt-5 text-4xl text-navy">Brian Burke</h2>
              <p className="mt-2 text-base font-semibold text-mid-blue">
                AI Governance Architect · Founder, ByteStream Strategies Inc.
              </p>

              <div className="mt-6 max-w-prose space-y-4 text-slate">
                <p>
                  Brian Burke holds a PhD in Organizational and Systems
                  Perspective from Carleton University, an MBA in Enterprise
                  Governance and Strategy from the University of Ottawa, and is
                  a certified Project Management Professional. He has more than
                  30 years of enterprise consulting experience.
                </p>
                <p>
                  His doctoral research examined the governance gap in how
                  enterprises deploy large language models, specifically, the
                  absence of structural controls over the AI Decision Influence
                  Layer. AlignAI is the proprietary governance architecture
                  framework developed from that research.
                </p>
                <p>
                  ByteStream Strategies Inc. is the consulting entity through
                  which the AlignAI framework is delivered. Brian works with
                  enterprise leadership teams in real estate, financial
                  services, and adjacent sectors.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href="https://www.linkedin.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex rounded-btn bg-mid-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-deep-blue"
                >
                  Connect on LinkedIn →
                </a>
                <a
                  href="mailto:bburke@bytestream.ca"
                  className="inline-flex rounded-btn border border-light-slate bg-white px-6 py-3 text-sm font-medium text-slate"
                >
                  bburke@bytestream.ca
                </a>
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
