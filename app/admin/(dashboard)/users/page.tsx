"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  User,
  Mail,
  Shield,
  Trash2,
  Edit,
  MoreVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CMS_H1,
  CMS_PAGE_HEADER,
  CMS_PAGE_SHELL,
  CMS_TABLE_SCROLL,
} from "@/lib/cms-page-shell";
import { UserRole } from "@/lib/cms-enums";

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  bio?: string | null;
  status?: string;
  lastLogin?: string;
  lastLoginAt?: string | null;
};

const ROLE_OPTIONS = Object.values(UserRole);

function initials(name: string | null | undefined) {
  const n = (name || "").trim();
  if (!n) return "?";
  const parts = n.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function UsersManager() {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<UserRow | null>(null);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState<string>(UserRole.EDITOR);
  const [editBio, setEditBio] = useState("");

  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [invitePassword, setInvitePassword] = useState("");
  const [inviteRole, setInviteRole] = useState<string>(UserRole.EDITOR);

  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/cms/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      const userList: UserRow[] = (data.users || []).map((u: UserRow) => ({
        ...u,
        name: u.name || "Anonymous User",
        status: "ACTIVE",
        lastLogin: u.lastLoginAt
          ? new Date(u.lastLoginAt as string).toLocaleString()
          : "Never",
      }));
      setUsers(userList);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  function openEdit(user: UserRow) {
    if (!isAdmin) return;
    setEditing(user);
    setEditName(user.name || "");
    setEditRole(user.role);
    setEditBio(user.bio || "");
    setEditOpen(true);
  }

  async function saveEdit() {
    if (!editing || !isAdmin) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/cms/users/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          role: editRole,
          bio: editBio.trim() || null,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Save failed");
      setEditOpen(false);
      setEditing(null);
      await fetchUsers();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function submitInvite() {
    if (!isAdmin) return;
    setSaving(true);
    try {
      const res = await fetch("/api/cms/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: inviteEmail.trim(),
          name: inviteName.trim(),
          password: invitePassword,
          role: inviteRole,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Could not create user");
      setInviteOpen(false);
      setInviteEmail("");
      setInviteName("");
      setInvitePassword("");
      setInviteRole(UserRole.EDITOR);
      await fetchUsers();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Create failed");
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget || !isAdmin) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/cms/users/${deleteTarget.id}`, {
        method: "DELETE",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setDeleteTarget(null);
      await fetchUsers();
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Delete failed");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="font-medium text-slate-500">Loading user management...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-8">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-navy">Users</h1>
          <p className="mt-1 font-medium text-slate-500">
            Manage team access, roles, and platform permissions
          </p>
          <div className="mt-4 flex w-max items-center gap-2 rounded-full bg-slate-100 px-3 py-1">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-mid-blue" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
              {isAdmin
                ? "Double-click a card or row to edit"
                : "View only — admins can edit users"}
            </span>
          </div>
        </div>
        <Button
          className="bg-navy text-white shadow-md hover:bg-navy/90"
          disabled={!isAdmin}
          onClick={() => setInviteOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Invite User
        </Button>
      </div>

      {!isAdmin && (
        <p className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          You are signed in as <strong>{session?.user?.role || "—"}</strong>. Only{" "}
          <strong>ADMIN</strong> can invite, edit, or delete users.
        </p>
      )}

      {error && (
        <p className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <Card
            key={user.id}
            className={cn(
              "group overflow-hidden border-slate-200 bg-white shadow-sm transition-all hover:shadow-md",
              isAdmin && "cursor-pointer"
            )}
            onDoubleClick={() => isAdmin && openEdit(user)}
          >
            <CardHeader className="flex flex-row items-center gap-4 pb-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white bg-slate-100 shadow-sm ring-1 ring-slate-100">
                <User className="h-7 w-7 text-navy" />
              </div>
              <div className="min-w-0 overflow-hidden">
                <CardTitle className="truncate text-lg font-bold leading-tight text-navy">
                  {user.name}
                </CardTitle>
                <p className="mt-0.5 flex items-center gap-1 text-xs font-medium text-slate-500">
                  <Mail className="h-3 w-3" />
                  {user.email}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-t border-slate-50 pt-4 text-xs font-medium">
                  <span className="text-slate-400">ROLE</span>
                  <Badge
                    className={cn(
                      "rounded-md px-2 py-0.5 font-bold tracking-tight shadow-none",
                      user.role === "ADMIN"
                        ? "bg-navy text-white"
                        : "bg-slate-100 text-slate-600"
                    )}
                  >
                    {user.role}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-slate-400">STATUS</span>
                  <div className="flex items-center gap-1.5">
                    <div
                      className={cn(
                        "h-2 w-2 rounded-full",
                        user.status === "ACTIVE" ? "bg-green-500" : "bg-slate-300"
                      )}
                    />
                    <span className="text-navy">{user.status}</span>
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 flex-1 gap-2 border-slate-200 font-semibold text-slate-600 hover:bg-slate-50 hover:text-navy"
                    disabled={!isAdmin}
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(user);
                    }}
                  >
                    <Edit className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-9 w-9 border-slate-200 p-0 text-slate-400 hover:border-red-100 hover:bg-red-50 hover:text-red-600"
                    disabled={
                      !isAdmin || user.id === session?.user?.id
                    }
                    title={
                      user.id === session?.user?.id
                        ? "You cannot delete your own account"
                        : "Delete user"
                    }
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(user);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden rounded-xl border-slate-200 bg-white shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="flex items-center gap-2 text-lg font-bold text-navy">
            <Shield className="h-5 w-5 text-mid-blue" />
            Platform Access Logs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className={CMS_TABLE_SCROLL}>
          <Table className="min-w-[720px]">
            <TableHeader className="bg-slate-50/50">
              <TableRow className="h-14 border-slate-100">
                <TableHead className="px-6 font-bold text-slate-600">User</TableHead>
                <TableHead className="px-6 font-bold text-slate-600">Role</TableHead>
                <TableHead className="px-6 font-bold text-slate-600">Status</TableHead>
                <TableHead className="px-6 font-bold text-slate-600">Last Login</TableHead>
                <TableHead className="px-6 text-right font-bold text-slate-600">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  className={cn(
                    "h-16 border-slate-100 transition-colors hover:bg-slate-50/30",
                    isAdmin && "cursor-pointer"
                  )}
                  onDoubleClick={() => isAdmin && openEdit(user)}
                >
                  <TableCell className="px-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-navy">
                        {initials(user.name)}
                      </div>
                      <div>
                        <div className="font-semibold text-navy">{user.name}</div>
                        <div className="text-xs font-medium text-slate-400">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <Badge
                      variant="outline"
                      className="border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-tight text-slate-500"
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6">
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight",
                        user.status === "ACTIVE"
                          ? "bg-green-100 text-green-700"
                          : "bg-slate-100 text-slate-400"
                      )}
                    >
                      {user.status}
                    </span>
                  </TableCell>
                  <TableCell className="px-6 text-sm font-medium text-slate-500">
                    {user.lastLogin}
                  </TableCell>
                  <TableCell className="px-6 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-slate-400 hover:text-navy"
                          disabled={!isAdmin}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44 bg-white">
                        <DropdownMenuItem
                          onClick={() => openEdit(user)}
                          className="cursor-pointer gap-2"
                        >
                          <Edit className="h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="cursor-pointer gap-2 text-red-600 focus:text-red-600"
                          disabled={user.id === session?.user?.id}
                          onClick={() => setDeleteTarget(user)}
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit user */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-md border-slate-200 bg-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-navy">Edit user</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label className="text-slate-600">Email</Label>
              <Input value={editing?.email || ""} disabled className="bg-slate-50" />
            </div>
            <div className="space-y-1">
              <Label className="text-slate-600">Name</Label>
              <Input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="border-slate-200"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-slate-600">Role</Label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger className="border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <Label className="text-slate-600">Bio (optional)</Label>
              <Textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={3}
                className="resize-none border-slate-200"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setEditOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-navy text-white hover:bg-navy/90"
              disabled={saving}
              onClick={saveEdit}
            >
              {saving ? "Saving…" : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="max-w-md border-slate-200 bg-white">
          <DialogHeader>
            <DialogTitle className="text-navy">Invite user</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1">
              <Label className="text-slate-600">Email</Label>
              <Input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="border-slate-200"
                placeholder="name@company.com"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-slate-600">Name</Label>
              <Input
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                className="border-slate-200"
                placeholder="Display name"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-slate-600">Temporary password</Label>
              <Input
                type="password"
                value={invitePassword}
                onChange={(e) => setInvitePassword(e.target.value)}
                className="border-slate-200"
                placeholder="Min. 8 characters"
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-slate-600">Role</Label>
              <Select value={inviteRole} onValueChange={setInviteRole}>
                <SelectTrigger className="border-slate-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLE_OPTIONS.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-navy text-white hover:bg-navy/90"
              disabled={
                saving || !inviteEmail.trim() || invitePassword.length < 8
              }
              onClick={submitInvite}
            >
              {saving ? "Creating…" : "Create user"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="max-w-sm border-slate-200 bg-white">
          <DialogHeader>
            <DialogTitle className="text-navy">Delete user?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-slate-600">
            This will permanently remove{" "}
            <strong>{deleteTarget?.name || deleteTarget?.email}</strong> from the
            system. This cannot be undone.
          </p>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={saving}
              onClick={confirmDelete}
            >
              {saving ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
