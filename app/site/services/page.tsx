import type { Metadata } from "next";
import { CmsSitePage } from "@/components/site/CmsSitePage";
import { getCmsPageMetadata } from "@/lib/site-page-meta";

const FALLBACK = {
  title: "Services",
  description:
    "The AI Decision Visibility Assessment is a structured 4–6 week engagement covering one business domain.",
};

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  return getCmsPageMetadata("services", searchParams, FALLBACK);
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  return <CmsSitePage slug="services" searchParams={searchParams} />;
}
