import type { Metadata } from "next";

import ExpertsPageContent from "./ExpertsPageContent";
import { getExpertsPageData } from "./components/lib/expertsApi";

export const metadata: Metadata = {
  title: "All Experts | VelvetBook",
  description:
    "Browse and book verified beauty, wellness, and grooming experts near you.",
};

export default async function ExpertsPage() {
  const data = await getExpertsPageData();

  return <ExpertsPageContent data={data} />;
}
