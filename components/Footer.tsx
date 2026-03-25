import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-navy border-t border-white/5 text-slate">
      <div className="container-main py-20">
        <div className="flex flex-col gap-16 lg:flex-row lg:justify-between">
          <div className="max-w-[320px] space-y-6">
            <Link
              href="/site"
              className="inline-block transition-opacity hover:opacity-80"
              aria-label="AlignAI home"
            >
              <Image src="/brand/logo-bg-black.png" alt="AlignAI Logo" width={140} height={35} className="h-7 w-auto" />
            </Link>
            <p className="text-sm leading-relaxed">
              Governance architecture for AI-influenced enterprise decisions.
            </p>
            <p className="text-xs font-medium tracking-wide text-slate/60">
              ByteStream Strategies Inc.<br />Ottawa, ON
            </p>
          </div>

          <div className="grid grid-cols-2 gap-12 sm:grid-cols-3 lg:gap-24">
            <nav aria-label="Footer navigation">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                Navigation
              </p>
              <ul className="mt-6 space-y-4 text-[13px]">
                <li>
                  <Link href="/site" className="hover:text-cyan transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/site/framework" className="hover:text-cyan transition-colors">
                    The Framework
                  </Link>
                </li>
                <li>
                  <Link href="/site/services" className="hover:text-cyan transition-colors">
                    Services
                  </Link>
                </li>
                <li>
                  <Link href="/site/insights" className="hover:text-cyan transition-colors">
                    Insights
                  </Link>
                </li>
                <li>
                  <Link href="/site/contact" className="hover:text-cyan transition-colors">
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="space-y-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                Contact
              </p>
              <ul className="mt-6 space-y-4 text-[13px]">
                <li>
                  <a
                    href="mailto:bburke@bytestream.ca"
                    className="hover:text-cyan transition-colors"
                  >
                    bburke@bytestream.ca
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.linkedin.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-cyan transition-colors"
                  >
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                Access
              </p>
              <ul className="mt-6 space-y-4 text-[13px]">
                <li>
                  <Link
                    href="/site/client-access"
                    className="hover:text-cyan transition-colors"
                  >
                    Client Access
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-20 flex flex-col gap-6 border-t border-white/5 pt-8 text-[11px] font-medium tracking-wide text-slate/50 md:flex-row md:items-center md:justify-between">
          <div>
            © 2026 ByteStream Strategies Inc. All rights reserved.
          </div>

          <div className="flex items-center gap-2 uppercase tracking-[0.1em]">
            <span className="text-cyan">✦</span>
            <span>AlignAI is a proprietary framework by ByteStream Strategies Inc.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}




