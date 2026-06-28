"use client";

import { ArrowRight, ChevronRight } from "lucide-react";

import type { SubCategory } from "../experts.types";
import { getIcon } from "./icons";

interface SubCategoriesSidebarProps {
  title: string;
  categories: SubCategory[];
  activeId: string;
  onSelect: (id: string) => void;
  viewAllLabel: string;
}

export function SubCategoriesSidebar({
  title,
  categories,
  activeId,
  onSelect,
  viewAllLabel,
}: SubCategoriesSidebarProps) {
  return (
    <aside className="hidden w-[240px] shrink-0 2xl:block">
      <div className="sticky top-24 rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) p-3 shadow-[var(--shadow-card)]">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-(--text-muted)">
          {title}
        </p>

        <ul className="space-y-0.5">
          {categories.map((category) => {
            const Icon = getIcon(category.icon);
            const isActive = category.id === activeId;

            return (
              <li key={category.id}>
                <button
                  type="button"
                  onClick={() => onSelect(category.id)}
                  aria-current={isActive ? "true" : undefined}
                  className={`flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition-colors ${
                    isActive
                      ? "bg-(--bg-secondary)"
                      : "hover:bg-(--bg-secondary)"
                  }`}
                >
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                      isActive
                        ? "primary-button text-white"
                        : "bg-(--bg-secondary) text-(--accent-secondary)"
                    }`}
                  >
                    <Icon size={15} strokeWidth={1.8} />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate text-xs font-medium ${
                        isActive
                          ? "text-(--accent-primary)"
                          : "text-(--text-primary)"
                      }`}
                    >
                      {category.label}
                    </span>
                    <span className="block text-[10px] text-(--text-muted)">
                      {category.count} Experts
                    </span>
                  </span>

                  <ChevronRight
                    size={14}
                    strokeWidth={1.8}
                    className="shrink-0 text-(--text-muted)"
                  />
                </button>
              </li>
            );
          })}
        </ul>

        <button
          type="button"
          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-(--border) py-2.5 text-xs font-medium text-(--text-primary) transition-colors hover:border-(--accent-primary)"
        >
          {viewAllLabel}
          <ArrowRight size={14} strokeWidth={2} />
        </button>
      </div>
    </aside>
  );
}
