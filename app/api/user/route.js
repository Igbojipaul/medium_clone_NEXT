import { NextResponse } from "next/server";
import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;
export async function GET(req) {
  try {
    const cookieHeader = req.headers.get("cookie") || "";
    const { data } = await axios.get(`${API}/user/`, {
      headers: { cookie: cookieHeader },
      withCredentials: true,
    });
    return NextResponse.json(data);
  } catch (err) {
    // You can inspect err.response?.status here
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: err.response?.status || 500 }
    );
  }
}

export async function PUT(req) {
  const cookieHeader = req.headers.get("cookie") || "";
  const body = await req.json();
  try {
    const { data } = await axios.put(`${API}/user/`, body, {
      withCredentials: true,
      headers: {
        Cookie: cookieHeader,
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(data);
    
    return NextResponse.json(data);
  } catch (err) {
    console.log(err);
    
    const status = err.response?.status || 500;
    const payload = err.response?.data || { error: "Update failed" };
    return NextResponse.json(payload, { status });
  }
}
