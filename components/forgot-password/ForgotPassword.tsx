"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = "request" | "otp" | "new-password" | "success";

const KEYBOARD_ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
  ["*", "0", "⌫"],
];

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <div style={{ padding: "20px 24px 0" }}>
      <button onClick={onClick} style={{
        width: 40, height: 40, borderRadius: 20, border: "1.5px solid #E5E7EB",
        background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 19l-7-7 7-7" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

function StepRequest({ onNext }: { onNext: (phone: string) => void }) {
  const [phone, setPhone] = useState("");
  const router = useRouter();

  return (
    <div style={{ width: "100%", height: "100%", background: "white", display: "flex", flexDirection: "column", animation: "slideInRight 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}>
      <BackButton onClick={() => router.push("/login")} />

      {/* Icon */}
      <div style={{ padding: "32px 28px 0", display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20,
          background: "linear-gradient(135deg, #F0EFFF, #E0DEFF)",
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28,
        }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="4" width="20" height="16" rx="3" stroke="#5B4FFF" strokeWidth="2"/>
            <path d="M2 8l10 6 10-6" stroke="#5B4FFF" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0a0a0a", marginBottom: 8, lineHeight: 1.2 }}>
          Forgot your<br />password?
        </h1>
        <p style={{ fontSize: 14, color: "#9CA3AF", lineHeight: 1.6, marginBottom: 36 }}>
          Enter your phone number and we'll send a verification code to reset your password.
        </p>
      </div>

      {/* Phone input */}
      <div style={{ padding: "0 24px" }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>
          Phone number
        </label>
        <div style={{
          display: "flex", alignItems: "center",
          border: "1.5px solid #E5E7EB", borderRadius: 14, overflow: "hidden",
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

      <div style={{ flex: 1 }} />

      <div style={{ padding: "0 24px 40px" }}>
        <button
          onClick={() => phone.length >= 6 && onNext(`+1${phone}`)}
          style={{
            width: "100%", height: 56, borderRadius: 28, border: "none",
            background: phone.length >= 6
              ? "linear-gradient(135deg, #5B4FFF 0%, #7C6FFF 100%)"
              : "#E5E7EB",
            color: phone.length >= 6 ? "white" : "#9CA3AF",
            fontSize: 16, fontWeight: 700,
            cursor: phone.length >= 6 ? "pointer" : "default",
            boxShadow: phone.length >= 6 ? "0 8px 24px rgba(91,79,255,0.35)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          Send Reset Code
        </button>
      </div>
    </div>
  );
}

function StepOTP({ phone, onBack, onNext }: { phone: string; onBack: () => void; onNext: () => void }) {
  const [otp, setOtp] = useState("");
  const OTP_LENGTH = 6;

  function handleKey(val: string) {
    if (val === "⌫") {
      setOtp((p) => p.slice(0, -1));
    } else if (val !== "*" && otp.length < OTP_LENGTH) {
      const next = otp + val;
      setOtp(next);
      if (next.length === OTP_LENGTH) setTimeout(onNext, 400);
    }
  }

  return (
    <div style={{ width: "100%", height: "100%", background: "white", display: "flex", flexDirection: "column", animation: "slideInRight 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}>
      <BackButton onClick={onBack} />

      <div style={{ padding: "28px 28px 8px" }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0a0a0a", marginBottom: 8 }}>Enter the code</h1>
        <p style={{ fontSize: 14, color: "#9CA3AF", lineHeight: 1.5 }}>
          Code sent to <span style={{ color: "#0a0a0a", fontWeight: 600 }}>{phone}</span>
        </p>
      </div>

      {/* OTP dots */}
      <div style={{ padding: "32px 28px", display: "flex", gap: 10, justifyContent: "center" }}>
        {Array.from({ length: OTP_LENGTH }).map((_, i) => (
          <div key={i} style={{
            width: 46, height: 54, borderRadius: 14,
            border: i <= otp.length ? "2px solid #5B4FFF" : "1.5px solid #E5E7EB",
            background: i < otp.length ? "#F0EFFF" : "white",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s ease",
          }}>
            {i < otp.length && <div style={{ width: 10, height: 10, borderRadius: 5, background: "#5B4FFF" }} />}
          </div>
        ))}
      </div>

      <p style={{ textAlign: "center", fontSize: 13, color: "#9CA3AF" }}>
        Didn't receive code?{" "}
        <button style={{ border: "none", background: "none", color: "#5B4FFF", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Resend</button>
      </p>

      <div style={{ flex: 1 }} />

      <div style={{ padding: "0 24px 16px" }}>
        <button
          onClick={() => otp.length === OTP_LENGTH && onNext()}
          style={{
            width: "100%", height: 56, borderRadius: 28, border: "none",
            background: "linear-gradient(135deg, #5B4FFF 0%, #7C6FFF 100%)",
            color: "white", fontSize: 16, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 8px 24px rgba(91,79,255,0.35)",
          }}
        >
          Verify Code
        </button>
      </div>

      {/* Keyboard */}
      <div style={{ background: "#D1D5DB", padding: "12px 4px 8px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 1 }}>
        {KEYBOARD_ROWS.flat().map((key) => (
          <button key={key} onClick={() => handleKey(key)} style={{
            height: 56, border: "none", cursor: "pointer",
            background: key === "*" || key === "⌫" ? "#ADB5BD" : "white",
            fontSize: key === "⌫" ? 20 : 22, fontWeight: 400, color: "#0a0a0a",
            display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2,
          }}>
            {key !== "⌫" && key !== "*" ? (
              <>
                <span style={{ lineHeight: 1 }}>{key}</span>
                <span style={{ fontSize: 9, color: "#6B7280", letterSpacing: 1, fontWeight: 500 }}>
                  {({"2":"ABC","3":"DEF","4":"GHI","5":"JKL","6":"MNO","7":"PQRS","8":"TUV","9":"WXYZ"} as Record<string,string>)[key] || ""}
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

function StepNewPassword({ onBack, onDone }: { onBack: () => void; onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isStrong = password.length >= 8;
  const matches = password === confirm && confirm.length > 0;
  const canSubmit = isStrong && matches;

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 8 ? 2 : 3;
  const strengthColor = ["transparent", "#EF4444", "#F59E0B", "#10B981"][strength];
  const strengthLabel = ["", "Weak", "Medium", "Strong"][strength];

  return (
    <div style={{ width: "100%", height: "100%", background: "white", display: "flex", flexDirection: "column", animation: "slideInRight 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}>
      <BackButton onClick={onBack} />

      <div style={{ padding: "28px 28px 0" }}>
        <div style={{
          width: 64, height: 64, borderRadius: 20,
          background: "linear-gradient(135deg, #F0EFFF, #E0DEFF)",
          display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24,
        }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="11" width="14" height="10" rx="2" stroke="#5B4FFF" strokeWidth="2"/>
            <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#5B4FFF" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="16" r="1.5" fill="#5B4FFF"/>
          </svg>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "#0a0a0a", marginBottom: 8, lineHeight: 1.2 }}>
          New password
        </h1>
        <p style={{ fontSize: 14, color: "#9CA3AF", lineHeight: 1.6, marginBottom: 32 }}>
          Choose a strong password you haven't used before.
        </p>
      </div>

      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Password */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>New password</label>
          <div style={{ display: "flex", alignItems: "center", border: "1.5px solid #E5E7EB", borderRadius: 14, overflow: "hidden" }}>
            <input
              type={showPass ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              style={{ flex: 1, height: 54, border: "none", outline: "none", padding: "0 16px", fontSize: 15, color: "#0a0a0a", background: "transparent" }}
            />
            <button onClick={() => setShowPass(!showPass)} style={{ padding: "0 16px", height: 54, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="12" cy="12" r="3" stroke="#9CA3AF" strokeWidth="2"/>
              </svg>
            </button>
          </div>
          {/* Strength bar */}
          {password.length > 0 && (
            <div style={{ marginTop: 8, display: "flex", gap: 4, alignItems: "center" }}>
              {[1,2,3].map((i) => (
                <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= strength ? strengthColor : "#E5E7EB", transition: "background 0.2s" }} />
              ))}
              <span style={{ fontSize: 11, fontWeight: 600, color: strengthColor, marginLeft: 4, minWidth: 44 }}>{strengthLabel}</span>
            </div>
          )}
        </div>

        {/* Confirm */}
        <div>
          <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>Confirm password</label>
          <div style={{
            display: "flex", alignItems: "center",
            border: `1.5px solid ${confirm.length > 0 ? (matches ? "#10B981" : "#EF4444") : "#E5E7EB"}`,
            borderRadius: 14, overflow: "hidden",
          }}>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat your password"
              style={{ flex: 1, height: 54, border: "none", outline: "none", padding: "0 16px", fontSize: 15, color: "#0a0a0a", background: "transparent" }}
            />
            <button onClick={() => setShowConfirm(!showConfirm)} style={{ padding: "0 16px", height: 54, border: "none", background: "none", cursor: "pointer", display: "flex", alignItems: "center" }}>
              {confirm.length > 0 && matches ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#10B981" strokeWidth="2"/>
                  <path d="M8 12l3 3 5-6" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="12" cy="12" r="3" stroke="#9CA3AF" strokeWidth="2"/>
                </svg>
              )}
            </button>
          </div>
          {confirm.length > 0 && !matches && (
            <p style={{ fontSize: 12, color: "#EF4444", marginTop: 6 }}>Passwords don't match</p>
          )}
        </div>
      </div>

      <div style={{ flex: 1 }} />

      <div style={{ padding: "0 24px 40px" }}>
        <button
          onClick={() => canSubmit && onDone()}
          style={{
            width: "100%", height: 56, borderRadius: 28, border: "none",
            background: canSubmit ? "linear-gradient(135deg, #5B4FFF 0%, #7C6FFF 100%)" : "#E5E7EB",
            color: canSubmit ? "white" : "#9CA3AF",
            fontSize: 16, fontWeight: 700,
            cursor: canSubmit ? "pointer" : "default",
            boxShadow: canSubmit ? "0 8px 24px rgba(91,79,255,0.35)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          Reset Password
        </button>
      </div>
    </div>
  );
}

function StepSuccess() {
  const router = useRouter();
  return (
    <div style={{
      width: "100%", height: "100%", background: "white",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "0 28px",
      animation: "fadeInUp 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    }}>
      <div style={{
        width: 96, height: 96, borderRadius: 48,
        background: "linear-gradient(135deg, #5B4FFF 0%, #7C6FFF 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 16px 48px rgba(91,79,255,0.4)", marginBottom: 32,
        animation: "floatY 3s ease-in-out infinite",
      }}>
        <svg width="44" height="34" viewBox="0 0 44 34" fill="none">
          <path d="M4 17l12 12L40 4" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <h1 style={{ fontSize: 30, fontWeight: 900, color: "#0a0a0a", textAlign: "center", marginBottom: 12 }}>
        Password reset!
      </h1>
      <p style={{ fontSize: 15, color: "#9CA3AF", textAlign: "center", lineHeight: 1.6, marginBottom: 48 }}>
        Your password has been updated.<br />You can now log in with your new password.
      </p>
      <button
        onClick={() => router.push("/login")}
        style={{
          width: "100%", height: 56, borderRadius: 28, border: "none",
          background: "linear-gradient(135deg, #5B4FFF 0%, #7C6FFF 100%)",
          color: "white", fontSize: 16, fontWeight: 700, cursor: "pointer",
          boxShadow: "0 8px 24px rgba(91,79,255,0.35)",
        }}
      >
        Back to Login
      </button>
    </div>
  );
}

export default function ForgotPassword() {
  const [step, setStep] = useState<Step>("request");
  const [phone, setPhone] = useState("");

  return (
    <>
      {step === "request" && <StepRequest onNext={(p) => { setPhone(p); setStep("otp"); }} />}
      {step === "otp" && <StepOTP phone={phone} onBack={() => setStep("request")} onNext={() => setStep("new-password")} />}
      {step === "new-password" && <StepNewPassword onBack={() => setStep("otp")} onDone={() => setStep("success")} />}
      {step === "success" && <StepSuccess />}
    </>
  );
}
