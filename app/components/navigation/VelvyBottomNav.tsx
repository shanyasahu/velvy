"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  Home,
  LayoutGrid,
  MessageSquare,
  UserRound,
} from "lucide-react";

const items = [
  { label: "Home", icon: Home, href: "/" },
  { label: "Experts", icon: LayoutGrid, href: "/experts" },
  { label: "Bookings", icon: CalendarDays, href: "/bookings" },
  { label: "Messages", icon: MessageSquare, href: "/messages" },
  { label: "Profile", icon: UserRound, href: "/profile" },
];

export function VelvyBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-3 bottom-4 z-40 rounded-2xl border border-(--border) bg-(--bg-card)/90 px-4 py-3 shadow-[var(--shadow-card)] backdrop-blur-2xl lg:hidden">
      <ul className="flex items-center justify-between">
        {items.map(({ label, icon: Icon, href }) => {
          const active = pathname === href;

          return (
            <li key={label}>
              <Link
                href={href}
                className="group flex flex-col items-center gap-1 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <Icon
                  strokeWidth={1.6}
                  className={`h-5 w-5 transition-colors duration-300 ${
                    active
                      ? "fill-(--accent-primary)/15 text-(--accent-primary)"
                      : "text-(--text-secondary) group-hover:text-(--text-primary)"
                  }`}
                />
                <span
                  className={`text-[10px] transition-colors duration-300 ${
                    active
                      ? "text-(--accent-primary)"
                      : "text-(--text-secondary) group-hover:text-(--text-primary)"
                  }`}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
