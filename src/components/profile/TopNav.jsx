"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Flame,
  ChevronRight,
  Settings,
  LogOut,
  Bell,
  X,
  Check,
} from "lucide-react";

const NAV_ROUTES = [
  { label: "OVERVIEW", path: "/profile" },
  { label: "TOURNAMENT", path: "/profile/tournaments" },
  { label: "TEAMS", path: "/profile/teams" },
  { label: "CARDS", path: "/profile/cards" },
  { label: "COUPONS", path: "/profile/coupons" },
  { label: "BOOKING", path: "/profile/booking" },
  { label: "FOOD", path: "/profile/food" },
  { label: "FRIENDS", path: "/profile/friends" },
];

export function TopNav({ user, onLogout }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    fetchUnreadCount();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch("/api/profile/notifications/my/unread-count", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        setUnreadCount(data.data?.count || 0);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(
        "/api/profile/notifications/my?unread=true&limit=50",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (data.success) {
        const notifs = Array.isArray(data.data)
          ? data.data
          : data.data?.notifications || [];
        setNotifications(notifs);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const handleNotificationClick = () => {
    setIsNotificationOpen(!isNotificationOpen);
    if (!isNotificationOpen) {
      fetchNotifications();
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`/api/profile/notifications/${notificationId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(notifications.filter((n) => n._id !== notificationId));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const token = localStorage.getItem("token");
      await fetch("/api/profile/notifications/mark-all-read", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications([]);
      setUnreadCount(0);
      setIsNotificationOpen(false);
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleDeleteNotification = async (notificationId, e) => {
    e.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      await fetch(`/api/profile/notifications/${notificationId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(notifications.filter((n) => n._id !== notificationId));
      setUnreadCount(Math.max(0, unreadCount - 1));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-black h-14">
      <div className="h-full w-full px-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src="/logos/logo-white.png"
              alt="SpawnPoint"
              width={40}
              height={40}
              className="h-8 w-auto object-contain"
            />
          </Link>
        </div>

        <div className="hidden h-full items-center gap-12 md:flex">
          {NAV_ROUTES.map((route) => (
            <NavLink
              key={route.label}
              label={route.label}
              href={route.path}
              active={pathname === route.path}
            />
          ))}
        </div>

        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={handleNotificationClick}
              className="relative p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <Bell className="h-5 w-5 text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs font-bold text-white flex items-center justify-center">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 top-12 w-96 rounded-2xl bg-white shadow-2xl border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-100">
                  <h3 className="font-black text-gray-900">Notifications</h3>
                  <div className="flex items-center gap-2">
                    {notifications.length > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-xs font-bold text-spark-cyan hover:text-spark-cyan/80"
                      >
                        Mark all read
                      </button>
                    )}
                    <button
                      onClick={() => setIsNotificationOpen(false)}
                      className="p-1 hover:bg-gray-100 rounded-lg"
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Notifications List */}
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-gray-400">
                      <Bell className="h-12 w-12 mx-auto mb-2 opacity-20" />
                      <p className="font-bold">No new notifications</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification._id}
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 text-sm">
                              {notification.title || "Notification"}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {notification.message || notification.body}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {new Date(
                                notification.createdAt
                              ).toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={(e) =>
                              handleDeleteNotification(notification._id, e)
                            }
                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded-lg transition-opacity"
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex items-center gap-3 rounded-xl bg-white/5 p-1 pr-4 transition-colors hover:bg-white/10"
            >
              <div className="h-9 w-9 overflow-hidden rounded-lg bg-gray-900">
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-tr from-spark-cyan to-blue-500 text-sm font-bold text-white">
                  {user?.name?.charAt(0) || "U"}
                </div>
              </div>
              <div className="text-left">
                <p className="text-xs font-bold text-white">
                  {user?.name || "User"}
                </p>
                <div className="flex items-center gap-1">
                  <Flame className="h-3 w-3 text-spark-orange" />
                  <p className="text-[10px] font-bold text-gray-400">
                    {user?.balancePoints !== undefined
                      ? user.balancePoints
                      : user?.totalPointsSpent || 0}{" "}
                    pts
                  </p>
                </div>
              </div>
              <ChevronRight
                className={`h-4 w-4 text-gray-400 transition-transform ${
                  isMenuOpen ? "rotate-90" : ""
                }`}
              />
            </button>

            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 origin-top-right rounded-xl border border-gray-800 bg-[#13131a] p-2 shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                <div className="mb-2 border-b border-gray-800 px-3 py-2">
                  <p className="text-xs text-gray-500">Signed in as</p>
                  <p className="truncate text-sm font-bold text-white">
                    {user?.email}
                  </p>
                </div>
                <button className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-300 hover:bg-white/5">
                  <Settings className="h-4 w-4" /> Settings
                </button>
                <button
                  onClick={onLogout}
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-500 hover:bg-red-500/10"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

function NavLink({ label, href, active }) {
  return (
    <Link
      href={href}
      className={`relative flex h-full items-center text-sm font-black italic tracking-wide transition-colors ${
        active ? "text-spark-cyan" : "text-gray-400 hover:text-white"
      }`}
    >
      {label}
      {active && (
        <span className="absolute bottom-0 left-0 h-1 w-full bg-spark-cyan shadow-[0_0_10px_#00C2FF]" />
      )}
    </Link>
  );
}
