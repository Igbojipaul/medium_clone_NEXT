// middleware.js
import { NextResponse } from "next/server";

const PUBLIC_ONLY = ["/", "/login", "/register"];
const PROTECTED  = ["/feed", "/editor", "/posts", "/profile", "/settings"];

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("access")?.value;

  // 1) Public-only: redirect authenticated → /feed
  if (PUBLIC_ONLY.includes(pathname) && token) {
    return NextResponse.redirect(new URL("/feed", req.url));
  }

  // 2) Protected: redirect anonymous → /login
  if (PROTECTED.some(p => pathname.startsWith(p)) && !token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/", "/login", "/register",
    "/feed/:path*", "/editor/:path*", "/posts/:path*", "/profile/:path*", "/settings/:path*"
  ]
};
