// app/api/posts/[slug]/route.js
import { NextResponse } from "next/server";
import axios from "axios";

const DJANGO_API = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function GET(req, { params }) {
  const { slug } = await params;
  const cookieHeader = req.headers.get("cookie") || "";
  try {
    const { data } = await axios.get(`${DJANGO_API}/posts/${slug}/`, {
      headers: { cookie: cookieHeader },
    });
    return NextResponse.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    return NextResponse.json(err.response?.data || { error: "Error" }, { status });
  }
}

export async function PUT(req, { params }) {
  const { slug } = await params;
  const cookieHeader = req.headers.get("cookie") || "";
  try {
    const body = await req.json();
    const { data } = await axios.put(`${DJANGO_API}/posts/${slug}/`, body, {
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
   const {data} =  await axios.delete(`${DJANGO_API}/posts/${slug}/`, {
      headers: { cookie: cookieHeader },
    });
    return NextResponse.json({data});
  } catch (err) {
    console.log(err);
    const status = err.response?.status || 500;
    return NextResponse.json(err.response?.data || { error: "Error" }, { status });
  }
}
