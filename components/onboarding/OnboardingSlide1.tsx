"use client";

interface Props {
  direction?: "right" | "left";
}

export default function OnboardingSlide1({ direction = "right" }: Props) {
  const animStyle: React.CSSProperties = {
    animation: direction === "right"
      ? "slideInRight 0.4s ease-out"
      : "slideInLeft 0.4s ease-out",
  };

  return (
    <div
      className="relative w-full h-full flex flex-col"
      style={{
        background: "linear-gradient(160deg, #0D0060 0%, #2A0FA0 35%, #4B1FD4 65%, #7B3FF5 100%)",
        ...animStyle,
      }}
    >
      {/* Status bar */}
      <div className="flex justify-between items-center px-7 pt-4 pb-2 text-white/90 text-xs font-medium">
        <span>09:41</span>
        <div className="flex items-center gap-1.5">
          <svg width="16" height="11" viewBox="0 0 16 11" fill="white">
            <rect x="0" y="5" width="3" height="6" rx="1" />
            <rect x="4.5" y="3" width="3" height="8" rx="1" />
            <rect x="9" y="1" width="3" height="10" rx="1" />
          </svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="white" fillOpacity="0.9">
            <path d="M8 2.4C10.6 2.4 12.9 3.5 14.5 5.3L16 3.8C14 1.5 11.2 0 8 0S2 1.5 0 3.8L1.5 5.3C3.1 3.5 5.4 2.4 8 2.4Z" />
            <path d="M8 5.6C9.7 5.6 11.2 6.3 12.3 7.5L13.8 6C12.3 4.5 10.3 3.6 8 3.6S3.7 4.5 2.2 6L3.7 7.5C4.8 6.3 6.3 5.6 8 5.6Z" />
            <circle cx="8" cy="10" r="2" />
          </svg>
          <div className="flex items-center gap-0.5">
            <div className="w-5 h-2.5 rounded-sm border border-white/50 p-0.5">
              <div className="w-3 h-full bg-white rounded-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="px-7 mt-3">
        <div className="flex items-center gap-1.5">
          <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
            <path d="M11 1L21 6.5V15.5L11 21L1 15.5V6.5L11 1Z" fill="white" fillOpacity="0.85" />
            <path d="M11 5L18 9V13L11 17L4 13V9L11 5Z" fill="#3333DD" />
          </svg>
          <span className="text-white font-black text-lg tracking-widest uppercase">FiNCORe</span>
        </div>
      </div>

      {/* Card visual — center zone */}
      <div className="flex-1 flex items-center justify-center relative px-8" style={{ minHeight: 0 }}>
        {/* Glow blob */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: "280px",
            height: "280px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(150,120,255,0.5) 0%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -60%)",
            filter: "blur(40px)",
          }}
        />

        {/* Credit card */}
        <div
          style={{
            width: "100%",
            maxWidth: "310px",
            height: "175px",
            borderRadius: "20px",
            background: "linear-gradient(135deg, rgba(30,20,180,0.85) 0%, rgba(80,60,220,0.7) 100%)",
            backdropFilter: "blur(16px)",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 20px 60px rgba(0,0,80,0.4)",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Shimmer */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(ellipse at 25% 25%, rgba(255,255,255,0.25) 0%, transparent 55%)",
            }}
          />
          <div className="relative p-5 h-full flex flex-col justify-between">
            <div className="flex justify-between items-center">
              <span className="text-white/80 text-sm font-medium">Credit Card</span>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" opacity="0.7">
                <path d="M8.5 12c0-1.93 1.57-3.5 3.5-3.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M5.5 12C5.5 8.41 8.41 5.5 12 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M2.5 12C2.5 6.75 6.75 2.5 12 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-white/50 text-[9px] mb-0.5">Card Holder</p>
                <p className="text-white text-sm font-bold">Michael Anthony</p>
              </div>
              <div>
                <p className="text-white/50 text-[9px] mb-0.5">Expires</p>
                <p className="text-white text-sm font-bold">01/21</p>
              </div>
              <div className="flex -space-x-2">
                <div className="w-7 h-7 rounded-full" style={{ background: "rgba(255,255,255,0.3)" }} />
                <div className="w-7 h-7 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* White panel at bottom */}
      <div
        className="px-7 pt-7 pb-36"
        style={{
          background: "rgba(255,255,255,0.97)",
          borderRadius: "28px 28px 0 0",
        }}
      >
        <p className="text-gray-400 text-sm font-medium mb-2">News For You</p>
        <h1 className="text-[26px] font-black text-gray-900 leading-tight">
          All-in-One Solution
          <br />
          for Modern{" "}
          <span className="text-gray-300 font-black">Money Management</span>
        </h1>
      </div>
    </div>
  );
}
