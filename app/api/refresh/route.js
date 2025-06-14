// app/api/refresh/route.js
import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req) {
    const API = process.env.NEXT_PUBLIC_API_BASE_URL
  try {
    // Forward the incoming cookies to Django’s refresh endpoint
    const { data } = await axios.post(
      `${API}/token/refresh/`,
      {},
      {
        headers: { cookie: req.headers.get("cookie") },
      }
    );

    // Set the new access token as an HttpOnly cookie
    const res = NextResponse.json({ access: data.access });
    res.cookies.set("access", data.access, {
      httpOnly: true,
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 5, // match your ACCESS_TOKEN_LIFETIME (in seconds)
    });

    return res;
  } catch (err) {
    return NextResponse.json(
      { error: "Unable to refresh token" },
      { status: 401 }
    );
  }
}
