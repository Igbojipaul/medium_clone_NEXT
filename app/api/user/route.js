import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(req) {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL;

  try {
    const { data } = await axios.get(`${API}/user/`, {
      headers: { cookie: req.headers.get("cookie") },
    });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.error();
  }
}
