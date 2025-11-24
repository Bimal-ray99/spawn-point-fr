"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  Monitor,
  Calendar,
  Clock,
  ArrowLeft,
  Loader2,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function BookingDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { bookingId } = params;

  const [booking, setBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`/api/profile/bookings/${bookingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      if (data.success && data.data.booking) {
        setBooking(data.data.booking);
      } else {
        toast.error("Failed to load booking details");
        router.push("/profile/booking");
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
      toast.error("Error loading booking details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    setIsCancelling(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/profile/bookings/${bookingId}/cancel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Booking cancelled successfully");
        fetchBookingDetails(); // Refresh details
      } else {
        toast.error(data.error?.message || "Failed to cancel booking");
      }
    } catch (error) {
      console.error("Error cancelling booking:", error);
      toast.error("Failed to cancel booking");
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-spark-orange" />
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="min-h-screen font-sans text-gray-900 pb-20">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-200"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-2xl">
          <div className="bg-gray-900 p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-gray-400">
                  Booking ID: {booking._id}
                </p>
                <h1 className="text-3xl font-black italic uppercase">
                  {booking.systemId?.name || booking.system?.name || "System"}
                </h1>
              </div>
              <div
                className={`rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wider ${
                  booking.status === "completed"
                    ? "bg-green-500 text-white"
                    : booking.status === "cancelled"
                    ? "bg-red-500 text-white"
                    : "bg-blue-500 text-white"
                }`}
              >
                {booking.status}
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="mb-4 text-lg font-black uppercase text-gray-900">
                  Time & Date
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                    <Calendar className="h-6 w-6 text-spark-cyan" />
                    <div>
                      <p className="text-xs font-bold uppercase text-gray-400">
                        Date
                      </p>
                      <p className="font-bold text-gray-900">
                        {new Date(
                          booking.startAt || booking.startTime
                        ).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4">
                    <Clock className="h-6 w-6 text-spark-cyan" />
                    <div>
                      <p className="text-xs font-bold uppercase text-gray-400">
                        Time
                      </p>
                      <p className="font-bold text-gray-900">
                        {new Date(
                          booking.startAt || booking.startTime
                        ).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-black uppercase text-gray-900">
                  Payment Details
                </h3>
                <div className="rounded-2xl bg-gray-50 p-6">
                  <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
                    <span className="text-sm font-bold text-gray-500">
                      Rate per Hour
                    </span>
                    <span className="font-bold text-gray-900">
                      {booking.systemId?.hourlyRatePoints ||
                        booking.system?.hourlyRatePoints ||
                        0}{" "}
                      Pts
                    </span>
                  </div>
                  <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-4">
                    <span className="text-sm font-bold text-gray-500">
                      Duration
                    </span>
                    <span className="font-bold text-gray-900">
                      {(new Date(booking.endAt) - new Date(booking.startAt)) /
                        (1000 * 60 * 60)}{" "}
                      Hours
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black uppercase text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-black text-spark-cyan">
                      {booking.pointsCharged || booking.totalCost} Pts
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {(booking.status === "scheduled" ||
              booking.status === "reserved") && (
              <div className="mt-12 border-t border-gray-100 pt-8">
                <div className="flex items-center justify-between rounded-2xl bg-red-50 p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-red-100 p-3 text-red-600">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-red-900">Cancel Booking</h4>
                      <p className="text-sm text-red-700">
                        Need to change plans? You can cancel this booking.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleCancelBooking}
                    disabled={isCancelling}
                    className="rounded-xl bg-red-600 px-6 py-3 font-bold text-white shadow-lg transition-all hover:bg-red-700 disabled:bg-gray-300"
                  >
                    {isCancelling ? "Cancelling..." : "Cancel Booking"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
