import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { itemId } = await params;
    const baseUrl = process.env.API_BASE_URL || "http://localhost:4000/api";
    const url = `${baseUrl}/v1/food/items/${itemId}`;

    const authHeader = request.headers.get("authorization");
    const headers = {
      "Content-Type": "application/json",
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    console.log(`[API] Food item details request to: ${url}`);

    const res = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[API] Food item details error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
