"use client";

interface CreditCardProps {
  variant: "blue" | "orange" | "dark";
  holderName?: string;
  expiry?: string;
  type?: "visa" | "mastercard";
  className?: string;
  style?: React.CSSProperties;
}

export default function CreditCard({
  variant,
  holderName = "Michael Anthony",
  expiry = "01/21",
  type = "mastercard",
  className = "",
  style,
}: CreditCardProps) {
  const gradients = {
    blue: "linear-gradient(135deg, #1a1aff 0%, #4040cc 40%, #8080ff 100%)",
    orange: "linear-gradient(135deg, #FF8C42 0%, #E05A1E 50%, #C84B0F 100%)",
    dark: "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
  };

  return (
    <div
      className={`relative rounded-2xl p-5 w-full h-44 overflow-hidden shadow-2xl ${className}`}
      style={{ background: gradients[variant], ...style }}
    >
      {/* Shimmer overlay */}
      <div
        className="absolute inset-0 opacity-20 rounded-2xl"
        style={{
          background:
            "radial-gradient(ellipse at 30% 30%, rgba(255,255,255,0.6) 0%, transparent 60%)",
        }}
      />

      {/* Contactless icon */}
      <div className="absolute top-4 right-4 text-white/70 text-xl">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="white" strokeWidth="1.5" fill="none" opacity="0.5"/>
          <path d="M8 12c0-2.21 1.79-4 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
          <path d="M5 12c0-3.87 3.13-7 7-7" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </div>

      {/* Card type */}
      <p className="text-white/80 text-sm font-medium mb-8">Credit Card</p>

      {/* Chip icon */}
      <div className="mb-4">
        <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
          <rect width="32" height="24" rx="4" fill="rgba(255,255,255,0.3)"/>
          <rect x="6" y="6" width="20" height="12" rx="2" fill="rgba(255,255,255,0.4)"/>
          <line x1="16" y1="6" x2="16" y2="18" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
          <line x1="6" y1="12" x2="26" y2="12" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
        </svg>
      </div>

      {/* Card details */}
      <div className="absolute bottom-5 left-5 right-5 flex justify-between items-end">
        <div>
          <p className="text-white/50 text-[10px] mb-0.5">Card Holder</p>
          <p className="text-white text-sm font-semibold">{holderName}</p>
        </div>
        <div className="text-right">
          <p className="text-white/50 text-[10px] mb-0.5">Expires</p>
          <p className="text-white text-sm font-semibold">{expiry}</p>
        </div>
        {type === "mastercard" && (
          <div className="flex -space-x-2">
            <div className="w-7 h-7 rounded-full bg-amber-400 opacity-90" />
            <div className="w-7 h-7 rounded-full bg-amber-600 opacity-80" />
          </div>
        )}
      </div>
    </div>
  );
}
