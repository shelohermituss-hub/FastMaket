"use client";

import { useState } from "react";

interface Props {
  onBack: () => void;
  onNext: (phone: string) => void;
}

const COUNTRIES = [
  { code: "+1", flag: "🇺🇸", name: "US" },
  { code: "+44", flag: "🇬🇧", name: "GB" },
  { code: "+33", flag: "🇫🇷", name: "FR" },
  { code: "+49", flag: "🇩🇪", name: "DE" },
  { code: "+43", flag: "🇦🇹", name: "AT" },
];

export default function SignUpPhone({ onBack, onNext }: Props) {
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [phone, setPhone] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showCountries, setShowCountries] = useState(false);

  const canProceed = phone.length >= 6 && agreed;

  return (
    <div style={{
      width: "100%", height: "100%", background: "white",
      display: "flex", flexDirection: "column",
      animation: "slideInRight 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    }}>
      {/* Status bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 24px 0" }}>
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

      {/* Back */}
      <div style={{ padding: "20px 24px 0" }}>
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 20, border: "1.5px solid #E5E7EB",
          background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Heading */}
      <div style={{ padding: "28px 28px 32px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0a0a0a", marginBottom: 8 }}>Enter your<br />phone number</h1>
        <p style={{ fontSize: 14, color: "#9CA3AF" }}>We'll send you a verification code</p>
      </div>

      {/* Phone input */}
      <div style={{ padding: "0 24px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 0,
          border: "1.5px solid #E5E7EB", borderRadius: 16, overflow: "hidden",
          background: "white",
        }}>
          {/* Country selector */}
          <button
            onClick={() => setShowCountries(!showCountries)}
            style={{
              display: "flex", alignItems: "center", gap: 6, padding: "0 14px",
              height: 56, border: "none", borderRight: "1.5px solid #E5E7EB",
              background: "#F9FAFB", cursor: "pointer", whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: 20 }}>{country.flag}</span>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>{country.code}</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M6 9l6 6 6-6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          {/* Number */}
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            placeholder="Phone number"
            style={{
              flex: 1, height: 56, border: "none", outline: "none",
              padding: "0 16px 0 12px", fontSize: 16, fontWeight: 500, color: "#0a0a0a",
              background: "transparent",
            }}
          />

          {/* Clear */}
          {phone.length > 0 && (
            <button
              onClick={() => setPhone("")}
              style={{
                width: 32, height: 32, borderRadius: 16, border: "none",
                background: "#E5E7EB", cursor: "pointer", marginRight: 12,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="#6B7280" strokeWidth="2.5" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Country dropdown */}
        {showCountries && (
          <div style={{
            marginTop: 4, border: "1.5px solid #E5E7EB", borderRadius: 12,
            background: "white", overflow: "hidden",
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            animation: "fadeIn 0.18s ease",
          }}>
            {COUNTRIES.map((c) => (
              <button
                key={c.code}
                onClick={() => { setCountry(c); setShowCountries(false); }}
                style={{
                  width: "100%", padding: "14px 16px", border: "none",
                  background: c.code === country.code ? "#F0EFFF" : "white",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 12,
                  textAlign: "left",
                }}
              >
                <span style={{ fontSize: 20 }}>{c.flag}</span>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>{c.name}</span>
                <span style={{ fontSize: 14, color: "#9CA3AF", marginLeft: "auto" }}>{c.code}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Terms */}
      <div style={{ padding: "20px 24px 0", display: "flex", alignItems: "flex-start", gap: 12 }}>
        <button
          onClick={() => setAgreed(!agreed)}
          style={{
            width: 22, height: 22, borderRadius: 6, cursor: "pointer", flexShrink: 0, marginTop: 1,
            background: agreed ? "linear-gradient(135deg, #5B4FFF, #7C6FFF)" : "white",
            border: agreed ? "none" : "1.5px solid #D1D5DB",
            display: "flex", alignItems: "center", justifyContent: "center",
          } as React.CSSProperties}
        >
          {agreed && (
            <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
              <path d="M1 5l4 4 7-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          )}
        </button>
        <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5 }}>
          I agree to the{" "}
          <a href="#" style={{ color: "#5B4FFF", fontWeight: 600, textDecoration: "none" }}>Terms of Service</a>
          {" "}and{" "}
          <a href="#" style={{ color: "#5B4FFF", fontWeight: 600, textDecoration: "none" }}>Privacy Policy</a>
        </p>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* CTA */}
      <div style={{ padding: "0 24px 40px" }}>
        <button
          onClick={() => canProceed && onNext(`${country.code}${phone}`)}
          style={{
            width: "100%", height: 56, borderRadius: 28, border: "none", cursor: canProceed ? "pointer" : "default",
            background: canProceed
              ? "linear-gradient(135deg, #5B4FFF 0%, #7C6FFF 100%)"
              : "#E5E7EB",
            color: canProceed ? "white" : "#9CA3AF",
            fontSize: 16, fontWeight: 700,
            boxShadow: canProceed ? "0 8px 24px rgba(91,79,255,0.35)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          Get Started
        </button>
      </div>
    </div>
  );
}
