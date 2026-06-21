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
    }
  }, [current]);

  const goSkip = useCallback(() => {
    setDirection("right");
    setCurrent(SLIDES.length - 1);
  }, []);

  const isLast = current === SLIDES.length - 1;
  const SlideComponent = SLIDES[current];

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      {/* Slide */}
      <SlideComponent key={current} direction={direction} />

      {/* Dots — only on slides 1 and 2 */}
      {!isLast && (
        <div style={{
          position: "absolute",
          bottom: 88,
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: 8,
          alignItems: "center",
          zIndex: 30,
        }}>
          {SLIDES.map((_, i) => (
            <div
              key={i}
              style={{
                height: 8,
                width: i === current ? 28 : 8,
                borderRadius: 4,
                background: i === current ? "#5B4FFF" : "rgba(91,79,255,0.25)",
                transition: "all 0.3s ease",
              }}
            />
          ))}
        </div>
      )}

      {/* Nav bar — only on slides 1 and 2 */}
      {!isLast && (
        <div style={{
          position: "absolute",
          bottom: 24,
          left: 24,
          right: 24,
          display: "flex",
          alignItems: "center",
          gap: 12,
          zIndex: 30,
        }}>
          {/* Skip */}
          <button
            onClick={goSkip}
            style={{
              height: 52,
              paddingLeft: 24,
              paddingRight: 24,
              borderRadius: 26,
              border: "none",
              background: "rgba(0,0,0,0.06)",
              color: "#374151",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            skip
          </button>

          {/* Next */}
          <button
            onClick={goNext}
            style={{
              flex: 1,
              height: 52,
              borderRadius: 26,
              border: "none",
              background: "linear-gradient(135deg, #5B4FFF 0%, #7C6FFF 100%)",
              color: "white",
              fontSize: 15,
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              boxShadow: "0 8px 24px rgba(91,79,255,0.35)",
            }}
          >
            Next
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}
