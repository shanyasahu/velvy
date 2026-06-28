"use client";

import type { FilterOption } from "../experts.types";
import { CategoryPills } from "./CategoryPills";

interface ExpertsHeaderProps {
  title: string;
  subtitle: string;
  activeCategory: {
    title: string;
    description: string;
    pillItems: { value: string; label: string }[];
    showMorePills?: boolean;
  };
  pillValue: string;
  onPillChange: (value: string) => void;
  onMorePillsClick?: () => void;
}

export function ExpertsHeader({
  title,
  subtitle,
  activeCategory,
  pillValue,
  onPillChange,
  onMorePillsClick,
}: ExpertsHeaderProps) {
  return (
    <div className="hidden gap-5 lg:flex lg:items-start">
      <div className="shrink-0">
        <h1 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-(--text-primary) xl:text-[28px]">
          {title}
        </h1>
        <p className="mt-1 max-w-[220px] text-xs text-(--text-secondary)">
          {subtitle}
        </p>
      </div>

      <div className="min-w-0 flex-1 border-l border-(--border) pl-5">
        <h2 className="text-lg font-semibold text-(--text-primary)">
          {activeCategory.title}
        </h2>
        <p className="mt-0.5 text-xs text-(--text-secondary)">
          {activeCategory.description}
        </p>
        <CategoryPills
          items={activeCategory.pillItems}
          value={pillValue}
          onChange={onPillChange}
          showMore={activeCategory.showMorePills}
          onMoreClick={onMorePillsClick}
          className="mt-3"
        />
      </div>
    </div>
  );
}
