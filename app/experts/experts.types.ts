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
