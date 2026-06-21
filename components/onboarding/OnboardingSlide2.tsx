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

      {/* Status bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px 0", position: "relative", zIndex: 10 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: "#111" }}>09:41</span>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
            <rect x="0" y="5" width="3" height="7" rx="1" fill="#111"/>
            <rect x="4.5" y="3" width="3" height="9" rx="1" fill="#111"/>
            <rect x="9" y="1" width="3" height="11" rx="1" fill="#111"/>
          </svg>
          <div style={{ width: 22, height: 11, borderRadius: 3, border: "1.5px solid #111", padding: "1.5px", display: "flex", alignItems: "center" }}>
            <div style={{ width: 13, height: "100%", background: "#111", borderRadius: 1.5 }} />
          </div>
        </div>
      </div>

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
