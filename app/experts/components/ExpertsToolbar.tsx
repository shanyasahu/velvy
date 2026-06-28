"use client";

import { ArrowDownWideNarrow, Search } from "lucide-react";

import type { FilterGroup, SortOption } from "../experts.types";
import { FilterDropdown } from "./FilterDropdown";
import { getIcon } from "./icons";

interface ExpertsToolbarProps {
  filters: FilterGroup[];
  filterValues: Record<string, string>;
  onFilterChange: (filterId: string, value: string) => void;
  sortOptions: SortOption[];
  sortValue: string;
  onSortChange: (value: string) => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function ExpertsToolbar({
  filters,
  filterValues,
  onFilterChange,
  sortOptions,
  sortValue,
  onSortChange,
  searchQuery,
  onSearchChange,
}: ExpertsToolbarProps) {
  return (
    <div
      data-experts-filters
      className="rounded-[var(--radius-md)] border border-(--border) bg-(--bg-card) p-2 shadow-[var(--shadow-card)] lg:p-2.5"
    >
      <div className="flex items-center gap-3">
        {/* Search bar — left */}
        <label className="flex h-10 w-[260px] shrink-0 items-center gap-2 rounded-full border border-(--border) bg-(--bg-secondary) px-4 transition-colors focus-within:border-(--accent-primary) xl:w-[300px]">
          <Search
            size={15}
            strokeWidth={1.8}
            className="shrink-0 text-(--text-muted)"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search services, salons, experts..."
            className="w-full bg-transparent text-xs text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none"
          />
        </label>

        {/* Filters + sort — right */}
        <div className="flex min-w-0 flex-1 flex-wrap items-center justify-end gap-2 lg:gap-3">
          {filters.map((filter) => {
            const Icon = getIcon(filter.icon);
            return (
              <FilterDropdown
                key={filter.id}
                options={filter.options}
                value={filterValues[filter.id] ?? filter.defaultValue}
                onChange={(value) => onFilterChange(filter.id, value)}
                icon={<Icon size={14} strokeWidth={1.8} />}
                searchable={filter.searchable}
                searchPlaceholder={`Search ${filter.label.toLowerCase()}...`}
                className="shrink-0"
              />
            );
          })}

          <FilterDropdown
            options={sortOptions}
            value={sortValue}
            onChange={onSortChange}
            prefix="Sort by:"
            align="right"
            icon={<ArrowDownWideNarrow size={14} strokeWidth={1.8} />}
            className="shrink-0"
          />
        </div>
      </div>
    </div>
  );
}
