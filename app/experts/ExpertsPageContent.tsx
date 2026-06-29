"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { Map } from "lucide-react";

import type { Expert, ExpertsPageData } from "./experts.types";
import { CategoryCircles } from "./components/CategoryCircles";
import { CategoryPills } from "./components/CategoryPills";
import { ExpertSection } from "./components/ExpertSection";
import type { ExpertSliderHandle } from "./components/ExpertSlider";
import { ExpertsHeader } from "./components/ExpertsHeader";
import { ExpertsToolbar } from "./components/ExpertsToolbar";
import { FeaturedExpertCard } from "./components/FeaturedExpertCard";
import { MobileCategoriesPanel } from "./components/MobileCategoriesPanel";
import { MobileSuburbsBar } from "./components/MobileSuburbsBar";
import { SubCategoriesSidebar } from "./components/SubCategoriesSidebar";
import { TopCategoriesSidebar } from "./components/TopCategoriesSidebar";

interface ExpertsPageContentProps {
  data: ExpertsPageData;
}

const MOBILE_ALL_PILL = "All";
const MAX_INLINE_PILLS = 5;

/** Short labels for the horizontal sub-category pill bar. */
const SUB_CATEGORY_PILL_LABELS: Record<string, string> = {
  "makeup-artists": "Makeup",
  "hair-stylists": "Hair Styling",
  "nail-technicians": "Nails",
  "lash-artists": "Lashes & Brows",
  "brow-specialists": "Brows",
  "facial-skin": "Facial & Skin",
  barbers: "Barbers",
  "massage-therapy": "Massage",
  "waxing-specialists": "Waxing",
  "cosmetic-tattoo": "Cosmetic Tattoo",
  "bridal-beauty": "Bridal",
  "spa-therapists": "Spa",
};

const TOP_CATEGORY_DESCRIPTIONS: Record<string, string> = {
  therapists: "Licensed therapists for massage, spa, and wellness treatments.",
  coaches: "Professional coaches to help you reach your personal goals.",
  trainers: "Certified trainers and grooming experts for fitness and style.",
  wellness: "Holistic wellness services for body and mind.",
  health: "Health and skincare specialists for your wellbeing.",
  beauty: "Discover beauty experts for every look and occasion.",
  lifestyle: "Lifestyle experts for weddings, events, and everyday style.",
  more: "Browse all available expert categories.",
};

function getSubCategoryPillLabel(sub: { id: string; label: string }): string {
  return SUB_CATEGORY_PILL_LABELS[sub.id] ?? sub.label;
}

function buildCategoryPillItems(
  subCategories: ExpertsPageData["subCategories"],
  maxInline = MAX_INLINE_PILLS,
) {
  const subPills = subCategories.map((sub) => ({
    value: sub.id,
    label: getSubCategoryPillLabel(sub),
  }));

  return {
    pillItems: [
      { value: "", label: MOBILE_ALL_PILL },
      ...subPills.slice(0, maxInline),
    ],
    showMorePills: subPills.length > maxInline,
  };
}

/** Which sub-categories appear under each main category. */
const SUB_CATEGORIES_BY_TOP: Record<string, string[]> = {
  therapists: ["spa-therapists", "massage-therapy", "facial-skin"],
  coaches: ["facial-skin", "makeup-artists"],
  trainers: ["barbers", "hair-stylists"],
  wellness: ["spa-therapists", "massage-therapy", "facial-skin"],
  health: ["facial-skin", "spa-therapists"],
  beauty: [
    "makeup-artists",
    "hair-stylists",
    "nail-technicians",
    "lash-artists",
    "brow-specialists",
    "facial-skin",
    "barbers",
    "waxing-specialists",
    "cosmetic-tattoo",
    "bridal-beauty",
    "spa-therapists",
  ],
  lifestyle: ["makeup-artists", "bridal-beauty", "hair-stylists"],
  more: [],
};

/** Order for the sections shown below the main results bar. */
const SECONDARY_SECTION_ORDER = ["massage-therapy", "barbers", "facial-skin"];

function getExpertsForSubCategory(
  subCategoryId: string,
  sections: ExpertsPageData["sections"],
  subCategories: ExpertsPageData["subCategories"],
  mixedExperts: Expert[],
): Expert[] {
  const matchedSection = sections.find((section) => section.id === subCategoryId);
  if (matchedSection) return matchedSection.experts;

  const sub = subCategories.find((category) => category.id === subCategoryId);
  if (!sub) return mixedExperts;

  const allExperts = sections.flatMap((section) => section.experts);
  const needle = sub.label.toLowerCase();

  return allExperts.filter(
    (expert) =>
      expert.categoryId === subCategoryId ||
      expert.specialty.toLowerCase().includes(needle.split(" ")[0]) ||
      expert.tags.some((tag) => needle.includes(tag.toLowerCase())),
  );
}

/**
 * Deterministically interleaves experts from each section so the mixed
 * pool alternates categories (no Math.random → no hydration mismatch).
 */
