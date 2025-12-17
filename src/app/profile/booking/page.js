"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Monitor,
  Calendar,
  Clock,
  CheckCircle,
  Loader2,
  History,
  Cpu,
  Gamepad2,
} from "lucide-react";
import { PaginationControl } from "@/components/ui/PaginationControl";

export default function BookingPage() {
  const router = useRouter();
  const [systems, setSystems] = useState([]);
  const [cards, setCards] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [activeBooking, setActiveBooking] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSystem, setSelectedSystem] = useState(null);

  // Booking Form State
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [duration, setDuration] = useState(1);
  const [couponCode, setCouponCode] = useState("");

  const [availability, setAvailability] = useState(null); // null, 'checking', 'available', 'unavailable'
  const [isBooking, setIsBooking] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const fetchData = async (page = 1) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      // Fetch Systems
      const systemsRes = await fetch("/api/profile/systems", { headers });
      const systemsData = await systemsRes.json();

      if (systemsData.success && systemsData.data.systems) {
        const availableSystems = systemsData.data.systems.filter(
          (sys) => sys.status === "available"
        );
        setSystems(availableSystems);
      }

      // Fetch Cards
      const cardsRes = await fetch("/api/profile/cards", { headers });
      const cardsData = await cardsRes.json();
      if (cardsData.success && cardsData.data.cards) {
        setCards(cardsData.data.cards);
      }

      // Fetch My Bookings
      const bookingsRes = await fetch(
        `/api/profile/bookings/mine?page=${page}&limit=10`,
        { headers }
      );
      const bookingsData = await bookingsRes.json();
      if (bookingsData.success && bookingsData.data.data) {
        setBookings(bookingsData.data.data);
        const total = bookingsData.data.total || bookingsData.data.data.length;
        setTotalPages(Math.ceil(total / 10));

        // Check for active booking (status: 'scheduled' or 'active')
        const active = bookingsData.data.data.find(
          (b) =>
            b.status === "scheduled" ||
            b.status === "active" ||
            b.status === "in_progress"
        );

        if (active) {
          // Fetch full details for the active booking
          const activeRes = await fetch(`/api/profile/bookings/${active._id}`, {
            headers,
          });
          const activeData = await activeRes.json();
          if (activeData.success && activeData.data.booking) {
            setActiveBooking(activeData.data.booking);
          } else {
            setActiveBooking(active); // Fallback to list data
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load booking data");
    } finally {
      setIsLoading(false);
    }
  };

  const checkAvailability = async () => {
    if (!selectedSystem || !date || !startTime || !duration) return;

    setAvailability("checking");
    try {
      const token = localStorage.getItem("token");

      // Construct startAt: "YYYY-MM-DDTHH:mm:00"
      const startAt = `${date}T${startTime}:00`;
      const durationMinutes = duration * 60;

      const query = new URLSearchParams({
        systemId: selectedSystem._id,
        startAt,
        durationMinutes,
      }).toString();

      const res = await fetch(`/api/profile/bookings/availability?${query}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success && data.available) {
        setAvailability("available");
      } else {
        setAvailability("unavailable");
        toast.error(data.reason || "Selected slot is not available");
      }
    } catch (error) {
      console.error("Availability check error:", error);
      setAvailability("unavailable");
    }
  };

  const handleBooking = async () => {
    const activeCard = cards.find((c) => c.status === "active");
    if (!activeCard) {
      toast.error("You need an active membership card to book.");
      return;
    }

    if (availability !== "available") {
      toast.error("Please check availability first.");
      return;
    }

    setIsBooking(true);
    try {
      const token = localStorage.getItem("token");
      const startDateTime = new Date(`${date}T${startTime}:00`);
      const isoStartTime = startDateTime.toISOString();

      const res = await fetch("/api/profile/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          systemId: selectedSystem._id,
          cardId: activeCard._id,
          startAt: isoStartTime,
          durationMinutes: parseInt(duration) * 60,
          couponCode,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Booking created successfully!");
        setSelectedSystem(null);
        setDate("");
        setStartTime("");
        setCouponCode("");
        setAvailability(null);
        fetchData(1); // Refresh bookings
      } else {
        toast.error(data.error?.message || "Failed to create booking");
      }
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to create booking");
    } finally {
      setIsBooking(false);
    }
  };

  // Countdown Timer
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!activeBooking) return;

    const calculateTimeLeft = () => {
      const now = new Date();
      const end = new Date(
        new Date(
          new Date(activeBooking.startAt).getTime() +
            activeBooking.durationMinutes * 60000
        )
      );
      const diff = end - now;

      if (diff <= 0) {
        return "Finished";
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      return `${hours}h ${minutes}m ${seconds}s`;
    };

    setTimeLeft(calculateTimeLeft()); // Initial call

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [activeBooking]);

  // Date Constraints
  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 3);

  const minDateStr = today.toISOString().split("T")[0];
  const maxDateStr = maxDate.toISOString().split("T")[0];

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-spark-orange" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen font-sans text-gray-900 pb-20">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-8 text-5xl font-black italic uppercase tracking-tighter text-gray-900">
          Book a System
        </h1>

        {/* Active Booking Banner */}
        {activeBooking && (
          <div className="mb-12 overflow-hidden rounded-[2.5rem] bg-gradient-to-r from-gray-900 to-gray-800 p-8 text-white shadow-2xl">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                  </span>
                  <p className="text-xs font-bold uppercase tracking-widest text-green-400">
                    Active Booking
                  </p>
                </div>
                <h2 className="text-3xl font-black italic uppercase">
                  {activeBooking.systemId?.name ||
                    activeBooking.system?.name ||
                    "System"}
                </h2>
                <p className="text-gray-400">
                  {new Date(
                    activeBooking.startAt || activeBooking.startTime
                  ).toLocaleDateString()}{" "}
                  •{" "}
                  {new Date(
                    activeBooking.startAt || activeBooking.startTime
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-xs font-bold uppercase text-gray-500">
                    Time Remaining
                  </p>
                  <p className="text-3xl font-black text-white tabular-nums">
                    {timeLeft}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold uppercase text-gray-500">
                    Cost
                  </p>
                  <p className="text-2xl font-bold text-spark-cyan">
                    {activeBooking.pointsCharged || activeBooking.totalCost} Pts
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 mb-12">
          {/* Left: System Selection */}
          <div className="lg:col-span-7">
            <h2 className="mb-6 text-2xl font-black italic uppercase text-gray-900">
              Available Systems
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {systems.length > 0 ? (
                systems.map((system) => (
                  <div
                    key={system._id}
                    onClick={() => {
                      setSelectedSystem(system);
                      setAvailability(null);
                    }}
                    className={`cursor-pointer rounded-3xl border-2 p-6 transition-all hover:scale-[1.02] ${
                      selectedSystem?._id === system._id
                        ? "border-spark-cyan bg-white shadow-xl ring-4 ring-spark-cyan/10"
                        : "border-gray-100 bg-white hover:border-spark-cyan/30 hover:shadow-md"
                    }`}
                  >
                    <div className="mb-4 flex items-start justify-between">
                      <div
                        className={`rounded-2xl p-4 ${
                          selectedSystem?._id === system._id
                            ? "bg-spark-cyan text-white"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        <Monitor className="h-8 w-8" />
                      </div>
                      <div className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                        {system.type}
                      </div>
                    </div>

                    <h3 className="mb-1 text-2xl font-black text-gray-900">
                      {system.name}
                    </h3>

                    {/* Specs / Tags Placeholder */}
                    <div className="mb-4 flex flex-wrap gap-2">
                      <span className="flex items-center gap-1 text-xs font-bold text-gray-400">
                        <Cpu className="h-3 w-3" /> RTX 4090
                      </span>
                      <span className="flex items-center gap-1 text-xs font-bold text-gray-400">
                        <Monitor className="h-3 w-3" /> 240Hz
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                      <span className="text-xs font-bold uppercase text-gray-400">
                        Hourly Rate
                      </span>
                      <span className="text-xl font-black text-spark-cyan">
                        {system.hourlyRatePoints} Pts
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full rounded-3xl bg-gray-50 p-8 text-center">
                  <p className="font-bold text-gray-500">
                    No available systems found.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right: Booking Form */}
          <div className="lg:col-span-5">
            <div className="sticky top-8 rounded-[2.5rem] bg-white p-8 shadow-2xl">
              <h2 className="mb-6 text-2xl font-black italic uppercase text-gray-900">
                Booking Details
              </h2>

              {!selectedSystem ? (
                <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400">
                  <Monitor className="mb-4 h-16 w-16 opacity-20" />
                  <p className="font-bold">Select a system to proceed</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Selected System Info */}
                  <div className="flex items-center gap-3 rounded-2xl bg-gray-50 p-4 border border-gray-100">
                    <Monitor className="h-6 w-6 text-spark-cyan" />
                    <div>
                      <p className="text-xs font-bold uppercase text-gray-400">
                        Selected System
                      </p>
                      <p className="font-black text-gray-900">
                        {selectedSystem.name}
                      </p>
                    </div>
                  </div>

                  {/* Date Picker */}
                  <div>
                    <label className="mb-2 block text-sm font-bold uppercase text-gray-500">
                      Date
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                      <input
                        type="date"
                        min={minDateStr}
                        max={maxDateStr}
                        value={date}
                        onChange={(e) => {
                          setDate(e.target.value);
                          setAvailability(null);
                        }}
                        className="w-full rounded-xl border-2 border-gray-100 bg-gray-50 py-3 pl-12 pr-4 font-bold text-gray-900 focus:border-spark-cyan focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Time & Duration */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-bold uppercase text-gray-500">
                        Start Time
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                        <select
                          value={startTime}
                          onChange={(e) => {
                            setStartTime(e.target.value);
                            setAvailability(null);
                          }}
                          className="w-full rounded-xl border-2 border-gray-100 bg-gray-50 py-3 pl-12 pr-4 font-bold text-gray-900 focus:border-spark-cyan focus:outline-none appearance-none"
                        >
                          <option value="">Select Time</option>
                          {Array.from({ length: 48 }).map((_, i) => {
                            const hour = Math.floor(i / 2);
                            const minute = i % 2 === 0 ? "00" : "30";
                            const time = `${hour
                              .toString()
                              .padStart(2, "0")}:${minute}`;
                            return (
                              <option key={time} value={time}>
                                {time}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-bold uppercase text-gray-500">
                        Duration (Hrs)
                      </label>
                      <select
                        value={duration}
                        onChange={(e) => {
                          setDuration(e.target.value);
                          setAvailability(null);
                        }}
                        className="w-full rounded-xl border-2 border-gray-100 bg-gray-50 py-3 px-4 font-bold text-gray-900 focus:border-spark-cyan focus:outline-none"
                      >
                        {[1, 2, 3, 4, 5].map((h) => (
                          <option key={h} value={h}>
                            {h} Hour{h > 1 ? "s" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Coupon Code */}
                  <div>
                    <label className="mb-2 block text-sm font-bold uppercase text-gray-500">
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      placeholder="Enter code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full rounded-xl border-2 border-gray-100 bg-gray-50 py-3 px-4 font-bold text-gray-900 focus:border-spark-cyan focus:outline-none"
                    />
                  </div>

                  {/* Buttons */}
                  {availability !== "available" ? (
                    <button
                      onClick={checkAvailability}
                      disabled={
                        !date || !startTime || availability === "checking"
                      }
                      className="w-full rounded-xl bg-gray-900 py-4 text-lg font-bold uppercase tracking-wider text-white shadow-xl transition-all hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400"
                    >
                      {availability === "checking" ? (
                        <Loader2 className="mx-auto h-6 w-6 animate-spin" />
                      ) : (
                        "Check Availability"
                      )}
                    </button>
                  ) : (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
                      <div className="flex items-center justify-center gap-2 rounded-xl bg-green-100 py-3 text-green-700 font-bold">
                        <CheckCircle className="h-5 w-5" /> Slot Available
                      </div>

                      {/* Total Cost */}
                      <div className="rounded-2xl bg-spark-cyan/5 p-6 text-center border-2 border-spark-cyan/20">
                        <p className="text-sm font-bold uppercase text-gray-500">
                          Total Cost
                        </p>
                        <p className="text-4xl font-black italic text-spark-cyan">
                          {selectedSystem.hourlyRatePoints * duration}{" "}
                          <span className="text-lg not-italic text-gray-400">
                            Pts
                          </span>
                        </p>
                      </div>

                      <button
                        onClick={handleBooking}
                        disabled={isBooking}
                        className="w-full rounded-full bg-spark-cyan py-4 text-lg font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-spark-cyan/90 hover:scale-[1.02] disabled:bg-gray-200 disabled:cursor-not-allowed"
                      >
                        {isBooking ? "Booking..." : "Confirm Booking"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Current Bookings Section - Full Width */}
        <div className="mt-12">
          <h2 className="mb-6 flex items-center gap-3 text-2xl font-black italic uppercase text-gray-900">
            <History className="h-6 w-6" /> Current Bookings
          </h2>
          <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-100 bg-gray-50/50">
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-400">
                      System
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black uppercase tracking-wider text-gray-400">
                      Date & Time
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider text-gray-400">
                      Status
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-black uppercase tracking-wider text-gray-400">
                      Cost
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.length > 0 ? (
                    bookings.map((booking) => (
                      <tr
                        key={booking._id}
                        onClick={() =>
                          router.push(`/profile/booking/${booking._id}`)
                        }
                        className="cursor-pointer transition-colors hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="rounded-xl bg-gray-100 p-2 text-gray-500">
                              <Gamepad2 className="h-5 w-5" />
                            </div>
                            <span className="font-bold text-gray-900">
                              {booking.systemId?.name ||
                                booking.system?.name ||
                                "System"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900">
                              {new Date(
                                booking.startAt || booking.startTime
                              ).toLocaleDateString()}
                            </span>
                            <span className="text-xs font-bold text-gray-400">
                              {new Date(
                                booking.startAt || booking.startTime
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${
                              booking.status === "completed"
                                ? "bg-green-100 text-green-600"
                                : booking.status === "cancelled"
                                ? "bg-red-100 text-red-600"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="font-black text-gray-900">
                            {booking.pointsCharged || booking.totalCost} Pts
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-8 text-center text-gray-500 font-bold"
                      >
                        No booking history found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          {/* Pagination Control */}
          <div className="border-t border-gray-100 p-4">
            <PaginationControl
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
