"use client";

import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  type DragEvent,
} from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  FileText,
  Plus,
  Edit,
  Trash2,
  ExternalLink,
  Library,
  Search,
  Loader2,
  GripVertical,
} from "lucide-react";
import {
  CMS_H1,
  CMS_PAGE_HEADER,
  CMS_PAGE_SHELL,
  CMS_TABLE_SCROLL,
} from "@/lib/cms-page-shell";
import { cn } from "@/lib/utils";

type Resource = {
  id: string;
  title: string;
  description: string | null;
  fileUrl: string;
  sortOrder: number;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

type FormState = {
  title: string;
  description: string;
  fileUrl: string;
  published: boolean;
};

const emptyForm: FormState = {
  title: "",
  description: "",
  fileUrl: "",
  published: true,
};

export default function ResourcesManager() {
  const [rows, setRows] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">(
    "ALL"
  );

  const [editing, setEditing] = useState<Resource | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Resource | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [reordering, setReordering] = useState(false);

  const fetchRows = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cms/resources");
      if (!res.ok) throw new Error("Failed to load resources");
      const data = await res.json();
      setRows((data.resources || []) as Resource[]);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load resources");
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
      if (statusFilter === "PUBLISHED" && !r.published) return false;
      if (statusFilter === "DRAFT" && r.published) return false;
      if (!q) return true;
      const blob = [r.title, r.description, r.fileUrl]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return blob.includes(q);
    });
  }, [rows, search, statusFilter]);

  const counts = useMemo(() => {
    let published = 0;
    let draft = 0;
    for (const r of rows) {
      if (r.published) published++;
      else draft++;
    }
    return { total: rows.length, published, draft };
  }, [rows]);

  const canReorder = statusFilter === "ALL" && search.trim() === "";

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
    setCreating(true);
  }

  function openEdit(r: Resource) {
    setCreating(false);
    setEditing(r);
    setForm({
      title: r.title,
      description: r.description || "",
      fileUrl: r.fileUrl,
      published: r.published,
    });
    setFormError(null);
  }

  function closeForm() {
    setCreating(false);
    setEditing(null);
    setForm(emptyForm);
    setFormError(null);
  }

  async function submitForm() {
    setFormError(null);
    const title = form.title.trim();
    const fileUrl = form.fileUrl.trim();
    const description = form.description.trim();

    if (!title) {
      setFormError("Title is required.");
      return;
    }
    if (!fileUrl) {
      setFormError("File URL or link is required.");
      return;
    }
    try {
      new URL(fileUrl);
    } catch {
      setFormError("Please enter a valid URL (https://…).");
      return;
    }

    const payload = {
      title,
      description: description || null,
      fileUrl,
      sortOrder: editing
        ? editing.sortOrder
        : rows.reduce((max, r) => Math.max(max, r.sortOrder), -1) + 1,
      published: form.published,
    };

    setSaving(true);
    try {
      const isEdit = Boolean(editing);
      const res = await fetch(
        isEdit ? `/api/cms/resources/${editing!.id}` : "/api/cms/resources",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Save failed");
      const saved = data.resource as Resource;
      setRows((prev) => {
        if (isEdit) {
          return prev.map((r) => (r.id === saved.id ? saved : r));
        }
        return [...prev, saved].sort(
          (a, b) =>
            a.sortOrder - b.sortOrder ||
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });
      closeForm();
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(r: Resource) {
    setTogglingId(r.id);
    try {
      const res = await fetch(`/api/cms/resources/${r.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !r.published }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Update failed");
      const saved = data.resource as Resource;
      setRows((prev) => prev.map((x) => (x.id === saved.id ? saved : x)));
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Update failed");
    } finally {
      setTogglingId(null);
    }
  }

  function handleDragStart(e: DragEvent<HTMLTableRowElement>, id: string) {
    if (!canReorder || reordering) return;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
    setDraggingId(id);
  }

  function handleDragOver(e: DragEvent<HTMLTableRowElement>, id: string) {
    if (!draggingId || draggingId === id || !canReorder || reordering) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverId(id);
  }

  async function handleDrop(e: DragEvent<HTMLTableRowElement>, targetId: string) {
    e.preventDefault();
    if (!draggingId || draggingId === targetId || !canReorder || reordering) {
      setDraggingId(null);
      setDragOverId(null);
      return;
    }

    const previousRows = rows;
    const ordered = [...rows].sort(
      (a, b) =>
        a.sortOrder - b.sortOrder ||
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    const fromIndex = ordered.findIndex((r) => r.id === draggingId);
    const toIndex = ordered.findIndex((r) => r.id === targetId);
    if (fromIndex < 0 || toIndex < 0) return;

    const next = [...ordered];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);

    const reordered = next.map((r, index) => ({ ...r, sortOrder: index }));
    setRows(reordered);
    setDraggingId(null);
    setDragOverId(null);
    setReordering(true);

    try {
      await Promise.all(
        reordered
          .filter((r) => previousRows.find((p) => p.id === r.id)?.sortOrder !== r.sortOrder)
          .map(async (r) => {
            const res = await fetch(`/api/cms/resources/${r.id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ sortOrder: r.sortOrder }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(data.error || "Reorder failed");
          })
      );
    } catch (e: unknown) {
      setRows(previousRows);
      alert(e instanceof Error ? e.message : "Reorder failed");
    } finally {
      setReordering(false);
    }
  }

  function handleDragEnd() {
    setDraggingId(null);
    setDragOverId(null);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/cms/resources/${deleteTarget.id}`, {
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
          Loading resources…
        </div>
      </div>
    );
  }

  const formOpen = creating || Boolean(editing);

  return (
    <div className={CMS_PAGE_SHELL}>
      <div className={CMS_PAGE_HEADER}>
        <div>
          <h1 className={CMS_H1}>Resources</h1>
          <p className="mt-1 font-medium text-slate-500">
            Documents and links published to the client portal resource library
          </p>
        </div>
        <Button
          onClick={openCreate}
          className="bg-navy text-white shadow-md hover:bg-navy/90"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add resource
        </Button>
      </div>

      {error && (
        <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <div className="mb-6 grid grid-cols-3 gap-3">
        <SummaryTile
          label="Total"
          value={counts.total}
          accent="bg-navy text-white"
        />
        <SummaryTile
          label="Published"
          value={counts.published}
          accent="bg-emerald-100 text-emerald-800 border border-emerald-200"
        />
        <SummaryTile
          label="Draft"
          value={counts.draft}
          accent="bg-slate-100 text-slate-600 border border-slate-200"
        />
      </div>

      <Card className="overflow-hidden rounded-xl border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-bold text-navy">
              <Library className="h-5 w-5 text-mid-blue" />
              All resources
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
                  placeholder="Search title, link…"
                  className="h-9 w-full border-slate-200 pl-8 sm:w-64"
                />
              </div>
              <div className="flex rounded-md border border-slate-200 bg-slate-50 p-0.5 text-xs font-semibold">
                {(["ALL", "PUBLISHED", "DRAFT"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setStatusFilter(opt)}
                    className={cn(
                      "rounded px-3 py-1.5 transition-colors",
                      statusFilter === opt
                        ? "bg-white text-navy shadow-sm"
                        : "text-slate-500 hover:text-navy"
                    )}
                  >
                    {opt === "ALL"
                      ? "All"
                      : opt === "PUBLISHED"
                        ? "Published"
                        : "Drafts"}
                  </button>
                ))}
              </div>
            </div>
            {!canReorder && rows.length > 1 ? (
              <p className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
                Clear search and select All to drag resources into a new order.
              </p>
            ) : null}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <FileText className="h-10 w-10 text-slate-300" />
              <p className="text-sm font-semibold text-slate-600">
                {rows.length === 0
                  ? "No resources yet"
                  : "No resources match your filter"}
              </p>
              {rows.length === 0 ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2"
                  onClick={openCreate}
                >
                  <Plus className="mr-2 h-3.5 w-3.5" />
                  Add the first resource
                </Button>
              ) : null}
            </div>
          ) : (
            <div className={CMS_TABLE_SCROLL}>
              <Table className="min-w-[860px]">
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="h-14 border-slate-100">
                    <TableHead className="w-16 px-6 font-bold text-slate-600">
                      Move
                    </TableHead>
                    <TableHead className="px-6 font-bold text-slate-600">
                      Title
                    </TableHead>
                    <TableHead className="px-6 font-bold text-slate-600">
                      Link
                    </TableHead>
                    <TableHead className="px-6 font-bold text-slate-600">
                      Status
                    </TableHead>
                    <TableHead className="px-6 text-right font-bold text-slate-600">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => {
                    const busy = togglingId === r.id;
                    return (
                      <TableRow
                        key={r.id}
                        draggable={canReorder && !reordering}
                        onDragStart={(e) => handleDragStart(e, r.id)}
                        onDragOver={(e) => handleDragOver(e, r.id)}
                        onDrop={(e) => handleDrop(e, r.id)}
                        onDragEnd={handleDragEnd}
                        className={cn(
                          "h-16 border-slate-100 transition-colors hover:bg-slate-50/30",
                          canReorder && !reordering && "cursor-grab active:cursor-grabbing",
                          draggingId === r.id && "opacity-40",
                          dragOverId === r.id && "bg-cyan/10"
                        )}
                      >
                        <TableCell className="px-6">
                          <div
                            className={cn(
                              "flex h-8 w-8 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-400",
                              canReorder && !reordering
                                ? "cursor-grab hover:text-navy active:cursor-grabbing"
                                : "cursor-not-allowed opacity-50"
                            )}
                            title={
                              canReorder
                                ? "Drag to reorder"
                                : "Clear filters to reorder"
                            }
                          >
                            <GripVertical className="h-4 w-4" />
                          </div>
                        </TableCell>
                        <TableCell className="px-6">
                          <div className="min-w-0">
                            <div className="truncate font-semibold text-navy">
                              {r.title}
                            </div>
                            {r.description ? (
                              <div className="line-clamp-1 text-xs font-medium text-slate-500">
                                {r.description}
                              </div>
                            ) : null}
                          </div>
                        </TableCell>
                        <TableCell className="px-6">
                          <a
                            href={r.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex max-w-[18rem] items-center gap-1 truncate text-xs font-semibold text-mid-blue hover:text-navy hover:underline"
                          >
                            <ExternalLink className="h-3 w-3 shrink-0" />
                            <span className="truncate">{r.fileUrl}</span>
                          </a>
                        </TableCell>
                        <TableCell className="px-6">
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={r.published}
                              disabled={busy}
                              onCheckedChange={() => togglePublished(r)}
                            />
                            <Badge
                              className={cn(
                                "rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight shadow-none",
                                r.published
                                  ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                  : "bg-slate-100 text-slate-600 border border-slate-200"
                              )}
                            >
                              {r.published ? "Published" : "Draft"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 gap-1.5 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-navy"
                              onClick={() => openEdit(r)}
                            >
                              <Edit className="h-3.5 w-3.5" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 border-slate-200 p-0 text-slate-400 hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                              onClick={() => setDeleteTarget(r)}
                              title="Delete resource"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create / edit dialog */}
      <Dialog open={formOpen} onOpenChange={(o) => !o && closeForm()}>
        <DialogContent className="max-w-lg border-slate-200 bg-white">
          <DialogHeader>
            <DialogTitle className="text-navy">
              {editing ? "Edit resource" : "Add resource"}
            </DialogTitle>
            <DialogDescription>
              Resources marked <strong>Published</strong> will appear in the
              client portal at <code>/portal/resources</code>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {formError && (
              <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800">
                {formError}
              </p>
            )}
            <div className="space-y-1">
              <Label className="text-slate-600">Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. AI Governance Framework v2"
                className="border-slate-200"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-slate-600">Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={3}
                placeholder="Short summary visible to clients"
                className="resize-none border-slate-200"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-slate-600">File URL or link *</Label>
              <Input
                value={form.fileUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fileUrl: e.target.value }))
                }
                placeholder="https://drive.google.com/… or https://…"
                className="border-slate-200"
              />
              <p className="text-xs text-slate-400">
                Paste a public/shared link to a PDF, doc, video, or web page.
              </p>
            </div>
            <div className="space-y-1">
              <Label className="text-slate-600">Visibility</Label>
              <div className="flex h-10 items-center gap-3 rounded-md border border-slate-200 px-3">
                <Switch
                  checked={form.published}
                  onCheckedChange={(v) =>
                    setForm((f) => ({ ...f, published: Boolean(v) }))
                  }
                />
                <span className="text-sm font-medium text-navy">
                  {form.published ? "Published" : "Draft"}
                </span>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={closeForm} disabled={saving}>
              Cancel
            </Button>
            <Button
              className="bg-navy text-white hover:bg-navy/90"
              onClick={submitForm}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving…
                </>
              ) : editing ? (
                "Save changes"
              ) : (
                "Create resource"
              )}
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
            <DialogTitle className="text-navy">Delete resource?</DialogTitle>
            <DialogDescription>
              <strong>{deleteTarget?.title}</strong> will be permanently
              removed and immediately disappear from the client portal.
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
