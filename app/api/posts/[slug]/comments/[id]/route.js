// app/api/posts/[slug]/comments/[id]/route.js
import { NextResponse } from "next/server";
import axios from "axios";

const DJANGO_API = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function DELETE(req, { params }) {
  const { slug, id } = await params;
  const cookieHeader = req.headers.get("cookie") || "";
  try {
    await axios.delete(`${DJANGO_API}/posts/${slug}/comments/${id}/`, {
      headers: { cookie: cookieHeader },
    });
    return NextResponse.json({}, { status: 204 });
  } catch (err) {
    const status = err.response?.status || 500;
    return NextResponse.json(err.response?.data || { error: "Error deleting comment" }, { status });
  }
}
