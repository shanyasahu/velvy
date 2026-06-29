export type Gender = "female" | "male" | "other";

export interface Expert {
  id: string;
  name: string;
  image: string;
  verified: boolean;
  specialty: string;
  rating: number;
  reviews: number;
  distance: string;
  tags: string[];
  /** Numeric price used for sorting; rendered with `currency`. */
  price: number;
  currency: string;
  gender: Gender;
  /** Sub-category this expert belongs to (e.g. "facial-skin"). */
  categoryId: string;
}

export interface TopCategory {
  id: string;
  /** Icon key resolved by the icon map. */
  icon: string;
  label: string;
  count: number;
}

export interface SubCategory {
  id: string;
  icon: string;
  label: string;
  count: number;
}

export interface ExpertSection {
  id: string;
  title: string;
  subtitle?: string;
  /** Quick-filter pills shown beside the section title. */
  pills?: string[];
  viewAllHref?: string;
  experts: Expert[];
}

export interface FilterOption {
  id: string;
  label: string;
}

export interface FilterGroup {
  id: string;
  label: string;
  icon: string;
  options: FilterOption[];
  defaultValue: string;
  /** When true, the dropdown shows a search box to filter options. */
  searchable?: boolean;
}

export interface SortOption {
  id: string;
  label: string;
}

export interface FeaturedService {
  id: string;
  label: string;
  icon: string;
}

export interface FeaturedExpert {
  id: string;
  name: string;
  verified: boolean;
  rating: number;
  reviews: number;
  distance: string;
  tagline: string;
  videoThumbnail: string;
  videoDuration: string;
  services: FeaturedService[];
}

export interface MobileCategory {
  id: string;
  label: string;
  image: string;
}

export interface ServiceItem {
  id: string;
  name: string;
  /** Numeric price, rendered with the expert's currency. */
  price: number;
  /** Human-readable duration, e.g. "60 min". */
  duration: string;
  image: string;
}

export interface ServiceCategory {
  id: string;
  label: string;
  /** Icon key resolved by the icon map. */
  icon: string;
  services: ServiceItem[];
}

export interface ProfileReview {
  id: string;
  author: string;
  avatar: string;
  /** Relative date label, e.g. "2 days ago". */
  date: string;
  rating: number;
  comment: string;
}

export interface RatingBucket {
  /** Star tier, 5 → 1. */
  stars: number;
  count: number;
}

/** Full detail backing the individual expert profile page. */
export interface ExpertProfile extends Expert {
  /** Wide hero/cover image for the profile header. */
  coverImage: string;
  availableToday: boolean;
  /** Badge text, e.g. "5+ Years Experience". */
  experienceBadge: string;
  about: string;
  nationality: string;
  languages: string[];
  /** Short experience summary, e.g. "5+ Years in Skincare". */
  experienceSummary: string;
  specialization: string;
  skills: string[];
  ratingBreakdown: RatingBucket[];
  reviewList: ProfileReview[];
  serviceCategories: ServiceCategory[];
}

export interface ExpertsPageData {
  location: string;
  topCategories: TopCategory[];
  subCategories: SubCategory[];
  activeCategory: {
    id: string;
    title: string;
    description: string;
    pills: string[];
  };
  sections: ExpertSection[];
  filters: FilterGroup[];
  sortOptions: SortOption[];
  genderOptions: FilterOption[];
  featuredExpert: FeaturedExpert;
  mobileCategories: MobileCategory[];
  mobilePills: string[];
}
