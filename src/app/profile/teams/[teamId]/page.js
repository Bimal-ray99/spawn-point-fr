"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import {
  Shield,
  Users,
  UserPlus,
  Settings,
  LogOut,
  Trash2,
  Loader2,
  ArrowLeft,
  Crown,
  MoreVertical,
  Search,
  Lock,
  Unlock,
} from "lucide-react";

export default function TeamDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const teamId = params.teamId;

  const [team, setTeam] = useState(null);
  const [members, setMembers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [userRole, setUserRole] = useState("");
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showMemberMenu, setShowMemberMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const [settingsForm, setSettingsForm] = useState({
    name: "",
    tag: "",
    description: "",
    isPublic: true,
  });

  useEffect(() => {
    if (teamId) {
      fetchTeamData();
    }
  }, [teamId]);

  const fetchTeamData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const res = await fetch(`/api/profile/teams/${teamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      if (data.success) {
        const teamData = data.data?.team || data.data;
        console.log("Full team data:", teamData);

        setTeam(teamData);
        setMembers(teamData.members || []);

        // Try to get user role from different possible locations
        let role = teamData.userRole || teamData.role;

        // If not found, check in members array for current user
        if (!role && teamData.members) {
          const token = localStorage.getItem("token");
          const userId = JSON.parse(atob(token.split(".")[1])).userId;
          const currentUserMember = teamData.members.find(
            (m) => m.userId?._id === userId || m.userId === userId
          );
          role = currentUserMember?.role;
        }

        console.log("Detected user role:", role);
        setUserRole(role || "member");

        setSettingsForm({
          name: teamData.name,
          tag: teamData.tag,
          description: teamData.description || "",
          isPublic: teamData.isPublic,
        });
      } else {
        toast.error("Failed to load team");
        router.push("/profile/teams");
      }
    } catch (error) {
      console.error("Error fetching team:", error);
      toast.error("Failed to load team");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchUsers = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `/api/profile/friends/search?q=${encodeURIComponent(
          searchQuery
        )}&limit=20`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      if (data.success) {
        const users = Array.isArray(data.data)
          ? data.data
          : data.data?.users || [];
        setSearchResults(users);
      }
    } catch (error) {
      console.error("Error searching users:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleInviteMember = async (userId, userName) => {
    setActionLoading({ ...actionLoading, [`invite_${userId}`]: true });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/profile/teams/${teamId}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          invitedUserId: userId,
          message: `Join our team!`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Invitation sent to ${userName}`);
        setSearchQuery("");
        setSearchResults([]);
      } else {
        toast.error(data.error?.message || "Failed to send invitation");
      }
    } catch (error) {
      console.error("Error inviting member:", error);
      toast.error("Failed to send invitation");
    } finally {
      setActionLoading({ ...actionLoading, [`invite_${userId}`]: false });
    }
  };

  const handleUpdateRole = async (memberId, newRole) => {
    setActionLoading({ ...actionLoading, [`role_${memberId}`]: true });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `/api/profile/teams/${teamId}/members/${memberId}/role`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      const data = await res.json();
      if (data.success) {
        toast.success(`Role updated to ${newRole}`);
        fetchTeamData();
      } else {
        toast.error(data.error?.message || "Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    } finally {
      setActionLoading({ ...actionLoading, [`role_${memberId}`]: false });
      setShowMemberMenu(null);
    }
  };

  const handleRemoveMember = async (memberId, memberName) => {
    if (!confirm(`Remove ${memberName} from the team?`)) return;

    setActionLoading({ ...actionLoading, [`remove_${memberId}`]: true });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `/api/profile/teams/${teamId}/members/${memberId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      if (data.success) {
        toast.success(`Removed ${memberName} from team`);
        fetchTeamData();
      } else {
        toast.error(data.error?.message || "Failed to remove member");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      toast.error("Failed to remove member");
    } finally {
      setActionLoading({ ...actionLoading, [`remove_${memberId}`]: false });
      setShowMemberMenu(null);
    }
  };

  const handleTransferCaptain = async (newCaptainId, memberName) => {
    if (!confirm(`Transfer captain role to ${memberName}?`)) return;

    setActionLoading({ ...actionLoading, transfer: true });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/profile/teams/${teamId}/transfer-captain`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newCaptainId }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success(`Transferred captain role to ${memberName}`);
        fetchTeamData();
      } else {
        toast.error(data.error?.message || "Failed to transfer captain");
      }
    } catch (error) {
      console.error("Error transferring captain:", error);
      toast.error("Failed to transfer captain");
    } finally {
      setActionLoading({ ...actionLoading, transfer: false });
      setShowMemberMenu(null);
    }
  };

  const handleUpdateTeam = async (e) => {
    e.preventDefault();

    setActionLoading({ ...actionLoading, update: true });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/profile/teams/${teamId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settingsForm),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Team updated successfully");
        setShowSettingsModal(false);
        fetchTeamData();
      } else {
        toast.error(data.error?.message || "Failed to update team");
      }
    } catch (error) {
      console.error("Error updating team:", error);
      toast.error("Failed to update team");
    } finally {
      setActionLoading({ ...actionLoading, update: false });
    }
  };

  const handleLeaveTeam = async () => {
    if (!confirm("Are you sure you want to leave this team?")) return;

    setActionLoading({ ...actionLoading, leave: true });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/profile/teams/${teamId}/leave`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Left team successfully");
        router.push("/profile/teams");
      } else {
        toast.error(data.error?.message || "Failed to leave team");
      }
    } catch (error) {
      console.error("Error leaving team:", error);
      toast.error("Failed to leave team");
    } finally {
      setActionLoading({ ...actionLoading, leave: false });
    }
  };

  const handleDeleteTeam = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this team? This action cannot be undone."
      )
    )
      return;

    setActionLoading({ ...actionLoading, delete: true });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/profile/teams/${teamId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Team deleted successfully");
        router.push("/profile/teams");
      } else {
        toast.error(data.error?.message || "Failed to delete team");
      }
    } catch (error) {
      console.error("Error deleting team:", error);
      toast.error("Failed to delete team");
    } finally {
      setActionLoading({ ...actionLoading, delete: false });
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

  const canManageMembers = () => {
    return userRole === "captain" || userRole === "moderator";
  };

  const canEditSettings = () => {
    return userRole === "captain";
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-spark-orange" />
      </div>
    );
  }

  if (!team) {
    return null;
  }

  return (
    <div className="relative min-h-screen font-sans text-gray-900 pb-20">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.push("/profile/teams")}
          className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="font-bold">Back to Teams</span>
        </button>

        {/* Team Header */}
        <div className="mb-8 rounded-[2.5rem] bg-white p-8 shadow-xl">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900">
                  {team.name}
                </h1>
                <span className="rounded-full bg-gray-900 px-3 py-1 text-sm font-bold text-white">
                  {team.tag}
                </span>
                {team.isPublic ? (
                  <Unlock className="h-5 w-5 text-green-500" />
                ) : (
                  <Lock className="h-5 w-5 text-gray-400" />
                )}
              </div>
              <p className="text-gray-600 font-medium mb-4">
                {team.description || "No description"}
              </p>
              <div className="flex items-center gap-4">
                <span
                  className={`rounded-full px-4 py-1.5 text-sm font-bold ${getRoleBadgeColor(
                    userRole
                  )}`}
                >
                  <Shield className="inline h-4 w-4 mr-1" />
                  {userRole}
                </span>
                <span className="text-sm text-gray-500">
                  <Users className="inline h-4 w-4 mr-1" />
                  {members.length} members
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {canEditSettings() && (
                <button
                  onClick={() => setShowSettingsModal(true)}
                  className="rounded-xl bg-gray-100 px-4 py-2 font-bold text-gray-700 transition-colors hover:bg-gray-200"
                >
                  <Settings className="inline h-4 w-4 mr-2" />
                  Settings
                </button>
              )}
              {canManageMembers() && (
                <button
                  onClick={() => setShowInviteModal(true)}
                  className="rounded-xl bg-spark-cyan px-4 py-2 font-bold text-white transition-colors hover:bg-spark-cyan/90"
                >
                  <UserPlus className="inline h-4 w-4 mr-2" />
                  Invite
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Members List */}
        <div className="rounded-[2.5rem] bg-white p-8 shadow-xl">
          <h2 className="mb-6 text-2xl font-black italic uppercase text-gray-900">
            Team Members
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {members.map((member) => (
              <div
                key={member._id}
                className="relative rounded-2xl border border-gray-100 p-4 transition-all hover:border-spark-cyan"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-spark-cyan to-blue-500 text-white font-black">
                      {member.userId?.name?.charAt(0)?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="font-black text-gray-900">
                        {member.userId?.name || "Unknown"}
                      </p>
                      <span
                        className={`inline-block rounded-full px-2 py-0.5 text-xs font-bold ${getRoleBadgeColor(
                          member.role
                        )}`}
                      >
                        {member.role}
                      </span>
                    </div>
                  </div>

                  {/* Member Actions Menu */}
                  {canManageMembers() && member.role !== "captain" && (
                    <div className="relative">
                      <button
                        onClick={() =>
                          setShowMemberMenu(
                            showMemberMenu === member._id ? null : member._id
                          )
                        }
                        className="rounded-lg p-1 hover:bg-gray-100"
                      >
                        <MoreVertical className="h-4 w-4 text-gray-500" />
                      </button>

                      {showMemberMenu === member._id && (
                        <div className="absolute right-0 top-8 z-10 w-48 rounded-xl border border-gray-200 bg-white p-2 shadow-lg">
                          {canEditSettings() && (
                            <>
                              <button
                                onClick={() =>
                                  handleUpdateRole(
                                    member.userId._id,
                                    member.role === "moderator"
                                      ? "member"
                                      : "moderator"
                                  )
                                }
                                className="w-full rounded-lg px-3 py-2 text-left text-sm font-bold hover:bg-gray-50"
                              >
                                {member.role === "moderator"
                                  ? "Demote to Member"
                                  : "Promote to Moderator"}
                              </button>
                              <button
                                onClick={() =>
                                  handleTransferCaptain(
                                    member.userId._id,
                                    member.userId?.name
                                  )
                                }
                                className="w-full rounded-lg px-3 py-2 text-left text-sm font-bold text-yellow-600 hover:bg-yellow-50"
                              >
                                <Crown className="inline h-4 w-4 mr-2" />
                                Transfer Captain
                              </button>
                            </>
                          )}
                          <button
                            onClick={() =>
                              handleRemoveMember(
                                member.userId._id,
                                member.userId?.name
                              )
                            }
                            className="w-full rounded-lg px-3 py-2 text-left text-sm font-bold text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="inline h-4 w-4 mr-2" />
                            Remove Member
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-500">{member.userId?.email}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Actions */}
        <div className="mt-6 flex items-center justify-between rounded-2xl bg-white p-6 shadow-xl">
          <div>
            <p className="font-bold text-gray-900">Team Actions</p>
            <p className="text-sm text-gray-500">Manage your team membership</p>
          </div>
          <div className="flex gap-3">
            {canEditSettings() && (
              <button
                onClick={handleDeleteTeam}
                disabled={actionLoading.delete}
                className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 transition-colors hover:bg-red-100 disabled:opacity-50"
              >
                {actionLoading.delete ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Delete Team
                  </>
                )}
              </button>
            )}
            {userRole !== "captain" && (
              <button
                onClick={handleLeaveTeam}
                disabled={actionLoading.leave}
                className="flex items-center gap-2 rounded-xl bg-gray-100 px-4 py-2 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
              >
                {actionLoading.leave ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <LogOut className="h-4 w-4" />
                    Leave Team
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <h2 className="mb-6 text-2xl font-black italic uppercase text-gray-900">
              Team Settings
            </h2>
            <form onSubmit={handleUpdateTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Team Name
                </label>
                <input
                  type="text"
                  value={settingsForm.name}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, name: e.target.value })
                  }
                  className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 font-bold focus:border-spark-cyan focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Team Tag
                </label>
                <input
                  type="text"
                  value={settingsForm.tag}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      tag: e.target.value.toUpperCase(),
                    })
                  }
                  maxLength={5}
                  className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 font-bold uppercase focus:border-spark-cyan focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={settingsForm.description}
                  onChange={(e) =>
                    setSettingsForm({
                      ...settingsForm,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full rounded-xl border-2 border-gray-100 px-4 py-3 font-bold focus:border-spark-cyan focus:outline-none resize-none"
                />
              </div>
              <div className="flex items-center justify-between rounded-xl bg-gray-50 p-4">
                <span className="text-sm font-bold text-gray-700">
                  Public Team
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setSettingsForm({
                      ...settingsForm,
                      isPublic: !settingsForm.isPublic,
                    })
                  }
                  className={`relative h-6 w-12 rounded-full transition-colors ${
                    settingsForm.isPublic ? "bg-spark-cyan" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                      settingsForm.isPublic
                        ? "translate-x-6"
                        : "translate-x-0.5"
                    }`}
                  />
                </button>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowSettingsModal(false)}
                  className="flex-1 rounded-xl bg-gray-100 py-3 font-bold text-gray-700 hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading.update}
                  className="flex-1 rounded-xl bg-spark-cyan py-3 font-bold text-white hover:bg-spark-cyan/90 disabled:bg-gray-200"
                >
                  {actionLoading.update ? (
                    <Loader2 className="mx-auto h-5 w-5 animate-spin" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
            <h2 className="mb-6 text-2xl font-black italic uppercase text-gray-900">
              Invite Member
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearchUsers()}
                  className="flex-1 rounded-xl border-2 border-gray-100 px-4 py-3 font-bold focus:border-spark-cyan focus:outline-none"
                />
                <button
                  onClick={handleSearchUsers}
                  disabled={isSearching}
                  className="rounded-xl bg-spark-cyan px-6 py-3 font-bold text-white hover:bg-spark-cyan/90"
                >
                  {isSearching ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </button>
              </div>

              {searchResults.length > 0 && (
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {searchResults.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center justify-between rounded-xl bg-gray-50 p-3"
                    >
                      <div>
                        <p className="font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <button
                        onClick={() => handleInviteMember(user._id, user.name)}
                        disabled={actionLoading[`invite_${user._id}`]}
                        className="rounded-xl bg-spark-cyan px-4 py-2 text-sm font-bold text-white hover:bg-spark-cyan/90 disabled:bg-gray-200"
                      >
                        {actionLoading[`invite_${user._id}`] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          "Invite"
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="w-full rounded-xl bg-gray-100 py-3 font-bold text-gray-700 hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
