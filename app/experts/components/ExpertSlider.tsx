"use client";

import {
  forwardRef,
  useImperativeHandle,
  useState,
  type ReactNode,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper } from "swiper/react";
import type { Swiper as SwiperClass } from "swiper/types";

import "swiper/css";
import "swiper/css/pagination";
import "./experts-slider.css";

export interface ExpertSliderHandle {
  slideNext: () => void;
  slidePrev: () => void;
}

interface ExpertSliderProps {
  children: ReactNode;
  loop?: boolean;
  className?: string;
}

/** Desktop: 4 cards · Mobile: ~3–4 cards with peek */
const EXPERT_BREAKPOINTS = {
  0: { slidesPerView: 3.15, spaceBetween: 10 },
  640: { slidesPerView: 3.35, spaceBetween: 12 },
  1024: { slidesPerView: 4, spaceBetween: 14 },
  1280: { slidesPerView: 4, spaceBetween: 16 },
};

export const ExpertSlider = forwardRef<ExpertSliderHandle, ExpertSliderProps>(
  function ExpertSlider({ children, loop = true, className = "experts-slider" }, ref) {
    const [swiper, setSwiper] = useState<SwiperClass | null>(null);

    useImperativeHandle(ref, () => ({
      slideNext: () => swiper?.slideNext(),
      slidePrev: () => swiper?.slidePrev(),
    }));

    const arrowBase =
      "primary-button absolute top-[calc(50%-20px)] z-20 hidden h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-white opacity-0 shadow-[var(--shadow-glow)] transition-opacity duration-300 pointer-events-none group-hover/expert-slider:opacity-100 group-hover/expert-slider:pointer-events-auto lg:flex";

    return (
      <div className="group/expert-slider relative px-0.5 pb-1 lg:px-1">
        <Swiper
          modules={[Pagination, Autoplay]}
          onSwiper={setSwiper}
          pagination={{ clickable: true }}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={loop}
          grabCursor
          breakpoints={EXPERT_BREAKPOINTS}
          className={`${className} pb-4 lg:pb-0`}
        >
          {children}
        </Swiper>

        <button
          type="button"
          aria-label="Previous experts"
          onClick={() => swiper?.slidePrev()}
          className={`${arrowBase} -left-1`}
        >
          <ChevronLeft size={18} />
        </button>

        <button
          type="button"
          aria-label="Next experts"
          onClick={() => swiper?.slideNext()}
          className={`${arrowBase} -right-1`}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    );
  },
);