function interleaveExperts(lists: Expert[][]): Expert[] {
  const result: Expert[] = [];
  const maxLength = Math.max(0, ...lists.map((list) => list.length));
  for (let index = 0; index < maxLength; index += 1) {
    for (const list of lists) {
      const expert = list[index];
      if (expert) result.push(expert);
    }
  }
  return result;
}

function parseDistance(distance: string): number {
  const match = distance.match(/[\d.]+/);
  return match ? Number.parseFloat(match[0]) : Number.POSITIVE_INFINITY;
}

function sortExperts(experts: Expert[], sortValue: string): Expert[] {
  const sorted = [...experts];
  switch (sortValue) {
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating);
    case "price-low":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-high":
      return sorted.sort((a, b) => b.price - a.price);
    case "nearest":
      return sorted.sort(
        (a, b) => parseDistance(a.distance) - parseDistance(b.distance),
      );
    case "popular":
    default:
      return sorted.sort((a, b) => b.reviews - a.reviews);
  }
}

function matchesPrice(expert: Expert, priceFilter: string): boolean {
  if (!priceFilter || priceFilter === "any") return true;
  if (priceFilter === "0-50") return expert.price <= 50;
  if (priceFilter === "50-100") return expert.price > 50 && expert.price <= 100;
  if (priceFilter === "100-plus") return expert.price > 100;
  return true;
}

