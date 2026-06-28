import Image from "next/image";
import { LayoutGrid } from "lucide-react";

import type { MobileCategory } from "../experts.types";

interface CategoryCirclesProps {
  categories: MobileCategory[];
  activeId: string;
  onSelect: (id: string) => void;
  allCategoriesLabel?: string;
  onAllCategoriesClick?: () => void;
}

export function CategoryCircles({
  categories,
  activeId,
  onSelect,
  allCategoriesLabel = "All Categories",
  onAllCategoriesClick,
}: CategoryCirclesProps) {
  return (
    <div className="flex items-start gap-3 overflow-x-auto scrollbar-none">
      {categories.map((category) => {
        const isActive = category.id === activeId;
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => onSelect(category.id)}
            aria-current={isActive ? "true" : undefined}
            className="flex w-16 shrink-0 flex-col items-center gap-1.5"
          >
            <span
              className={`relative h-16 w-16 overflow-hidden rounded-2xl border-2 transition-colors ${
                isActive
                  ? "border-(--accent-primary) shadow-[0_0_0_1px_var(--accent-primary)]"
                  : "border-(--brand-gold)/60"
              }`}
            >
              <Image
                src={category.image}
                alt={category.label}
                fill
                sizes="64px"
                className="object-cover"
              />
            </span>
            <span
              className={`w-full truncate text-center text-[10px] font-medium ${
                isActive ? "text-(--accent-primary)" : "text-(--text-secondary)"
              }`}
            >
              {category.label}
            </span>
          </button>
        );
      })}

      <button
        type="button"
        onClick={onAllCategoriesClick}
        className="flex w-16 shrink-0 flex-col items-center gap-1.5"
      >
        <span className="flex h-16 w-16 items-center justify-center rounded-2xl border border-(--brand-gold)/60 bg-(--bg-card) text-(--accent-secondary)">
          <LayoutGrid size={22} strokeWidth={1.6} />
        </span>
        <span className="w-full truncate text-center text-[10px] font-medium text-(--text-secondary)">
          {allCategoriesLabel}
        </span>
      </button>
    </div>
  );
}
