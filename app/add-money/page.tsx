"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp, fmtMoney } from "@/lib/store";

const QUICK = [50, 100, 200, 500, 1000, 2000];

type Step = "form" | "success";

export default function AddMoneyPage() {
  const router = useRouter();
  const { state, addMoney } = useApp();
  const { cards, activeCardId } = state;

  const [step, setStep] = useState<Step>("form");
  const [amount, setAmount] = useState("");
  const [cardId, setCardId] = useState(activeCardId || cards[0]?.id || "");
  const [error, setError] = useState("");
  const [added, setAdded] = useState(0);

  const activeCard = cards.find(c => c.id === cardId) || cards[0];
  const parsed = parseFloat(amount.replace(/,/g, ""));

  function handleSubmit() {
    if (!parsed || parsed <= 0) { setError("Enter a valid amount"); return; }
    if (parsed > 50000) { setError("Maximum deposit is $50,000"); return; }
    setAdded(parsed);
    addMoney(parsed, cardId);
    setStep("success");
  }

  if (step === "success") {
    return (
      <div style={{ maxWidth:430, margin:"0 auto", height:"100dvh", background:"white", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 32px", fontFamily:"var(--font-geist-sans)", gap:24 }}>
        <div style={{ width:96, height:96, borderRadius:48, background:"linear-gradient(135deg,#10B981,#059669)", display:"flex", alignItems:"center", justifyContent:"center", animation:"fadeInUp 0.4s ease" }}>
          <span style={{ fontSize:44, color:"white" }}>✓</span>
        </div>
        <div style={{ textAlign:"center", animation:"fadeInUp 0.4s ease 0.1s both" }}>
          <h2 style={{ fontSize:24, fontWeight:800, color:"#111827", marginBottom:8 }}>Money Added!</h2>
          <p style={{ fontSize:15, color:"#6B7280" }}>${fmtMoney(added)} has been added to your {activeCard?.type} card ending in {activeCard?.last4}</p>
        </div>
        <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:12, animation:"fadeInUp 0.4s ease 0.2s both" }}>
          <button onClick={() => router.push("/home")} style={{ width:"100%", padding:"16px 0", borderRadius:16, background:"linear-gradient(135deg,#5B4FFF,#7C6FFF)", border:"none", color:"white", fontSize:16, fontWeight:700, cursor:"pointer" }}>
            Back to Home
          </button>
          <button onClick={() => { setStep("form"); setAmount(""); setError(""); }} style={{ width:"100%", padding:"16px 0", borderRadius:16, background:"#F3F4F6", border:"none", color:"#374151", fontSize:16, fontWeight:600, cursor:"pointer" }}>
            Add More Money
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth:430, margin:"0 auto", height:"100dvh", background:"#F8F9FA", display:"flex", flexDirection:"column", fontFamily:"var(--font-geist-sans)" }}>
      {/* Header */}
      <div style={{ background:"white", padding:"52px 24px 20px", borderBottom:"1px solid #F3F4F6" }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <button onClick={() => router.back()} style={{ background:"#F3F4F6", border:"none", borderRadius:12, width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <span style={{ fontSize:18 }}>←</span>
          </button>
          <h1 style={{ fontSize:17, fontWeight:700, color:"#111827" }}>Add Money</h1>
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"24px 20px", display:"flex", flexDirection:"column", gap:20 }}>
        {/* Card selector */}
        <div>
          <p style={{ fontSize:13, fontWeight:600, color:"#6B7280", marginBottom:10 }}>Select Card</p>
          <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
            {cards.map(c => (
              <button key={c.id} onClick={() => setCardId(c.id)} style={{
                padding:"14px 16px", borderRadius:14, border:`2px solid ${cardId===c.id?"#5B4FFF":"#E5E7EB"}`,
                background: cardId===c.id ? "#F0EFFE" : "white",
                display:"flex", alignItems:"center", gap:12, cursor:"pointer", textAlign:"left",
              }}>
                <div style={{ width:40, height:40, borderRadius:10, background:c.gradient, flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:13, fontWeight:700, color:"#111827", margin:0 }}>{c.type} •••• {c.last4}</p>
                  <p style={{ fontSize:12, color:"#6B7280", margin:0 }}>Balance: ${fmtMoney(c.balance)}</p>
                </div>
                {cardId===c.id && <span style={{ color:"#5B4FFF", fontSize:18 }}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Amount */}
        <div style={{ background:"white", borderRadius:20, padding:"24px 20px" }}>
          <p style={{ fontSize:13, fontWeight:600, color:"#6B7280", marginBottom:12 }}>Amount</p>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:16 }}>
            <span style={{ fontSize:28, fontWeight:800, color:"#111827" }}>$</span>
            <input
              type="number"
              min="1"
              value={amount}
              onChange={e => { setAmount(e.target.value); setError(""); }}
              placeholder="0.00"
              style={{ flex:1, border:"none", outline:"none", fontSize:36, fontWeight:800, color:"#111827", background:"transparent", width:0 }}
            />
          </div>
          {error && <p style={{ color:"#EF4444", fontSize:12, marginBottom:8 }}>{error}</p>}
          <div style={{ height:1, background:"#F3F4F6", marginBottom:16 }} />
          {/* Quick amounts */}
          <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
            {QUICK.map(q => (
              <button key={q} onClick={() => { setAmount(String(q)); setError(""); }} style={{
                padding:"10px 0", borderRadius:12,
                background: parseFloat(amount)===q ? "#5B4FFF" : "#F3F4F6",
                border:"none",
                color: parseFloat(amount)===q ? "white" : "#374151",
                fontSize:14, fontWeight:600, cursor:"pointer",
              }}>${q.toLocaleString()}</button>
            ))}
          </div>
        </div>

        {/* Payment method */}
        <div style={{ background:"white", borderRadius:20, padding:"20px" }}>
          <p style={{ fontSize:13, fontWeight:600, color:"#6B7280", marginBottom:12 }}>Payment Method</p>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <div style={{ width:40, height:28, borderRadius:6, background:"#1A1F71", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <span style={{ color:"white", fontSize:8, fontWeight:900, letterSpacing:1 }}>VISA</span>
            </div>
            <div>
              <p style={{ fontSize:13, fontWeight:600, color:"#111827", margin:0 }}>Bank Account</p>
              <p style={{ fontSize:11, color:"#9CA3AF", margin:0 }}>Instant transfer • No fees</p>
            </div>
            <span style={{ marginLeft:"auto", color:"#10B981", fontSize:12, fontWeight:700 }}>FREE</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding:"16px 20px 32px", background:"white", borderTop:"1px solid #F3F4F6" }}>
        {parsed > 0 && (
          <p style={{ textAlign:"center", fontSize:13, color:"#6B7280", marginBottom:10 }}>
            Adding <strong style={{ color:"#111827" }}>${fmtMoney(parsed)}</strong> to {activeCard?.type} •••• {activeCard?.last4}
          </p>
        )}
        <button
          onClick={handleSubmit}
          disabled={!parsed || parsed <= 0}
          style={{ width:"100%", padding:"16px 0", borderRadius:16, background: (!parsed||parsed<=0) ? "#D1D5DB" : "linear-gradient(135deg,#5B4FFF,#7C6FFF)", border:"none", color:"white", fontSize:16, fontWeight:700, cursor: (!parsed||parsed<=0) ? "default" : "pointer" }}>
          Add Money
        </button>
      </div>
    </div>
  );
}