export default function ExpertsPageContent({ data }: ExpertsPageContentProps) {
  const mobilePrimarySliderRef = useRef<ExpertSliderHandle>(null);

  const [topCategoryId, setTopCategoryId] = useState("beauty");
  // Empty = no sub-category drilled into → show the mixed pool.
  const [subCategoryId, setSubCategoryId] = useState("");
  const [filterValues, setFilterValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      data.filters.map((filter) => [filter.id, filter.defaultValue]),
    ),
  );
  const [sortValue, setSortValue] = useState(
    data.sortOptions[0]?.id ?? "popular",
  );
  const [mobileCategoryId, setMobileCategoryId] = useState("beauty");
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileCategories, setShowMobileCategories] = useState(false);

  const visibleSubCategories = useMemo(() => {
    const allowedIds = SUB_CATEGORIES_BY_TOP[topCategoryId];
    if (!allowedIds?.length) return data.subCategories;
    const allowed = new Set(allowedIds);
    return data.subCategories.filter((category) => allowed.has(category.id));
  }, [data.subCategories, topCategoryId]);

  const { pillItems, showMorePills } = useMemo(
    () => buildCategoryPillItems(visibleSubCategories),
    [visibleSubCategories],
  );

  const mixedExperts = useMemo(
    () => interleaveExperts(data.sections.map((section) => section.experts)),
    [data.sections],
  );

  const primaryExpertsBase = useMemo(
    () =>
      subCategoryId
        ? getExpertsForSubCategory(
            subCategoryId,
            data.sections,
            data.subCategories,
            mixedExperts,
          )
        : mixedExperts,
    [subCategoryId, data.sections, data.subCategories, mixedExperts],
  );

  // Sections below the main bar, in the requested order (massage → barbers),
  // skipping whichever category is currently drilled into.
  const secondarySections = useMemo(() => {
    // Hide the curated secondary rows while searching — they'd just show
    // "No experts found" since the search only targets the main pool.
    if (searchQuery.trim()) return [];
    return SECONDARY_SECTION_ORDER.filter((id) => id !== subCategoryId)
      .map((id) => data.sections.find((section) => section.id === id))
      .filter((section): section is (typeof data.sections)[number] =>
        Boolean(section),
      );
  }, [data.sections, subCategoryId, searchQuery]);

  const applyFiltersAndSort = useCallback(
    (experts: Expert[]) => {
      let result = [...experts];

      const genderFilter = filterValues.gender;
      if (genderFilter && genderFilter !== "all") {
        result = result.filter((expert) => expert.gender === genderFilter);
      }

      result = result.filter((expert) =>
        matchesPrice(expert, filterValues.price ?? "any"),
      );

      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        result = result.filter(
          (expert) =>
            expert.name.toLowerCase().includes(query) ||
            expert.specialty.toLowerCase().includes(query) ||
            expert.tags.some((tag) => tag.toLowerCase().includes(query)),
        );
      }

      return sortExperts(result, sortValue);
    },
    [filterValues, searchQuery, sortValue],
  );

  const desktopPrimaryExperts = useMemo(
    () => applyFiltersAndSort(primaryExpertsBase),
    [applyFiltersAndSort, primaryExpertsBase],
  );

  const mobilePrimaryExperts = useMemo(
    () => applyFiltersAndSort(primaryExpertsBase),
    [applyFiltersAndSort, primaryExpertsBase],
  );

  const handleFilterChange = useCallback((filterId: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [filterId]: value }));
  }, []);

  const handleTopCategorySelect = useCallback((id: string) => {
    setTopCategoryId(id);
    setSubCategoryId("");
  }, []);

  const handleSubCategorySelect = useCallback((id: string) => {
    setSubCategoryId((prev) => (prev === id ? "" : id));
  }, []);

  const handleCategoryPillSelect = useCallback((value: string) => {
    if (!value) {
      setSubCategoryId("");
      return;
    }
    setSubCategoryId((prev) => (prev === value ? "" : value));
  }, []);

  const resultsLabel = subCategoryId
    ? `${desktopPrimaryExperts.length} ${visibleSubCategories.find((category) => category.id === subCategoryId)?.label ?? "Experts"} in ${data.location}`
    : `${desktopPrimaryExperts.length} Experts Available in ${data.location}`;
  const activeTopLabel =
    data.topCategories.find((category) => category.id === topCategoryId)
      ?.label ?? "Experts";
  const activeTopDescription =
    TOP_CATEGORY_DESCRIPTIONS[topCategoryId] ?? data.activeCategory.description;

  const viewOnMap = (
    <button
      type="button"
      onClick={() => {
        /* future: open map view */
      }}
      className="flex shrink-0 items-center gap-1 text-[11px] font-medium text-(--accent-secondary) transition-colors hover:text-(--accent-primary) lg:text-sm"
    >
      <Map size={14} strokeWidth={1.8} />
      View on Map
    </button>
  );

  return (
    <main className="min-h-screen bg-(--bg-primary) pb-24 lg:pb-10">
      <div className="mx-auto max-w-[1600px] space-y-3 px-3 py-2 lg:space-y-5 lg:px-6 lg:py-6">
        <div className="hidden lg:block">
          <ExpertsToolbar
            filters={data.filters}
            filterValues={filterValues}
            onFilterChange={handleFilterChange}
            sortOptions={data.sortOptions}
            sortValue={sortValue}
            onSortChange={setSortValue}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        </div>

        <div className="lg:flex lg:gap-6">
          <TopCategoriesSidebar
            categories={data.topCategories}
            activeId={topCategoryId}
            onSelect={handleTopCategorySelect}
          />

          <SubCategoriesSidebar
            title="All Categories"
            categories={visibleSubCategories}
            activeId={subCategoryId}
            onSelect={handleSubCategorySelect}
            viewAllLabel={`View All ${activeTopLabel} Services`}
          />

          <div className="min-w-0 flex-1">
            {/* Mobile */}
            <div className="lg:hidden">
              <MobileSuburbsBar
                onFilterClick={() => setShowMobileCategories((prev) => !prev)}
              />

              <MobileCategoriesPanel
                open={showMobileCategories}
                categories={data.topCategories}
                activeId={topCategoryId}
                onSelect={(id) => {
                  handleTopCategorySelect(id);
                  setShowMobileCategories(false);
                }}
                onClose={() => setShowMobileCategories(false)}
                filters={data.filters}
                filterValues={filterValues}
                onFilterChange={handleFilterChange}
                sortOptions={data.sortOptions}
                sortValue={sortValue}
                onSortChange={setSortValue}
              />

              <div className="mt-3 space-y-4">
                <FeaturedExpertCard expert={data.featuredExpert} />

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-(--text-primary)">
                    Explore by Category
                  </h2>
                  <Link
                    href="/experts"
                    className="text-[10px] font-medium text-(--accent-secondary)"
                  >
                    View all
                  </Link>
                </div>
                <CategoryCircles
                  categories={data.mobileCategories}
                  activeId={mobileCategoryId}
                  onSelect={setMobileCategoryId}
                  onAllCategoriesClick={() => setShowMobileCategories(true)}
                />
              </section>

              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-(--text-primary)">
                    {activeTopLabel}
                  </h2>
                  <button
                    type="button"
                    onClick={() => mobilePrimarySliderRef.current?.slideNext()}
                    className="text-[10px] font-medium text-(--accent-secondary)"
                  >
                    View all
                  </button>
                </div>

                <CategoryPills
                  items={pillItems}
                  value={subCategoryId}
                  onChange={handleCategoryPillSelect}
                  showMore={showMorePills}
                  onMoreClick={() => mobilePrimarySliderRef.current?.slideNext()}
                />

                <ExpertSection
                  title=""
                  experts={mobilePrimaryExperts}
                  compact
                  sliderRef={mobilePrimarySliderRef}
                />
              </section>

              {secondarySections.map((section) => (
                <ExpertSection
                  key={section.id}
                  title={section.title}
                  experts={applyFiltersAndSort(section.experts)}
                  viewAllLabel="View all"
                  compact
                />
              ))}
              </div>
            </div>

            {/* Desktop */}
            <div className="hidden space-y-6 lg:block">
              <ExpertsHeader
                title="Browse All Categories"
                subtitle="Explore services and find the perfect expert for your needs."
                activeCategory={{
                  title: activeTopLabel,
                  description: activeTopDescription,
                  pillItems,
                  showMorePills,
                }}
                pillValue={subCategoryId}
                onPillChange={handleCategoryPillSelect}
              />

              <ExpertSection
                title={resultsLabel}
                experts={desktopPrimaryExperts}
                headerAction={viewOnMap}
                headingLevel="h2"
              />

              {secondarySections.map((section) => (
                <ExpertSection
                  key={section.id}
                  title={section.title}
                  experts={applyFiltersAndSort(section.experts)}
                  viewAllLabel="View all"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
