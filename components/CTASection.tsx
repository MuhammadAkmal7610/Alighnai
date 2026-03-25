import Link from "next/link";

export function CTASection() {
  return (
    <section className="bg-deep-blue py-20" aria-label="Call to action">
      <div className="container-main text-center">
        <h2 className="text-2xl font-semibold text-white md:text-2xl">
          Ready to understand what your AI is actually deciding?
        </h2>
        <p className="mx-auto mt-4 max-w-6xl text-sm text-light-slate">
          No platform required. No prior governance work needed.
        </p>
          <Link
            href="/site/contact"
            className="inline-flex w-full sm:w-auto items-center justify-center rounded-btn bg-white px-8 py-4 text-sm font-bold uppercase tracking-[0.05em] text-navy transition-all duration-300 hover:bg-cyan hover:shadow-[0_0_20px_rgba(99,188,231,0.4)]"
          >
          Start a conversation →
        </Link>
      </div>
    </section>
  );
}
