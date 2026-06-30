import { getExpertProfile } from "../../../experts/components/lib/expertsApi";
import type { ServiceItem } from "../../../experts/experts.types";
import type { BookingData, BookingDay } from "../../booking.types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/**
 * Builds every selectable day from today through the end of NEXT month, so the
 * picker always rolls into the following month (useful when today is near a
 * month boundary, e.g. Jun 30 → shows the rest of June plus all of July).
 * The first day is labelled "Today"; the rest show their weekday abbreviation.
 */
function buildScheduleDays(from = new Date()): BookingDay[] {
  const startOfToday = new Date(
    from.getFullYear(),
    from.getMonth(),
    from.getDate(),
  );
  // Last day of next month: day 0 of the month after next.
  const end = new Date(from.getFullYear(), from.getMonth() + 2, 0);

  const days: BookingDay[] = [];
  for (
    const cursor = new Date(startOfToday);
    cursor <= end;
    cursor.setDate(cursor.getDate() + 1)
  ) {
    const monthLabel = MONTHS[cursor.getMonth()];
    const dayOfMonth = cursor.getDate();
    const isToday = cursor.getTime() === startOfToday.getTime();
    const iso = `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}-${String(dayOfMonth).padStart(2, "0")}`;
    days.push({
      id: iso,
      iso,
      weekday: isToday ? "Today" : WEEKDAYS[cursor.getDay()],
      date: `${monthLabel} ${dayOfMonth}`,
    });
  }
  return days;
}

const DEFAULT_TIMES = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
];

/** Default studio address (the dataset has no per-expert address yet). */
const DEFAULT_LOCATION = "South Yarra, 3141 VIC";

/**
 * Builds the booking payload for a specific expert and the services the user
 * selected on the profile page. Returns `null` when the expert can't be found
 * or no valid services were passed — the page treats that as "redirect away".
 *
 * This is the single integration point: swap `getExpertProfile` for a real
 * API call and the booking UI stays untouched.
 */
export async function getBookingDataForExpert(
  expertId: string | undefined,
  serviceIds: string[] | undefined,
): Promise<BookingData | null> {
  if (!expertId) return null;

  const profile = await getExpertProfile(expertId);
  if (!profile) return null;

  const allServices: ServiceItem[] = profile.serviceCategories.flatMap(
    (category) => category.services,
  );

  const requested = serviceIds?.filter(Boolean) ?? [];
  const requestedSet = new Set(requested);

  // Preserve the order the user selected them in.
  const selectedServices = requested
    .map((id) => allServices.find((service) => service.id === id))
    .filter((service): service is ServiceItem => Boolean(service));

  if (selectedServices.length === 0) return null;

  // Suggest other services from the expert's primary category first, then any
  // remaining services — never re-suggesting something already selected.
  const primaryServices = profile.serviceCategories[0]?.services ?? [];
  const primaryIds = new Set(primaryServices.map((service) => service.id));
  const suggestedServices = [
    ...primaryServices.filter((service) => !requestedSet.has(service.id)),
    ...allServices.filter(
      (service) =>
        !requestedSet.has(service.id) && !primaryIds.has(service.id),
    ),
  ].slice(0, 8);

  const days = buildScheduleDays();

  return {
    currency: profile.currency,
    expert: {
      id: profile.id,
      name: profile.name,
      image: profile.image,
      coverImage: profile.coverImage,
      specialty: profile.specialty,
      verified: profile.verified,
      rating: profile.rating,
      reviews: profile.reviews,
      distance: profile.distance,
      language: profile.languages[0] ?? "English",
      about: profile.about,
      availableToday: profile.availableToday,
      expertLocation: DEFAULT_LOCATION,
      nationality: profile.nationality,
      languages: profile.languages,
      experienceSummary: profile.experienceSummary,
      specialization: profile.specialization,
    },
    selectedServices,
    suggestedServices,
    days,
    times: DEFAULT_TIMES,
    // Default to today (first available day) and a mid-morning slot.
    defaultDayId: days[0]?.id ?? "",
    defaultTime: DEFAULT_TIMES.includes("11:00 AM")
      ? "11:00 AM"
      : (DEFAULT_TIMES[0] ?? ""),
  };
}
