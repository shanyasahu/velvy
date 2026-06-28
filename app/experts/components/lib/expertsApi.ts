import categoriesData from "../data/categories.json";
import expertsData from "../data/experts.json";
import filtersData from "../data/filters.json";
import mobileData from "../data/mobile.json";

import type {
  ExpertsPageData,
  ExpertSection,
  FilterGroup,
  SortOption,
} from "../../experts.types";

/**
 * Simulates a network request. Swap the body for a real `fetch`/RPC call
 * when wiring APIs — the rest of the page consumes the same shape.
 */
async function simulateFetch<T>(data: T): Promise<T> {
  return data;
}

/**
 * Aggregates every dataset the experts page needs. This is the single
 * integration point: replace each JSON read with an API call and the UI
 * stays untouched.
 */
export async function getExpertsPageData(): Promise<ExpertsPageData> {
  const [categories, experts, filters, mobile] = await Promise.all([
    simulateFetch(categoriesData),
    simulateFetch(expertsData),
    simulateFetch(filtersData),
    simulateFetch(mobileData),
  ]);

  return {
    location: filters.location,
    topCategories: categories.topCategories,
    subCategories: categories.subCategories,
    activeCategory: categories.activeCategory,
    sections: experts.sections as ExpertSection[],
    filters: filters.filters as FilterGroup[],
    sortOptions: filters.sortOptions as SortOption[],
    genderOptions: filters.genderOptions,
    featuredExpert: mobile.featuredExpert,
    mobileCategories: mobile.mobileCategories,
    mobilePills: mobile.mobilePills,
  } as ExpertsPageData;
}
