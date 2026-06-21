"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp, type Card } from "@/lib/store";

type Step = "form" | "success";
type Brand = "VISA" | "MC" | "AMEX";
type CardType = "Credit" | "Debit" | "Savings";

const GRADIENTS = [
  { label: "Purple", value: "linear-gradient(135deg,#5B4FFF,#9B8FFF)" },
  { label: "Dark",   value: "linear-gradient(135deg,#374151,#1A1A1A)" },
  { label: "Gold",   value: "linear-gradient(135deg,#F59E0B,#D97706)" },
  { label: "Ocean",  value: "linear-gradient(135deg,#06B6D4,#0284C7)" },
  { label: "Rose",   value: "linear-gradient(135deg,#EC4899,#BE185D)" },
  { label: "Forest", value: "linear-gradient(135deg,#10B981,#047857)" },
];

function formatCardNumber(v: string) {
  return v.replace(/\D/g,"").slice(0,16).replace(/(.{4})/g,"$1 ").trim();
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g,"").slice(0,4);
  return d.length > 2 ? `${d.slice(0,2)}/${d.slice(2)}` : d;
}
function formatCvv(v: string) {
  return v.replace(/\D/g,"").slice(0,4);
}

export default function AddCardPage() {
  const router = useRouter();
  const { dispatch, state } = useApp();
  const { user } = state;

  const [step, setStep] = useState<Step>("form");
  const [brand, setBrand] = useState<Brand>("VISA");
  const [cardType, setCardType] = useState<CardType>("Debit");
  const [number, setNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [holder, setHolder] = useState(`${user.firstName} ${user.lastName}`);
  const [gradient, setGradient] = useState(GRADIENTS[0].value);
  const [flag, setFlag] = useState("🇺🇸");
  const [errors, setErrors] = useState<Record<string,string>>({});

  const FLAGS = ["🇺🇸","🇩🇪","🇬🇧","🇫🇷","🇯🇵","🇨🇦","🇦🇺","🇧🇷"];

  function validate() {
    const e: Record<string,string> = {};
    const raw = number.replace(/\s/g,"");
    if (raw.length < 16) e.number = "Enter 16-digit card number";
    if (!expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = "Use MM/YY format";
    if (cvv.length < 3) e.cvv = "CVS must be 3-4 digits";
    if (!holder.trim()) e.holder = "Cardholder name required";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleAdd() {
    if (!validate()) return;
    const raw = number.replace(/\s/g,"");
    const last4 = raw.slice(-4);
    const newCard: Omit<Card,"id"|"isDefault"> = {
      brand, last4, holder, expiry, balance:0, gradient, flag,
      number: number, cvv, type: cardType,
    };
    dispatch({ type:"ADD_CARD", card: newCard });
    setStep("success");
  }

  const previewNumber = number || "•••• •••• •••• ••••";
  const previewExpiry = expiry || "MM/YY";

  if (step === "success") {
    return (
      <div style={{ maxWidth:430, margin:"0 auto", height:"100dvh", background:"white", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 32px", fontFamily:"var(--font-geist-sans)", gap:24 }}>
        <div style={{ width:96, height:96, borderRadius:48, background:"linear-gradient(135deg,#5B4FFF,#7C6FFF)", display:"flex", alignItems:"center", justifyContent:"center", animation:"fadeInUp 0.4s ease" }}>
          <span style={{ fontSize:44, color:"white" }}>✓</span>
        </div>
        <div style={{ textAlign:"center", animation:"fadeInUp 0.4s ease 0.1s both" }}>
          <h2 style={{ fontSize:24, fontWeight:800, color:"#111827", marginBottom:8 }}>Card Added!</h2>
          <p style={{ fontSize:15, color:"#6B7280" }}>Your {brand} {cardType} card ending in {number.replace(/\s/g,"").slice(-4)} has been added successfully.</p>
        </div>
        <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:12, animation:"fadeInUp 0.4s ease 0.2s both" }}>
          <button onClick={() => router.push("/home")} style={{ width:"100%", padding:"16px 0", borderRadius:16, background:"linear-gradient(135deg,#5B4FFF,#7C6FFF)", border:"none", color:"white", fontSize:16, fontWeight:700, cursor:"pointer" }}>
            Go to Home
          </button>
          <button onClick={() => { setStep("form"); setNumber(""); setExpiry(""); setCvv(""); setErrors({}); }} style={{ width:"100%", padding:"16px 0", borderRadius:16, background:"#F3F4F6", border:"none", color:"#374151", fontSize:16, fontWeight:600, cursor:"pointer" }}>
            Add Another Card
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
          <h1 style={{ fontSize:17, fontWeight:700, color:"#111827" }}>Add New Card</h1>
        </div>
      </div>

      <div style={{ flex:1, overflowY:"auto", padding:"24px 20px", display:"flex", flexDirection:"column", gap:20 }}>
        {/* Card preview */}
        <div style={{ borderRadius:20, padding:"24px", background:gradient, position:"relative", overflow:"hidden", minHeight:160 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
            <span style={{ color:"white", fontSize:14, fontWeight:700 }}>{holder || "Cardholder"}</span>
            <span style={{ fontSize:22 }}>{flag}</span>
          </div>
          <p style={{ color:"rgba(255,255,255,0.7)", fontSize:18, fontWeight:600, letterSpacing:2, marginBottom:12 }}>{previewNumber}</p>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <p style={{ color:"rgba(255,255,255,0.6)", fontSize:10, margin:0 }}>EXPIRES</p>
              <p style={{ color:"white", fontSize:13, fontWeight:600, margin:0 }}>{previewExpiry}</p>
            </div>
            <div style={{ textAlign:"right" }}>
              <p style={{ color:"white", fontSize:12, fontWeight:900, letterSpacing:1.5 }}>{brand}</p>
              <p style={{ color:"rgba(255,255,255,0.7)", fontSize:11, margin:0 }}>{cardType}</p>
            </div>
          </div>
        </div>

        {/* Card type */}
        <div style={{ background:"white", borderRadius:20, padding:"20px" }}>
          <p style={{ fontSize:13, fontWeight:600, color:"#6B7280", marginBottom:12 }}>Card Type</p>
          <div style={{ display:"flex", gap:8 }}>
            {(["Debit","Credit","Savings"] as CardType[]).map(t => (
              <button key={t} onClick={() => setCardType(t)} style={{ flex:1, padding:"10px 0", borderRadius:12, border:`2px solid ${cardType===t?"#5B4FFF":"#E5E7EB"}`, background:cardType===t?"#5B4FFF":"white", color:cardType===t?"white":"#374151", fontSize:13, fontWeight:600, cursor:"pointer" }}>{t}</button>
            ))}
          </div>
        </div>

        {/* Network */}
        <div style={{ background:"white", borderRadius:20, padding:"20px" }}>
          <p style={{ fontSize:13, fontWeight:600, color:"#6B7280", marginBottom:12 }}>Network</p>
          <div style={{ display:"flex", gap:8 }}>
            {(["VISA","MC","AMEX"] as Brand[]).map(b => (
              <button key={b} onClick={() => setBrand(b)} style={{ flex:1, padding:"10px 0", borderRadius:12, border:`2px solid ${brand===b?"#5B4FFF":"#E5E7EB"}`, background:brand===b?"#F0EFFE":"white", color:brand===b?"#5B4FFF":"#374151", fontSize:13, fontWeight:600, cursor:"pointer" }}>{b}</button>
            ))}
          </div>
        </div>

        {/* Card details form */}
        <div style={{ background:"white", borderRadius:20, padding:"20px", display:"flex", flexDirection:"column", gap:16 }}>
          <p style={{ fontSize:13, fontWeight:600, color:"#6B7280", margin:0 }}>Card Details</p>

          {[
            { label:"Card Number", value:number, onChange:(v:string)=>setNumber(formatCardNumber(v)), placeholder:"0000 0000 0000 0000", error:errors.number, inputMode:"numeric" as const },
            { label:"Cardholder Name", value:holder, onChange:(v:string)=>setHolder(v), placeholder:"Full Name", error:errors.holder, inputMode:"text" as const },
          ].map(f => (
            <div key={f.label}>
              <p style={{ fontSize:12, color:"#6B7280", marginBottom:6 }}>{f.label}</p>
              <input
                type="text"
                inputMode={f.inputMode}
                value={f.value}
                onChange={e => f.onChange(e.target.value)}
                placeholder={f.placeholder}
                style={{ width:"100%", padding:"12px 14px", borderRadius:12, border:`1.5px solid ${f.error?"#EF4444":"#E5E7EB"}`, fontSize:15, color:"#111827", outline:"none", boxSizing:"border-box" }}
              />
              {f.error && <p style={{ color:"#EF4444", fontSize:11, marginTop:4 }}>{f.error}</p>}
            </div>
          ))}

          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
            <div>
              <p style={{ fontSize:12, color:"#6B7280", marginBottom:6 }}>Expiry (MM/YY)</p>
              <input type="text" inputMode="numeric" value={expiry} onChange={e=>setExpiry(formatExpiry(e.target.value))} placeholder="MM/YY"
                style={{ width:"100%", padding:"12px 14px", borderRadius:12, border:`1.5px solid ${errors.expiry?"#EF4444":"#E5E7EB"}`, fontSize:15, color:"#111827", outline:"none", boxSizing:"border-box" }} />
              {errors.expiry && <p style={{ color:"#EF4444", fontSize:11, marginTop:4 }}>{errors.expiry}</p>}
            </div>
            <div>
              <p style={{ fontSize:12, color:"#6B7280", marginBottom:6 }}>CVV</p>
              <input type="password" inputMode="numeric" value={cvv} onChange={e=>setCvv(formatCvv(e.target.value))} placeholder="•••"
                style={{ width:"100%", padding:"12px 14px", borderRadius:12, border:`1.5px solid ${errors.cvv?"#EF4444":"#E5E7EB"}`, fontSize:15, color:"#111827", outline:"none", boxSizing:"border-box" }} />
              {errors.cvv && <p style={{ color:"#EF4444", fontSize:11, marginTop:4 }}>{errors.cvv}</p>}
            </div>
          </div>
        </div>

        {/* Color */}
        <div style={{ background:"white", borderRadius:20, padding:"20px" }}>
          <p style={{ fontSize:13, fontWeight:600, color:"#6B7280", marginBottom:12 }}>Card Color</p>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {GRADIENTS.map(g => (
              <button key={g.value} onClick={() => setGradient(g.value)} style={{
                width:40, height:40, borderRadius:20, background:g.value, border: gradient===g.value ? "3px solid #5B4FFF" : "3px solid transparent",
                cursor:"pointer", padding:0,
              }} />
            ))}
          </div>
        </div>

        {/* Flag */}
        <div style={{ background:"white", borderRadius:20, padding:"20px" }}>
          <p style={{ fontSize:13, fontWeight:600, color:"#6B7280", marginBottom:12 }}>Country Flag</p>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap" }}>
            {FLAGS.map(f => (
              <button key={f} onClick={() => setFlag(f)} style={{ width:40, height:40, borderRadius:20, border:`2px solid ${flag===f?"#5B4FFF":"#E5E7EB"}`, background:flag===f?"#F0EFFE":"white", fontSize:20, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding:"16px 20px 32px", background:"white", borderTop:"1px solid #F3F4F6" }}>
        <button onClick={handleAdd} style={{ width:"100%", padding:"16px 0", borderRadius:16, background:"linear-gradient(135deg,#5B4FFF,#7C6FFF)", border:"none", color:"white", fontSize:16, fontWeight:700, cursor:"pointer" }}>
          Add Card
        </button>
      </div>
    </div>
  );
}
