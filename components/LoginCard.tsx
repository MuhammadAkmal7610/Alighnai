"use client";

import { useState } from "react";

export function LoginCard() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <div className="relative mx-auto w-full max-w-md">
      <span className="absolute -top-4 left-6 rounded-btn bg-cyan px-3 py-1 text-xs font-semibold text-navy">
        Invitation Only
      </span>
      <div className="rounded-btn border border-light-slate bg-white p-8 shadow-lg">
        <h2 className="font-heading text-xl font-semibold text-navy">
          Client Access
        </h2>
        <p className="mt-2 text-sm text-slate">
          Sign in to your secure project portal.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-medium text-navy"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-btn border border-light-slate px-4 py-2 text-sm text-navy outline-none focus:border-mid-blue focus:ring-1 focus:ring-mid-blue"
              placeholder="you@company.com"
              autoComplete="email"
            />
          </div>
          <div>
            <label
              htmlFor="login-password"
              className="block text-sm font-medium text-navy"
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-btn border border-light-slate px-4 py-2 text-sm text-navy outline-none focus:border-mid-blue focus:ring-1 focus:ring-mid-blue"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-btn bg-mid-blue px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-deep-blue"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-xs text-slate">
          Access is granted by invitation. Contact us for details.
        </p>
      </div>
    </div>
  );
}
