/** Builds the booking-page URL for an expert and their selected service ids. */
export function buildBookingHref(
  expertId: string,
  serviceIds: Iterable<string>,
): string {
  const ids = [...serviceIds];
  if (ids.length === 0) return "";

  const params = new URLSearchParams({
    expert: expertId,
    services: ids.join(","),
  });
  return `/booking?${params.toString()}`;
}

/**
 * Builds the expert-profile URL while preserving the already-selected services,
 * so returning to "Add More Services" keeps the current selection.
 */
export function buildAddServicesHref(
  expertId: string,
  serviceIds: Iterable<string>,
): string {
  const ids = [...serviceIds];
  if (ids.length === 0) return `/experts/${expertId}`;

  const params = new URLSearchParams({ services: ids.join(",") });
  return `/experts/${expertId}?${params.toString()}`;
}
