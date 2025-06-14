import { NextResponse } from "next/server";

export function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.delete("access",  { path: "/" });
  res.cookies.delete("refresh", { path: "/" });
  return res;
}
