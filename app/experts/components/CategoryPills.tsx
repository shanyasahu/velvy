"use client";

import { ChevronDown } from "lucide-react";

interface CategoryPillItem {
  value: string;
  label: string;
}

interface CategoryPillsProps {
  /** Simple string pills — value and label are the same. */
  pills?: string[];
  /** Structured pills with separate value (id) and display label. */
  items?: CategoryPillItem[];
  value: string;
  onChange: (value: string) => void;
  /** Render a trailing "More" pill (display-only, matches reference). */
  showMore?: boolean;
  onMoreClick?: () => void;
  className?: string;
}

export function CategoryPills({
  pills,
  items,
  value,
  onChange,
  showMore = false,
  onMoreClick,
  className = "",
}: CategoryPillsProps) {
  const pillItems: CategoryPillItem[] =
    items ?? pills?.map((pill) => ({ value: pill, label: pill })) ?? [];

  return (
    <div
      className={`flex items-center gap-2 overflow-x-auto scrollbar-none ${className}`}
    >
      {pillItems.map((pill) => {
        const isActive = pill.value === value;
        return (
          <button
            key={pill.value || "all"}
            type="button"
            onClick={() => onChange(pill.value)}
            aria-pressed={isActive}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors lg:text-xs ${
              isActive
                ? "primary-button border-transparent text-white"
                : "border-(--border) bg-(--bg-card) text-(--text-secondary) hover:border-(--accent-primary) hover:text-(--text-primary)"
            }`}
          >
            {pill.label}
          </button>
        );
      })}

      {showMore && (
        <button
          type="button"
          onClick={onMoreClick}
          className="flex shrink-0 items-center gap-1 rounded-full border border-(--border) bg-(--bg-card) px-3 py-1.5 text-[11px] font-medium text-(--text-secondary) transition-colors hover:border-(--accent-primary) hover:text-(--text-primary) lg:text-xs"
        >
          More
          <ChevronDown size={13} strokeWidth={1.8} />
        </button>
      )}
    </div>
  );
}
