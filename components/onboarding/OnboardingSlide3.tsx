"use client";

interface Props {
  direction?: "right" | "left";
}

function Coin({ size = 60, style }: { size?: number; style?: React.CSSProperties }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: "linear-gradient(135deg, #FFB830 0%, #FF8C00 100%)",
      boxShadow: "0 6px 20px rgba(255,140,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center",
      ...style,
    }}>
      <span style={{ fontSize: size * 0.4, fontWeight: 900, color: "rgba(255,255,255,0.9)" }}>$</span>
    </div>
  );
}

export default function OnboardingSlide3({ direction = "right" }: Props) {
  return (
    <div
      className="relative w-full h-full bg-white overflow-hidden flex flex-col"
      style={{
        animation: `${direction === "right" ? "slideInRight" : "slideInLeft"} 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
      }}
    >
      {/* Card + coins area */}
      <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", justifyContent: "center", minHeight: 0 }}>
        {/* Floating coin top-left */}
        <Coin size={64} style={{ position: "absolute", top: 10, left: 20, animation: "floatY 3s ease-in-out infinite" }} />

        {/* Gray card (behind) */}
        <div style={{
          position: "absolute",
          width: 285,
          height: 172,
          borderRadius: 20,
          background: "linear-gradient(135deg, #e8e8e8 0%, #d0d0d0 100%)",
          transform: "rotate(6deg) translateX(22px) translateY(8px)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        }}>
          <div style={{ padding: "18px 20px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <span style={{ color: "rgba(0,0,0,0.4)", fontSize: 11, fontWeight: 600 }}>FIN CORE</span>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <span style={{ fontSize: 18, fontWeight: 900, color: "rgba(0,0,0,0.3)", fontStyle: "italic", letterSpacing: 1 }}>FIN CORE</span>
            </div>
          </div>
        </div>

        {/* Orange card (front) */}
        <div style={{
          position: "absolute",
          width: 285,
          height: 172,
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 16px 50px rgba(255,100,0,0.3)",
          transform: "rotate(-2deg)",
        }}>
          {/* Orange top half */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "55%",
            background: "linear-gradient(135deg, #FF8C42 0%, #FF6B00 100%)",
          }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 40%, rgba(255,200,100,0.4) 0%, transparent 60%)" }} />
            <div style={{ padding: "16px 18px", position: "relative" }}>
              <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 600 }}>Michael Anthony</p>
              {/* Mastercard circles */}
              <div style={{ position: "absolute", top: 14, right: 16, display: "flex" }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(255,200,0,0.9)", marginRight: -8 }} />
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "rgba(255,140,0,0.8)" }} />
              </div>
            </div>
          </div>
          {/* Black bottom half */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "47%",
            background: "#0a0a0a",
            display: "flex", flexDirection: "column", justifyContent: "space-between",
            padding: "10px 18px 14px",
          }}>
            {/* Chip */}
            <div style={{ width: 30, height: 22, borderRadius: 4, background: "linear-gradient(135deg, #D4AF37, #B8960C)", alignSelf: "flex-end" }} />
            {/* Card number */}
            <p style={{ color: "white", fontSize: 13, fontWeight: 700, textAlign: "right", letterSpacing: 0.5, lineHeight: 1.4 }}>
              2507<br />5645<br />6685<br />5633
            </p>
          </div>
          {/* FIN CORE branding overlay */}
          <div style={{ position: "absolute", bottom: 10, left: 14 }}>
            <span style={{ fontSize: 16, fontWeight: 900, color: "white", letterSpacing: 2, fontStyle: "italic" }}>FIN CORE</span>
          </div>
        </div>

        {/* Floating coin bottom-right */}
        <Coin size={56} style={{ position: "absolute", bottom: 20, right: 16, animation: "floatY 3s ease-in-out infinite 1.5s" }} />
      </div>

      {/* Text */}
      <div style={{ padding: "0 28px 32px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0a0a0a", lineHeight: 1.25, marginBottom: 28, textAlign: "center" }}>
          Embrace Global<br />
          <span style={{ color: "#9CA3AF" }}>Currencies</span> with Ease
        </h1>

        {/* Log in + Register */}
        <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
          <a href="/login" style={{
            flex: 1, height: 52, borderRadius: 28, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #5B4FFF, #7C6FFF)",
            color: "white", fontSize: 16, fontWeight: 700,
            boxShadow: "0 8px 24px rgba(91,79,255,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center",
            textDecoration: "none",
          }}>
            Log in
          </a>
          <a href="/signup" style={{
            flex: 1, height: 52, borderRadius: 28, border: "none", cursor: "pointer",
            background: "#F0EFFF",
            color: "#5B4FFF", fontSize: 16, fontWeight: 700,
            display: "flex", alignItems: "center", justifyContent: "center",
            textDecoration: "none",
          }}>
            Register
          </a>
        </div>

        {/* Google */}
        <button style={{
          width: "100%", height: 52, borderRadius: 28, border: "1.5px solid #E5E7EB",
          background: "white", cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", gap: 10,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#374151" }}>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}
