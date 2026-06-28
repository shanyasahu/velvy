"use client";

import Link from "next/link";
import { Headset } from "lucide-react";

import type { TopCategory } from "../experts.types";
import { getIcon } from "./icons";

interface TopCategoriesSidebarProps {
  categories: TopCategory[];
  activeId: string;
  onSelect: (id: string) => void;
}

export function TopCategoriesSidebar({
  categories,
  activeId,
  onSelect,
}: TopCategoriesSidebarProps) {
  return (
    <aside className="hidden w-[220px] shrink-0 lg:block">
      <div className="sticky top-24 flex h-[calc(100vh-7rem)] flex-col gap-4">
        <nav
          aria-label="Expert categories"
          className="flex flex-1 flex-col rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) p-4 shadow-[var(--shadow-card)]"
        >
          <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-(--text-muted)">
            Categories
          </p>

          <ul className="flex flex-1 flex-col justify-between gap-1.5">
            {categories.map((category) => {
              const Icon = getIcon(category.icon);
              const isActive = category.id === activeId;

              return (
                <li key={category.id} className="flex-1">
                  <button
                    type="button"
                    onClick={() => onSelect(category.id)}
                    aria-current={isActive ? "true" : undefined}
                    className={`flex h-full w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                      isActive
                        ? "primary-button text-white"
                        : "text-(--text-secondary) hover:bg-(--bg-secondary) hover:text-(--text-primary)"
                    }`}
                  >
                    <Icon size={18} strokeWidth={1.8} className="shrink-0" />
                    <span className="truncate">{category.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="shrink-0 rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) p-4 shadow-[var(--shadow-card)]">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-(--bg-secondary) text-(--accent-secondary)">
            <Headset size={18} strokeWidth={1.6} />
          </span>
          <h3 className="mt-3 text-sm font-semibold text-(--text-primary)">
            Need Help?
          </h3>
          <p className="mt-1 text-[11px] leading-relaxed text-(--text-secondary)">
            We&apos;re here to help you find the right expert.
          </p>
          <Link
            href="/help"
            className="mt-3 flex h-9 w-full items-center justify-center rounded-lg border border-(--border) text-xs font-medium text-(--text-primary) transition-colors hover:border-(--accent-primary)"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </aside>
  );
}
