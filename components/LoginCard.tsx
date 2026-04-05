"use client";

import Image from "next/image";
import { useState } from "react";
import { getSession, signIn, signOut } from "next-auth/react";
import { DEFAULT_LOGO_URL } from "@/lib/site-theme";
import {
  mergeClientAccessForm,
  type ClientAccessFormCopy,
} from "@/lib/client-access-form";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type FieldKey =
  | "badge"
  | "title"
  | "subtitle"
  | "emailLabel"
  | "emailPlaceholder"
  | "passwordLabel"
  | "passwordPlaceholder"
  | "submitButton"
  | "footerLine1"
  | "footerLine2";

type LoginCardProps = {
  logoUrl?: string;
  formCopy?: ClientAccessFormCopy | null;
  /** CMS preview: double-click copy to edit */
  editable?: boolean;
  onFormCopyChange?: (patch: Partial<ClientAccessFormCopy>) => void;
  /** When true, submit authenticates via NextAuth and only allows role CLIENT into /portal */
  clientPortalSignIn?: boolean;
};

export function LoginCard({
  logoUrl = DEFAULT_LOGO_URL,
  formCopy,
  editable = false,
  onFormCopyChange,
  clientPortalSignIn = false,
}: LoginCardProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [activeField, setActiveField] = useState<FieldKey | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [signingIn, setSigningIn] = useState(false);

  const c = mergeClientAccessForm(formCopy ?? undefined);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientPortalSignIn) return;
    setAuthError(null);
    setSigningIn(true);
    try {
      const res = await signIn("credentials", {
        email: email.trim(),
        password,
        redirect: false,
        callbackUrl: "/portal",
      });
      if (res?.error) {
        setAuthError("Invalid email or password.");
        setSigningIn(false);
        return;
      }
      const session = await getSession();
      if (session?.user?.role !== "CLIENT") {
        setAuthError(
          "This area is only for accounts with the CLIENT role. In Admin → Users, edit your user and set role to Client, then try again."
        );
        await signOut({ redirect: false });
        setSigningIn(false);
        return;
      }
      window.location.href = "/portal";
    } catch {
      setAuthError("Something went wrong. Try again.");
      setSigningIn(false);
    }
  }

  function patch(patch: Partial<ClientAccessFormCopy>) {
    onFormCopyChange?.(patch);
  }

  function commitAndClose() {
    setActiveField(null);
  }

  function editWrap(
    field: FieldKey,
    node: React.ReactNode,
    className?: string
  ) {
    if (!editable) return node;
    return (
      <span
        className={cn(className, "cursor-text rounded px-0.5 hover:ring-1 hover:ring-cyan/35")}
        onDoubleClick={(e) => {
          e.preventDefault();
          setActiveField(field);
        }}
      >
        {node}
      </span>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-[420px]">
      <div className="rounded-[8px] border border-[rgba(99,188,231,0.22)] bg-[rgba(18,44,79,0.92)] p-8 py-12">
        <div className="mb-5 flex justify-center">
          {editable && activeField === "badge" ? (
            <Input
              autoFocus
              value={c.badge}
              onChange={(e) => patch({ badge: e.target.value })}
              onBlur={commitAndClose}
              onKeyDown={(e) => e.key === "Enter" && commitAndClose()}
              className="max-w-[320px] rounded-btn border border-white/20 bg-[rgba(11,32,63,0.95)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-cyan"
            />
          ) : (
            editWrap(
              "badge",
              <span className="rounded-btn border border-[rgba(99,188,231,0.25)] bg-[rgba(38,71,112,0.55)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-cyan">
                {c.badge}
              </span>
            )
          )}
        </div>

        <div className="text-center">
          <Image src={logoUrl} alt="AlignAI Logo" className="mx-auto" width={150} height={150} />
          {editable && activeField === "title" ? (
            <Input
              autoFocus
              value={c.title}
              onChange={(e) => patch({ title: e.target.value })}
              onBlur={commitAndClose}
              onKeyDown={(e) => e.key === "Enter" && commitAndClose()}
              className="mt-6 border-white/20 bg-[rgba(11,32,63,0.95)] text-center font-heading text-xl font-semibold text-white"
            />
          ) : (
            <h2
              className={cn(
                "mt-6 font-heading text-2xl font-semibold text-white",
                editable && "cursor-text rounded px-0.5 hover:ring-1 hover:ring-cyan/35"
              )}
              onDoubleClick={(e) => {
                if (!editable) return;
                e.preventDefault();
                setActiveField("title");
              }}
            >
              {c.title}
            </h2>
          )}
          {editable && activeField === "subtitle" ? (
            <Input
              autoFocus
              value={c.subtitle}
              onChange={(e) => patch({ subtitle: e.target.value })}
              onBlur={commitAndClose}
              onKeyDown={(e) => e.key === "Enter" && commitAndClose()}
              className="mx-auto mt-2 max-w-[290px] border-white/20 bg-[rgba(11,32,63,0.95)] text-sm text-light-slate"
            />
          ) : (
            <p
              className={cn(
                "mx-auto mt-2 max-w-[290px] text-sm leading-relaxed text-light-slate",
                editable && "cursor-text rounded px-0.5 hover:ring-1 hover:ring-cyan/35"
              )}
              onDoubleClick={(e) => {
                if (!editable) return;
                e.preventDefault();
                setActiveField("subtitle");
              }}
            >
              {c.subtitle}
            </p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {clientPortalSignIn && authError ? (
            <div className="rounded-btn border border-red-400/40 bg-red-950/40 px-3 py-2 text-center text-xs text-red-200">
              {authError}
            </div>
          ) : null}
          <div>
            {editable && activeField === "emailLabel" ? (
              <Input
                autoFocus
                value={c.emailLabel}
                onChange={(e) => patch({ emailLabel: e.target.value })}
                onBlur={commitAndClose}
                onKeyDown={(e) => e.key === "Enter" && commitAndClose()}
                className="block border-white/20 bg-[rgba(11,32,63,0.95)] text-[11px] font-semibold uppercase tracking-[0.08em] text-light-slate"
              />
            ) : (
              <label
                htmlFor="login-email"
                className={cn(
                  "block text-[11px] font-semibold uppercase tracking-[0.08em] text-light-slate",
                  editable && "cursor-text rounded px-0.5 hover:ring-1 hover:ring-cyan/35"
                )}
                onDoubleClick={(e) => {
                  if (!editable) return;
                  e.preventDefault();
                  setActiveField("emailLabel");
                }}
              >
                {c.emailLabel}
              </label>
            )}
            {editable && activeField === "emailPlaceholder" ? (
              <Input
                autoFocus
                value={c.emailPlaceholder}
                onChange={(e) => patch({ emailPlaceholder: e.target.value })}
                onBlur={commitAndClose}
                onKeyDown={(e) => e.key === "Enter" && commitAndClose()}
                className="mt-2 w-full border-white/20 bg-[rgba(11,32,63,0.95)] text-sm text-cyan"
              />
            ) : (
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={clientPortalSignIn && signingIn}
                className={cn(
                  "mt-2 w-full rounded-btn border border-deep-blue bg-[rgba(11,32,63,0.9)] px-4 py-2.5 text-sm text-white outline-none focus:border-mid-blue focus:ring-1 focus:ring-mid-blue",
                  editable && "cursor-text hover:ring-1 hover:ring-cyan/25"
                )}
                placeholder={c.emailPlaceholder}
                autoComplete="email"
                required={clientPortalSignIn}
                onDoubleClick={(e) => {
                  if (editable) {
                    e.preventDefault();
                    setActiveField("emailPlaceholder");
                  }
                }}
              />
            )}
          </div>
          <div>
            {editable && activeField === "passwordLabel" ? (
              <Input
                autoFocus
                value={c.passwordLabel}
                onChange={(e) => patch({ passwordLabel: e.target.value })}
                onBlur={commitAndClose}
                onKeyDown={(e) => e.key === "Enter" && commitAndClose()}
                className="block border-white/20 bg-[rgba(11,32,63,0.95)] text-[11px] font-semibold uppercase tracking-[0.08em] text-light-slate"
              />
            ) : (
              <label
                htmlFor="login-password"
                className={cn(
                  "block text-[11px] font-semibold uppercase tracking-[0.08em] text-light-slate",
                  editable && "cursor-text rounded px-0.5 hover:ring-1 hover:ring-cyan/35"
                )}
                onDoubleClick={(e) => {
                  if (!editable) return;
                  e.preventDefault();
                  setActiveField("passwordLabel");
                }}
              >
                {c.passwordLabel}
              </label>
            )}
            {editable && activeField === "passwordPlaceholder" ? (
              <Input
                autoFocus
                value={c.passwordPlaceholder}
                onChange={(e) => patch({ passwordPlaceholder: e.target.value })}
                onBlur={commitAndClose}
                onKeyDown={(e) => e.key === "Enter" && commitAndClose()}
                className="mt-2 w-full border-white/20 bg-[rgba(11,32,63,0.95)] text-sm text-cyan"
              />
            ) : (
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={clientPortalSignIn && signingIn}
                className={cn(
                  "mt-2 w-full rounded-btn border border-deep-blue bg-[rgba(11,32,63,0.9)] px-4 py-2.5 text-sm text-white outline-none focus:border-mid-blue focus:ring-1 focus:ring-mid-blue",
                  editable && "cursor-text hover:ring-1 hover:ring-cyan/25"
                )}
                placeholder={c.passwordPlaceholder}
                autoComplete="current-password"
                required={clientPortalSignIn}
                onDoubleClick={(e) => {
                  if (editable) {
                    e.preventDefault();
                    setActiveField("passwordPlaceholder");
                  }
                }}
              />
            )}
          </div>
          {editable && activeField === "submitButton" ? (
            <Input
              autoFocus
              value={c.submitButton}
              onChange={(e) => patch({ submitButton: e.target.value })}
              onBlur={commitAndClose}
              onKeyDown={(e) => e.key === "Enter" && commitAndClose()}
              className="w-full border-white/20 bg-[rgba(11,32,63,0.95)] py-3 text-center text-sm font-semibold text-white"
            />
          ) : (
            <button
              type="submit"
              disabled={clientPortalSignIn && signingIn}
              className={cn(
                "w-full rounded-btn bg-mid-blue px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-deep-blue disabled:opacity-60",
                editable && "cursor-text hover:ring-1 hover:ring-cyan/35"
              )}
              onDoubleClick={(e) => {
                if (!editable) return;
                e.preventDefault();
                setActiveField("submitButton");
              }}
            >
              {signingIn ? "Signing in…" : c.submitButton}
            </button>
          )}
        </form>

        <div className="mt-5 text-center text-xs leading-relaxed text-light-slate">
          {editable && activeField === "footerLine1" ? (
            <Input
              autoFocus
              value={c.footerLine1}
              onChange={(e) => patch({ footerLine1: e.target.value })}
              onBlur={commitAndClose}
              onKeyDown={(e) => e.key === "Enter" && commitAndClose()}
              className="border-white/20 bg-[rgba(11,32,63,0.95)] text-xs text-light-slate"
            />
          ) : (
            <span
              className={cn(
                "block",
                editable && "cursor-text rounded px-0.5 hover:ring-1 hover:ring-cyan/35"
              )}
              onDoubleClick={(e) => {
                if (!editable) return;
                e.preventDefault();
                setActiveField("footerLine1");
              }}
            >
              {c.footerLine1}
            </span>
          )}
          {editable && activeField === "footerLine2" ? (
            <Input
              autoFocus
              value={c.footerLine2}
              onChange={(e) => patch({ footerLine2: e.target.value })}
              onBlur={commitAndClose}
              onKeyDown={(e) => e.key === "Enter" && commitAndClose()}
              className="mt-1 border-white/20 bg-[rgba(11,32,63,0.95)] text-xs text-light-slate"
            />
          ) : (
            <span
              className={cn(
                "mt-1 block",
                editable && "cursor-text rounded px-0.5 hover:ring-1 hover:ring-cyan/35"
              )}
              onDoubleClick={(e) => {
                if (!editable) return;
                e.preventDefault();
                setActiveField("footerLine2");
              }}
            >
              {c.footerLine2}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
