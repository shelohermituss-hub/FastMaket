"use client";

interface Props {
  direction?: "right" | "left";
}

export default function OnboardingSlide3({ direction = "right" }: Props) {
  return (
    <div
      className={`relative w-full h-full bg-white dark:bg-gray-950 flex flex-col animate-${direction === "right" ? "slide-in-right" : "slide-in-left"}`}
    >
      {/* Gradient blob */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #C084FC 0%, #818CF8 100%)" }}
      />

      {/* Status bar */}
      <div className="flex justify-between items-center px-7 pt-3 pb-2 text-gray-700 dark:text-gray-300 text-xs font-medium">
        <span>09:41</span>
        <div className="flex items-center gap-1.5">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="currentColor">
            <rect x="0" y="4" width="3" height="8" rx="1"/>
            <rect x="4.5" y="2.5" width="3" height="9.5" rx="1"/>
            <rect x="9" y="1" width="3" height="11" rx="1"/>
          </svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
            <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="currentColor" strokeOpacity="0.35"/>
            <rect x="2" y="2" width="15" height="8" rx="2" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {/* Text content (top) */}
      <div className="px-7 pt-8 pb-4">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white leading-tight mb-3">
          Virtual Payment
          <br />
          Via <span style={{ color: "#9CA3AF" }}>Cards</span>
        </h1>
        <p className="text-gray-400 text-sm leading-relaxed">
          Unmatched Payment Encryption Technology for Maximum Protection
        </p>
      </div>

      {/* Cards area */}
      <div className="flex-1 flex items-center justify-center px-6 relative">
        {/* Dark card (behind) */}
        <div
          className="absolute rounded-2xl shadow-xl"
          style={{
            width: "300px",
            height: "175px",
            top: "50%",
            left: "50%",
            transform: "translateX(-50%) translateY(-50%) rotate(5deg) translateX(15px) translateY(10px)",
            background: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
          }}
        >
          <div className="p-5 h-full flex flex-col justify-between">
            <span className="text-white/60 text-sm">Credit Card</span>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-white/40 text-[10px]">Card Holder</p>
                <p className="text-white/70 text-sm font-bold">Michael Anthony</p>
              </div>
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-amber-500 opacity-80" />
                <div className="w-7 h-7 rounded-full bg-amber-700 opacity-70" />
              </div>
            </div>
          </div>
        </div>

        {/* Orange card (front) */}
        <div
          className="absolute rounded-2xl shadow-2xl"
          style={{
            width: "300px",
            height: "175px",
            top: "50%",
            left: "50%",
            transform: "translateX(-50%) translateY(-50%) rotate(-3deg)",
            background: "linear-gradient(135deg, #FF8C42 0%, #E05A1E 50%, #C84B0F 100%)",
          }}
        >
          <div
            className="absolute inset-0 rounded-2xl opacity-30"
            style={{
              background: "radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.6) 0%, transparent 60%)",
            }}
          />
          <div className="p-5 h-full flex flex-col justify-between relative z-10">
            <div className="flex justify-between">
              <span className="text-white text-sm font-medium">Credit Card</span>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M8 12c0-2.21 1.79-4 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7"/>
                <path d="M5 12c0-3.87 3.13-7 7-7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7"/>
              </svg>
            </div>
            <div>
              <svg width="36" height="28" viewBox="0 0 36 28" fill="none">
                <rect width="36" height="28" rx="4" fill="rgba(255,255,255,0.25)"/>
                <rect x="7" y="7" width="22" height="14" rx="2" fill="rgba(255,255,255,0.3)"/>
              </svg>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-white/60 text-[10px]">Card Holder</p>
                <p className="text-white text-sm font-bold">Michael Anthony</p>
              </div>
              <div className="text-right">
                <p className="text-white/60 text-[10px]">Expires</p>
                <p className="text-white text-sm font-bold">01/21</p>
              </div>
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full bg-amber-400 opacity-90" />
                <div className="w-7 h-7 rounded-full bg-amber-700 opacity-80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom spacing for nav */}
      <div className="pb-32" />
    </div>
  );
}
