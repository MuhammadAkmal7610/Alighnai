import type { Metadata } from "next";
import { CmsSitePage } from "@/components/site/CmsSitePage";
import { getCmsPageMetadata } from "@/lib/site-page-meta";

const FALLBACK = {
  title: "Enterprise AI Governance & Strategy",
  description:
    "AlignAI by ByteStream Strategies helps enterprises deploy AI responsibly with governance frameworks, decision visibility, and strategic advisory.",
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  return getCmsPageMetadata("home", searchParams, FALLBACK);
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <CmsSitePage slug="home" searchParams={searchParams} />;
}
