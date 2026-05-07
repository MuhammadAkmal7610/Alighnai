"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession } from "next-auth/react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ClipboardList,
  Eye,
  Mail,
  Search,
  Trash2,
  Building2,
  Loader2,
} from "lucide-react";
import {
  CMS_H1,
  CMS_PAGE_HEADER,
  CMS_PAGE_SHELL,
  CMS_TABLE_SCROLL,
} from "@/lib/cms-page-shell";
import { cn } from "@/lib/utils";

type AssessmentPayload = {
  organizationName?: string;
  contactName?: string;
  contactEmail?: string;
  roleTitle?: string | null;
  primaryGoals?: string;
  timeline?: string | null;
  currentAiUse?: string | null;
  additionalNotes?: string | null;
};

type AssessmentRow = {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: { id: string; email: string; name: string | null } | null;
  payload: AssessmentPayload;
};

const STATUS_OPTIONS = [
  { value: "SUBMITTED", label: "Submitted" },
  { value: "IN_REVIEW", label: "In review" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "ARCHIVED", label: "Archived" },
] as const;

const STATUS_BADGE: Record<string, string> = {
  SUBMITTED: "bg-cyan/15 text-navy border border-mid-blue/35",
  IN_REVIEW: "bg-amber-100 text-amber-800 border border-amber-200",
  CONTACTED: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  ARCHIVED: "bg-slate-100 text-slate-500 border border-slate-200",
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

export default function AssessmentsManager() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const [rows, setRows] = useState<AssessmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [viewing, setViewing] = useState<AssessmentRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AssessmentRow | null>(null);
  const [savingStatus, setSavingStatus] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchRows = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cms/assessments");
      if (!res.ok) throw new Error("Failed to load submissions");
      const data = await res.json();
      setRows((data.assessments || []) as AssessmentRow[]);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRows();
  }, [fetchRows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (statusFilter !== "ALL" && r.status !== statusFilter) return false;
      if (!q) return true;
      const blob = [
        r.payload?.organizationName,
        r.payload?.contactName,
        r.payload?.contactEmail,
        r.payload?.roleTitle,
        r.payload?.primaryGoals,
        r.user?.email,
        r.user?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    });
  }, [rows, search, statusFilter]);

  const counts = useMemo(() => {
    const base = { TOTAL: rows.length, SUBMITTED: 0, IN_REVIEW: 0, CONTACTED: 0, ARCHIVED: 0 };
    for (const r of rows) {
      if (r.status in base) (base as Record<string, number>)[r.status]++;
    }
    return base;
  }, [rows]);

  async function updateStatus(id: string, status: string) {
    setSavingStatus(true);
    try {
      const res = await fetch(`/api/cms/assessments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Update failed");
      const updated = data.assessment as AssessmentRow;
      setRows((prev) => prev.map((r) => (r.id === id ? updated : r)));
      if (viewing?.id === id) setViewing(updated);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Update failed");
    } finally {
      setSavingStatus(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget || !isAdmin) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/cms/assessments/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setRows((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-2 font-medium text-slate-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading assessment submissions…
        </div>
      </div>
    );
  }

  return (
    <div className={CMS_PAGE_SHELL}>
      <div className={CMS_PAGE_HEADER}>
        <div>
          <h1 className={CMS_H1}>Assessment submissions</h1>
          <p className="mt-1 font-medium text-slate-500">
            Client-submitted intake forms from the portal
          </p>
        </div>
      </div>

      {error && (
        <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      {/* Summary tiles */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <SummaryTile label="Total" value={counts.TOTAL} accent="bg-navy text-white" />
        <SummaryTile
          label="Submitted"
          value={counts.SUBMITTED}
          accent="bg-cyan/15 text-navy border border-mid-blue/35"
        />
        <SummaryTile
          label="In review"
          value={counts.IN_REVIEW}
          accent="bg-amber-100 text-amber-800 border border-amber-200"
        />
        <SummaryTile
          label="Contacted"
          value={counts.CONTACTED}
          accent="bg-emerald-100 text-emerald-800 border border-emerald-200"
        />
        <SummaryTile
          label="Archived"
          value={counts.ARCHIVED}
          accent="bg-slate-100 text-slate-600 border border-slate-200"
        />
      </div>

      <Card className="overflow-hidden rounded-xl border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-navy">
              <ClipboardList className="h-5 w-5 text-mid-blue" />
              Submissions
              <span className="text-xs font-semibold text-slate-500">
                ({filtered.length})
              </span>
            </CardTitle>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search org, name, email…"
                  className="h-9 w-full border-slate-200 pl-8 sm:w-64"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="h-9 w-full border-slate-200 sm:w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All statuses</SelectItem>
                  {STATUS_OPTIONS.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <ClipboardList className="h-10 w-10 text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">
                No submissions yet
              </p>
              <p className="max-w-md text-xs text-slate-400">
                When a client fills the intake form on{" "}
                <code className="rounded bg-slate-100 px-1 py-0.5 text-[11px] text-navy">
                  /portal/assessment
                </code>
                , it will show up here.
              </p>
            </div>
          ) : (
            <div className={CMS_TABLE_SCROLL}>
              <Table className="min-w-[860px]">
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="h-14 border-slate-100">
                    <TableHead className="px-6 font-bold text-slate-600">
                      Organization
                    </TableHead>
                    <TableHead className="px-6 font-bold text-slate-600">
                      Contact
                    </TableHead>
                    <TableHead className="px-6 font-bold text-slate-600">
                      Status
                    </TableHead>
                    <TableHead className="px-6 font-bold text-slate-600">
                      Submitted
                    </TableHead>
                    <TableHead className="px-6 text-right font-bold text-slate-600">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow
                      key={r.id}
                      className="h-16 cursor-pointer border-slate-100 transition-colors hover:bg-slate-50/30"
                      onClick={() => setViewing(r)}
                    >
                      <TableCell className="px-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                            <Building2 className="h-4 w-4 text-navy" />
                          </div>
                          <div className="min-w-0">
                            <div className="truncate font-semibold text-navy">
                              {r.payload?.organizationName || "—"}
                            </div>
                            <div className="truncate text-xs font-medium text-slate-400">
                              {r.payload?.roleTitle || "—"}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <div className="min-w-0">
                          <div className="truncate font-semibold text-navy">
                            {r.payload?.contactName || "—"}
                          </div>
                          <div className="flex items-center gap-1 truncate text-xs font-medium text-slate-500">
                            <Mail className="h-3 w-3 shrink-0" />
                            <span className="truncate">
                              {r.payload?.contactEmail || r.user?.email || "—"}
                            </span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6">
                        <Badge
                          className={cn(
                            "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight shadow-none",
                            STATUS_BADGE[r.status] ||
                              "bg-slate-100 text-slate-600"
                          )}
                        >
                          {r.status.replace("_", " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 text-sm font-medium text-slate-500">
                        {formatDate(r.createdAt)}
                      </TableCell>
                      <TableCell
                        className="px-6 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 gap-1.5 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-navy"
                            onClick={() => setViewing(r)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 border-slate-200 p-0 text-slate-400 hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                            disabled={!isAdmin}
                            title={
                              isAdmin
                                ? "Delete submission"
                                : "Only ADMIN can delete"
                            }
                            onClick={() => setDeleteTarget(r)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* View dialog */}
      <Dialog
        open={!!viewing}
        onOpenChange={(o) => !o && setViewing(null)}
      >
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto border-slate-200 bg-white">
          <DialogHeader>
            <DialogTitle className="text-navy">
              {viewing?.payload?.organizationName || "Assessment submission"}
            </DialogTitle>
            <DialogDescription>
              Submitted {viewing ? formatDate(viewing.createdAt) : ""}
              {viewing?.user?.email ? (
                <>
                  {" "}
                  by{" "}
                  <span className="font-semibold text-navy">
                    {viewing.user.email}
                  </span>
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>

          {viewing && (
            <div className="space-y-5 py-2">
              <div className="flex flex-col gap-2 rounded-lg border border-slate-200 bg-slate-50/60 p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="text-xs font-bold uppercase tracking-widest text-slate-500">
                  Status
                </div>
                <Select
                  value={viewing.status}
                  onValueChange={(v) => updateStatus(viewing.id, v)}
                  disabled={savingStatus}
                >
                  <SelectTrigger className="h-9 w-full border-slate-200 bg-white sm:w-52">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>
                        {o.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Organization" value={viewing.payload?.organizationName} />
                <Field label="Role / title" value={viewing.payload?.roleTitle} />
                <Field label="Contact name" value={viewing.payload?.contactName} />
                <Field
                  label="Contact email"
                  value={viewing.payload?.contactEmail}
                  asEmail
                />
                <Field label="Preferred timeline" value={viewing.payload?.timeline} />
                <Field
                  label="Account email"
                  value={viewing.user?.email}
                  asEmail
                />
              </div>

              <LongField
                label="Primary goals"
                value={viewing.payload?.primaryGoals}
              />
              <LongField
                label="Current AI use"
                value={viewing.payload?.currentAiUse}
              />
              <LongField
                label="Additional notes"
                value={viewing.payload?.additionalNotes}
              />
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            {viewing?.payload?.contactEmail ? (
              <Button
                variant="outline"
                onClick={() => {
                  if (viewing?.payload?.contactEmail) {
                    window.location.href = `mailto:${viewing.payload.contactEmail}?subject=Re: AI Decision Visibility intake — ${viewing.payload.organizationName || ""}`;
                  }
                }}
              >
                <Mail className="mr-2 h-4 w-4" />
                Reply
              </Button>
            ) : null}
            <Button
              className="bg-navy text-white hover:bg-navy/90"
              onClick={() => setViewing(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <DialogContent className="max-w-sm border-slate-200 bg-white">
          <DialogHeader>
            <DialogTitle className="text-navy">Delete submission?</DialogTitle>
            <DialogDescription>
              This will permanently remove the intake from{" "}
              <strong>
                {deleteTarget?.payload?.organizationName ||
                  deleteTarget?.payload?.contactName ||
                  "this client"}
              </strong>
              . This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function SummaryTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {label}
      </div>
      <div className="mt-2 flex items-center justify-between">
        <div className="text-2xl font-bold text-navy">{value}</div>
        <div
          className={cn(
            "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight",
            accent
          )}
        >
          {label}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  asEmail,
}: {
  label: string;
  value?: string | null;
  asEmail?: boolean;
}) {
  const text = (value || "").trim();
  return (
    <div className="space-y-1">
      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {label}
      </div>
      {text ? (
        asEmail ? (
          <a
            href={`mailto:${text}`}
            className="break-all text-sm font-medium text-navy underline-offset-2 hover:underline"
          >
            {text}
          </a>
        ) : (
          <div className="break-words text-sm font-medium text-navy">
            {text}
          </div>
        )
      ) : (
        <div className="text-sm font-medium text-slate-400">—</div>
      )}
    </div>
  );
}

function LongField({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  const text = (value || "").trim();
  if (!text) return null;
  return (
    <div className="space-y-1">
      <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {label}
      </div>
      <div className="whitespace-pre-wrap break-words rounded-lg border border-slate-200 bg-slate-50/60 p-3 text-sm leading-relaxed text-slate-700">
        {text}
      </div>
    </div>
  );
}
