import type { LocationSuggestion } from "../../booking.types";

/**
 * Mock suburb list — replace `searchLocations` body with a real geocoding /
 * places API call. The booking UI only depends on `LocationSuggestion[]`.
 */
const MOCK_LOCATIONS: LocationSuggestion[] = [
  { id: "south-yarra", label: "South Yarra, 3141 VIC", suburb: "South Yarra" },
  { id: "richmond", label: "Richmond, 3121 VIC", suburb: "Richmond" },
  { id: "st-kilda", label: "St Kilda, 3182 VIC", suburb: "St Kilda" },
  { id: "carlton", label: "Carlton, 3053 VIC", suburb: "Carlton" },
  { id: "fitzroy", label: "Fitzroy, 3065 VIC", suburb: "Fitzroy" },
  { id: "brunswick", label: "Brunswick, 3056 VIC", suburb: "Brunswick" },
  { id: "southbank", label: "Southbank, 3006 VIC", suburb: "Southbank" },
  { id: "cbd", label: "Melbourne CBD, 3000 VIC", suburb: "CBD" },
  { id: "prahran", label: "Prahran, 3181 VIC", suburb: "Prahran" },
  { id: "hawthorn", label: "Hawthorn, 3122 VIC", suburb: "Hawthorn" },
  { id: "collingwood", label: "Collingwood, 3066 VIC", suburb: "Collingwood" },
  { id: "docklands", label: "Docklands, 3008 VIC", suburb: "Docklands" },
  { id: "footscray", label: "Footscray, 3011 VIC", suburb: "Footscray" },
  { id: "camberwell", label: "Camberwell, 3124 VIC", suburb: "Camberwell" },
  { id: "toorak", label: "Toorak, 3142 VIC", suburb: "Toorak" },
];

/** Simulates network latency so loading states can be tested. */
async function simulateFetch<T>(data: T): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, 120));
  return data;
}

/** Synchronous filter — used for instant dropdown feedback while the API loads. */
export function filterLocationsSync(query: string): LocationSuggestion[] {
  const q = query.trim().toLowerCase();
  const results = q
    ? MOCK_LOCATIONS.filter(
        (loc) =>
          loc.label.toLowerCase().includes(q) ||
          loc.suburb.toLowerCase().includes(q),
      )
    : MOCK_LOCATIONS.slice(0, 6);
  return results.slice(0, 8);
}

/**
 * Returns location suggestions matching `query`. Empty query returns popular
 * suburbs so the dropdown is useful on first focus.
 */
export async function searchLocations(
  query: string,
): Promise<LocationSuggestion[]> {
  return simulateFetch(filterLocationsSync(query));
}
