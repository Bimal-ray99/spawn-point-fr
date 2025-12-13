import { useMemo, useState } from "react";

export const useTournamentFilter = (allTournaments) => {
  const [filter, setFilter] = useState("all");

  const mapByStatus = useMemo(() => {
    const map = { all: allTournaments };
    for (const t of allTournaments) {
      if (!map[t.status]) map[t.status] = [];
      map[t.status].push(t);
    }
    return map;
  }, [allTournaments]);

  const filteredTournaments = useMemo(
    () => mapByStatus[filter] || [],
    [mapByStatus, filter]
  );

  const featuredTournaments = useMemo(() => {
    if (filter === "upcoming") return [];
    return filteredTournaments.filter((t) => t.featured);
  }, [filteredTournaments, filter]);

  const regularTournaments = useMemo(() => {
    const featuredIds = new Set(featuredTournaments.map((t) => t.id));
    return filteredTournaments.filter((t) => !featuredIds.has(t.id));
  }, [filteredTournaments, featuredTournaments]);

  const isDarkMode = filter === "current";

  return {
    filter,
    setFilter,
    isDarkMode,
    filteredTournaments,
    featuredTournaments,
    regularTournaments,
  };
};
