"use client";

import { useState, useEffect } from "react";
import { TopNav } from "@/components/profile/TopNav";
import { useRouter, usePathname } from "next/navigation";
import TopBar from "@/components/TopBar/TopBar";

export function GlobalNav() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const [profileRes, cardsRes] = await Promise.all([
          fetch("/api/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/profile/cards", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.success) {
            let userData = profileData.data.user;

            if (cardsRes.ok) {
              const cardsData = await cardsRes.json();
              if (cardsData.success && cardsData.data.cards) {
                const activeCard = cardsData.data.cards.find(
                  (c) => c.status === "active"
                );
                if (activeCard) {
                  userData = {
                    ...userData,
                    balancePoints: activeCard.balancePoints,
                  };
                }
              }
            }
            setUser(userData);
          }
        }
      } catch (error) {
        console.error("Error fetching user for nav:", error);
      }
    };

    fetchUser();

    // Listen for auth changes
    // Listen for auth changes and user updates
    const handleAuthChange = () => fetchUser();
    window.addEventListener("auth-change", handleAuthChange);
    window.addEventListener("user-updated", handleAuthChange);

    return () => {
      window.removeEventListener("auth-change", handleAuthChange);
      window.removeEventListener("user-updated", handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("auth-change"));
    router.push("/login");
  };

  const isProfileSection = pathname?.startsWith("/profile");

  return isProfileSection ? (
    <TopNav user={user} onLogout={handleLogout} />
  ) : (
    <TopBar />
  );
}
