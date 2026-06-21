"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginScreen() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const canLogin = phone.length >= 6 && password.length >= 4;

  return (
    <div style={{
      width: "100%", height: "100%", background: "white",
      display: "flex", flexDirection: "column",
      animation: "slideInRight 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    }}>
      {/* Back */}
      <div style={{ padding: "20px 24px 0" }}>
        <button
          onClick={() => router.push("/onboarding")}
          style={{
            width: 40, height: 40, borderRadius: 20, border: "1.5px solid #E5E7EB",
            background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Logo */}
      <div style={{ padding: "28px 28px 8px" }}>
        <span style={{ fontSize: 20, fontWeight: 900, color: "#5B4FFF", letterSpacing: 3, fontStyle: "italic" }}>FINCORE</span>
      </div>

      {/* Heading */}
      <div style={{ padding: "0 28px 36px" }}>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: "#0a0a0a", lineHeight: 1.2, marginBottom: 8 }}>
          Welcome<br />back 👋
        </h1>
        <p style={{ fontSize: 14, color: "#9CA3AF" }}>Sign in to your account</p>
      </div>

      {/* Form */}
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 14 }}>
        {/* Phone field */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>
            Phone number
          </label>
          <div style={{
            display: "flex", alignItems: "center",
            border: "1.5px solid #E5E7EB", borderRadius: 14,
            background: "white", overflow: "hidden",
          }}>
            <div style={{
              padding: "0 14px", height: 54, display: "flex", alignItems: "center",
              borderRight: "1.5px solid #E5E7EB", background: "#F9FAFB",
            }}>
              <span style={{ fontSize: 20 }}>🇺🇸</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#374151", marginLeft: 6 }}>+1</span>
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              placeholder="Phone number"
              style={{
                flex: 1, height: 54, border: "none", outline: "none",
                padding: "0 16px", fontSize: 15, color: "#0a0a0a", background: "transparent",
              }}
            />
          </div>
        </div>

        {/* Password field */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>
            Password
          </label>
          <div style={{
            display: "flex", alignItems: "center",
            border: "1.5px solid #E5E7EB", borderRadius: 14,
            background: "white", overflow: "hidden",
          }}>
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              style={{
                flex: 1, height: 54, border: "none", outline: "none",
                padding: "0 16px", fontSize: 15, color: "#0a0a0a", background: "transparent",
              }}
            />
            <button
              onClick={() => setShowPass(!showPass)}
              style={{
                padding: "0 16px", height: 54, border: "none", background: "none",
                cursor: "pointer", display: "flex", alignItems: "center",
              }}
            >
              {showPass ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M1 1l22 22" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="12" cy="12" r="3" stroke="#9CA3AF" strokeWidth="2"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Forgot */}
        <div style={{ textAlign: "right" }}>
          <a href="/forgot-password" style={{ fontSize: 13, color: "#5B4FFF", fontWeight: 600, textDecoration: "none" }}>
            Forgot password?
          </a>
        </div>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Divider with SSO */}
      <div style={{ padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
          <span style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 500 }}>or continue with</span>
          <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
        </div>

        <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
          {/* Google */}
          <button style={{
            flex: 1, height: 52, borderRadius: 28, border: "1.5px solid #E5E7EB",
            background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>Google</span>
          </button>

          {/* Apple */}
          <button style={{
            flex: 1, height: 52, borderRadius: 28, border: "none",
            background: "#0a0a0a", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <svg width="16" height="20" viewBox="0 0 18 22" fill="white">
              <path d="M14.94 11.46a4.57 4.57 0 0 1 2.17-3.84 4.68 4.68 0 0 0-3.69-2c-1.55-.16-3.05.93-3.84.93-.8 0-2-.91-3.3-.88a4.91 4.91 0 0 0-4.13 2.52C.24 11.21 1.5 15.82 3.21 18.35c.87 1.24 1.88 2.62 3.21 2.57 1.3-.05 1.78-.83 3.35-.83 1.56 0 2 .83 3.36.8 1.39-.02 2.27-1.24 3.11-2.5a10.13 10.13 0 0 0 1.42-2.88 4.42 4.42 0 0 1-2.72-4.05zM12.33 3.9A4.5 4.5 0 0 0 13.37 1a4.58 4.58 0 0 0-2.96 1.53 4.28 4.28 0 0 0-1.06 3.1 3.79 3.79 0 0 0 2.98-1.73z"/>
            </svg>
            <span style={{ fontSize: 14, fontWeight: 600, color: "white" }}>Apple</span>
          </button>
        </div>
      </div>

      {/* Login CTA */}
      <div style={{ padding: "0 24px 16px" }}>
        <button
          onClick={() => canLogin && router.push("/home")}
          style={{
            width: "100%", height: 56, borderRadius: 28, border: "none",
            background: canLogin
              ? "linear-gradient(135deg, #5B4FFF 0%, #7C6FFF 100%)"
              : "#E5E7EB",
            color: canLogin ? "white" : "#9CA3AF",
            fontSize: 16, fontWeight: 700, cursor: canLogin ? "pointer" : "default",
            boxShadow: canLogin ? "0 8px 24px rgba(91,79,255,0.35)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          Log in
        </button>
      </div>

      {/* Sign up link */}
      <p style={{ textAlign: "center", fontSize: 14, color: "#9CA3AF", paddingBottom: 36 }}>
        Don&apos;t have an account?{" "}
        <a href="/signup" style={{ color: "#5B4FFF", fontWeight: 700, textDecoration: "none" }}>
          Sign up
        </a>
      </p>
    </div>
  );
}
