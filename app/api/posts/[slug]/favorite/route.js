import { NextResponse } from "next/server";
import axios from "axios";

const DJANGO_API = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function POST(req, { params }) {
  const { slug } = await params;
  const cookieHeader = req.headers.get("cookie") || "";
  try {
    const { data } = await axios.post(`${DJANGO_API}/posts/${slug}/favorite/`, null, {
      headers: { cookie: cookieHeader },
    });
    return NextResponse.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    return NextResponse.json(err.response?.data || { error: "Error" }, { status });
  }
}

export async function DELETE(req, { params }) {
  const { slug } = await params;
  const cookieHeader = req.headers.get("cookie") || "";
  try {
    const { data } = await axios.delete(`${DJANGO_API}/posts/${slug}/favorite/`, {
      headers: { cookie: cookieHeader },
    });
    return NextResponse.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    return NextResponse.json(err.response?.data || { error: "Error" }, { status });
  }
}
