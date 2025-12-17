"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Clock,
  Utensils,
  ChevronRight,
  CreditCard,
  Tag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FoodPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [tableNumber, setTableNumber] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const headers = { Authorization: `Bearer ${token}` };

      const [catRes, menuRes, cardsRes] = await Promise.all([
        fetch("/api/profile/food/categories", { headers }),
        fetch("/api/profile/food/menu", { headers }),
        fetch("/api/profile/cards", { headers }),
      ]);

      const catData = await catRes.json();
      const menuData = await menuRes.json();
      const cardsData = await cardsRes.json();

      if (catData.success) setCategories(catData.data.categories);
      if (menuData.success) setMenuItems(menuData.data.menu);
      if (cardsData.success && cardsData.data.cards) {
        setCards(cardsData.data.cards);
        const active = cardsData.data.cards.find((c) => c.status === "active");
        if (active) setSelectedCard(active);
      }
    } catch (error) {
      console.error("Error fetching food data:", error);
      toast.error("Failed to load menu");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      if (existing) {
        return prev.map((i) =>
          i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
    toast.success(`Added ${item.name} to cart`);
  };

  const removeFromCart = (itemId) => {
    setCart((prev) => prev.filter((i) => i._id !== itemId));
  };

  const updateQuantity = (itemId, delta) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item._id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.pricePoints * item.quantity,
    0
  );

  const handleCheckout = async () => {
    if (!selectedCard) {
      toast.error("Please select a payment card");
      return;
    }
    if (!tableNumber) {
      toast.error("Please enter your table number");
      return;
    }

    setIsOrdering(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/profile/food/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          cardId: selectedCard._id,
          items: cart.map((item) => ({
            foodItemId: item._id,
            quantity: item.quantity,
          })),
          deliveryType: "table",
          tableNumber,
          couponCode,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Order placed successfully!");
        setCart([]);
        setIsCartOpen(false);
        router.push("/profile/food/orders");
      } else {
        toast.error(data.error?.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order");
    } finally {
      setIsOrdering(false);
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
    <div className="relative min-h-screen font-sans text-gray-900">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-gray-900">
              Food & Drinks
            </h1>
            <p className="text-gray-500 font-bold mt-2">
              Fuel up for your next match!
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => router.push("/profile/food/orders")}
              className="rounded-xl bg-white px-6 py-3 font-bold text-gray-900 shadow-lg transition-all hover:bg-gray-50"
            >
              My Orders
            </button>
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 rounded-xl bg-spark-orange px-6 py-3 font-bold text-white shadow-lg transition-all hover:bg-spark-orange/90"
            >
              <ShoppingCart className="h-5 w-5" />
              Cart
              {cart.length > 0 && (
                <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white text-xs font-black text-spark-orange shadow-md">
                  {cart.reduce((sum, i) => sum + i.quantity, 0)}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <button
              onClick={() => setActiveCategory("all")}
              className={`rounded-full px-6 py-2 text-sm font-bold uppercase tracking-wider transition-all ${
                activeCategory === "all"
                  ? "bg-gray-900 text-white shadow-lg"
                  : "bg-white text-gray-500 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap rounded-full px-6 py-2 text-sm font-bold uppercase tracking-wider transition-all ${
                  activeCategory === cat
                    ? "bg-gray-900 text-white shadow-lg"
                    : "bg-white text-gray-500 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border-none bg-white py-3 pl-10 pr-4 font-bold text-gray-900 shadow-sm placeholder:text-gray-400 focus:ring-2 focus:ring-spark-cyan"
            />
          </div>
        </div>

        {/* Menu Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <motion.div
              key={item._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="group relative overflow-hidden rounded-[2rem] bg-white p-4 shadow-lg transition-all hover:shadow-xl"
            >
              <div
                onClick={() => router.push(`/profile/food/${item._id}`)}
                className="mb-4 aspect-square w-full cursor-pointer overflow-hidden rounded-2xl bg-gray-100"
              >
                {/* Placeholder for image - in real app would use item.image */}
                <div className="flex h-full w-full items-center justify-center bg-gray-50 text-gray-300">
                  <Utensils className="h-12 w-12" />
                </div>
              </div>
              <div className="mb-4">
                <div className="mb-1 flex items-start justify-between">
                  <h3 className="text-lg font-black text-gray-900 line-clamp-1">
                    {item.name}
                  </h3>
                  <span className="rounded-full bg-spark-cyan/10 px-2 py-1 text-[10px] font-bold uppercase text-spark-cyan">
                    {item.category}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400">
                  <Clock className="h-3 w-3" />
                  {item.preparationTime} mins
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xl font-black text-spark-orange">
                  {item.pricePoints} pts
                </p>
                <button
                  onClick={() => addToCart(item)}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-white transition-transform hover:scale-110 active:scale-95"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-0 top-0 z-50 h-full w-full max-w-md bg-white shadow-2xl"
            >
              <div className="flex h-full flex-col p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-2xl font-black italic uppercase text-gray-900">
                    Your Order
                  </h2>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="rounded-full bg-gray-100 p-2 hover:bg-gray-200"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {cart.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center text-gray-400">
                      <ShoppingCart className="mb-4 h-12 w-12 opacity-20" />
                      <p className="font-bold">Your cart is empty</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {cart.map((item) => (
                        <div
                          key={item._id}
                          className="flex items-center gap-4 rounded-2xl border border-gray-100 p-3"
                        >
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900">
                              {item.name}
                            </h4>
                            <p className="text-sm font-bold text-spark-orange">
                              {item.pricePoints * item.quantity} pts
                            </p>
                          </div>
                          <div className="flex items-center gap-3 rounded-full bg-gray-50 px-2 py-1">
                            <button
                              onClick={() => updateQuantity(item._id, -1)}
                              className="p-1 hover:text-red-500"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-4 text-center text-sm font-bold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, 1)}
                              className="p-1 hover:text-green-500"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <div className="mb-6 space-y-4">
                    {/* Table Number */}
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase text-gray-500">
                        Table Number
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="w-full rounded-xl border-gray-200 bg-gray-50 p-3 font-bold focus:border-spark-cyan focus:ring-spark-cyan"
                      />
                    </div>

                    {/* Coupon */}
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase text-gray-500">
                        Coupon Code
                      </label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Enter code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          className="w-full rounded-xl border-gray-200 bg-gray-50 p-3 pl-10 font-bold focus:border-spark-cyan focus:ring-spark-cyan"
                        />
                      </div>
                    </div>

                    {/* Payment Method */}
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase text-gray-500">
                        Payment Method
                      </label>
                      {cards.length > 0 ? (
                        <div className="rounded-xl border border-gray-200 p-3">
                          <div className="flex items-center gap-3">
                            <CreditCard className="h-5 w-5 text-gray-400" />
                            <div className="flex-1">
                              <p className="text-sm font-bold text-gray-900">
                                {selectedCard?.name || "Select Card"}
                              </p>
                              <p className="text-xs text-gray-500">
                                Balance: {selectedCard?.balancePoints || 0} pts
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-xl bg-red-50 p-3 text-sm font-bold text-red-500">
                          No active cards found
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-6 flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-500">
                      Total
                    </span>
                    <span className="text-3xl font-black text-gray-900">
                      {cartTotal} pts
                    </span>
                  </div>

                  <button
                    onClick={handleCheckout}
                    disabled={cart.length === 0 || isOrdering}
                    className="w-full rounded-xl bg-spark-cyan py-4 text-lg font-black uppercase tracking-widest text-white shadow-lg transition-all hover:bg-spark-cyan/90 disabled:bg-gray-200 disabled:text-gray-400"
                  >
                    {isOrdering ? "Processing..." : "Place Order"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
