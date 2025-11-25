"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Search,
  Users,
  Plus,
  Shield,
  Mail,
  Check,
  X,
  Loader2,
  Lock,
  Unlock,
  Eye,
  Send,
} from "lucide-react";

export default function TeamsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("myteams");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [myTeams, setMyTeams] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [sentInvitations, setSentInvitations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    name: "",
    tag: "",
    description: "",
    isPublic: true,
  });

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

      const [teamsRes, invitationsRes, sentInvitationsRes] = await Promise.all([
        fetch("/api/profile/teams/my", { headers }),
        fetch("/api/profile/teams/invitations/my?status=pending", { headers }),
        fetch("/api/profile/teams/invitations/sent", { headers }),
      ]);

      const teamsData = await teamsRes.json();
      const invitationsData = await invitationsRes.json();
      const sentInvitationsData = await sentInvitationsRes.json();

      console.log("Teams data:", teamsData);
      console.log("Invitations data:", invitationsData);
      console.log("Sent invitations data:", sentInvitationsData);

      if (teamsData.success) {
        const teams = Array.isArray(teamsData.data)
          ? teamsData.data
          : teamsData.data?.teams || [];

        // Extract user role from members array for each team
        const userId = JSON.parse(atob(token.split(".")[1])).userId;
        const teamsWithRole = teams.map((team) => {
          const userMember = team.members?.find(
            (m) => m.userId?._id === userId || m.userId === userId
          );
          return {
            ...team,
            role: userMember?.role || "member",
          };
        });

        console.log("Parsed teams with roles:", teamsWithRole);
        setMyTeams(teamsWithRole);
      }

      if (invitationsData.success) {
        const invites = Array.isArray(invitationsData.data)
          ? invitationsData.data
          : invitationsData.data?.invitations || [];
        setInvitations(invites);
      }

      if (sentInvitationsData.success) {
        const sentInvites = Array.isArray(sentInvitationsData.data)
          ? sentInvitationsData.data
          : sentInvitationsData.data?.invitations || [];
        setSentInvitations(sentInvites);
      }
    } catch (error) {
      console.error("Error fetching teams data:", error);
      toast.error("Failed to load teams");
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
      const url = `/api/profile/teams/search?query=${encodeURIComponent(
        searchQuery
      )}&limit=20`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        const teams = Array.isArray(data.data)
          ? data.data
          : data.data?.teams || [];
        setSearchResults(teams);
        if (teams.length === 0) {
          toast.info("No teams found matching your search");
        }
      } else {
        toast.error(data.error?.message || "Failed to search teams");
      }
    } catch (error) {
      console.error("Error searching teams:", error);
      toast.error("Failed to search teams");
    } finally {
      setIsSearching(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();

    if (!createForm.name.trim() || !createForm.tag.trim()) {
      toast.error("Team name and tag are required");
      return;
    }

    if (createForm.tag.length < 2 || createForm.tag.length > 5) {
      toast.error("Tag must be 2-5 characters");
      return;
    }

    setActionLoading({ ...actionLoading, create: true });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/profile/teams", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(createForm),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Team "${createForm.name}" created successfully!`);
        setShowCreateModal(false);
        setCreateForm({ name: "", tag: "", description: "", isPublic: true });
        fetchData();
      } else {
        toast.error(data.error?.message || "Failed to create team");
      }
    } catch (error) {
      console.error("Error creating team:", error);
      toast.error("Failed to create team");
    } finally {
      setActionLoading({ ...actionLoading, create: false });
    }
  };

  const handleRespondInvitation = async (invitationId, accept) => {
    setActionLoading({ ...actionLoading, [invitationId]: true });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `/api/profile/teams/invitations/${invitationId}/respond`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ accept }),
        }
      );

      const data = await res.json();
      if (data.success) {
        toast.success(accept ? "Invitation accepted!" : "Invitation declined");
        fetchData();
      } else {
        toast.error(data.error?.message || "Failed to respond to invitation");
      }
    } catch (error) {
      console.error("Error responding to invitation:", error);
      toast.error("Failed to respond to invitation");
    } finally {
      setActionLoading({ ...actionLoading, [invitationId]: false });
    }
  };

  const getRoleBadgeColor = (role) => {
    switch (role?.toLowerCase()) {
      case "captain":
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case "moderator":
        return "bg-gradient-to-r from-blue-400 to-blue-600 text-white";
      default:
        return "bg-gray-200 text-gray-700";
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
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-black italic uppercase tracking-tighter text-gray-900">
              Teams
            </h1>
            <p className="text-gray-500 font-bold mt-2">
              Join or create competitive teams
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 rounded-2xl bg-spark-cyan px-6 py-3 font-bold text-white shadow-lg transition-all hover:bg-spark-cyan/90"
          >
            <Plus className="h-5 w-5" />
            Create Team
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search teams by name or tag..."
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
              <div className="grid gap-4 sm:grid-cols-2">
                {searchResults.map((team) => (
                  <div
                    key={team._id}
                    className="rounded-2xl border border-gray-100 p-4 transition-all hover:border-spark-cyan hover:shadow-md"
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-gray-900">
                            {team.name}
                          </h4>
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600">
                            {team.tag}
                          </span>
                        </div>
                        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                          {team.description || "No description"}
                        </p>
                      </div>
                      {team.isPublic ? (
                        <Unlock className="h-4 w-4 text-green-500" />
                      ) : (
                        <Lock className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        <Users className="inline h-3 w-3 mr-1" />
                        {team.memberCount || 0} members
                      </span>
                      <button
                        onClick={() =>
                          router.push(`/profile/teams/${team._id}`)
                        }
                        className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200"
                      >
                        <Eye className="inline h-4 w-4 mr-1" />
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab("myteams")}
            className={`whitespace-nowrap rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
              activeTab === "myteams"
                ? "bg-gray-900 text-white shadow-lg"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Users className="inline h-4 w-4 mr-2" />
            My Teams ({myTeams.length})
          </button>
          <button
            onClick={() => setActiveTab("invitations")}
            className={`whitespace-nowrap rounded-full px-6 py-3 text-sm font-bold uppercase tracking-wider transition-all ${
              activeTab === "invitations"
                ? "bg-gray-900 text-white shadow-lg"
                : "bg-white text-gray-500 hover:bg-gray-50"
            }`}
          >
            <Mail className="inline h-4 w-4 mr-2" />
            Invitations ({invitations.length})
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
            Sent ({sentInvitations.length})
          </button>
        </div>

        {/* Content */}
        <div className="rounded-[2.5rem] bg-white p-8 shadow-xl">
          {activeTab === "myteams" && (
            <div>
              <h2 className="mb-6 text-2xl font-black italic uppercase text-gray-900">
                My Teams
              </h2>
              {myTeams.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <Users className="mx-auto mb-4 h-12 w-12 opacity-20" />
                  <p className="font-bold">No teams yet</p>
                  <p className="text-sm">
                    Create or join a team to get started
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {myTeams.map((team) => (
                    <div
                      key={team._id}
                      className="rounded-2xl border border-gray-100 p-6 transition-all hover:border-spark-cyan hover:shadow-md cursor-pointer"
                      onClick={() => router.push(`/profile/teams/${team._id}`)}
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-black text-gray-900">
                              {team.name}
                            </h3>
                            <span className="rounded-full bg-gray-900 px-2 py-0.5 text-xs font-bold text-white">
                              {team.tag}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-gray-500 line-clamp-2">
                            {team.description || "No description"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${getRoleBadgeColor(
                            team.role
                          )}`}
                        >
                          <Shield className="inline h-3 w-3 mr-1" />
                          {team.role || "Member"}
                        </span>
                        <span className="text-xs text-gray-400">
                          <Users className="inline h-3 w-3 mr-1" />
                          {team.memberCount || 0} members
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "invitations" && (
            <div>
              <h2 className="mb-6 text-2xl font-black italic uppercase text-gray-900">
                Team Invitations
              </h2>
              {invitations.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <Mail className="mx-auto mb-4 h-12 w-12 opacity-20" />
                  <p className="font-bold">No pending invitations</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {invitations.map((invitation) => (
                    <div
                      key={invitation._id}
                      className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-spark-cyan text-white font-black">
                          {invitation.teamId?.name?.charAt(0)?.toUpperCase() ||
                            "T"}
                        </div>
                        <div>
                          <p className="font-black text-gray-900">
                            {invitation.teamId?.name || "Team"}
                            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600">
                              {invitation.teamId?.tag}
                            </span>
                          </p>
                          <p className="text-sm text-gray-500">
                            Invited by {invitation.invitedBy?.name || "Unknown"}
                          </p>
                          {invitation.message && (
                            <p className="mt-1 text-xs text-gray-400 italic">
                              "{invitation.message}"
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            handleRespondInvitation(invitation._id, true)
                          }
                          disabled={actionLoading[invitation._id]}
                          className="flex items-center gap-2 rounded-xl bg-green-500 px-4 py-2 text-sm font-bold text-white transition-all hover:bg-green-600 disabled:bg-gray-200 disabled:text-gray-400"
                        >
                          <Check className="h-4 w-4" />
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            handleRespondInvitation(invitation._id, false)
                          }
                          disabled={actionLoading[invitation._id]}
                          className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-500 transition-all hover:bg-red-100 disabled:opacity-50"
                        >
                          <X className="h-4 w-4" />
                          Decline
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
                Sent Invitations
              </h2>
              {sentInvitations.length === 0 ? (
                <div className="py-12 text-center text-gray-400">
                  <Send className="mx-auto mb-4 h-12 w-12 opacity-20" />
                  <p className="font-bold">No sent invitations</p>
                  <p className="text-sm">Invite users from team details page</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sentInvitations.map((invitation) => (
                    <div
                      key={invitation._id}
                      className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-6 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 font-black text-gray-600">
                          {invitation.invitedUser?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "?"}
                        </div>
                        <div className="flex-1">
                          <p className="font-black text-gray-900">
                            {invitation.invitedUser?.name || "Unknown User"}
                          </p>
                          <p className="text-sm text-gray-500">
                            Invited to:{" "}
                            <span className="font-bold">
                              {invitation.teamId?.name || "Team"}
                            </span>
                            <span className="ml-2 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-bold text-gray-600">
                              {invitation.teamId?.tag}
                            </span>
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Status:{" "}
                            <span className="font-bold">
                              {invitation.status || "pending"}
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Team Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <h2 className="mb-6 text-2xl font-black italic uppercase text-gray-900">
              Create New Team
            </h2>
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  value={createForm.name}
                  onChange={(e) =>
                    setCreateForm({ ...createForm, name: e.target.value })
                  }
                  className="w-full rounded-xl border-2 border-gray-100 bg-white px-4 py-3 font-bold text-gray-900 focus:border-spark-cyan focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Team Tag * (2-5 characters)
                </label>
                <input
                  type="text"
                  value={createForm.tag}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      tag: e.target.value.toUpperCase(),
                    })
                  }
                  maxLength={5}
                  className="w-full rounded-xl border-2 border-gray-100 bg-white px-4 py-3 font-bold text-gray-900 uppercase focus:border-spark-cyan focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={createForm.description}
                  onChange={(e) =>
                    setCreateForm({
                      ...createForm,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full rounded-xl border-2 border-gray-100 bg-white px-4 py-3 font-bold text-gray-900 focus:border-spark-cyan focus:outline-none resize-none"
                />
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                <span className="text-sm font-bold text-gray-700">
                  Public Team
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setCreateForm({
                      ...createForm,
                      isPublic: !createForm.isPublic,
                    })
                  }
                  className={`relative h-6 w-12 rounded-full transition-colors ${
                    createForm.isPublic ? "bg-spark-cyan" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                      createForm.isPublic ? "translate-x-6" : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 rounded-xl bg-gray-100 py-3 font-bold text-gray-700 transition-colors hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading.create}
                  className="flex-1 rounded-xl bg-spark-cyan py-3 font-bold text-white transition-colors hover:bg-spark-cyan/90 disabled:bg-gray-200 disabled:text-gray-400"
                >
                  {actionLoading.create ? (
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                  ) : (
                    "Create Team"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
