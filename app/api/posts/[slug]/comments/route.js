// app/api/posts/[slug]/comments/route.js
import { NextResponse } from "next/server";
import axios from "axios";

const DJANGO_API = process.env.NEXT_PUBLIC_API_BASE_URL; 

export async function GET(req, { params }) {
  const { slug } = await params;
  const cookieHeader = req.headers.get("cookie") || "";
  try {
    // Forward to Django: GET /posts/<slug>/comments/
    const { data } = await axios.get(`${DJANGO_API}/posts/${slug}/comments/`, {
      headers: { cookie: cookieHeader },
    });
    return NextResponse.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    return NextResponse.json(err.response?.data || { error: "Error fetching comments" }, { status });
  }
}

export async function POST(req, { params }) {
  const { slug } = await params;
  const cookieHeader = req.headers.get("cookie") || "";
  try {
    const body = await req.json();
    const { data } = await axios.post(
      `${DJANGO_API}/posts/${slug}/comments/`,
      body,
      { headers: { cookie: cookieHeader } }
    );
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    const status = err.response?.status || 500;
    return NextResponse.json(err.response?.data || { error: "Error creating comment" }, { status });
  }
}
