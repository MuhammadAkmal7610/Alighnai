import type { Metadata } from "next";
import { Sora, Inter } from "next/font/google";
import "@/styles/globals.css";
import Providers from "@/components/Providers";
import { ChatWidget } from "@/components/ChatWidget";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "AlignAI by ByteStream Strategies | Enterprise AI Governance",
    template: "%s | AlignAI by ByteStream Strategies",
  },
  description:
    "AlignAI by ByteStream Strategies provides enterprise AI governance frameworks, decision visibility assessments, and strategic advisory for responsible AI deployment.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "AlignAI by ByteStream Strategies",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AlignAI by ByteStream Strategies",
  description:
    "Enterprise AI governance frameworks, decision visibility assessments, and strategic advisory for responsible AI deployment.",
  url: "https://alignai.bytestreamstrategies.com",
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    email: "contact@bytestreamstrategies.com",
    contactType: "customer service",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body>
        <Providers>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-btn focus:bg-mid-blue focus:px-4 focus:py-2 focus:text-white"
          >
            Skip to main content
          </a>
          {children}
          <ChatWidget />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </Providers>
      </body>
    </html>
  );
}
