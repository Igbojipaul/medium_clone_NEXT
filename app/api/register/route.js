// app/api/register/route.js
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const body = await req.json();
    // Proxy to Django’s registration endpoint
    const { data } = await axios.post(
      `${API}/users/register/register/`,
      {
        username: body.username,
        email: body.email,
        password: body.password,
        password2: body.password2,
      }
    );

    // Set HttpOnly cookies from the returned tokens
    const res = NextResponse.json({ ok: true, data });
    res.cookies.set("access", data.access, {
      httpOnly: true,
      sameSite: "lax", 
      path: "/",
      maxAge: 60 * 15, // 15 minutes
    });
    res.cookies.set("refresh", data.refresh, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
    });
    return res;
  } catch (err) {
    // If Django returns 400 with error details, forward them
    const message = err.response?.data?.errors || "Registration failed";
    return NextResponse.json(
      { error: message },
      { status: err.response?.status || 500 }
    );
  }
}
