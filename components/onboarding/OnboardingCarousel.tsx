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
      {/* Slide */}
      <SlideComponent key={current} direction={direction} />

      {/* Dot indicators — fixed over slide */}
      <div
        className="absolute flex gap-2 items-center"
        style={{ bottom: "112px", left: "50%", transform: "translateX(-50%)", zIndex: 30 }}
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? "right" : "left");
              setCurrent(i);
            }}
            aria-label={`Slide ${i + 1}`}
            style={{
              width: i === current ? "28px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: i === current ? "#4040FF" : "rgba(150,150,150,0.4)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s ease",
              padding: 0,
            }}
          />
        ))}
      </div>

      {/* Navigation bar — fixed at bottom */}
      <div
        className="absolute flex items-center gap-3"
        style={{ bottom: "32px", left: "24px", right: "24px", zIndex: 30 }}
      >
        {/* Back button */}
        <button
          onClick={goPrev}
          aria-label="Previous"
          style={{
            width: "52px",
            height: "52px",
            borderRadius: "50%",
            background: current === 0 ? "transparent" : "rgba(255,255,255,0.9)",
            border: current === 0 ? "none" : "1px solid rgba(0,0,0,0.08)",
            boxShadow: current === 0 ? "none" : "0 2px 12px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: current === 0 ? "default" : "pointer",
            flexShrink: 0,
            transition: "all 0.2s",
          }}
        >
          {current > 0 && (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="#374151" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>

        {/* Swipe to Signup button */}
        <button
          onClick={goNext}
          style={{
            flex: 1,
            height: "56px",
            borderRadius: "18px",
            background: "linear-gradient(135deg, #4040FF 0%, #6B21FF 100%)",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            paddingLeft: "8px",
            paddingRight: "20px",
            boxShadow: "0 8px 24px rgba(64,64,255,0.35)",
            transition: "transform 0.15s, box-shadow 0.15s",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {current === SLIDES.length - 1 ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M9 18l6-6-6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </div>
          <span style={{ color: "white", fontWeight: 600, fontSize: "16px" }}>
            {current === SLIDES.length - 1 ? "Get Started" : "Swipe to Signup"}
          </span>
        </button>
      </div>
    </div>
  );
}
