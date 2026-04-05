import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PortalShell } from "@/components/portal/PortalShell";
import { UserRole } from "@/lib/cms-enums";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink, FileText } from "lucide-react";

export const metadata = {
  title: "Resources | Client portal",
};

export default async function PortalResourcesPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== UserRole.CLIENT) {
    redirect("/portal/login");
  }

  const resources = await prisma.clientResource.findMany({
    where: { published: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return (
    <PortalShell current="resources">
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy sm:text-3xl">
            Resource library
          </h1>
          <p className="mt-2 text-slate-600">
            Documents and links provisioned for your engagement.
          </p>
        </div>

        {resources.length === 0 ? (
          <Card className="border-slate-200 border-dashed">
            <CardContent className="py-12 text-center text-slate-500">
              <FileText className="mx-auto mb-3 h-10 w-10 text-slate-300" />
              <p>No resources have been published yet.</p>
              <p className="mt-1 text-sm">Check back later or contact your AlignAI advisor.</p>
            </CardContent>
          </Card>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-1">
            {resources.map((r) => (
              <li key={r.id}>
                <Card className="border-slate-200 shadow-sm transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg text-navy">{r.title}</CardTitle>
                    {r.description ? (
                      <CardDescription className="text-slate-600">
                        {r.description}
                      </CardDescription>
                    ) : null}
                  </CardHeader>
                  <CardContent>
                    <Link
                      href={r.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-mid-blue hover:text-navy"
                    >
                      Open / download
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </PortalShell>
  );
}
