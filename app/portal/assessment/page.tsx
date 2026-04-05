import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PortalShell } from "@/components/portal/PortalShell";
import { AssessmentIntakeForm } from "@/components/portal/AssessmentIntakeForm";
import { UserRole } from "@/lib/cms-enums";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Assessment intake | Client portal",
};

export default async function PortalAssessmentPage() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== UserRole.CLIENT) {
    redirect("/portal/login");
  }

  return (
    <PortalShell current="assessment">
      <div className="space-y-6">
        <div>
          <h1 className="font-heading text-2xl font-bold text-navy sm:text-3xl">
            AI Decision Visibility — intake
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Share context about your organization and goals. This helps us scope a
            conversation or assessment. Submitting this form does not obligate you to a
            purchase.
          </p>
        </div>

        <Card className="border-slate-200 shadow-sm">
          <CardHeader>
            <CardTitle className="text-navy">Intake form</CardTitle>
            <CardDescription>
              Fields marked * are required. Your account email is recorded with the submission.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AssessmentIntakeForm />
          </CardContent>
        </Card>
      </div>
    </PortalShell>
  );
}
