"use client";

import { useMemo, useRef, useState } from "react";
import {
  ArrowDownWideNarrow,
  Check,
  ChevronDown,
  MapPin,
  Search,
} from "lucide-react";

import type { FilterGroup, SortOption } from "../experts.types";
import { FilterDropdown } from "./FilterDropdown";
import { getIcon } from "./icons";
import { useClickOutside } from "./lib/useClickOutside";

const SUBURB_OPTIONS = [
  "All Melbourne",
  "CBD",
  "Southbank",
  "Richmond",
  "St Kilda",
  "Carlton",
  "Fitzroy",
  "Brunswick",
  "Docklands",
  "South Yarra",
  "Prahran",
  "Footscray",
];

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
        {/* Suburbs search — left */}
        <SuburbsSearchField
          value={searchQuery}
          onChange={onSearchChange}
        />

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

function SuburbsSearchField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useClickOutside(containerRef, () => setOpen(false), open);

  const filteredOptions = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return SUBURB_OPTIONS;
    return SUBURB_OPTIONS.filter((option) =>
      option.toLowerCase().includes(q),
    );
  }, [value]);

  return (
    <div
      ref={containerRef}
      className="relative w-[260px] shrink-0 xl:w-[300px]"
    >
      <div className="flex h-10 items-center gap-2 rounded-full border border-(--border) bg-(--bg-secondary) px-4 transition-colors focus-within:border-(--accent-primary)">
        <Search
          size={15}
          strokeWidth={1.8}
          className="shrink-0 text-(--text-muted)"
        />
        <input
          type="text"
          value={value}
          onChange={(event) => {
            onChange(event.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder="Suburbs search only"
          className="w-full bg-transparent text-xs text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none"
        />
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Toggle suburbs list"
          className="shrink-0 text-(--text-muted) transition-colors hover:text-(--accent-primary)"
        >
          <ChevronDown
            size={15}
            strokeWidth={1.8}
            className={`transition-transform duration-200 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 z-30 mt-2 max-h-64 overflow-y-auto rounded-xl border border-(--border) bg-(--bg-card) py-1.5 shadow-lg"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((option) => {
              const isActive = option === value;
              return (
                <li key={option} role="option" aria-selected={isActive}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left text-xs transition-colors hover:bg-(--bg-secondary) ${
                      isActive
                        ? "font-medium text-(--accent-primary)"
                        : "text-(--text-primary)"
                    }`}
                  >
                    <MapPin
                      size={13}
                      strokeWidth={1.8}
                      className="shrink-0 text-(--brand-gold)"
                    />
                    <span className="flex-1 truncate">{option}</span>
                    {isActive && (
                      <Check size={13} strokeWidth={2} className="shrink-0" />
                    )}
                  </button>
                </li>
              );
            })
          ) : (
            <li className="px-3 py-2 text-xs text-(--text-muted)">
              No suburbs found
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
