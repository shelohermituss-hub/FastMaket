"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp, fmtMoney } from "@/lib/store";

export default function ReceivePage() {
  const router = useRouter();
  const { state } = useApp();
  const { user, cards } = state;

  const defaultCard = cards.find(c => c.isDefault) || cards[0];
  const [copied, setCopied] = useState<string | null>(null);

  function copy(text: string, label: string) {
    navigator.clipboard?.writeText(text).catch(() => {});
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }

  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  return (
    <div style={{ maxWidth:430, margin:"0 auto", height:"100dvh", background:"#F8F9FA", display:"flex", flexDirection:"column", fontFamily:"var(--font-geist-sans)" }}>
      {/* Header */}
      <div style={{ background:"white", padding:"52px 24px 20px", borderBottom:"1px solid #F3F4F6" }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <button onClick={() => router.back()} style={{ background:"#F3F4F6", border:"none", borderRadius:12, width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <span style={{ fontSize:18 }}>←</span>
          </button>
          <h1 style={{ fontSize:17, fontWeight:700, color:"#111827" }}>Receive Money</h1>
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"24px 20px", display:"flex", flexDirection:"column", gap:20 }}>
        {/* QR / Avatar block */}
        <div style={{ background:"white", borderRadius:24, padding:"32px 24px", display:"flex", flexDirection:"column", alignItems:"center", gap:20 }}>
          {/* QR placeholder */}
          <div style={{ width:200, height:200, borderRadius:20, background:"#F3F4F6", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
            {/* Simulated QR pattern */}
            <div style={{ display:"grid", gridTemplateColumns:"repeat(10,16px)", gap:2 }}>
              {Array.from({ length:100 }, (_, i) => (
                <div key={i} style={{ width:14, height:14, borderRadius:2, background: (i % 3 === 0 || i % 7 === 0 || i % 11 === 0) ? "#111827" : "transparent" }} />
              ))}
            </div>
            {/* Center avatar overlay */}
            <div style={{ position:"absolute", width:52, height:52, borderRadius:26, background:"linear-gradient(135deg,#5B4FFF,#7C6FFF)", display:"flex", alignItems:"center", justifyContent:"center", border:"4px solid white" }}>
              <span style={{ color:"white", fontSize:16, fontWeight:800 }}>{initials}</span>
            </div>
          </div>

          <div style={{ textAlign:"center" }}>
            <p style={{ fontSize:18, fontWeight:800, color:"#111827", margin:0 }}>{user.firstName} {user.lastName}</p>
            <p style={{ fontSize:13, color:"#9CA3AF", margin:"4px 0 0" }}>{user.phone}</p>
          </div>

          <p style={{ fontSize:12, color:"#6B7280", textAlign:"center", lineHeight:1.5 }}>
            Scan QR code or share your details below to receive money instantly
          </p>
        </div>

        {/* Account details */}
        <div style={{ background:"white", borderRadius:20, padding:"20px" }}>
          <p style={{ fontSize:13, fontWeight:700, color:"#111827", marginBottom:14 }}>Account Details</p>

          {[
            { label: "Account Name", value: `${user.firstName} ${user.lastName}` },
            { label: "Phone", value: user.phone },
            { label: "Email", value: user.email },
            { label: "Default Card", value: defaultCard ? `•••• ${defaultCard.last4}` : "N/A" },
            { label: "Account Number", value: defaultCard?.number.replace(/\s/g,"").slice(-8) || "N/A" },
          ].map(row => (
            <div key={row.label} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid #F9FAFB" }}>
              <span style={{ fontSize:13, color:"#6B7280" }}>{row.label}</span>
              <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                <span style={{ fontSize:13, fontWeight:600, color:"#111827" }}>{row.value}</span>
                <button onClick={() => copy(row.value, row.label)} style={{ background:"#F3F4F6", border:"none", borderRadius:8, padding:"4px 8px", fontSize:11, color: copied===row.label ? "#10B981" : "#5B4FFF", fontWeight:600, cursor:"pointer" }}>
                  {copied===row.label ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cards */}
        {cards.length > 0 && (
          <div style={{ background:"white", borderRadius:20, padding:"20px" }}>
            <p style={{ fontSize:13, fontWeight:700, color:"#111827", marginBottom:14 }}>Your Cards</p>
            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
              {cards.map(c => (
                <div key={c.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid #F9FAFB" }}>
                  <div style={{ width:40, height:26, borderRadius:6, background:c.gradient, flexShrink:0 }} />
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:13, fontWeight:600, color:"#111827", margin:0 }}>{c.type} •••• {c.last4}</p>
                    <p style={{ fontSize:11, color:"#9CA3AF", margin:0 }}>Balance: ${fmtMoney(c.balance)}</p>
                  </div>
                  {c.isDefault && <span style={{ fontSize:11, color:"#5B4FFF", fontWeight:700, background:"#F0EFFE", padding:"3px 8px", borderRadius:8 }}>Default</span>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share button */}
      <div style={{ padding:"16px 20px 32px", background:"white", borderTop:"1px solid #F3F4F6" }}>
        <button
          onClick={() => copy(`${user.firstName} ${user.lastName} | ${user.phone} | ${user.email}`, "details")}
          style={{ width:"100%", padding:"16px 0", borderRadius:16, background:"linear-gradient(135deg,#5B4FFF,#7C6FFF)", border:"none", color:"white", fontSize:16, fontWeight:700, cursor:"pointer" }}>
          {copied==="details" ? "✓ Copied to Clipboard" : "Share My Details"}
        </button>
      </div>
    </div>
  );
}
