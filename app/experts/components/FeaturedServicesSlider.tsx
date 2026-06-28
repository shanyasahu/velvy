"use client";

import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import type { FeaturedService } from "../experts.types";
import { getIcon } from "./icons";

import "swiper/css";

interface FeaturedServicesSliderProps {
  services: FeaturedService[];
}

export function FeaturedServicesSlider({ services }: FeaturedServicesSliderProps) {
  // Keep the "More" action pinned at the end; only the rest auto-slide.
  const moreService = services.find((service) => service.id === "more");
  const slidingServices = services.filter((service) => service.id !== "more");

  const renderIcon = (service: FeaturedService) => {
    const Icon = getIcon(service.icon);
    return (
      <div className="flex flex-col items-center gap-1">
        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-(--brand-gold) bg-(--bg-card) text-(--accent-secondary)">
          <Icon size={16} strokeWidth={1.7} />
        </span>
        <span className="w-full truncate text-center text-[8px] text-(--text-secondary)">
          {service.label}
        </span>
      </div>
    );
  };

  return (
    <div className="flex items-start gap-0">
      <div className="min-w-0 flex-1">
        <Swiper
          modules={[Autoplay]}
          slidesPerView={5}
          spaceBetween={0}
          autoplay={{
            delay: 2800,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={slidingServices.length > 5}
          className="featured-services-slider !overflow-visible"
        >
          {slidingServices.map((service) => (
            <SwiperSlide key={service.id}>{renderIcon(service)}</SwiperSlide>
          ))}
        </Swiper>
      </div>

      {moreService && (
        <button type="button" className="w-11 shrink-0">
          {renderIcon(moreService)}
        </button>
      )}
    </div>
  );
}
