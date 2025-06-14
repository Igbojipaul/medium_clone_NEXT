// app/api/login/route.js
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  const { username, password } = await req.json();
  const API = process.env.NEXT_PUBLIC_API_BASE_URL
  const { data } = await axios.post(`${API}/token/`, { username, password });

  const res = NextResponse.json({ ok: true });
  // Set HttpOnly cookies
  res.cookies.set("access",  data.access,  { httpOnly: true, path: "/", sameSite: "lax", maxAge: 60 * 60 });
  res.cookies.set("refresh", data.refresh, { httpOnly: true, path: "/", sameSite: "lax", maxAge: 60 * 60 * 24 });
  return res;
}
