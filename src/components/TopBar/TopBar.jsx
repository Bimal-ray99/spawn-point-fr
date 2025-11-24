"use client";
import { useViewTransition } from "@/hooks/useViewTransition";
import "./TopBar.css";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import AnimatedButton from "../AnimatedButton/AnimatedButton";

// ... existing imports

const TopBar = () => {
  const topBarRef = useRef(null);
  const { navigateWithTransition } = useViewTransition();
  const pathname = usePathname();
  const router = useRouter();
  let lastScrollY = 0;
  let isScrolling = false;

  // ... existing scroll effect code ...

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check for token to determine login state
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    // Listen for storage events to update state across tabs/windows
    const handleStorageChange = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("storage", handleStorageChange);
    // Custom event for same-tab updates (e.g. after login/logout)
    window.addEventListener("auth-change", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-change", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("auth-change"));
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const isProfilePage = pathname === "/profile";

  if (isProfilePage) return null;

  return (
    <div className="top-bar" ref={topBarRef}>
      <div className="top-bar-logo">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigateWithTransition("/");
          }}
        >
          <img src="/logos/logo-white.png" alt="" />
        </a>
      </div>
      <div className="top-bar-cta">
        <AnimatedButton
          label={isLoggedIn ? "Profile" : "Login"}
          route={isLoggedIn ? "/profile" : "/login"}
          animate={false}
        />
      </div>
    </div>
  );
};

export default TopBar;
