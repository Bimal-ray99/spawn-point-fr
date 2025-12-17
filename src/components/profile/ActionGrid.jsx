"use client";

import { CreditCard, Calendar, Utensils, Users } from "lucide-react";
import Link from "next/link";

export function ActionGrid() {
  const actions = [
    {
      label: "Recharge Card",
      icon: CreditCard,
      color: "text-spark-cyan",
      bg: "bg-white",
      hover: "hover:bg-spark-cyan hover:text-white",
      href: "/profile/cards",
      iconBg: "bg-blue-50",
      iconColor: "text-spark-cyan",
    },
    {
      label: "Make Booking",
      icon: Calendar,
      color: "text-spark-purple",
      bg: "bg-white",
      hover: "hover:bg-spark-purple hover:text-white",
      href: "/profile/booking",
      iconBg: "bg-purple-50",
      iconColor: "text-spark-purple",
    },
    {
      label: "Order Food",
      icon: Utensils,
      color: "text-spark-orange",
      bg: "bg-white",
      hover: "hover:bg-spark-orange hover:text-white",
      href: "/profile/food",
      iconBg: "bg-orange-50",
      iconColor: "text-spark-orange",
    },
    {
      label: "My Team",
      icon: Users,
      color: "text-green-500",
      bg: "bg-white",
      hover: "hover:bg-green-500 hover:text-white",
      href: "/profile/teams",
      iconBg: "bg-green-50",
      iconColor: "text-green-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 flex-1">
      {actions.map((action) => {
        const content = (
          <>
            <div
              className={`mb-2 rounded-full p-3 transition-colors ${action.iconBg} ${action.color} group-hover:bg-white/20 group-hover:text-white`}
            >
              <action.icon className="h-6 w-6" />
            </div>
            <span
              className={`text-xs font-bold ${action.color} group-hover:text-white`}
            >
              {action.label}
            </span>
          </>
        );

        if (action.href) {
          return (
            <Link
              key={action.label}
              href={action.href}
              className={`group relative flex flex-col items-center justify-center rounded-2xl p-4 shadow-sm transition-all hover:scale-105 hover:shadow-md ${action.bg} ${action.hover}`}
            >
              {content}
            </Link>
          );
        }

        return (
          <button
            key={action.label}
            className={`group relative flex flex-col items-center justify-center rounded-2xl p-4 shadow-sm transition-all hover:scale-105 hover:shadow-md ${action.bg} ${action.hover}`}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
