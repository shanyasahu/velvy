import type { DayAvailabilityStatus } from "../../booking.types";

const ALL_TIMES = [
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

function hashString(value: string): number {
  return value.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
}

/** Deterministic day status per expert + service + date. */
export function getDayAvailabilityStatus(
  expertId: string,
  serviceId: string,
  iso: string,
): DayAvailabilityStatus {
  const date = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(date.getTime())) return "closed";

  // Sundays closed for all experts.
  if (date.getDay() === 0) return "closed";

  const hash = hashString(`${expertId}:${serviceId}:${iso}`);
  if (hash % 19 === 0) return "closed";
  if (hash % 13 === 0) return "full";
  if (hash % 7 === 0 || hash % 11 === 0) return "limited";
  return "available";
}

/** Whether the user can pick this day in the calendar. */
export function isDaySelectable(status: DayAvailabilityStatus): boolean {
  return status === "available" || status === "limited";
}

/**
 * Simulates fetching available slots for a service on a given date.
 * Returns an empty array for closed / fully-booked days.
 */
export function getAvailableTimeSlots(
  expertId: string,
  serviceId: string,
  iso: string,
): string[] {
  const status = getDayAvailabilityStatus(expertId, serviceId, iso);
  if (status === "closed" || status === "full") return [];

  const hash = hashString(`${expertId}:${serviceId}:${iso}:slots`);
  const slots = ALL_TIMES.filter((_, index) => (hash + index) % 4 !== 0);

  if (status === "limited") {
    return slots.slice(0, Math.max(2, (hash % 3) + 2));
  }

  return slots;
}

export const DEFAULT_TIME_SLOTS = ALL_TIMES;
