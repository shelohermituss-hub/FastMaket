"use client";

interface Props {
  direction?: "right" | "left";
}

export default function OnboardingSlide3({ direction = "right" }: Props) {
  const animStyle: React.CSSProperties = {
    animation: direction === "right"
      ? "slideInRight 0.4s ease-out"
      : "slideInLeft 0.4s ease-out",
  };

  return (
    <div
      className="relative w-full h-full flex flex-col bg-white dark:bg-gray-950 overflow-hidden"
      style={animStyle}
    >
      {/* Gradient blob center */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(192,132,252,0.3) 0%, rgba(129,140,248,0.15) 50%, transparent 70%)",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          filter: "blur(50px)",
        }}
      />

      {/* Status bar */}
      <div className="flex justify-between items-center px-7 pt-4 pb-2 text-gray-600 dark:text-gray-400 text-xs font-medium">
        <span>09:41</span>
        <div className="flex items-center gap-1.5">
          <svg width="16" height="11" viewBox="0 0 16 11" fill="currentColor">
            <rect x="0" y="5" width="3" height="6" rx="1" />
            <rect x="4.5" y="3" width="3" height="8" rx="1" />
            <rect x="9" y="1" width="3" height="10" rx="1" />
          </svg>
          <div className="flex items-center gap-0.5">
            <div className="w-5 h-2.5 rounded-sm border border-current p-0.5 opacity-40">
              <div className="w-3 h-full bg-current rounded-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Text — top */}
      <div className="px-7 pt-8 pb-2">
        <h1 className="text-[30px] font-black text-gray-900 dark:text-white leading-tight mb-3">
          Virtual Payment
          <br />
          Via <span className="text-gray-300 dark:text-gray-600">Cards</span>
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
          Unmatched Payment Encryption Technology for Maximum Protection
        </p>
      </div>

      {/* Cards — center */}
      <div className="flex-1 flex items-center justify-center relative" style={{ minHeight: 0 }}>
        {/* Dark card — back */}
        <div
          style={{
            position: "absolute",
            width: "295px",
            height: "175px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #1c1c1e 0%, #2d2d30 100%)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)",
            transform: "rotate(5deg) translateX(18px) translateY(12px)",
          }}
        >
          <div className="p-5 h-full flex flex-col justify-between">
            <span className="text-white/50 text-sm">Credit Card</span>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-white/30 text-[9px] mb-0.5">Card Holder</p>
                <p className="text-white/60 text-sm font-bold">Michael Anthony</p>
              </div>
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-amber-500 opacity-80" />
                <div className="w-7 h-7 rounded-full bg-amber-800 opacity-70" />
              </div>
            </div>
          </div>
        </div>

        {/* Orange card — front */}
        <div
          style={{
            position: "absolute",
            width: "295px",
            height: "175px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, #FF8C42 0%, #E0591E 55%, #C44B0E 100%)",
            boxShadow: "0 20px 60px rgba(200,80,20,0.35)",
            transform: "rotate(-3deg)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse at 28% 28%, rgba(255,255,255,0.3) 0%, transparent 55%)",
            }}
          />
          <div className="relative p-5 h-full flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-white text-sm font-medium">Credit Card</span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" opacity="0.7">
                <path d="M8.5 12c0-1.93 1.57-3.5 3.5-3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M5.5 12C5.5 8.41 8.41 5.5 12 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M2.5 12C2.5 6.75 6.75 2.5 12 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <svg width="36" height="28" viewBox="0 0 36 28" fill="none">
              <rect width="36" height="28" rx="4" fill="rgba(255,255,255,0.2)" />
              <rect x="7" y="7" width="22" height="14" rx="2" fill="rgba(255,255,255,0.25)" />
            </svg>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-white/60 text-[9px] mb-0.5">Card Holder</p>
                <p className="text-white text-sm font-bold">Michael Anthony</p>
              </div>
              <div>
                <p className="text-white/60 text-[9px] mb-0.5">Expires</p>
                <p className="text-white text-sm font-bold">01/21</p>
              </div>
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-amber-400 opacity-95" />
                <div className="w-7 h-7 rounded-full bg-amber-700 opacity-85" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom spacing for nav */}
      <div className="pb-36" />
    </div>
  );
}
