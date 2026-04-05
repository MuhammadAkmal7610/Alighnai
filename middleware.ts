import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "./auth.config";

/** Edge-only: do not import `@/auth` (pulls Prisma/pg/bcrypt into middleware). */
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const role = req.auth?.user?.role;

  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/portal/login")) {
    if (req.auth && role === "CLIENT") {
      return NextResponse.redirect(new URL("/portal", req.nextUrl));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/portal")) {
    if (!req.auth) {
      const url = new URL("/portal/login", req.nextUrl.origin);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    if (role !== "CLIENT") {
      return NextResponse.redirect(new URL("/site", req.nextUrl));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/portal")) {
    if (!req.auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (role !== "CLIENT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin/login")) {
    if (req.auth) {
      if (role === "CLIENT") {
        return NextResponse.redirect(new URL("/portal", req.nextUrl));
      }
      return NextResponse.redirect(new URL("/admin", req.nextUrl));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/admin")) {
    if (!req.auth) {
      const url = new URL("/admin/login", req.nextUrl.origin);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
    if (role === "CLIENT") {
      return NextResponse.redirect(new URL("/portal", req.nextUrl));
    }
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/cms")) {
    if (!req.auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (role === "CLIENT") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/cms/:path*",
    "/portal/:path*",
    "/api/portal/:path*",
  ],
};
