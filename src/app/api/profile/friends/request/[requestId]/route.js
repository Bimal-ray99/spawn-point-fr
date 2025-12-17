import { NextResponse } from "next/server";

// Accept friend request
export async function POST(request, { params }) {
  try {
    const { requestId } = await params;
    const baseUrl = process.env.API_BASE_URL || "http://localhost:4000/api";
    const url = `${baseUrl}/v1/friends/request/${requestId}/accept`;

    const authHeader = request.headers.get("authorization");
    const headers = {
      "Content-Type": "application/json",
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    console.log(`[API] Accept friend request to: ${url}`);

    const res = await fetch(url, {
      method: "POST",
      headers: headers,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[API] Accept friend request error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Cancel friend request (DELETE)
export async function DELETE(request, { params }) {
  try {
    const { requestId } = await params;
    const baseUrl = process.env.API_BASE_URL || "http://localhost:4000/api";
    const url = `${baseUrl}/v1/friends/request/${requestId}`;

    const authHeader = request.headers.get("authorization");
    const headers = {
      "Content-Type": "application/json",
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    console.log(`[API] Cancel friend request to: ${url}`);

    const res = await fetch(url, {
      method: "DELETE",
      headers: headers,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[API] Cancel friend request error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
