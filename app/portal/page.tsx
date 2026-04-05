import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { PortalShell } from "@/components/portal/PortalShell";
import { UserRole } from "@/lib/cms-enums";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileStack, ClipboardList, ArrowRight } from "lucide-react";

export const metadata = {
  title: "Client portal | AlignAI",
};

export default async function PortalDashboardPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== UserRole.CLIENT) {
    redirect("/portal/login");
  }

  const name = session.user.name || session.user.email || "there";

  return (
    <PortalShell current="dashboard">
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy sm:text-3xl">
            Welcome, {name}
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Your secure workspace for AlignAI materials and the AI Decision Visibility
            assessment intake.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-navy">
                <FileStack className="h-5 w-5 text-mid-blue" />
                Resource library
              </CardTitle>
              <CardDescription>
                Reports, guides, and links shared with your organization.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/portal/resources"
                className="inline-flex items-center gap-2 text-sm font-semibold text-mid-blue hover:text-navy"
              >
                Open resources
                <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>

          <Card className="border-slate-200 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-navy">
                <ClipboardList className="h-5 w-5 text-mid-blue" />
                Assessment intake
              </CardTitle>
              <CardDescription>
                Tell us about your goals so we can scope an assessment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link
                href="/portal/assessment"
                className="inline-flex items-center gap-2 text-sm font-semibold text-mid-blue hover:text-navy"
              >
                Start intake form
                <ArrowRight className="h-4 w-4" />
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </PortalShell>
  );
}
