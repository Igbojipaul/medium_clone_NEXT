import { NextResponse } from "next/server";
import axios from "axios";
// import { cookies } from "next/headers";

export async function POST(req) {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    const refreshToken = req.cookies.get("refresh")?.value;

    if (!refreshToken) {
      throw new Error("No refresh token");
    }

    const { data } = await axios.post(`${API}/token/refresh/`, {
      refresh: refreshToken,
    });
    const res = NextResponse.json({ access: data.access });
    res.cookies.set("access", data.access, {
      httpOnly: true,
      path: "/",
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 6,
    });
    res.cookies.set("refresh", data.refresh, {
      httpOnly: true,
      path: "/",
      secure: false,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });
    return res;
  } catch (err) {
    console.error(
      "Refresh proxy error:",
      err.response?.status,
      err.response?.data || err.message
    );
    return NextResponse.json(
      {
        error: "Unable to refresh token",
        details: err.response?.data || err.message,
      },
      { status: err.response?.status || 401 }
    );
  }
}
