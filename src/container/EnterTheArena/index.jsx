"use client";

import { useIsMobile } from "@/utils/IsMobile";
import EnterArena from "./EnterArenaDesktop";
import EnterArenaMobile from "./EnterArenaMobile";

export default function EnterArenaWrapper() {
  const isMobile = useIsMobile();
  return <>{isMobile ? <EnterArenaMobile /> : <EnterArena />}</>;
}
