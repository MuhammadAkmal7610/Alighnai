import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#08162e] text-light-slate">
      <div className="section-divider" />
      <div className="container-main py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div className="max-w-[260px]">
            <Link
              href="/"
              className="font-heading text-base font-bold text-white"
              aria-label="AlignAI home"
            >
              Align<span className="text-cyan">AI</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-slate">
              Governance architecture for AI-influenced enterprise decisions.
              By ByteStream Strategies.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="md:justify-self-center">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate">
              Navigation
            </p>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/framework" className="hover:text-white transition-colors">
                  The Framework
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="/insights" className="hover:text-white transition-colors">
                  Insights
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>

          <div className="md:justify-self-end">
            <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate">
              Contact
            </p>
            <a
              href="mailto:contact@bytestreamstrategies.com"
              className="mt-3 block text-sm hover:text-white transition-colors"
            >
              contact@bytestreamstrategies.com
            </a>
            <Link
              href="/client-access"
              className="mt-2 inline-block text-sm hover:text-white transition-colors"
            >
              Client Access
            </Link>
          </div>
        </div>

        <div className="mt-10 border-t border-deep-blue pt-6 text-xs text-slate">
          &copy; {year} ByteStream Strategies. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
