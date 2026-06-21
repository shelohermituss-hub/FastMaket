"use client";

interface Props {
  direction?: "right" | "left";
}

export default function OnboardingSlide1({ direction = "right" }: Props) {
  return (
    <div
      className="relative w-full h-full bg-white overflow-hidden flex flex-col"
      style={{
        animation: `${direction === "right" ? "slideInRight" : "slideInLeft"} 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
      }}
    >
      {/* Purple blob background */}
      <div
        style={{
          position: "absolute",
          top: -80,
          left: "50%",
          transform: "translateX(-50%)",
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(220,215,255,0.9) 0%, rgba(196,186,255,0.6) 40%, transparent 70%)",
          filter: "blur(20px)",
          pointerEvents: "none",
        }}
      />

      {/* Card area */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", minHeight: 0, marginTop: 20 }}>
        {/* Ghost shadow card 2 */}
        <div style={{
          position: "absolute",
          width: 290,
          height: 178,
          borderRadius: 22,
          background: "rgba(180,170,255,0.25)",
          transform: "rotate(12deg) translateX(30px) translateY(12px)",
        }} />
        {/* Ghost shadow card 1 */}
        <div style={{
          position: "absolute",
          width: 290,
          height: 178,
          borderRadius: 22,
          background: "rgba(180,170,255,0.4)",
          transform: "rotate(6deg) translateX(14px) translateY(6px)",
        }} />
        {/* Main purple VISA card */}
        <div style={{
          position: "relative",
          width: 290,
          height: 178,
          borderRadius: 22,
          background: "linear-gradient(135deg, #5B4FFF 0%, #7C6FFF 40%, #9B8FFF 100%)",
          boxShadow: "0 20px 60px rgba(91,79,255,0.35)",
          transform: "rotate(-5deg)",
          overflow: "hidden",
        }}>
          {/* Shimmer */}
          <div style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.25) 0%, transparent 60%)",
          }} />
          <div style={{ padding: "20px 22px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginBottom: 2 }}>Michael Anthony</p>
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-end" }}>
              <span style={{ color: "white", fontSize: 22, fontWeight: 700, fontStyle: "italic", letterSpacing: 2 }}>VISA</span>
            </div>
          </div>
        </div>
      </div>

      {/* Text */}
      <div style={{ padding: "0 28px 120px" }}>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: "#0a0a0a", lineHeight: 1.2, marginBottom: 10, textAlign: "center" }}>
          Virtual payment<br />via cards
        </h1>
        <p style={{ fontSize: 14, color: "#9CA3AF", textAlign: "center", lineHeight: 1.6, maxWidth: 260, margin: "0 auto" }}>
          Unmatched Payment Encryption Technology for Maximum Protection
        </p>
      </div>
    </div>
  );
}
