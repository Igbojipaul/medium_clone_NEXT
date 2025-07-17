import { NextResponse } from "next/server";
import axios from "axios";

const DJANGO_API = process.env.NEXT_PUBLIC_API_BASE_URL; 

export async function GET(req) {
  const cookieHeader = req.headers.get("cookie") || "";
  try {
    const { data } = await axios.get(`${DJANGO_API}/tags`, {
      headers: { cookie: cookieHeader },
    });
    return NextResponse.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    return NextResponse.json(err.response?.data || { error: "Error fetching tags" }, { status });
  }
}

