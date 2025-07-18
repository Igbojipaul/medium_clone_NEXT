import axios from "axios";
import { NextResponse } from "next/server";

const DJANGO_API =  process.env.NEXT_PUBLIC_API_BASE_URL

export async function DELETE(req, { params }) {
  // Create a post: JSON body forwarded
  const { username } = await params;
  const cookieHeader = req.headers.get("cookie") || "";
  try {
    const { data } = await axios.delete(
      `${DJANGO_API}/profiles/${username}/unfollow/`, 
      {
        headers: { cookie: cookieHeader },
      }
    );
    // console.log(data);

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    const status = err.response?.status || 500;
    return NextResponse.json(err.response?.data || { error: "Error" }, {
      status,
    });
  }
}
