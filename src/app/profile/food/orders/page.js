"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowLeft, Clock, XCircle, ChevronRight } from "lucide-react";
import { PaginationControl } from "@/components/ui/PaginationControl";

export default function OrderHistoryPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchOrders(currentPage);
  }, [currentPage]);

  const fetchOrders = async (page) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const res = await fetch(
        `/api/profile/food/orders/my-orders?page=${page}&limit=10`,
        { headers }
      );
      const data = await res.json();

      if (data.success) {
        setOrders(data.data.orders);
        setTotalPages(Math.ceil(data.data.total / 10));
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async (orderId) => {
    if (!confirm("Are you sure you want to cancel this order?")) return;

    setCancellingId(orderId);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/profile/food/orders/${orderId}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (data.success) {
        toast.success("Order cancelled successfully");
        fetchOrders(currentPage);
      } else {
        toast.error(data.error?.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toast.error("Failed to cancel order");
    } finally {
      setCancellingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-spark-orange border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto max-w-5xl">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/profile/food")}
              className="rounded-full bg-white p-3 shadow-md transition-all hover:bg-gray-50"
            >
              <ArrowLeft className="h-6 w-6 text-gray-900" />
            </button>
            <h1 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900">
              My Orders
            </h1>
          </div>
        </div>

        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="rounded-[2rem] bg-white p-12 text-center shadow-lg">
              <p className="text-xl font-bold text-gray-400">
                No orders found.
              </p>
              <button
                onClick={() => router.push("/profile/food")}
                className="mt-4 rounded-xl bg-spark-cyan px-6 py-3 font-bold text-white hover:bg-spark-cyan/90"
              >
                Order Food
              </button>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="overflow-hidden rounded-[2rem] bg-white p-6 shadow-lg transition-all hover:shadow-xl"
              >
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                  <div>
                    <div className="mb-2 flex items-center gap-3">
                      <span className="text-lg font-black text-gray-900">
                        #{order._id.slice(-6).toUpperCase()}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                          order.status === "pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : order.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : order.status === "cancelled"
                            ? "bg-red-100 text-red-600"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm font-bold text-gray-400">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div className="flex-1 md:px-8">
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2 text-sm font-bold text-gray-700"
                        >
                          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs shadow-sm">
                            {item.quantity}
                          </span>
                          {item.foodItemId?.name || "Unknown Item"}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <p className="text-2xl font-black text-spark-orange">
                      {order.totalPoints} pts
                    </p>
                    {order.status === "pending" && (
                      <button
                        onClick={() => handleCancel(order._id)}
                        disabled={cancellingId === order._id}
                        className="rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-500 transition-colors hover:bg-red-100 disabled:opacity-50"
                      >
                        {cancellingId === order._id ? "..." : "Cancel"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-8">
          <PaginationControl
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
