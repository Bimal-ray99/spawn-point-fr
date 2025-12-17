import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const baseUrl = process.env.API_BASE_URL || "http://localhost:4000/api";
    const url = `${baseUrl}/v1/food/orders`;

    const authHeader = request.headers.get("authorization");
    const headers = {
      "Content-Type": "application/json",
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const body = await request.json();

    console.log(`[API] Create food order request to: ${url}`);

    const res = await fetch(url, {
      method: "POST",
      headers: headers,
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[API] Create food order error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
