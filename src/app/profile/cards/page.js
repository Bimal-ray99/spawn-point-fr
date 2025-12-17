"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RefreshCw, X, Check, Crown, Tag } from "lucide-react";
import { MemberCard } from "@/components/profile/MemberCard";
import PaginationControl from "@/components/PaginationControl";

export default function CardsPage() {
  const router = useRouter();
  const [cards, setCards] = useState([]);
  const [cardQRs, setCardQRs] = useState({});
  const [tiers, setTiers] = useState([]);
  const [rechargePacks, setRechargePacks] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [selectedPack, setSelectedPack] = useState(null);
  const [isRecharging, setIsRecharging] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [user, setUser] = useState({ name: "User" });

  const activeCard = cards.find((card) => card.status === "active");

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (activeCard) {
      fetchTransactions(activeCard._id, currentPage);
    }
  }, [currentPage, activeCard?._id]);

  const fetchData = async () => {
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

      // Fetch cards
      const cardsRes = await fetch("/api/profile/cards", { headers });
      const cardsData = await cardsRes.json();

      if (cardsData.success && cardsData.data.cards) {
        const fetchedCards = cardsData.data.cards;
        setCards(fetchedCards);

        // Fetch QR codes for all cards
        const qrPromises = fetchedCards.map(async (card) => {
          const qrRes = await fetch(`/api/profile/cards/${card._id}/qr`, {
            headers,
          });
          const qrData = await qrRes.json();
          return { cardId: card._id, qrCode: qrData.data?.qrCode };
        });

        const qrResults = await Promise.all(qrPromises);
        const qrMap = qrResults.reduce((acc, { cardId, qrCode }) => {
          acc[cardId] = qrCode;
          return acc;
        }, {});
        setCardQRs(qrMap);

        // Fetch transactions for active card
        const activeCard = fetchedCards.find(
          (card) => card.status === "active"
        );
        if (activeCard) {
          fetchTransactions(activeCard._id, 1);
        }
      }

      // Fetch Tiers
      const tiersRes = await fetch("/api/profile/tiers", { headers });
      const tiersData = await tiersRes.json();
      if (tiersData.success && tiersData.data?.tiers) {
        setTiers(tiersData.data.tiers);
      }

      // Fetch recharge packs
      const packsRes = await fetch("/api/profile/recharge-packs", {
        headers,
      });
      const packsData = await packsRes.json();
      if (packsData.success && packsData.data.packs) {
        setRechargePacks(packsData.data.packs);
      }

      // Fetch User Profile (for fresh points)
      const profileRes = await fetch("/api/profile", { headers });
      const profileData = await profileRes.json();
      if (profileData.success && profileData.data.user) {
        setUser(profileData.data.user);
        // Update localStorage to keep other components in sync
        localStorage.setItem("user", JSON.stringify(profileData.data.user));
        // Dispatch event for other components listening to storage changes
        window.dispatchEvent(new Event("user-updated"));
      } else {
        // Fallback to local storage if fetch fails
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            console.error("Error parsing user", e);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load cards");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTransactions = async (cardId, page = 1) => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };
      const res = await fetch(
        `/api/profile/cards/${cardId}/transactions?page=${page}&limit=10`,
        { headers }
      );
      const data = await res.json();
      if (data.success) {
        setTransactions(data.data?.transactions || []);
        setTotalPages(data.data?.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleRecharge = async () => {
    if (!activeCard || !selectedPack) {
      toast.error("Please select a recharge pack");
      return;
    }

    setIsRecharging(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/profile/cards/${activeCard._id}/recharge`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rechargePackId: selectedPack._id,
          paymentMethod: "card",
          paymentId: "pi_123",
          couponCode: couponCode || undefined,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Card recharged successfully!");
        setShowRechargeModal(false);
        setSelectedPack(null);
        setCouponCode("");
        fetchData(); // Refresh data
      } else {
        toast.error(data.error?.message || "Failed to recharge card");
      }
    } catch (error) {
      console.error("Error recharging card:", error);
      toast.error("Failed to recharge card");
    } finally {
      setIsRecharging(false);
    }
  };

  const getCardTier = (card) => {
    if (!card || !tiers.length || !user) return null;
    // Sort tiers by points required (descending)
    const sortedTiers = [...tiers].sort(
      (a, b) => b.pointsRequired - a.pointsRequired
    );
    // Find the first tier where user's TOTAL SPENT points >= required points
    const currentTier = sortedTiers.find(
      (t) => (user.totalPointsSpent || 0) >= t.pointsRequired
    );

    // If no tier matches (points < lowest tier), return null or a base tier placeholder
    // If we want to show "Base Tier" when points < Silver (5000), we return null here
    // and handle the fallback in the UI.
    return currentTier;
  };

  const currentTier = getCardTier(activeCard);

  // Calculate progress to next tier
  const getNextTierInfo = () => {
    if (!tiers.length || !activeCard) return { nextTier: null, progress: 0 };

    const sortedTiersAsc = [...tiers].sort(
      (a, b) => a.pointsRequired - b.pointsRequired
    );
    const nextTier = sortedTiersAsc.find(
      (t) => t.pointsRequired > (user.totalPointsSpent || 0)
    );

    if (!nextTier) return { nextTier: null, progress: 100 }; // Max tier reached

    const prevTierPoints = currentTier ? currentTier.pointsRequired : 0;
    const progress =
      ((user.totalPointsSpent - prevTierPoints) /
        (nextTier.pointsRequired - prevTierPoints)) *
      100;

    return { nextTier, progress: Math.max(0, Math.min(progress, 100)) };
  };

  const { nextTier, progress } = getNextTierInfo();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-spark-orange border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen font-sans text-gray-900">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-gray-900">
            My Cards
          </h1>
          {activeCard && (
            <button
              onClick={() => setShowRechargeModal(true)}
              className="flex items-center gap-2 rounded-full bg-spark-cyan px-6 py-3 font-bold text-white shadow-lg transition-all hover:bg-spark-cyan/90 hover:scale-105"
            >
              <RefreshCw className="h-5 w-5" />
              Recharge Card
            </button>
          )}
        </div>

        {/* Main Layout: Left (Card) - Right (Tiers) */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left Column: Member Card */}
          <div className="lg:col-span-5">
            {activeCard ? (
              <div className="sticky top-8">
                <MemberCard
                  card={activeCard}
                  user={user}
                  tier={currentTier}
                  qrCode={cardQRs[activeCard._id]}
                />

                {/* Current Tier Status */}
                <div className="mt-6 rounded-3xl bg-white p-6 shadow-lg">
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-full bg-yellow-100 p-2 text-yellow-600">
                      <Crown className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase text-gray-400">
                        Current Status
                      </p>
                      <h3 className="text-xl font-black text-gray-900">
                        {currentTier?.name || "Base Tier"}
                      </h3>
                    </div>
                  </div>

                  {nextTier ? (
                    <>
                      <div className="w-full rounded-full bg-gray-100 h-2 mb-2">
                        <div
                          className="h-full rounded-full bg-spark-cyan transition-all duration-1000"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <p className="text-xs font-bold text-gray-500 text-right">
                        {user.totalPointsSpent || 0} / {nextTier.pointsRequired}{" "}
                        Points to {nextTier.name} (Total Spent)
                      </p>
                    </>
                  ) : (
                    <p className="text-sm font-bold text-spark-cyan">
                      Max Tier Reached!
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-3xl bg-yellow-50 p-8 text-center shadow-lg">
                <p className="text-xl font-bold text-yellow-800">
                  No active card found.
                </p>
              </div>
            )}
          </div>

          {/* Right Column: Tiers List */}
          <div className="lg:col-span-7">
            <h2 className="mb-6 text-2xl font-black italic uppercase text-gray-900">
              Membership Tiers
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {tiers.map((tier) => {
                const isCurrent = currentTier?._id === tier._id;
                return (
                  <div
                    key={tier._id}
                    className={`relative overflow-hidden rounded-3xl border-2 p-6 transition-all ${
                      isCurrent
                        ? "border-spark-cyan bg-spark-cyan/5 shadow-lg"
                        : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-md"
                    }`}
                  >
                    {isCurrent && (
                      <div className="absolute right-4 top-4 rounded-full bg-spark-cyan px-3 py-1 text-[10px] font-bold uppercase text-white">
                        Current
                      </div>
                    )}
                    <h3 className="text-lg font-black text-gray-900">
                      {tier.name}
                    </h3>
                    <p className="mb-4 text-sm font-bold text-spark-cyan">
                      {tier.pointsRequired} Points
                    </p>

                    <div className="space-y-2">
                      {tier.perks?.map((perk, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-sm text-gray-600"
                        >
                          <Check className="h-4 w-4 text-green-500" />
                          <span>{perk}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom Section: Transactions */}
        {activeCard && transactions.length > 0 && (
          <div className="mt-12 rounded-[2.5rem] bg-white p-8 shadow-xl">
            <h2 className="mb-8 text-3xl font-black italic uppercase text-gray-900">
              Recent Transactions
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    <th className="pb-4 text-left text-sm font-black uppercase tracking-wider text-gray-400">
                      Date
                    </th>
                    <th className="pb-4 text-left text-sm font-black uppercase tracking-wider text-gray-400">
                      Type
                    </th>
                    <th className="pb-4 text-right text-sm font-black uppercase tracking-wider text-gray-400">
                      Amount
                    </th>
                    <th className="pb-4 text-right text-sm font-black uppercase tracking-wider text-gray-400">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {transactions.map((transaction) => (
                    <tr
                      key={transaction._id}
                      className="group transition-colors hover:bg-gray-50/50"
                    >
                      <td className="py-6 text-sm font-bold text-gray-600">
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-6 text-sm font-bold text-gray-900 capitalize">
                        {transaction.type}
                      </td>
                      <td className="py-6 text-right text-lg font-black text-gray-900">
                        {transaction.amount}
                      </td>
                      <td className="py-6 text-right">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                            transaction.status === "completed"
                              ? "bg-green-100 text-green-600"
                              : "bg-yellow-100 text-yellow-600"
                          }`}
                        >
                          {transaction.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <PaginationControl
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Recharge Modal */}
      {showRechargeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[2.5rem] bg-white p-8 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="mb-8 flex items-center justify-between">
              <h2 className="text-3xl font-black italic uppercase text-gray-900">
                Select Recharge Pack
              </h2>
              <button
                onClick={() => setShowRechargeModal(false)}
                className="rounded-full bg-gray-100 p-2 transition-colors hover:bg-gray-200"
              >
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            <div className="mb-8 grid gap-4">
              {rechargePacks.map((pack) => (
                <div
                  key={pack._id}
                  onClick={() => setSelectedPack(pack)}
                  className={`cursor-pointer rounded-3xl border-2 p-6 transition-all hover:scale-[1.02] ${
                    selectedPack?._id === pack._id
                      ? "border-spark-cyan bg-spark-cyan/5 shadow-lg ring-2 ring-spark-cyan/20"
                      : "border-gray-100 bg-white hover:border-spark-cyan/30 hover:shadow-md"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-xl font-black text-gray-900">
                      {pack.name}
                    </h3>
                    <div className="text-right">
                      <p className="text-2xl font-black text-spark-cyan">
                        ₹{pack.basePrice}
                      </p>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                        +{pack.pointsGranted} Points
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-gray-500">
                    {pack.description}
                  </p>
                </div>
              ))}
            </div>

            {/* Coupon Code */}
            <div className="mb-8">
              <label className="mb-2 block text-xs font-bold uppercase text-gray-500">
                Coupon Code (Optional)
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full rounded-xl border-gray-200 bg-gray-50 p-3 pl-10 font-bold focus:border-spark-cyan focus:ring-spark-cyan"
                />
              </div>
            </div>

            <button
              onClick={handleRecharge}
              disabled={!selectedPack || isRecharging}
              className="w-full rounded-full bg-spark-cyan py-5 text-lg font-black uppercase tracking-widest text-white shadow-xl transition-all hover:bg-spark-cyan/90 hover:scale-[1.02] hover:shadow-2xl disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
            >
              {isRecharging ? "Processing..." : "Confirm Recharge"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
