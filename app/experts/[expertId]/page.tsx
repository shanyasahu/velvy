import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getAllExpertIds,
  getExpertProfile,
  getExpertsPageData,
} from "../components/lib/expertsApi";
import { ExpertProfileContent } from "./ExpertProfileContent";

interface ExpertProfilePageProps {
  params: Promise<{ expertId: string }>;
}

export async function generateStaticParams() {
  const ids = await getAllExpertIds();
  return ids.map((expertId) => ({ expertId }));
}

export async function generateMetadata({
  params,
}: ExpertProfilePageProps): Promise<Metadata> {
  const { expertId } = await params;
  const expert = await getExpertProfile(expertId);

  if (!expert) {
    return { title: "Expert Not Found | Velvy" };
  }

  return {
    title: `${expert.name} · ${expert.specialty} | Velvy`,
    description: expert.about,
  };
}

export default async function ExpertProfilePage({
  params,
}: ExpertProfilePageProps) {
  const { expertId } = await params;
  const [expert, pageData] = await Promise.all([
    getExpertProfile(expertId),
    getExpertsPageData(),
  ]);

  if (!expert) {
    notFound();
  }

  return (
    <ExpertProfileContent
      expert={expert}
      topCategories={pageData.topCategories}
    />
  );
}
