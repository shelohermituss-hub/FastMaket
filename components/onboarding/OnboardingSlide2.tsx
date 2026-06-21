"use client";

interface Props {
  direction?: "right" | "left";
}

export default function OnboardingSlide2({ direction = "right" }: Props) {
  return (
    <div
      className="relative w-full h-full overflow-hidden flex flex-col"
      style={{
        background: "linear-gradient(180deg, #6B5FFF 0%, #9B8FFF 50%, #C4BAFF 100%)",
        animation: `${direction === "right" ? "slideInRight" : "slideInLeft"} 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
      }}
    >
      {/* Vertical stripe texture overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: "repeating-linear-gradient(90deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 28px)",
      }} />

      {/* Big typography */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-start", padding: "20px 28px 0", position: "relative", zIndex: 10 }}>
        <h1 style={{
          fontSize: 58,
          fontWeight: 900,
          lineHeight: 1.05,
          color: "#0a0a0a",
          letterSpacing: -1,
        }}>
          All-<br />
          Inclusive<br />
          Financial<br />
          Payment<br />
          Service.
        </h1>
      </div>

      {/* Subtitle + bottom spacing */}
      <div style={{ padding: "16px 28px 120px", position: "relative", zIndex: 10 }}>
        <p style={{ fontSize: 14, color: "rgba(0,0,0,0.5)", lineHeight: 1.5 }}>
          Unmatched Payment Encryption Technology for Maximum Protection
        </p>
      </div>
    </div>
  );
}
