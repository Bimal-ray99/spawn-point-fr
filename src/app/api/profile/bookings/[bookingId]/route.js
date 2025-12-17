import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { bookingId } = await params;
    const baseUrl = process.env.API_BASE_URL || "http://localhost:4000/api";
    const url = `${baseUrl}/v1/bookings/${bookingId}`;

    const authHeader = request.headers.get("authorization");
    const headers = {
      "Content-Type": "application/json",
    };
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const res = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("[API] Single Booking error:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
