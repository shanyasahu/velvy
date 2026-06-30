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
  searchParams: Promise<{ tab?: string; services?: string }>;
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
  searchParams,
}: ExpertProfilePageProps) {
  const { expertId } = await params;
  const { tab, services } = await searchParams;
  const [expert, pageData] = await Promise.all([
    getExpertProfile(expertId),
    getExpertsPageData(),
  ]);

  if (!expert) {
    notFound();
  }

  const initialServiceIds = services
    ? services
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean)
    : [];

  return (
    <ExpertProfileContent
      expert={expert}
      topCategories={pageData.topCategories}
      initialTab={tab === "message" ? "message" : "profile"}
      initialServiceIds={initialServiceIds}
    />
  );
}
