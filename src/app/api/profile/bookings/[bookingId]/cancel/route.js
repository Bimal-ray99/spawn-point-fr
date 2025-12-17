import { NextResponse } from "next/server";

export async function POST(request, { params }) {
  const { bookingId } = await params;
  const token = request.headers.get("authorization");

  if (!token) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const res = await fetch(
      `${process.env.API_BASE_URL}/v1/bookings/${bookingId}/cancel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      }
    );

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
