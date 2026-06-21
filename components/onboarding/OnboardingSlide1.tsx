"use client";

interface Props {
  direction?: "right" | "left";
}

export default function OnboardingSlide1({ direction = "right" }: Props) {
  return (
    <div
      className={`relative w-full h-full flex flex-col animate-${direction === "right" ? "slide-in-right" : "slide-in-left"}`}
      style={{
        background: "linear-gradient(160deg, #0D0060 0%, #2A0FA0 35%, #4B1FD4 65%, #7B3FF5 100%)",
      }}
    >
      {/* Status bar */}
      <div className="flex justify-between items-center px-7 pt-3 pb-2 text-white/90 text-xs font-medium">
        <span>09:41</span>
        <div className="flex items-center gap-1.5">
          <svg width="16" height="12" viewBox="0 0 16 12" fill="white">
            <rect x="0" y="4" width="3" height="8" rx="1"/>
            <rect x="4.5" y="2.5" width="3" height="9.5" rx="1"/>
            <rect x="9" y="1" width="3" height="11" rx="1"/>
          </svg>
          <svg width="15" height="12" viewBox="0 0 15 12" fill="white">
            <path d="M7.5 2.5C9.8 2.5 11.8 3.5 13.2 5L14.5 3.7C12.8 2 10.3 1 7.5 1S2.2 2 0.5 3.7L1.8 5C3.2 3.5 5.2 2.5 7.5 2.5Z"/>
            <path d="M7.5 5.5C9 5.5 10.3 6.1 11.3 7.1L12.6 5.8C11.3 4.6 9.5 3.9 7.5 3.9S3.7 4.6 2.4 5.8L3.7 7.1C4.7 6.1 6 5.5 7.5 5.5Z"/>
            <circle cx="7.5" cy="10" r="1.5"/>
          </svg>
          <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
            <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="white" strokeOpacity="0.35"/>
            <rect x="2" y="2" width="15" height="8" rx="2" fill="white"/>
            <path d="M23 4.5V7.5C23.8 7.2 24.5 6.5 24.5 6S23.8 4.8 23 4.5Z" fill="white" fillOpacity="0.4"/>
          </svg>
        </div>
      </div>

      {/* Logo */}
      <div className="px-7 mt-4">
        <div className="flex items-center gap-1">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M11 2L20 7V15L11 20L2 15V7L11 2Z" fill="white" fillOpacity="0.9"/>
            <path d="M11 6L16 9V13L11 16L6 13V9L11 6Z" fill="#4040FF"/>
          </svg>
          <span className="text-white font-black text-xl tracking-tight">FiNCORe</span>
        </div>
      </div>

      {/* Card visual area */}
      <div className="flex-1 flex items-center justify-center px-8 mt-2">
        <div className="relative w-full" style={{ maxWidth: "300px", height: "220px" }}>
          {/* Glow */}
          <div
            className="absolute rounded-full blur-3xl opacity-40"
            style={{
              width: "260px",
              height: "260px",
              background: "radial-gradient(circle, #8080FF 0%, #4040FF 50%, transparent 100%)",
              top: "-20px",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
          {/* Blue card */}
          <div
            className="absolute rounded-2xl shadow-2xl"
            style={{
              width: "290px",
              height: "170px",
              top: "20px",
              left: "50%",
              transform: "translateX(-50%) rotate(-2deg)",
              background: "linear-gradient(135deg, #1a1aff 0%, #3030cc 40%, rgba(255,255,255,0.15) 100%)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="p-5 h-full flex flex-col justify-between">
              <div className="flex justify-between items-start">
                <span className="text-white/80 text-sm font-medium">Credit Card</span>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M8 12c0-2.21 1.79-4 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7"/>
                  <path d="M5 12c0-3.87 3.13-7 7-7" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.7"/>
                </svg>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-white/50 text-[10px]">Card Holder</p>
                  <p className="text-white text-sm font-bold">Michael Anthony</p>
                </div>
                <div className="text-right">
                  <p className="text-white/50 text-[10px]">Expires</p>
                  <p className="text-white text-sm font-bold">01/21</p>
                </div>
                <div className="flex -space-x-2">
                  <div className="w-7 h-7 rounded-full bg-white/30" />
                  <div className="w-7 h-7 rounded-full bg-white/20" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Text content */}
      <div
        className="px-7 pb-32 pt-6 rounded-t-3xl mt-auto"
        style={{ background: "rgba(255,255,255,0.95)" }}
      >
        <p className="text-gray-400 text-sm font-medium mb-2">News For You</p>
        <h1 className="text-2xl font-black text-gray-900 leading-tight">
          All-in-One Solution
          <br />
          for Modern{" "}
          <span className="text-gray-300">Money Management</span>
        </h1>
      </div>
    </div>
  );
}
