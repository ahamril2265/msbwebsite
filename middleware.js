import { NextResponse } from "next/server";
import { SESSION_COOKIE, readSession } from "./lib/session";

// Gate the admin area and account pages before they render.
export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const session = await readSession(req.cookies.get(SESSION_COOKIE)?.value);

  const needsAdmin = pathname.startsWith("/admin");
  const needsLogin = needsAdmin || ["/orders", "/profile", "/settings"].some((p) => pathname.startsWith(p));

  if (needsLogin && !session) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  if (needsAdmin && session.role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/orders/:path*", "/profile/:path*", "/settings/:path*"],
};
