import type { Metadata } from "next";
import { CmsSitePage } from "@/components/site/CmsSitePage";
import { getCmsPageMetadata } from "@/lib/site-page-meta";

const FALLBACK = {
  title: "Contact",
  description:
    "Get in touch with AlignAI by ByteStream Strategies to discuss enterprise AI governance and strategic advisory.",
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  return getCmsPageMetadata("contact", searchParams, FALLBACK);
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <CmsSitePage slug="contact" searchParams={searchParams} />;
}
