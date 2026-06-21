"use client";

interface Props {
  onEmail: () => void;
}

function StatusBar() {
  return (
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
  );
}

function CardVisual() {
  return (
    <div style={{ position: "relative", width: 280, height: 170, margin: "0 auto" }}>
      {/* Shadow card 2 */}
      <div style={{
        position: "absolute", width: 250, height: 148, borderRadius: 18,
        background: "linear-gradient(135deg, #d0cfff 0%, #b8b5ff 100%)",
        top: 22, left: "50%", transform: "translateX(-50%) rotate(8deg)",
        boxShadow: "0 4px 20px rgba(91,79,255,0.15)",
      }} />
      {/* Shadow card 1 */}
      <div style={{
        position: "absolute", width: 260, height: 154, borderRadius: 18,
        background: "linear-gradient(135deg, #9B8FFF 0%, #7C6FFF 100%)",
        top: 12, left: "50%", transform: "translateX(-50%) rotate(4deg)",
        boxShadow: "0 6px 24px rgba(91,79,255,0.2)",
      }} />
      {/* Main card */}
      <div style={{
        position: "absolute", width: 270, height: 160, borderRadius: 20,
        overflow: "hidden", top: 0, left: "50%", transform: "translateX(-50%)",
        boxShadow: "0 16px 50px rgba(91,79,255,0.4)",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, #5B4FFF 0%, #7C6FFF 50%, #9B8FFF 100%)",
        }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.25) 0%, transparent 60%)" }} />
        <div style={{ position: "relative", padding: "18px 20px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: "white", letterSpacing: 2, fontStyle: "italic" }}>FIN CORE</span>
            <div style={{ display: "flex" }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,200,0,0.9)", marginRight: -8 }} />
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,140,0,0.75)" }} />
            </div>
          </div>
          <div>
            <div style={{ width: 32, height: 24, borderRadius: 4, background: "linear-gradient(135deg, #D4AF37, #B8960C)", marginBottom: 12 }} />
            <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 13, fontWeight: 700, letterSpacing: 1.5 }}>•••• •••• •••• 5633</p>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, marginTop: 4 }}>Michael Anthony</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignUpLanding({ onEmail }: Props) {
  return (
    <div
      style={{
        width: "100%", height: "100%", background: "white",
        display: "flex", flexDirection: "column",
        animation: "slideInRight 0.38s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
    >
      <StatusBar />

      {/* Logo */}
      <div style={{ textAlign: "center", padding: "24px 0 8px" }}>
        <span style={{ fontSize: 22, fontWeight: 900, color: "#5B4FFF", letterSpacing: 3, fontStyle: "italic" }}>FINCORE</span>
      </div>

      {/* Card visual */}
      <div style={{ padding: "24px 28px 32px" }}>
        <CardVisual />
      </div>

      {/* Heading */}
      <div style={{ padding: "0 28px 32px", textAlign: "center" }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0a0a0a", lineHeight: 1.25, marginBottom: 8 }}>
          Create your account
        </h1>
        <p style={{ fontSize: 14, color: "#9CA3AF", lineHeight: 1.5 }}>
          Join millions managing money smarter
        </p>
      </div>

      {/* Auth buttons */}
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {/* Google */}
        <button style={{
          width: "100%", height: 52, borderRadius: 28, border: "1.5px solid #E5E7EB",
          background: "white", cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", gap: 10,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#374151" }}>Continue with Google</span>
        </button>

        {/* Apple */}
        <button style={{
          width: "100%", height: 52, borderRadius: 28, border: "none",
          background: "#0a0a0a", cursor: "pointer", display: "flex", alignItems: "center",
          justifyContent: "center", gap: 10,
        }}>
          <svg width="18" height="22" viewBox="0 0 18 22" fill="white">
            <path d="M14.94 11.46a4.57 4.57 0 0 1 2.17-3.84 4.68 4.68 0 0 0-3.69-2c-1.55-.16-3.05.93-3.84.93-.8 0-2-.91-3.3-.88a4.91 4.91 0 0 0-4.13 2.52C.24 11.21 1.5 15.82 3.21 18.35c.87 1.24 1.88 2.62 3.21 2.57 1.3-.05 1.78-.83 3.35-.83 1.56 0 2 .83 3.36.8 1.39-.02 2.27-1.24 3.11-2.5a10.13 10.13 0 0 0 1.42-2.88 4.42 4.42 0 0 1-2.72-4.05zM12.33 3.9A4.5 4.5 0 0 0 13.37 1a4.58 4.58 0 0 0-2.96 1.53 4.28 4.28 0 0 0-1.06 3.1 3.79 3.79 0 0 0 2.98-1.73z"/>
          </svg>
          <span style={{ fontSize: 15, fontWeight: 600, color: "white" }}>Continue with Apple</span>
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
          <span style={{ fontSize: 13, color: "#9CA3AF", fontWeight: 500 }}>or</span>
          <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
        </div>

        {/* Email/Phone */}
        <button
          onClick={onEmail}
          style={{
            width: "100%", height: 52, borderRadius: 28, border: "none",
            background: "linear-gradient(135deg, #5B4FFF 0%, #7C6FFF 100%)",
            color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 8px 24px rgba(91,79,255,0.35)",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}
        >
          Sign up with phone
        </button>
      </div>

      {/* Login link */}
      <p style={{ textAlign: "center", fontSize: 14, color: "#9CA3AF", marginTop: 24, paddingBottom: 32 }}>
        Already have an account?{" "}
        <a href="/login" style={{ color: "#5B4FFF", fontWeight: 700, textDecoration: "none" }}>Login</a>
      </p>
    </div>
  );
}
