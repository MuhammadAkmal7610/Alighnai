import type { Metadata } from "next";
import { CmsSitePage } from "@/components/site/CmsSitePage";
import { getCmsPageMetadata } from "@/lib/site-page-meta";

const FALLBACK = {
  title: "AlignAI Governance Framework",
  description:
    "Governance architecture for the layer where AI actually changes enterprise behaviour.",
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  return getCmsPageMetadata("framework", searchParams, FALLBACK);
}

export default async function FrameworkPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <CmsSitePage slug="framework" searchParams={searchParams} />;
}
