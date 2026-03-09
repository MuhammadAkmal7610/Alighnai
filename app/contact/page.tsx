import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with AlignAI by ByteStream Strategies to discuss enterprise AI governance and strategic advisory.",
};

export default function ContactPage() {
  return (
    <section className="flex min-h-screen items-center bg-navy pt-16">
      <div className="container-main py-20 text-center">
        <h1 className="text-4xl text-white md:text-5xl">Get in touch</h1>
        <p className="mx-auto mt-6 max-w-prose text-lg text-light-slate">
          We&rsquo;d love to hear about your AI governance challenges. Reach out
          directly — no forms, no friction.
        </p>
        <a
          href="mailto:contact@bytestreamstrategies.com"
          className="mt-12 inline-block text-2xl font-medium text-cyan transition-colors hover:text-white md:text-3xl"
        >
          contact@bytestreamstrategies.com
        </a>
      </div>
    </section>
  );
}
