import Link from "next/link";

export function CTASection() {
  return (
    <section className="bg-deep-blue py-14" aria-label="Call to action">
      <div className="container-main text-center">
        <h2 className="text-3xl font-semibold text-white md:text-4xl">
          Ready to understand what your AI is actually deciding?
        </h2>
        <p className="mx-auto mt-4 max-w-prose text-sm text-light-slate">
          No platform migration. No policy paperwork. Just governance
          architecture grounded in visibility.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-block rounded-btn bg-mid-blue px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-cyan"
        >
          Start a conversation →
        </Link>
      </div>
    </section>
  );
}
