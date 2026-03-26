"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit, Trash2, Eye, FileText, Calendar, Globe } from "lucide-react";
import {
  ContentType,
  ContentStatus,
  type ContentType as ContentTypeValue,
  type ContentStatus as ContentStatusValue,
} from "@/lib/cms-enums";
import { CMSEditor } from "@/components/cms/CMSEditor";
import { cn } from "@/lib/utils";
import {
  CMS_H1,
  CMS_PAGE_HEADER,
  CMS_PAGE_SHELL,
  CMS_TABLE_SCROLL,
} from "@/lib/cms-page-shell";

const emptyForm = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  type: ContentType.BLOG_POST as ContentTypeValue,
  status: ContentStatus.DRAFT as ContentStatusValue,
  featured: false,
  categoryId: "",
  metadata: {} as Record<string, unknown>,
};

export default function ContentManager() {
  const [contents, setContents] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [contentsRes, categoriesRes] = await Promise.all([
        fetch("/api/cms/posts"),
        fetch("/api/cms/categories"),
      ]);

      let contentsData = { posts: [] as any[] };
      let categoriesData = { categories: [] as any[] };

      if (contentsRes.ok) {
        contentsData = await contentsRes.json();
      }

      if (categoriesRes.ok) {
        categoriesData = await categoriesRes.json();
      }

      setContents(contentsData.posts || []);
      setCategories(categoriesData.categories || []);
    } catch (error: any) {
      console.error("CMS: Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (content: any) => {
    setContentToDelete(content);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (!contentToDelete) return;
    try {
      const res = await fetch(`/api/cms/posts/${contentToDelete.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        await fetchData();
        setShowDeleteDialog(false);
        setContentToDelete(null);
      }
    } catch (error) {
      console.error("Failed to delete content:", error);
    }
  };

  const startEdit = (content: any) => {
    setEditingId(content.id);
    setFormData({
      title: content.title,
      slug: content.slug || "",
      excerpt: content.excerpt || "",
      content: content.content,
      type: content.type,
      status: content.status,
      featured: Boolean(content.featured),
      categoryId: content.categoryId || "",
      metadata:
        content.metadata && typeof content.metadata === "object" && !Array.isArray(content.metadata)
          ? (content.metadata as Record<string, unknown>)
          : {},
    });
    setShowCreateDialog(true);
  };

  const resetDialog = () => {
    setEditingId(null);
    setFormData({ ...emptyForm });
  };

  const saveWithStatus = async (status: ContentStatusValue) => {
    try {
      setSaving(true);
      const payload = { ...formData, status };
      const url = editingId ? `/api/cms/posts/${editingId}` : "/api/cms/posts";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await fetchData();
        setShowCreateDialog(false);
        resetDialog();
      }
    } catch (error) {
      console.error("Failed to save content:", error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="font-medium text-slate-500">Loading content manager...</div>
      </div>
    );
  }

  return (
    <div className={CMS_PAGE_SHELL}>
      <div className={CMS_PAGE_HEADER}>
        <div className="min-w-0">
          <h1 className={CMS_H1}>Content</h1>
          <p className="mt-1 font-medium text-slate-500">
            Manage your articles, blog posts, and resources
          </p>
          <div className="mt-4 flex max-w-full items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 sm:w-max">
            <div className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-mid-blue" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Double-click any row to edit
            </span>
          </div>
        </div>
        <Dialog
          open={showCreateDialog}
          onOpenChange={(open) => {
            setShowCreateDialog(open);
            if (!open) resetDialog();
          }}
        >
          <DialogTrigger asChild>
            <Button className="w-full bg-navy text-white shadow-md hover:bg-navy/90 sm:w-auto shrink-0">
              <Plus className="mr-2 h-4 w-4" />
              Create Content
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90dvh] w-[calc(100vw-1rem)] max-w-5xl overflow-y-auto border-slate-200 bg-white p-4 shadow-2xl sm:p-6">
            <DialogHeader className="mb-6 border-b border-slate-100 pb-4">
              <DialogTitle className="text-2xl font-bold text-navy">
                {editingId ? "Edit Content" : "Create New Content"}
              </DialogTitle>
            </DialogHeader>
            <form
              className="space-y-6"
              onSubmit={(e) => {
                e.preventDefault();
              }}
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-bold text-navy">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="h-11 rounded-lg border-slate-200 bg-white text-navy"
                    placeholder="Article title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-sm font-bold text-navy">
                    URL slug
                  </Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) =>
                      setFormData({ ...formData, slug: e.target.value })
                    }
                    className="h-11 rounded-lg border-slate-200 bg-white text-navy"
                    placeholder="auto from title if empty"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-navy">Content type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value as ContentTypeValue })
                    }
                  >
                    <SelectTrigger className="h-11 rounded-lg border-slate-200 bg-white text-navy">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      <SelectItem value={ContentType.BLOG_POST}>Blog Post</SelectItem>
                      <SelectItem value={ContentType.ARTICLE}>Article</SelectItem>
                      <SelectItem value={ContentType.NEWS}>News</SelectItem>
                      <SelectItem value={ContentType.CASE_STUDY}>Case Study</SelectItem>
                      <SelectItem value={ContentType.WHITEPAPER}>Whitepaper</SelectItem>
                      <SelectItem value={ContentType.PRESS_RELEASE}>
                        Press Release
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-navy">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        status: value as ContentStatusValue,
                      })
                    }
                  >
                    <SelectTrigger className="h-11 rounded-lg border-slate-200 bg-white text-navy">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      <SelectItem value={ContentStatus.DRAFT}>Draft</SelectItem>
                      <SelectItem value={ContentStatus.PUBLISHED}>Published</SelectItem>
                      <SelectItem value={ContentStatus.SCHEDULED}>Scheduled</SelectItem>
                      <SelectItem value={ContentStatus.ARCHIVED}>Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-navy">Category</Label>
                  <Select
                    value={formData.categoryId || "__none__"}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        categoryId: value === "__none__" ? "" : value,
                      })
                    }
                  >
                    <SelectTrigger className="h-11 rounded-lg border-slate-200 bg-white text-navy">
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-slate-200">
                      <SelectItem value="__none__">None</SelectItem>
                      {categories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
                  <Label htmlFor="featured" className="text-sm font-bold text-navy">
                    Featured
                  </Label>
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, featured: checked })
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-navy">Excerpt / Summary</Label>
                <CMSEditor
                  variant="ghost"
                  content={formData.excerpt}
                  onChange={(val) => setFormData({ ...formData, excerpt: val })}
                  placeholder="Brief summary used in listings"
                  minHeight="80px"
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-5 space-y-4">
                <p className="text-xs font-bold uppercase tracking-wider text-mid-blue">
                  SEO (search & social)
                </p>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500">
                    Meta title (optional — defaults to post title)
                  </Label>
                  <Input
                    value={String((formData.metadata as { seoTitle?: string })?.seoTitle ?? "")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        metadata: {
                          ...formData.metadata,
                          seoTitle: e.target.value,
                        },
                      })
                    }
                    className="h-10 rounded-lg border-slate-200 bg-white text-navy"
                    placeholder="Override browser title for this post"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500">
                    Meta description (optional — defaults to excerpt)
                  </Label>
                  <Input
                    value={String((formData.metadata as { seoDescription?: string })?.seoDescription ?? "")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        metadata: {
                          ...formData.metadata,
                          seoDescription: e.target.value,
                        },
                      })
                    }
                    className="h-10 rounded-lg border-slate-200 bg-white text-navy"
                    placeholder="Short description for Google / social previews"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-bold text-slate-500">
                    Social image URL (optional)
                  </Label>
                  <Input
                    value={String((formData.metadata as { ogImage?: string })?.ogImage ?? "")}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        metadata: {
                          ...formData.metadata,
                          ogImage: e.target.value,
                        },
                      })
                    }
                    className="h-10 rounded-lg border-slate-200 bg-white text-navy"
                    placeholder="https://…"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-bold text-navy">Body content</Label>
                <div className="overflow-hidden rounded-lg border border-slate-200 shadow-sm">
                  <CMSEditor
                    content={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                  />
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                  className="border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={saving}
                  className="border-slate-200 text-slate-600 hover:bg-slate-50"
                  onClick={() => saveWithStatus(ContentStatus.DRAFT)}
                >
                  Save as draft
                </Button>
                <Button
                  type="button"
                  disabled={saving}
                  className="bg-navy px-8 text-white shadow-md hover:bg-navy/90"
                  onClick={() => saveWithStatus(ContentStatus.PUBLISHED)}
                >
                  {editingId ? "Publish / update live" : "Publish"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="overflow-hidden rounded-xl border-slate-200 bg-white shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-navy">
            <FileText className="h-5 w-5 text-mid-blue" />
            Existing Content
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className={CMS_TABLE_SCROLL}>
          <Table className="min-w-[720px]">
            <TableHeader className="bg-slate-50/50">
              <TableRow className="h-14 border-slate-100">
                <TableHead className="px-6 font-bold text-slate-600">Title</TableHead>
                <TableHead className="px-6 font-bold text-slate-600">Type</TableHead>
                <TableHead className="px-6 font-bold text-slate-600">Status</TableHead>
                <TableHead className="px-6 font-bold text-slate-600">Updated</TableHead>
                <TableHead className="px-6 font-bold text-slate-600">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contents.length > 0 ? (
                contents.map((content) => (
                  <TableRow
                    key={content.id}
                    className="group h-16 cursor-pointer border-slate-100 transition-colors hover:bg-slate-50/30"
                    onDoubleClick={() => startEdit(content)}
                  >
                    <TableCell className="px-6 font-semibold text-navy">
                      {content.title}
                    </TableCell>
                    <TableCell className="px-6">
                      <Badge
                        variant="outline"
                        className="border-slate-200 bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight text-slate-600"
                      >
                        {content.type?.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6">
                      <Badge
                        variant={
                          content.status === "PUBLISHED" ? "default" : "secondary"
                        }
                        className={cn(
                          "px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight shadow-none",
                          content.status === "PUBLISHED"
                            ? "border-green-200 bg-green-100 text-green-700 hover:bg-green-100"
                            : "border-yellow-200 bg-yellow-100 text-yellow-700 hover:bg-yellow-100"
                        )}
                      >
                        {content.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 text-sm text-slate-500">
                      {new Date(content.updatedAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="flex gap-2">
                        <Link
                          href={`/site/insights/${content.slug}?preview=1`}
                          target="_blank"
                          title="Live site preview (draft if unpublished)"
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 border-slate-200 p-0 text-slate-400 hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            <Globe className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <Link
                          href={`/admin/preview/insights/${content.slug}`}
                          target="_blank"
                          title="CMS preview"
                        >
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 border-slate-200 p-0 text-slate-400 hover:bg-blue-50 hover:text-mid-blue"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(content)}
                          className="h-8 w-8 border-slate-200 p-0 text-slate-400 hover:bg-slate-50 hover:text-navy"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => confirmDelete(content)}
                          className="h-8 w-8 border-slate-200 p-0 text-slate-400 hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="py-12 text-center font-medium text-slate-400"
                  >
                    No content items found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="max-w-md border-slate-200 bg-white shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-navy">
              <Trash2 className="h-5 w-5 text-red-500" />
              Delete Content
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-slate-600">
              Are you sure you want to delete{" "}
              <span className="font-bold text-navy">&quot;{contentToDelete?.title}&quot;</span>
              ? This action cannot be undone.
            </p>
          </div>
          <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              className="border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              className="bg-red-600 px-6 text-white shadow-md hover:bg-red-700"
            >
              Delete permanently
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
