import categoriesData from "../data/categories.json";
import expertsData from "../data/experts.json";
import filtersData from "../data/filters.json";
import mobileData from "../data/mobile.json";
import profilesData from "../data/profiles.json";

import type {
  Expert,
  ExpertProfile,
  ExpertsPageData,
  ExpertSection,
  FilterGroup,
  ProfileReview,
  RatingBucket,
  ServiceCategory,
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
    sections: (experts.sections as ExpertSection[]).map((section) => ({
      ...section,
      experts: section.experts.map(enrichExpert),
    })),
    filters: filters.filters as FilterGroup[],
    sortOptions: filters.sortOptions as SortOption[],
    genderOptions: filters.genderOptions,
    featuredExpert: mobile.featuredExpert,
    mobileCategories: mobile.mobileCategories,
    mobilePills: mobile.mobilePills,
  } as ExpertsPageData;
}

/** Flattens every expert across all sections into a single list. */
function getAllExperts(): Expert[] {
  return (expertsData.sections as ExpertSection[]).flatMap(
    (section) => section.experts,
  );
}

/** All expert ids — used to pre-render the dynamic profile routes. */
export async function getAllExpertIds(): Promise<string[]> {
  return getAllExperts().map((expert) => expert.id);
}

/**
 * Splits a review count into a 5→1 star distribution. Deterministic so the
 * server and client render identical markup (no hydration mismatch).
 */
function buildRatingBreakdown(reviews: number): RatingBucket[] {
  const five = Math.round(reviews * 0.81);
  const four = Math.round(reviews * 0.14);
  const three = Math.round(reviews * 0.03);
  const two = Math.round(reviews * 0.01);
  const one = Math.max(0, reviews - five - four - three - two);
  return [
    { stars: 5, count: five },
    { stars: 4, count: four },
    { stars: 3, count: three },
    { stars: 2, count: two },
    { stars: 1, count: one },
  ];
}

const serviceCategories = profilesData.serviceCategories as ServiceCategory[];
const reviewPool = profilesData.reviewPool as ProfileReview[];
type ProfileOverride = {
  coverImage: string;
  availableToday: boolean;
  experienceBadge: string;
  about: string;
  nationality: string;
  languages: string[];
  experienceSummary: string;
  specialization: string;
  skills: string[];
  primaryServiceCategory?: string;
  isOnline?: boolean;
};
const overrides = profilesData.overrides as Record<string, ProfileOverride>;

/** Demo online set — replace with API availability when wired up. */
const ONLINE_EXPERT_IDS = new Set([
  "sophia-patel",
  "isabella-chen",
  "michael-lee",
  "daniel-smith",
  "ethan-carter-barber",
  "liam-brown",
  "noah-wilson",
  "mason-taylor",
]);

function formatAvailabilityHour(hour24: number): string {
  const h = ((hour24 % 24) + 24) % 24;
  if (h === 0) return "12am";
  if (h === 12) return "12pm";
  if (h < 12) return `${h}am`;
  return `${h - 12}pm`;
}

/** Deterministic hours per expert — stable across server/client renders. */
function getAvailabilityHours(expertId: string): string {
  const hash = expertId
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  const startHour = 6 + (hash % 6); // 6am–11am
  const endHour = 17 + ((hash >> 3) % 6); // 5pm–10pm
  return `${formatAvailabilityHour(startHour)}–${formatAvailabilityHour(endHour)}`;
}

function enrichExpert<T extends Expert>(expert: T): Expert {
  const override = overrides[expert.id];
  const isOnline =
    override?.isOnline ??
    (expert as Expert & { isOnline?: boolean }).isOnline ??
    ONLINE_EXPERT_IDS.has(expert.id);

  const availabilityHours =
    (expert as Expert & { availabilityHours?: string }).availabilityHours ??
    getAvailabilityHours(expert.id);

  return { ...expert, isOnline, availabilityHours };
}

/** Orders the service catalog so the expert's primary category comes first. */
function orderServiceCategories(primaryId?: string): ServiceCategory[] {
  if (!primaryId) return serviceCategories;
  const primary = serviceCategories.find((c) => c.id === primaryId);
  if (!primary) return serviceCategories;
  return [primary, ...serviceCategories.filter((c) => c.id !== primaryId)];
}

/**
 * Builds the full profile for a single expert. Rich, hand-authored detail is
 * used when an override exists (e.g. Sophia); otherwise sensible defaults are
 * derived from the base expert so every card links to a complete page.
 */
export async function getExpertProfile(
  id: string,
): Promise<ExpertProfile | null> {
  const expert = getAllExperts().find((candidate) => candidate.id === id);
  if (!expert) return null;

  const override = overrides[id];

  const skills = override?.skills?.length
    ? override.skills
    : [...new Set([...expert.tags, ...profilesData.defaultSkills])].slice(0, 8);

  const reviewList = reviewPool.map((review) => ({
    ...review,
    comment:
      review.id === "r1"
        ? `Amazing experience! ${expert.name.split(" ")[0]} is so gentle and professional. My skin feels so refreshed and glowing. Highly recommend!`
        : review.comment,
  }));

  return {
    ...enrichExpert(expert),
    coverImage: override?.coverImage ?? expert.image,
    availableToday: override?.availableToday ?? true,
    experienceBadge: override?.experienceBadge ?? "Verified Expert",
    about:
      override?.about ??
      `${expert.name} is a ${expert.specialty.toLowerCase()} dedicated to delivering high-quality, personalised treatments. Passionate about helping you look and feel your best.`,
    nationality: override?.nationality ?? "Australian",
    languages: override?.languages ?? ["English"],
    experienceSummary: override?.experienceSummary ?? expert.specialty,
    specialization: override?.specialization ?? expert.specialty,
    skills,
    ratingBreakdown: buildRatingBreakdown(expert.reviews),
    reviewList,
    serviceCategories: orderServiceCategories(override?.primaryServiceCategory),
  };
}
