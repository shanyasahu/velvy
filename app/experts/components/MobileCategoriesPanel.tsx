"use client";

import { useEffect } from "react";
import { ArrowDownWideNarrow, X } from "lucide-react";

import type {
  FilterGroup,
  SortOption,
  TopCategory,
} from "../experts.types";
import { FilterDropdown } from "./FilterDropdown";
import { getIcon } from "./icons";

interface MobileCategoriesPanelProps {
  open: boolean;
  categories: TopCategory[];
  activeId: string;
  onSelect: (id: string) => void;
  onClose: () => void;
  filters: FilterGroup[];
  filterValues: Record<string, string>;
  onFilterChange: (filterId: string, value: string) => void;
  sortOptions: SortOption[];
  sortValue: string;
  onSortChange: (value: string) => void;
}

export function MobileCategoriesPanel({
  open,
  categories,
  activeId,
  onSelect,
  onClose,
  filters,
  filterValues,
  onFilterChange,
  sortOptions,
  sortValue,
  onSortChange,
}: MobileCategoriesPanelProps) {
  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden={!open}
      />

      {/* Left drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(320px,88vw)] flex-col bg-(--bg-card) shadow-xl transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-hidden={!open}
        aria-label="Filters and categories"
      >
        <div className="flex items-center justify-between border-b border-(--border) px-4 py-3">
          <p className="text-sm font-semibold text-(--text-primary)">Filters</p>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close filters"
            className="flex h-8 w-8 items-center justify-center rounded-full text-(--text-secondary) transition-colors hover:bg-(--bg-secondary)"
          >
            <X size={16} strokeWidth={1.8} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-4">
            {/* Filter dropdowns */}
            <div className="grid grid-cols-1 gap-2">
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
                    className="w-full"
                  />
                );
              })}
            </div>

            {/* Sort */}
            <FilterDropdown
              options={sortOptions}
              value={sortValue}
              onChange={onSortChange}
              prefix="Sort by:"
              icon={<ArrowDownWideNarrow size={14} strokeWidth={1.8} />}
              className="w-full"
            />

            {/* Categories */}
            <div>
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-(--text-muted)">
                Categories
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {categories.map((category) => {
                  const Icon = getIcon(category.icon);
                  const isActive = category.id === activeId;

                  return (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => onSelect(category.id)}
                      aria-pressed={isActive}
                      className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[11px] font-medium transition-colors ${
                        isActive
                          ? "primary-button text-white"
                          : "border border-(--brand-gold)/60 bg-(--bg-secondary) text-(--text-secondary) hover:text-(--text-primary)"
                      }`}
                    >
                      <Icon size={14} strokeWidth={1.8} className="shrink-0" />
                      <span className="truncate">{category.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
