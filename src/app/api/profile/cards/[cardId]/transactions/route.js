import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const baseUrl = process.env.API_BASE_URL || "http://localhost:4000/api";
    const { cardId } = await params;
    const url = `${baseUrl}/v1/cards/${cardId}/transactions`;

    const authHeader = request.headers.get("authorization");
    const headers = {
      "Content-Type": "application/json",
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    console.log(`[API] Card transactions request to: ${url}`);

    const res = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[API] Card transactions error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
