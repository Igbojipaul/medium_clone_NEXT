import { NextResponse } from "next/server";
import axios from "axios";


export async function POST(req, {params}) {
  console.log("I've been hit")
  const {slug} = await params
  const cookieHeader = req.headers.get("cookie") || "";
  try {
    const body = await req.json();
    const { data } = await axios.post(
      `${DJANGO_API}/posts/${slug}/attachments/`,
      body,
      { headers: { cookie: cookieHeader } }
    );
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.log(err);
    const status = err.response?.status || 500;
    return NextResponse.json(err.response?.data || { error: "Error adding attachments" }, { status });
  }
}