"use client";

import { useRouter } from "next/navigation";

export default function SignUpSuccess() {
  const router = useRouter();

  return (
    <div style={{
      width: "100%", height: "100%", background: "white",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      animation: "fadeInUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      padding: "0 28px",
    }}>
      {/* Check circle */}
      <div style={{
        width: 96, height: 96, borderRadius: 48,
        background: "linear-gradient(135deg, #5B4FFF 0%, #7C6FFF 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 16px 48px rgba(91,79,255,0.4)",
        marginBottom: 32,
        animation: "floatY 3s ease-in-out infinite",
      }}>
        <svg width="44" height="34" viewBox="0 0 44 34" fill="none">
          <path d="M4 17l12 12L40 4" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      <h1 style={{ fontSize: 30, fontWeight: 900, color: "#0a0a0a", textAlign: "center", marginBottom: 12 }}>
        You&apos;re all set!
      </h1>
      <p style={{ fontSize: 15, color: "#9CA3AF", textAlign: "center", lineHeight: 1.6, marginBottom: 48 }}>
        Your account has been verified.<br />Welcome to FIN CORE.
      </p>

      <button
        onClick={() => router.push("/home")}
        style={{
          width: "100%", height: 56, borderRadius: 28, border: "none",
          background: "linear-gradient(135deg, #5B4FFF 0%, #7C6FFF 100%)",
          color: "white", fontSize: 16, fontWeight: 700, cursor: "pointer",
          boxShadow: "0 8px 24px rgba(91,79,255,0.35)",
        }}
      >
        Go to Dashboard
      </button>
    </div>
  );
}
