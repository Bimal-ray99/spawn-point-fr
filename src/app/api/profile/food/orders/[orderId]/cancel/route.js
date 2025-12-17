import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  try {
    const { orderId } = await params;
    const baseUrl = process.env.API_BASE_URL || "http://localhost:4000/api";
    const url = `${baseUrl}/v1/food/orders/${orderId}/cancel`;

    const authHeader = request.headers.get("authorization");
    const headers = {
      "Content-Type": "application/json",
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    console.log(`[API] Cancel food order request to: ${url}`);

    const res = await fetch(url, {
      method: "POST",
      headers: headers,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[API] Cancel food order error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
