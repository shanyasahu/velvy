import type { BookingDay } from "../../booking.types";

const MONTH_SHORT = [
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

/** "Tue, 01 Jul 2026" */
export function formatDayLabel(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  const weekday = date.toLocaleDateString("en-AU", { weekday: "short" });
  return `${weekday}, ${String(day).padStart(2, "0")} ${MONTH_SHORT[month - 1]} ${year}`;
}

/** "Tue, 01 Jul 2026, 09:30 AM" */
export function formatScheduleLabel(day: BookingDay | undefined, time: string): string {
  if (!day || !time) return "Select date & time";
  return `${formatDayLabel(day.iso)}, ${time}`;
}

/** Compact collapsed label: "Wed, 02 Jul 2026 11:00 AM" */
export function formatCollapsedSchedule(day: BookingDay | undefined, time: string): string {
  if (!day || !time) return "";
  return `${formatDayLabel(day.iso)} ${time}`;
}

export function getTimePeriod(time: string): "AM" | "PM" {
  return time.toUpperCase().includes("PM") ? "PM" : "AM";
}

export function filterTimesByPeriod(times: string[], period: "AM" | "PM"): string[] {
  return times.filter((time) => getTimePeriod(time) === period);
}
