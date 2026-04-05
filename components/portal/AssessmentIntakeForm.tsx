"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

export function AssessmentIntakeForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(
    null
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      organizationName: String(fd.get("organizationName") || "").trim(),
      contactName: String(fd.get("contactName") || "").trim(),
      contactEmail: String(fd.get("contactEmail") || "").trim(),
      roleTitle: String(fd.get("roleTitle") || "").trim() || null,
      primaryGoals: String(fd.get("primaryGoals") || "").trim(),
      timeline: String(fd.get("timeline") || "").trim() || null,
      currentAiUse: String(fd.get("currentAiUse") || "").trim() || null,
      additionalNotes: String(fd.get("additionalNotes") || "").trim() || null,
    };

    setLoading(true);
    try {
      const res = await fetch("/api/portal/assessment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({
          type: "err",
          text: data.error || "Submission failed. Please try again.",
        });
        return;
      }
      setMessage({ type: "ok", text: data.message || "Submitted successfully." });
      form.reset();
    } catch {
      setMessage({ type: "err", text: "Network error. Try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {message ? (
        <div
          className={
            message.type === "ok"
              ? "rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900"
              : "rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          }
        >
          {message.text}
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="organizationName" className="text-navy">
            Organization name *
          </Label>
          <Input
            id="organizationName"
            name="organizationName"
            required
            className="border-slate-200"
            placeholder="Company or agency"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactName" className="text-navy">
            Your name *
          </Label>
          <Input
            id="contactName"
            name="contactName"
            required
            className="border-slate-200"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactEmail" className="text-navy">
            Work email *
          </Label>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            required
            className="border-slate-200"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="roleTitle" className="text-navy">
            Role / title
          </Label>
          <Input
            id="roleTitle"
            name="roleTitle"
            className="border-slate-200"
            placeholder="e.g. VP Risk, Head of AI"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="primaryGoals" className="text-navy">
          What do you want to achieve with an AI governance / visibility assessment? *
        </Label>
        <Textarea
          id="primaryGoals"
          name="primaryGoals"
          required
          rows={5}
          className="border-slate-200"
          placeholder="Outcomes, scope, stakeholders, constraints…"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="timeline" className="text-navy">
          Preferred timeline
        </Label>
        <Input
          id="timeline"
          name="timeline"
          className="border-slate-200"
          placeholder="e.g. Q2 2026, within 90 days"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="currentAiUse" className="text-navy">
          Current AI use (high level)
        </Label>
        <Textarea
          id="currentAiUse"
          name="currentAiUse"
          rows={4}
          className="border-slate-200"
          placeholder="Tools, departments, regulated use cases if any…"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalNotes" className="text-navy">
          Additional notes
        </Label>
        <Textarea
          id="additionalNotes"
          name="additionalNotes"
          rows={3}
          className="border-slate-200"
        />
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="bg-navy text-white hover:bg-navy/90"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Submitting…
          </>
        ) : (
          "Submit intake"
        )}
      </Button>
    </form>
  );
}
