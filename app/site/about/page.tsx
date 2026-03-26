import type { Metadata } from "next";
import { CmsSitePage } from "@/components/site/CmsSitePage";
import { getCmsPageMetadata } from "@/lib/site-page-meta";

const FALLBACK = {
  title: "About",
  description:
    "Learn about AlignAI by ByteStream Strategies — our mission, expertise, and commitment to responsible enterprise AI governance.",
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  return getCmsPageMetadata("about", searchParams, FALLBACK);
}

export default async function AboutPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <CmsSitePage slug="about" searchParams={searchParams} />;
}
