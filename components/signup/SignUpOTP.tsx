"use client";

import { useState } from "react";

interface Props {
  phone: string;
  onBack: () => void;
  onVerified: () => void;
}

const KEYBOARD_ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["*", "0", "⌫"],
];

export default function SignUpOTP({ phone, onBack, onVerified }: Props) {
  const [otp, setOtp] = useState("");
  const OTP_LENGTH = 6;

  function handleKey(val: string) {
    if (val === "⌫") {
      setOtp((p) => p.slice(0, -1));
    } else if (val === "*") {
      // no-op
    } else if (otp.length < OTP_LENGTH) {
      const next = otp + val;
      setOtp(next);
      if (next.length === OTP_LENGTH) {
        setTimeout(onVerified, 400);
      }
    }
  }

  return (
    <div style={{
      width: "100%", height: "100%", background: "white",
      display: "flex", flexDirection: "column",
      animation: "slideInRight 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    }}>
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
      <div style={{ padding: "28px 28px 8px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0a0a0a", marginBottom: 8 }}>Verify your<br />phone number</h1>
        <p style={{ fontSize: 14, color: "#9CA3AF", lineHeight: 1.5 }}>
          Code sent to <span style={{ color: "#0a0a0a", fontWeight: 600 }}>{phone}</span>
        </p>
      </div>

      {/* OTP dots */}
      <div style={{ padding: "32px 28px", display: "flex", gap: 12, justifyContent: "center" }}>
        {Array.from({ length: OTP_LENGTH }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 48, height: 56, borderRadius: 14,
              border: i < otp.length
                ? "2px solid #5B4FFF"
                : i === otp.length
                  ? "2px solid #5B4FFF"
                  : "1.5px solid #E5E7EB",
              background: i < otp.length ? "#F0EFFF" : "white",
              display: "flex", alignItems: "center", justifyContent: "center",
              transition: "all 0.15s ease",
            }}
          >
            {i < otp.length && (
              <div style={{ width: 10, height: 10, borderRadius: 5, background: "#5B4FFF" }} />
            )}
          </div>
        ))}
      </div>

      {/* Resend */}
      <p style={{ textAlign: "center", fontSize: 13, color: "#9CA3AF" }}>
        Didn't receive code?{" "}
        <button style={{ border: "none", background: "none", color: "#5B4FFF", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
          Resend
        </button>
      </p>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Send Code button */}
      <div style={{ padding: "0 24px 16px" }}>
        <button
          onClick={() => otp.length === OTP_LENGTH && onVerified()}
          style={{
            width: "100%", height: 56, borderRadius: 28, border: "none",
            background: otp.length === OTP_LENGTH
              ? "linear-gradient(135deg, #5B4FFF 0%, #7C6FFF 100%)"
              : "linear-gradient(135deg, #5B4FFF 0%, #7C6FFF 100%)",
            color: "white", fontSize: 16, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 8px 24px rgba(91,79,255,0.35)",
          }}
        >
          Send Code
        </button>
      </div>

      {/* iOS-style numeric keyboard */}
      <div style={{
        background: "#D1D5DB", padding: "12px 4px 8px",
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1,
      }}>
        {KEYBOARD_ROWS.flat().map((key) => (
          <button
            key={key}
            onClick={() => handleKey(key)}
            style={{
              height: 56, border: "none", cursor: "pointer",
              background: key === "*" || key === "⌫" ? "#ADB5BD" : "white",
              fontSize: key === "⌫" ? 20 : 22, fontWeight: 400, color: "#0a0a0a",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column", gap: 2,
              transition: "background 0.1s",
            }}
          >
            {key !== "⌫" && key !== "*" ? (
              <>
                <span style={{ lineHeight: 1 }}>{key}</span>
                <span style={{ fontSize: 9, color: "#6B7280", letterSpacing: 1, fontWeight: 500 }}>
                  {{"2":"ABC","3":"DEF","4":"GHI","5":"JKL","6":"MNO","7":"PQRS","8":"TUV","9":"WXYZ"}[key] || ""}
                </span>
              </>
            ) : key === "⌫" ? (
              <svg width="24" height="18" viewBox="0 0 24 18" fill="none">
                <path d="M9 1H22a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H9l-8-8 8-8z" stroke="#0a0a0a" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M15 6l-4 6M11 6l4 6" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            ) : null}
          </button>
        ))}
      </div>
    </div>
  );
}
