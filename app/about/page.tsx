import type { Metadata } from "next";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about AlignAI by ByteStream Strategies — our mission, expertise, and commitment to responsible enterprise AI governance.",
};

const CREDENTIALS = [
  "AI Governance Strategy",
  "Enterprise Risk Management",
  "Regulatory Compliance",
  "Decision Science",
  "Executive Advisory",
  "Change Management",
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-navy pt-32 pb-20">
        <div className="container-main">
          <h1 className="max-w-3xl text-4xl text-white md:text-5xl">About</h1>
          <p className="mt-6 max-w-prose text-lg text-light-slate">
            Building trust between organizations and the AI systems they depend
            on.
          </p>
        </div>
      </section>

      <div className="section-divider" />

      <section className="bg-off-white py-20">
        <div className="container-main">
          <div className="grid gap-16 lg:grid-cols-2">
            {/* Photo Placeholder */}
            <div className="flex items-start justify-center">
              <div className="flex h-80 w-full max-w-sm items-center justify-center rounded-btn bg-light-slate">
                <span className="text-sm text-slate">Photo</span>
              </div>
            </div>

            {/* Bio */}
            <div>
              <h2 className="text-2xl text-navy md:text-3xl">
                Our Mission
              </h2>
              <div className="mt-6 max-w-prose space-y-4 text-slate">
                <p>
                  AlignAI by ByteStream Strategies was founded on the conviction
                  that enterprise AI must be governed with the same rigor applied
                  to financial controls and data privacy.
                </p>
                <p>
                  We work with C-suite leaders, AI teams, legal and compliance
                  functions to design governance structures that do more than
                  check boxes — they create genuine accountability and strategic
                  advantage.
                </p>
                <p>
                  Our approach combines deep technical understanding of AI
                  systems with practical experience in enterprise risk
                  management, regulatory affairs, and organizational change.
                </p>
              </div>

              <h3 className="mt-10 text-lg font-semibold text-navy">
                Areas of Expertise
              </h3>
              <div className="mt-4 flex flex-wrap gap-3">
                {CREDENTIALS.map((cred) => (
                  <span
                    key={cred}
                    className="rounded-btn bg-white px-4 py-2 text-xs font-medium text-deep-blue border border-light-slate"
                  >
                    {cred}
                  </span>
                ))}
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
