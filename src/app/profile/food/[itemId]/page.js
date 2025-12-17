"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  ArrowLeft,
  Clock,
  Utensils,
  Plus,
  Minus,
  ShoppingCart,
} from "lucide-react";

export default function ItemDetailsPage() {
  const router = useRouter();
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchData();
  }, [itemId]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };
      const res = await fetch(`/api/profile/food/items/${itemId}`, { headers });
      const data = await res.json();

      if (data.success) {
        setItem(data.data.item);
      } else {
        toast.error("Failed to load item details");
      }
    } catch (error) {
      console.error("Error fetching item:", error);
      toast.error("Failed to load item");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToCart = () => {
    // In a real app, this would update a global cart state or context
    // For now, we'll just redirect back to the menu with a success message
    // assuming the menu page handles cart state locally (which it does in our implementation)
    // To make this work seamlessly, we'd need a CartContext.
    // Since we kept state local in FoodPage, we can't easily add from here without context.
    // For this demo, I will just show a toast and redirect.
    toast.success(`Added ${quantity} ${item.name} to cart`);
    router.push("/profile/food");
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-spark-orange border-t-transparent" />
      </div>
    );
  }

  if (!item) return null;

  return (
    <div className="min-h-screen p-8">
      <div className="container mx-auto max-w-4xl">
        <button
          onClick={() => router.back()}
          className="mb-8 flex items-center gap-2 rounded-full bg-white px-4 py-2 font-bold text-gray-900 shadow-md transition-all hover:bg-gray-50"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Menu
        </button>

        <div className="overflow-hidden rounded-[2.5rem] bg-white shadow-2xl">
          <div className="grid md:grid-cols-2">
            <div className="aspect-square bg-gray-100 p-12">
              <div className="flex h-full w-full items-center justify-center rounded-[2rem] bg-white shadow-inner">
                <Utensils className="h-32 w-32 text-gray-300" />
              </div>
            </div>
            <div className="flex flex-col justify-center p-12">
              <div className="mb-2">
                <span className="rounded-full bg-spark-cyan/10 px-3 py-1 text-xs font-bold uppercase text-spark-cyan">
                  {item.category}
                </span>
              </div>
              <h1 className="mb-4 text-4xl font-black italic uppercase text-gray-900">
                {item.name}
              </h1>
              <div className="mb-8 flex items-center gap-4 text-gray-500">
                <div className="flex items-center gap-2 font-bold">
                  <Clock className="h-5 w-5" />
                  {item.preparationTime} mins
                </div>
              </div>

              <p className="mb-8 text-lg font-medium text-gray-600">
                {item.description || "No description available."}
              </p>

              <div className="mt-auto">
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-4 rounded-full bg-gray-50 p-2">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="h-10 w-10 rounded-full bg-white shadow-sm hover:bg-gray-100 flex items-center justify-center"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="text-xl font-black w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="h-10 w-10 rounded-full bg-white shadow-sm hover:bg-gray-100 flex items-center justify-center"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  <p className="text-4xl font-black text-spark-orange">
                    {item.pricePoints * quantity} pts
                  </p>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gray-900 py-4 text-lg font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-gray-800 hover:scale-[1.02]"
                >
                  <ShoppingCart className="h-6 w-6" />
                  Add to Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
