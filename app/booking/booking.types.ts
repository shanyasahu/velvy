import type { ServiceItem } from "../experts/experts.types";

/** A location option shown in the "Your Location" autocomplete dropdown. */
export interface LocationSuggestion {
  id: string;
  /** Full display label, e.g. "South Yarra, 3141 VIC". */
  label: string;
  suburb: string;
}

/** Availability state for a calendar day (per service). */
export type DayAvailabilityStatus = "available" | "limited" | "full" | "closed";

/** Per-service date & time selection. */
export interface ServiceScheduleSelection {
  dayId: string;
  time: string;
}

/** A selectable calendar day in the date picker. */
export interface BookingDay {
  id: string;
  /** ISO date (YYYY-MM-DD) — used by the calendar popover. */
  iso: string;
  /** Short weekday label, e.g. "Wed". */
  weekday: string;
  /** Short date label, e.g. "May 22". */
  date: string;
}

/** Expert summary shown on the booking page header. */
export interface BookingExpert {
  id: string;
  name: string;
  /** Square avatar / portrait. */
  image: string;
  /** Wide cover used on the mobile hero. */
  coverImage: string;
  specialty: string;
  verified: boolean;
  rating: number;
  reviews: number;
  distance: string;
  /** Primary spoken language label, e.g. "English". */
  language: string;
  about: string;
  availableToday: boolean;
  /** Display address of the expert's studio/clinic. */
  expertLocation: string;
  /* ----- Header info pills (Nationality, Languages, Experience...) ----- */
  nationality: string;
  languages: string[];
  /** Short experience summary, e.g. "5+ Years in Skincare". */
  experienceSummary: string;
  specialization: string;
}

/** Everything the booking page renders. Single integration point. */
export interface BookingData {
  expert: BookingExpert;
  currency: string;
  selectedServices: ServiceItem[];
  suggestedServices: ServiceItem[];
  days: BookingDay[];
  /** Available time slots, e.g. "11:00 AM". */
  times: string[];
  /** Pre-selected day id. */
  defaultDayId: string;
  /** Pre-selected time slot. */
  defaultTime: string;
}
