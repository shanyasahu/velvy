"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, Menu, Sparkles, X } from "lucide-react";

import { ThemeToggle } from "@/components/ThemeToggle";
import { SearchBar } from "./SearchBar";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Menu", href: "/menu" },
  { label: "Service", href: "/service" },
  { label: "Experts", href: "/experts" },
  { label: "Bookings", href: "/bookings" },
  { label: "Offers", href: "/offers" },
];

export function VelvyHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 border-b border-(--border) bg-(--bg-card)/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-[1600px] items-center justify-between gap-3 px-4 lg:h-16 lg:gap-4 lg:px-6">
        <div className="flex flex-1 items-center gap-3 lg:gap-4">
          <button
            type="button"
            aria-label="Open menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-(--text-primary) transition-colors hover:bg-(--bg-card-hover) lg:hidden"
          >
            {menuOpen ? (
              <X size={20} strokeWidth={1.8} />
            ) : (
              <Menu size={20} strokeWidth={1.8} />
            )}
          </button>

          <Link href="/" className="flex shrink-0 flex-col justify-center">
            <span className="flex items-center gap-0.5">
              <span className="font-[family-name:var(--font-logo)] text-[1.65rem] font-bold leading-none text-(--accent-primary) lg:text-3xl">
                Velvy
              </span>
              <Sparkles
                size={16}
                strokeWidth={1.6}
                className="-mt-2.5 fill-(--brand-gold) text-(--brand-gold) lg:-mt-3 lg:h-[18px] lg:w-[18px]"
              />
            </span>
            <span className="hidden text-[9px] font-semibold uppercase tracking-[0.28em] text-(--brand-gold) lg:block">
              Beauty · Wellness · Yours
            </span>
          </Link>

          <SearchBar
            className="hidden w-full max-w-sm lg:flex"
            placeholder="Search services, salons, spas, experts..."
          />
        </div>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map(({ label, href }) => {
            const active = pathname === href;
            return (
              <Link
                key={label}
                href={href}
                className={`text-sm font-medium transition-colors hover:text-(--accent-primary) ${
                  active ? "text-(--accent-primary)" : "text-(--text-secondary)"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5 lg:gap-3">
          <ThemeToggle />

          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-9 w-9 items-center justify-center rounded-full border border-(--border) bg-(--bg-card) transition-colors hover:border-(--accent-primary) lg:h-[38px] lg:w-[38px]"
          >
            <Bell size={15} strokeWidth={1.6} className="text-(--text-primary) lg:h-4 lg:w-4" />
            <span className="absolute -right-0.5 top-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-(--brand-gold) text-[9px] font-semibold text-white">
              2
            </span>
          </button>

          <button
            type="button"
            aria-label="Profile"
            className="flex items-center gap-2 rounded-full border border-transparent p-0.5 transition-colors hover:border-(--border) lg:pr-2"
          >
            <span className="h-9 w-9 overflow-hidden rounded-full border-2 border-(--brand-gold) bg-(--bg-secondary) lg:h-[38px] lg:w-[38px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/profile.jpeg"
                alt="Profile"
                className="h-full w-full object-cover"
              />
            </span>
            <span className="hidden text-sm font-medium text-(--text-primary) lg:block">
              Emma
            </span>
            <ChevronDown
              size={16}
              strokeWidth={1.8}
              className="hidden text-(--text-secondary) lg:block"
            />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="border-t border-(--border) bg-(--bg-card)/95 backdrop-blur-xl lg:hidden">
          <ul className="flex flex-col px-4 py-1.5">
            {navLinks.map(({ label, href }) => {
              const active = pathname === href;
              return (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={() => setMenuOpen(false)}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-(--bg-card-hover) hover:text-(--accent-primary) ${
                      active ? "text-(--accent-primary)" : "text-(--text-primary)"
                    }`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}
