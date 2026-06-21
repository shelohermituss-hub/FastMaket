"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import OnboardingSlide1 from "./OnboardingSlide1";
import OnboardingSlide2 from "./OnboardingSlide2";
import OnboardingSlide3 from "./OnboardingSlide3";

const SLIDES = [OnboardingSlide1, OnboardingSlide2, OnboardingSlide3];

export default function OnboardingCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState<"right" | "left">("right");
  const router = useRouter();

  const goNext = useCallback(() => {
    if (current < SLIDES.length - 1) {
      setDirection("right");
      setCurrent((c) => c + 1);
    } else {
      router.push("/signup");
    }
  }, [current, router]);

  const goPrev = useCallback(() => {
    if (current > 0) {
      setDirection("left");
      setCurrent((c) => c - 1);
    }
  }, [current]);

  const SlideComponent = SLIDES[current];

  return (
    <div className="relative w-full h-full">
      <SlideComponent key={current} direction={direction} />

      {/* Dot indicators */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 items-center z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > current ? "right" : "left"); setCurrent(i); }}
            className="transition-all duration-300"
            style={{
              width: i === current ? "28px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: i === current ? "#4040FF" : "#D1D5DB",
            }}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Navigation bar */}
      <div className="absolute bottom-6 left-6 right-6 flex items-center gap-4 z-20">
        {current > 0 ? (
          <button
            onClick={goPrev}
            className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center bg-white/80 backdrop-blur-sm shadow-sm transition-transform active:scale-95 dark:bg-gray-800 dark:border-gray-700"
            aria-label="Previous"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="#374151" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ) : (
          <div className="w-12 h-12" />
        )}

        <button
          onClick={goNext}
          className="flex-1 h-14 rounded-2xl flex items-center justify-center gap-3 font-semibold text-base transition-all active:scale-95"
          style={{ background: "linear-gradient(135deg, #4040FF, #6B21FF)" }}
        >
          <span className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 18l6-6-6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span className="text-white">
            {current === SLIDES.length - 1 ? "Get Started" : "Swipe to Signup"}
          </span>
        </button>
      </div>
    </div>
  );
}
