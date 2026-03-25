import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with AlignAI by ByteStream Strategies to discuss enterprise AI governance and strategic advisory.",
};

export default function ContactPage() {
  return (
    <section className="hero-panel flex min-h-screen items-center pt-16">
      <div className="container-main py-20 text-center">
        <p className="hero-kicker justify-center">ByteStream Strategies</p>
        <h1 className="mt-8 text-4xl text-white md:text-6xl">Start a conversation.</h1>
        <p className="mx-auto mt-6 max-w-[520px] text-lg leading-relaxed text-light-slate">
          No forms, no demos, no sales calls. A direct conversation about
          whether there is a fit.
        </p>
        <a
          href="mailto:bburke@bytestream.ca"
          className="mt-12 inline-block border-b border-deep-blue pb-1 text-2xl font-semibold text-white transition-colors hover:text-cyan md:text-4xl"
        >
          bburke@bytestream.ca
        </a>

        <p className="mx-auto mt-14 max-w-[520px] text-[15px] leading-[1.8] text-light-slate">
          If you are working on AI governance architecture - or trying to
          understand whether you should be - this is the conversation to have.
          Reach out directly. No intake form, no scheduling tool, no SDR.
        </p>

        <div className="mt-10 text-[15px] text-light-slate">
          You can also find Brian on{" "}
          <a
            href="https://www.linkedin.com/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-mid-blue/60 underline-offset-2 text-mid-blue hover:text-white"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
