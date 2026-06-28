"use client";

import { Mars, Venus } from "lucide-react";

import type { FilterOption, Gender } from "../experts.types";

interface GenderToggleProps {
  options: FilterOption[];
  value: Gender | null;
  onChange: (value: Gender | null) => void;
  className?: string;
}

const GENDER_ICON: Record<string, typeof Venus> = {
  female: Venus,
  male: Mars,
};

export function GenderToggle({
  options,
  value,
  onChange,
  className = "",
}: GenderToggleProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {options.map((option) => {
        const Icon = GENDER_ICON[option.id] ?? Venus;
        const isActive = value === option.id;

        return (
          <button
            key={option.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(isActive ? null : (option.id as Gender))}
            className={`inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[11px] font-medium transition-colors lg:h-10 lg:px-4 lg:text-xs ${
              isActive
                ? "primary-button border-transparent text-white"
                : "border-(--border) bg-(--bg-card) text-(--text-primary) hover:border-(--accent-primary)"
            }`}
          >
            <Icon size={14} strokeWidth={1.8} />
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
