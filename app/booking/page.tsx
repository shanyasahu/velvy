import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getBookingDataForExpert } from "./components/lib/bookingApi";
import { BookingPageContent } from "./BookingPageContent";

export const metadata: Metadata = {
  title: "Book Appointment | Velvy",
  description:
    "Confirm your services, location and time, then book your appointment securely with Velvy.",
};

interface BookingPageProps {
  searchParams: Promise<{ expert?: string; services?: string }>;
}

export default async function BookingPage({ searchParams }: BookingPageProps) {
  const { expert, services } = await searchParams;
  const serviceIds = services?.split(",").map((id) => id.trim());

  const data = await getBookingDataForExpert(expert, serviceIds);

  // No expert / no valid services selected → send the user back to browse.
  if (!data) {
    redirect("/experts");
  }

  return <BookingPageContent data={data} />;
}
