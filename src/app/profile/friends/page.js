"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Send,
  Check,
  X,
  Loader2,
  Mail,
} from "lucide-react";

export default function FriendsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("friends");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [actionLoading, setActionLoading] = useState({});

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

      const [friendsRes, pendingRes, sentRes] = await Promise.all([
        fetch("/api/profile/friends", { headers }),
        fetch("/api/profile/friends/requests/pending", { headers }),
        fetch("/api/profile/friends/requests/sent", { headers }),
      ]);

      const friendsData = await friendsRes.json();
      const pendingData = await pendingRes.json();
      const sentData = await sentRes.json();

      console.log("Friends data:", friendsData);
      console.log("Pending data:", pendingData);
      console.log("Sent data:", sentData);

      // Handle both response formats: data.friends/data.requests or data as array
      if (friendsData.success) {
        const friends = Array.isArray(friendsData.data)
          ? friendsData.data
          : friendsData.data?.friends || [];
        setFriends(friends);
      }
      if (pendingData.success) {
        const pending = Array.isArray(pendingData.data)
          ? pendingData.data
          : pendingData.data?.requests || [];
        setPendingRequests(pending);
      }
      if (sentData.success) {
        const sent = Array.isArray(sentData.data)
          ? sentData.data
          : sentData.data?.requests || [];
        setSentRequests(sent);
      }
    } catch (error) {
      console.error("Error fetching friends data:", error);
      toast.error("Failed to load friends");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const token = localStorage.getItem("token");
      const url = `/api/profile/friends/search?q=${encodeURIComponent(
        searchQuery
      )}&limit=20`;

      console.log("Searching with URL:", url);

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Search response status:", res.status);

      const data = await res.json();
      console.log("Search response data:", data);

      if (data.success) {
        // Handle both response formats: data.data.users or data.data
        const users = Array.isArray(data.data)
          ? data.data
          : data.data?.users || [];
        console.log("Found users:", users.length);
        setSearchResults(users);
        if (users.length === 0) {
          toast.info("No users found matching your search");
        }
      } else {
        console.error("Search failed:", data);
        toast.error(
          data.error?.message || data.message || "Failed to search users"
        );
      }
    } catch (error) {
      console.error("Error searching users:", error);
      toast.error("Failed to search users");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSendRequest = async (userId, userName) => {
    setActionLoading({ ...actionLoading, [userId]: true });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/profile/friends/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          receiverId: userId,
          message: `Let's be friends!`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Friend request sent to ${userName}`);
        fetchData();
        handleSearch(); // Refresh search results
      } else {
        toast.error(data.error?.message || "Failed to send request");
      }
    } catch (error) {
      console.error("Error sending friend request:", error);
      toast.error("Failed to send request");
    } finally {
      setActionLoading({ ...actionLoading, [userId]: false });
    }
  };

  const handleAcceptRequest = async (requestId) => {
    setActionLoading({ ...actionLoading, [requestId]: true });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/profile/friends/request/${requestId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Friend request accepted!");
        fetchData();
      } else {
        toast.error(data.error?.message || "Failed to accept request");
      }
    } catch (error) {
      console.error("Error accepting request:", error);
      toast.error("Failed to accept request");
    } finally {
      setActionLoading({ ...actionLoading, [requestId]: false });
    }
  };

  const handleRejectRequest = async (requestId) => {
    setActionLoading({ ...actionLoading, [requestId]: true });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `/api/profile/friends/request/${requestId}/reject`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (data.success) {
        toast.success("Friend request rejected");
        fetchData();
      } else {
        toast.error(data.error?.message || "Failed to reject request");
      }
    } catch (error) {
      console.error("Error rejecting request:", error);
      toast.error("Failed to reject request");
    } finally {
      setActionLoading({ ...actionLoading, [requestId]: false });
    }
  };

  const handleCancelRequest = async (requestId) => {
    setActionLoading({ ...actionLoading, [requestId]: true });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/profile/friends/request/${requestId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Friend request cancelled");
        fetchData();
      } else {
        toast.error(data.error?.message || "Failed to cancel request");
      }
    } catch (error) {
      console.error("Error cancelling request:", error);
      toast.error("Failed to cancel request");
    } finally {
      setActionLoading({ ...actionLoading, [requestId]: false });
    }
  };

  const handleRemoveFriend = async (friendId, friendName) => {
    if (!confirm(`Remove ${friendName} from friends?`)) return;

    setActionLoading({ ...actionLoading, [friendId]: true });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/profile/friends/${friendId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Removed ${friendName} from friends`);
        fetchData();
      } else {
        toast.error(data.error?.message || "Failed to remove friend");
      }
    } catch (error) {
      console.error("Error removing friend:", error);
      toast.error("Failed to remove friend");
    } finally {
      setActionLoading({ ...actionLoading, [friendId]: false });
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-spark-orange" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen font-sans text-gray-900 pb-20">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter text-gray-900">
            Friends
          </h1>
          <p className="text-gray-500 font-bold mt-2">
            Connect with other players
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="w-full rounded-2xl border-2 border-gray-100 bg-white py-4 pl-12 pr-4 font-bold text-gray-900 shadow-sm focus:border-spark-cyan focus:outline-none"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="rounded-2xl bg-spark-cyan px-8 py-4 font-bold text-white shadow-lg transition-all hover:bg-spark-cyan/90 disabled:bg-gray-200 disabled:text-gray-400"
            >
              {isSearching ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                "Search"
              )}
            </button>
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-4 rounded-2xl bg-white p-4 shadow-lg">
              <h3 className="mb-4 text-sm font-bold uppercase text-gray-400">
                Search Results
              </h3>
              <div className="space-y-2">
                {searchResults.map((user) => (
                  <div
                    key={user._id}
                    className="flex items-center justify-between rounded-xl bg-gray-50 p-4"
                  >
                    <div>
                      <p className="font-bold text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={() => handleSendRequest(user._id, user.name)}
                      disabled={actionLoading[user._id]}
                      className="flex items-center gap-2 rounded-xl bg-spark-cyan px-4 py-2 text-sm font-bold text-white transition-all hover:bg-spark-cyan/90 disabled:bg-gray-200 disabled:text-gray-400"
                    >
                      <UserPlus className="h-4 w-4" />
                      {actionLoading[user._id] ? "Sending..." : "Add Friend"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("friends")}
            className={`whitespace-nowrap rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
              activeTab === "friends"
                ? "bg-gray-900 text-white shadow-lg"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Users className="inline h-4 w-4 mr-2" />
            Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab("pending")}
            className={`whitespace-nowrap rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
              activeTab === "pending"
                ? "bg-gray-900 text-white shadow-lg"
                : "bg-white text-gray-500 hover:bg- gray-50"
            }`}
          >
            <Mail className="inline h-4 w-4 mr-2" />
            Requests ({pendingRequests.length})
          </button>
          <button
            onClick={() => setActiveTab("sent")}
            className={`whitespace-nowrap rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
              activeTab === "sent"
                ? "bg-gray-900 text-white shadow-lg"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Send className="inline h-4 w-4 mr-2" />
            Sent ({sentRequests.length})
          </button>
        </div>

        {/* Content */}
        <div className="rounded-[2.5rem] bg-white p-8 shadow-xl">
          {activeTab === "friends" && (
            <div>
              <h2 className="mb-6 text-2xl font-black italic uppercase text-gray-900">
                My Friends
              </h2>
              {friends.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <Users className="mx-auto mb-4 h-12 w-12 opacity-20" />
                  <p className="font-bold">No friends yet</p>
                  <p className="text-sm">Search for users to add friends</p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {friends.map((friend) => (
                    <div
                      key={friend._id}
                      className="rounded-2xl border border-gray-100 p-6 transition-all hover:border-spark-cyan hover:shadow-md"
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-spark-cyan text-white font-black">
                          {friend.name?.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <div className="flex-1">
                          <p className="font-black text-gray-900">
                            {friend.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {friend.email}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          handleRemoveFriend(friend._id, friend.name)
                        }
                        disabled={actionLoading[friend._id]}
                        className="w-full rounded-xl bg-red-50 py-2 text-sm font-bold text-red-500 transition-colors hover:bg-red-100 disabled:opacity-50"
                      >
                        {actionLoading[friend._id] ? (
                          <Loader2 className="mx-auto h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <UserX className="inline h-4 w-4 mr-2" />
                            Remove Friend
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "pending" && (
            <div>
              <h2 className="mb-6 text-2xl font-black italic uppercase text-gray-900">
                Pending Requests
              </h2>
              {pendingRequests.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <Mail className="mx-auto mb-4 h-12 w-12 opacity-20" />
                  <p className="font-bold">No pending requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingRequests.map((request) => (
                    <div
                      key={request._id}
                      className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 font-black text-gray-600">
                          {request.senderId?.name?.charAt(0)?.toUpperCase() ||
                            "?"}
                        </div>
                        <div>
                          <p className="font-black text-gray-900">
                            {request.senderId?.name || "Unknown User"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {request.message || "Wants to be friends"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAcceptRequest(request._id)}
                          disabled={actionLoading[request._id]}
                          className="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400"
                        >
                          <Check className="h-4 w-4" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request._id)}
                          disabled={actionLoading[request._id]}
                          className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-500 transition-all hover:bg-red-100 disabled:opacity-50"
                        >
                          <X className="h-4 w-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "sent" && (
            <div>
              <h2 className="mb-6 text-2xl font-black italic uppercase text-gray-900">
                Sent Requests
              </h2>
              {sentRequests.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <Send className="mx-auto mb-4 h-12 w-12 opacity-20" />
                  <p className="font-bold">No sent requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sentRequests.map((request) => (
                    <div
                      key={request._id}
                      className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 font-black text-gray-600">
                          {request.receiverId?.name?.charAt(0)?.toUpperCase() ||
                            "?"}
                        </div>
                        <div>
                          <p className="font-black text-gray-900">
                            {request.receiverId?.name || "Unknown User"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {request.status || "Pending"}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleCancelRequest(request._id)}
                        disabled={actionLoading[request._id]}
                        className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 transition-all hover:bg-gray-200 disabled:opacity-50"
                      >
                        {actionLoading[request._id] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Cancel Request"
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
