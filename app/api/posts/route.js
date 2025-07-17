import { NextResponse } from "next/server";
import axios from "axios";

const DJANGO_API = process.env.NEXT_PUBLIC_API_BASE_URL; 

export async function GET(req) {
  // Forward query string and cookies:
  const url = new URL(req.url);
  const qs = url.search; 
  const cookieHeader = req.headers.get("cookie") || "";
  try {
    const { data } = await axios.get(`${DJANGO_API}/posts${qs}`, {
      headers: { cookie: cookieHeader },
    });
    return NextResponse.json(data);
  } catch (err) {
    const status = err.response?.status || 500;
    return NextResponse.json(err.response?.data || { error: "Error" }, { status });
  }
}

export async function POST(req) {
  // Create a post: JSON body forwarded
  const cookieHeader = req.headers.get("cookie") || "";
  try {
    const body = await req.json();    
    const { data } = await axios.post(`${DJANGO_API}/posts/`, body, {
      headers: { cookie: cookieHeader },
    });
    // console.log(data);
    
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    
    const status = err.response?.status || 500;
    return NextResponse.json(err.response?.data || { error: "Error" }, { status });
  }
}
