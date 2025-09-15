"use client";

import { redirect, Router } from "next/navigation";

export default function NotFound() {
  return redirect("/");
}
