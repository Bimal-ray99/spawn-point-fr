import { NextResponse } from "next/server";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:4000/api";

export async function GET(request) {
  try {
    const token = request.headers.get("authorization");
    if (!token) {
      return NextResponse.json(
        { success: false, error: { message: "Unauthorized" } },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const unread = searchParams.get("unread") || "";
    const limit = searchParams.get("limit") || "50";

    let url = `${API_BASE_URL}/v1/notifications/my?limit=${limit}`;
    if (unread) {
      url += `&unread=${unread}`;
    }

    const response = await fetch(url, {
      headers: {
        Authorization: token,
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { message: "Internal server error" } },
      { status: 500 }
    );
  }
}
