export const sampleTournaments = [
  {
    id: 1,
    enquiryId: "T-001",
    slug: "weekly-blitz",
    title: "Weekly Blitz",
    prize: "$1,000",
    date: "April 5, 2025",
    status: "upcoming",
    registrationOpen: true,
    platforms: ["PC", "Console"],
    imageSrc: "/img.webp",
    genre: "Battle Royale",
    description:
      "Fast-paced battle royale action with weekly prizes and glory for the victors.",
  },
  {
    id: 2,
    enquiryId: "T-002",
    slug: "squad-battle",
    title: "Squad Battle",
    prize: "$3,500",
    date: "March 29, 2025",
    status: "upcoming",
    registrationOpen: true,
    platforms: ["PC", "Mobile"],
    imageSrc: "/img.webp",
    genre: "Team Deathmatch",
    description:
      "Form your elite squad and dominate the battlefield in this team-based competition.",
  },
  {
    id: 3,
    enquiryId: "T-003",
    slug: "duo-challenge",
    title: "XMAS CASH CUP",
    prize: "$2,500",
    date: "March 26-30, 2025",
    status: "current",
    registrationOpen: false,
    featured: true,
    platforms: ["All"],
    imageSrc: "/img.webp",
    genre: "25k Cash Prize",
    description:
      "Mortal Kombat | Gran Truismo7 ",
  },
  {
    id: 4,
    enquiryId: "T-004",
    slug: "pro-league-finals",
    title: "Pro League Finals",
    prize: "$25,000",
    date: "March 25-29, 2025",
    status: "current",
    registrationOpen: false,
    platforms: ["PC"],
    imageSrc: "/img.webp",
    featured: true,
    description:
      "Our flagship tournament with the biggest prize pool and pro players from around the world!",
    genre: "Professional League",
  },
  {
    id: 5,
    enquiryId: "T-005",
    slug: "rookie-cup",
    title: "Rookie Cup",
    prize: "$1,500",
    date: "April 15, 2025",
    status: "upcoming",
    registrationOpen: true,
    platforms: ["All"],
    imageSrc: "/img.webp",
    featured: true,
    description:
      "Perfect for new players looking to get their first competitive experience.",
    genre: "Rookie League",
  },
  {
    id: 6,
    enquiryId: "T-006",
    slug: "team-deathmatch-current",
    title: "Team Deathmatch",
    prize: "$5,000",
    date: "March 24-28, 2025",
    status: "current",
    registrationOpen: false,
    featured: true,
    platforms: ["Console", "PC"],
    imageSrc: "/img.webp",
    genre: "Team Deathmatch",
    description:
      "Team up and eliminate your opponents in this classic deathmatch format.",
  },
];

// Helper functions for filtering tournaments
export const getTournamentsByFilter = (tournaments, filter) => {
  if (filter === "all") return tournaments;
  return tournaments.filter((tournament) => tournament.status === filter);
};

export const getFeaturedTournaments = (tournaments, filter) => {
  if (filter === "upcoming") return [];
  return tournaments.filter((tournament) => tournament.featured);
};

export const getRegularTournaments = (tournaments, featuredTournaments) => {
  const featuredIds = new Set(featuredTournaments.map((t) => t.id));
  return tournaments.filter((t) => !featuredIds.has(t.id));
};
