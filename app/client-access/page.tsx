import type { Metadata } from "next";
import { LoginCard } from "@/components/LoginCard";

export const metadata: Metadata = {
  title: "Client Access",
  description:
    "Secure client portal for AlignAI by ByteStream Strategies project access.",
};

export default function ClientAccessPage() {
  return (
    <>
      <section className="bg-navy pt-32 pb-20">
        <div className="container-main">
          <h1 className="text-center text-4xl text-white md:text-5xl">
            Client Access
          </h1>
          <p className="mx-auto mt-6 max-w-prose text-center text-lg text-light-slate">
            Access your project deliverables, governance reports, and ongoing
            assessments.
          </p>
        </div>
      </section>

      <div className="section-divider" />

      <section className="bg-off-white py-20">
        <div className="container-main">
          <LoginCard />
        </div>
      </section>
    </>
  );
}
