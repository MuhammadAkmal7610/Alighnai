import Link from "next/link";

export function CTASection() {
  return (
    <section className="bg-deep-blue py-20 md:py-24" aria-label="Call to action">
      <div className="container-main text-center">
        <h2 className="mx-auto max-w-3xl text-2xl font-semibold leading-tight text-white md:text-3xl">
          Ready to understand what your AI is actually deciding?
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/90 md:text-base">
          No platform required. No prior governance work needed.
        </p>
        <Link
          href="/site/contact"
          className="mt-8 inline-flex min-h-[52px] items-center justify-center rounded-btn border border-[#34649e] bg-mid-blue px-10 py-3.5 text-sm font-bold leading-none text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-colors duration-200 hover:bg-[#4a8cc8] hover:border-[#2d5588] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-deep-blue"
        >
          Start a conversation →
        </Link>
      </div>
    </section>
  );
}
