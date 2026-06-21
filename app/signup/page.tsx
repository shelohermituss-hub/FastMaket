"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ─── Types ───────────────────────────────────────────────────────────────────
type Step =
  | "landing"        // 1  - SSO / méthode d'inscription
  | "phone"          // 2  - Numéro de téléphone
  | "otp"            // 3  - Code OTP
  | "email"          // 4  - Adresse email
  | "name"           // 5  - Prénom / Nom
  | "dob"            // 6  - Date de naissance
  | "gender"         // 7  - Genre
  | "address"        // 8  - Adresse
  | "city"           // 9  - Ville / Code postal
  | "country"        // 10 - Pays de résidence
  | "nationality"    // 11 - Nationalité
  | "occupation"     // 12 - Profession
  | "income"         // 13 - Source de revenus
  | "id-type"        // 14 - Type de document d'identité
  | "id-front"       // 15 - Photo recto ID
  | "id-back"        // 16 - Photo verso ID
  | "selfie-intro"   // 17 - Introduction selfie
  | "selfie"         // 18 - Selfie / Face scan
  | "review"         // 19 - Récapitulatif KYC
  | "kyc-pending"    // 20 - Vérification en cours
  | "pin-intro"      // 21 - Introduction PIN
  | "pin-create"     // 22 - Créer PIN
  | "pin-confirm"    // 23 - Confirmer PIN
  | "biometric"      // 24 - Activer Face ID / Empreinte
  | "notifications"  // 25 - Autorisations notifications
  | "avatar"         // 26 - Photo de profil
  | "username"       // 27 - Nom d'utilisateur
  | "referral"       // 28 - Code de parrainage
  | "terms"          // 29 - CGU / Politique de confidentialité
  | "success";       // 30 - Compte créé !

interface FormData {
  phone: string;
  email: string;
  firstName: string;
  lastName: string;
  day: string; month: string; year: string;
  gender: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  nationality: string;
  occupation: string;
  income: string;
  idType: string;
  pin: string;
  username: string;
  referral: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function BackBtn({ onClick }: { onClick: () => void }) {
  return (
    <button onClick={onClick} style={{
      width: 40, height: 40, borderRadius: 20, border: "1.5px solid #E5E7EB",
      background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M19 12H5M12 19l-7-7 7-7" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </button>
  );
}

function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div style={{ height: 4, background: "#F3F4F6", borderRadius: 2, overflow: "hidden" }}>
      <div style={{
        height: "100%", borderRadius: 2,
        background: "linear-gradient(90deg, #5B4FFF, #7C6FFF)",
        width: `${(current / total) * 100}%`,
        transition: "width 0.4s ease",
      }} />
    </div>
  );
}

function Header({ step, total, label, onBack, onSkip }: { step: number; total: number; label: string; onBack: () => void; onSkip?: () => void }) {
  return (
    <div style={{ padding: "20px 24px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: onSkip ? 10 : 16 }}>
        <BackBtn onClick={onBack} />
        <div style={{ flex: 1 }}>
          <ProgressBar current={step} total={total} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", minWidth: 36, textAlign: "right" }}>{step}/{total}</span>
      </div>
      {onSkip && (
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 6 }}>
          <button onClick={onSkip} style={{
            border: "none", background: "none", cursor: "pointer", padding: "4px 0",
            fontSize: 13, fontWeight: 700, color: "#9CA3AF",
            display: "flex", alignItems: "center", gap: 4,
          }}>
            Skip to dashboard
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M5 12h14M12 5l7 7-7 7" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      )}
      <p style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1 }}>{label}</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#374151", display: "block", marginBottom: 8 }}>{label}</label>
      {children}
    </div>
  );
}

function TextInput({ placeholder, value, onChange, type = "text" }: { placeholder: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={{
        width: "100%", height: 54, borderRadius: 14, border: "1.5px solid #E5E7EB",
        padding: "0 16px", fontSize: 15, color: "#0a0a0a", outline: "none", background: "white",
        boxSizing: "border-box",
      }}
    />
  );
}

function PrimaryBtn({ label, onClick, disabled = false }: { label: string; onClick: () => void; disabled?: boolean }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      width: "100%", height: 56, borderRadius: 28, border: "none",
      background: disabled ? "#E5E7EB" : "linear-gradient(135deg, #5B4FFF 0%, #7C6FFF 100%)",
      color: disabled ? "#9CA3AF" : "white",
      fontSize: 16, fontWeight: 700, cursor: disabled ? "default" : "pointer",
      boxShadow: disabled ? "none" : "0 8px 24px rgba(91,79,255,0.35)",
      transition: "all 0.2s ease",
    }}>{label}</button>
  );
}

function ChoiceGrid({ options, selected, onSelect }: { options: { icon: string; label: string; value: string }[]; selected: string; onSelect: (v: string) => void }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {options.map((o) => (
        <button key={o.value} onClick={() => onSelect(o.value)} style={{
          height: 80, borderRadius: 16, border: `2px solid ${selected === o.value ? "#5B4FFF" : "#E5E7EB"}`,
          background: selected === o.value ? "#F0EFFF" : "white",
          cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6,
          transition: "all 0.15s ease",
        }}>
          <span style={{ fontSize: 28 }}>{o.icon}</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: selected === o.value ? "#5B4FFF" : "#374151" }}>{o.label}</span>
        </button>
      ))}
    </div>
  );
}

const KEYBOARD_ROWS = [["1","2","3"],["4","5","6"],["7","8","9"],["*","0","⌫"]];

// ─── SCREEN 1: Landing ────────────────────────────────────────────────────────
function S01_Landing({ onPhone, onGoogle, onApple }: { onPhone: () => void; onGoogle: () => void; onApple: () => void }) {
  return (
    <div style={{ width:"100%", height:"100%", background:"white", display:"flex", flexDirection:"column", animation:"slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      {/* Hero */}
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 28px" }}>
        <div style={{
          width:100, height:100, borderRadius:30,
          background:"linear-gradient(135deg, #5B4FFF, #7C6FFF)",
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:"0 20px 60px rgba(91,79,255,0.35)", marginBottom:32,
          animation:"floatY 3s ease-in-out infinite",
        }}>
          <span style={{ fontSize:48, fontWeight:900, color:"white", fontStyle:"italic", letterSpacing:1 }}>F</span>
        </div>
        <h1 style={{ fontSize:32, fontWeight:900, color:"#0a0a0a", textAlign:"center", marginBottom:10, lineHeight:1.2 }}>
          Create your<br />FIN CORE account
        </h1>
        <p style={{ fontSize:14, color:"#9CA3AF", textAlign:"center", lineHeight:1.6 }}>
          Join millions managing money smarter every day
        </p>
      </div>

      {/* Actions */}
      <div style={{ padding:"0 24px 40px", display:"flex", flexDirection:"column", gap:12 }}>
        <button onClick={onGoogle} style={{
          width:"100%", height:52, borderRadius:28, border:"1.5px solid #E5E7EB",
          background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10,
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          <span style={{ fontSize:15, fontWeight:600, color:"#374151" }}>Continue with Google</span>
        </button>
        <button onClick={onApple} style={{
          width:"100%", height:52, borderRadius:28, border:"none",
          background:"#0a0a0a", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:10,
        }}>
          <svg width="18" height="22" viewBox="0 0 18 22" fill="white"><path d="M14.94 11.46a4.57 4.57 0 0 1 2.17-3.84 4.68 4.68 0 0 0-3.69-2c-1.55-.16-3.05.93-3.84.93-.8 0-2-.91-3.3-.88a4.91 4.91 0 0 0-4.13 2.52C.24 11.21 1.5 15.82 3.21 18.35c.87 1.24 1.88 2.62 3.21 2.57 1.3-.05 1.78-.83 3.35-.83 1.56 0 2 .83 3.36.8 1.39-.02 2.27-1.24 3.11-2.5a10.13 10.13 0 0 0 1.42-2.88 4.42 4.42 0 0 1-2.72-4.05zM12.33 3.9A4.5 4.5 0 0 0 13.37 1a4.58 4.58 0 0 0-2.96 1.53 4.28 4.28 0 0 0-1.06 3.1 3.79 3.79 0 0 0 2.98-1.73z"/></svg>
          <span style={{ fontSize:15, fontWeight:600, color:"white" }}>Continue with Apple</span>
        </button>
        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          <div style={{ flex:1, height:1, background:"#E5E7EB" }} />
          <span style={{ fontSize:13, color:"#9CA3AF" }}>or</span>
          <div style={{ flex:1, height:1, background:"#E5E7EB" }} />
        </div>
        <button onClick={onPhone} style={{
          width:"100%", height:52, borderRadius:28, border:"none",
          background:"linear-gradient(135deg,#5B4FFF,#7C6FFF)", color:"white",
          fontSize:15, fontWeight:700, cursor:"pointer",
          boxShadow:"0 8px 24px rgba(91,79,255,0.35)",
        }}>Sign up with phone number</button>
        <p style={{ textAlign:"center", fontSize:14, color:"#9CA3AF", marginTop:4 }}>
          Already have an account?{" "}
          <a href="/login" style={{ color:"#5B4FFF", fontWeight:700, textDecoration:"none" }}>Log in</a>
        </p>
      </div>
    </div>
  );
}

// ─── SCREEN 2: Phone ──────────────────────────────────────────────────────────
function S02_Phone({ onBack, onNext }: { onBack:()=>void; onNext:(p:string)=>void }) {
  const [phone, setPhone] = useState("");
  const COUNTRIES = [
    { code:"+1", flag:"🇺🇸", name:"United States" },
    { code:"+44", flag:"🇬🇧", name:"United Kingdom" },
    { code:"+33", flag:"🇫🇷", name:"France" },
    { code:"+49", flag:"🇩🇪", name:"Germany" },
    { code:"+43", flag:"🇦🇹", name:"Austria" },
    { code:"+212", flag:"🇲🇦", name:"Morocco" },
    { code:"+221", flag:"🇸🇳", name:"Senegal" },
  ];
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [showDrop, setShowDrop] = useState(false);

  return (
    <div style={{ width:"100%", height:"100%", background:"white", display:"flex", flexDirection:"column", animation:"slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <Header step={2} total={30} label="Account" onBack={onBack} />
      <div style={{ padding:"8px 28px 28px" }}>
        <h1 style={{ fontSize:26, fontWeight:900, color:"#0a0a0a", marginBottom:6 }}>Your phone number</h1>
        <p style={{ fontSize:14, color:"#9CA3AF", marginBottom:28 }}>We'll send a verification code</p>
        <Field label="Phone number">
          <div style={{ display:"flex", border:"1.5px solid #E5E7EB", borderRadius:14, overflow:"hidden" }}>
            <button onClick={() => setShowDrop(!showDrop)} style={{
              display:"flex", alignItems:"center", gap:6, padding:"0 14px", height:54,
              border:"none", borderRight:"1.5px solid #E5E7EB", background:"#F9FAFB", cursor:"pointer",
            }}>
              <span style={{ fontSize:20 }}>{country.flag}</span>
              <span style={{ fontSize:14, fontWeight:600, color:"#374151" }}>{country.code}</span>
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1l5 5 5-5" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round"/></svg>
            </button>
            <input type="tel" value={phone} onChange={(e)=>setPhone(e.target.value.replace(/\D/g,""))} placeholder="Phone number"
              style={{ flex:1, height:54, border:"none", outline:"none", padding:"0 14px", fontSize:15, color:"#0a0a0a", background:"transparent" }}/>
            {phone.length > 0 && (
              <button onClick={()=>setPhone("")} style={{ padding:"0 12px", border:"none", background:"none", cursor:"pointer" }}>
                <div style={{ width:22, height:22, borderRadius:11, background:"#E5E7EB", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M1 1l10 10M11 1L1 11" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round"/></svg>
                </div>
              </button>
            )}
          </div>
          {showDrop && (
            <div style={{ marginTop:4, border:"1.5px solid #E5E7EB", borderRadius:12, background:"white", boxShadow:"0 8px 24px rgba(0,0,0,0.1)", overflow:"hidden" }}>
              {COUNTRIES.map(c=>(
                <button key={c.code} onClick={()=>{setCountry(c);setShowDrop(false);}} style={{
                  width:"100%", padding:"13px 16px", border:"none", background:c.code===country.code?"#F0EFFF":"white",
                  cursor:"pointer", display:"flex", alignItems:"center", gap:12, textAlign:"left",
                }}>
                  <span style={{ fontSize:20 }}>{c.flag}</span>
                  <span style={{ fontSize:14, fontWeight:600, color:"#374151" }}>{c.name}</span>
                  <span style={{ fontSize:13, color:"#9CA3AF", marginLeft:"auto" }}>{c.code}</span>
                </button>
              ))}
            </div>
          )}
        </Field>
      </div>
      <div style={{ flex:1 }} />
      <div style={{ padding:"0 24px 40px" }}>
        <PrimaryBtn label="Send Code" onClick={()=>phone.length>=6&&onNext(`${country.code}${phone}`)} disabled={phone.length<6}/>
      </div>
    </div>
  );
}

// ─── SCREEN 3: OTP ────────────────────────────────────────────────────────────
function S03_OTP({ phone, onBack, onNext }: { phone:string; onBack:()=>void; onNext:()=>void }) {
  const [otp, setOtp] = useState("");
  const LEN = 6;
  function handleKey(k:string) {
    if(k==="⌫") setOtp(p=>p.slice(0,-1));
    else if(k!=="*" && otp.length<LEN){ const n=otp+k; setOtp(n); if(n.length===LEN) setTimeout(onNext,400); }
  }
  return (
    <div style={{ width:"100%", height:"100%", background:"white", display:"flex", flexDirection:"column", animation:"slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <Header step={3} total={30} label="Verification" onBack={onBack} />
      <div style={{ padding:"8px 28px 0" }}>
        <h1 style={{ fontSize:26, fontWeight:900, color:"#0a0a0a", marginBottom:6 }}>Enter the code</h1>
        <p style={{ fontSize:14, color:"#9CA3AF" }}>Sent to <b style={{ color:"#0a0a0a" }}>{phone}</b></p>
      </div>
      <div style={{ padding:"32px 28px", display:"flex", gap:10, justifyContent:"center" }}>
        {Array.from({length:LEN}).map((_,i)=>(
          <div key={i} style={{
            width:46, height:54, borderRadius:14,
            border:`${i<=otp.length?"2":"1.5"}px solid ${i<=otp.length?"#5B4FFF":"#E5E7EB"}`,
            background:i<otp.length?"#F0EFFF":"white",
            display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s",
          }}>
            {i<otp.length&&<div style={{ width:10, height:10, borderRadius:5, background:"#5B4FFF" }}/>}
          </div>
        ))}
      </div>
      <p style={{ textAlign:"center", fontSize:13, color:"#9CA3AF" }}>
        Didn't receive?{" "}
        <button style={{ border:"none", background:"none", color:"#5B4FFF", fontWeight:700, fontSize:13, cursor:"pointer" }}>Resend</button>
      </p>
      <div style={{ flex:1 }} />
      <div style={{ padding:"0 24px 16px" }}>
        <PrimaryBtn label="Verify" onClick={onNext} disabled={otp.length<LEN}/>
      </div>
      <div style={{ background:"#D1D5DB", padding:"12px 4px 8px", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1 }}>
        {KEYBOARD_ROWS.flat().map(k=>(
          <button key={k} onClick={()=>handleKey(k)} style={{
            height:56, border:"none", cursor:"pointer",
            background:k==="*"||k==="⌫"?"#ADB5BD":"white",
            fontSize:k==="⌫"?18:22, color:"#0a0a0a",
            display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:2,
          }}>
            {k==="⌫"?(
              <svg width="22" height="16" viewBox="0 0 24 18" fill="none"><path d="M9 1H22a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H9l-8-8 8-8z" stroke="#0a0a0a" strokeWidth="1.5" strokeLinejoin="round"/><path d="M15 6l-4 6M11 6l4 6" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round"/></svg>
            ):k!=="*"?(
              <>
                <span style={{ lineHeight:1 }}>{k}</span>
                <span style={{ fontSize:9, color:"#6B7280", letterSpacing:1, fontWeight:500 }}>
                  {({"2":"ABC","3":"DEF","4":"GHI","5":"JKL","6":"MNO","7":"PQRS","8":"TUV","9":"WXYZ"} as Record<string,string>)[k]||""}
                </span>
              </>
            ):null}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── SCREEN 4: Email ──────────────────────────────────────────────────────────
function S04_Email({ data, onBack, onNext }: { data:FormData; onBack:()=>void; onNext:(v:string)=>void }) {
  const [email, setEmail] = useState(data.email);
  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return (
    <div style={{ width:"100%", height:"100%", background:"white", display:"flex", flexDirection:"column", animation:"slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <Header step={4} total={30} label="Account" onBack={onBack} />
      <div style={{ padding:"8px 28px 28px" }}>
        <h1 style={{ fontSize:26, fontWeight:900, color:"#0a0a0a", marginBottom:6 }}>Your email address</h1>
        <p style={{ fontSize:14, color:"#9CA3AF", marginBottom:28 }}>For account security and receipts</p>
        <Field label="Email address">
          <TextInput placeholder="you@example.com" value={email} onChange={setEmail} type="email"/>
          {email.length>0 && !valid && <p style={{ fontSize:12, color:"#EF4444", marginTop:6 }}>Please enter a valid email</p>}
        </Field>
      </div>
      <div style={{ flex:1 }} />
      <div style={{ padding:"0 24px 40px" }}><PrimaryBtn label="Continue" onClick={()=>onNext(email)} disabled={!valid}/></div>
    </div>
  );
}

// ─── SCREEN 5: Name ───────────────────────────────────────────────────────────
function S05_Name({ data, onBack, onNext }: { data:FormData; onBack:()=>void; onNext:(f:string,l:string)=>void }) {
  const [first, setFirst] = useState(data.firstName);
  const [last, setLast] = useState(data.lastName);
  return (
    <div style={{ width:"100%", height:"100%", background:"white", display:"flex", flexDirection:"column", animation:"slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <Header step={5} total={30} label="Personal Info" onBack={onBack} />
      <div style={{ padding:"8px 28px 28px", display:"flex", flexDirection:"column", gap:16 }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:900, color:"#0a0a0a", marginBottom:6 }}>What&apos;s your name?</h1>
          <p style={{ fontSize:14, color:"#9CA3AF", marginBottom:24 }}>As it appears on your official ID</p>
        </div>
        <Field label="First name"><TextInput placeholder="First name" value={first} onChange={setFirst}/></Field>
        <Field label="Last name"><TextInput placeholder="Last name" value={last} onChange={setLast}/></Field>
      </div>
      <div style={{ flex:1 }} />
      <div style={{ padding:"0 24px 40px" }}><PrimaryBtn label="Continue" onClick={()=>onNext(first,last)} disabled={first.length<2||last.length<2}/></div>
    </div>
  );
}

// ─── SCREEN 6: Date of Birth ──────────────────────────────────────────────────
function S06_DOB({ data, onBack, onNext }: { data:FormData; onBack:()=>void; onNext:(d:string,m:string,y:string)=>void }) {
  const [day,setDay]=useState(data.day);
  const [month,setMonth]=useState(data.month);
  const [year,setYear]=useState(data.year);
  const valid = day&&month&&year&&parseInt(year)>=1900&&parseInt(year)<=2006;
  const MONTHS=["January","February","March","April","May","June","July","August","September","October","November","December"];
  return (
    <div style={{ width:"100%", height:"100%", background:"white", display:"flex", flexDirection:"column", animation:"slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <Header step={6} total={30} label="Personal Info" onBack={onBack} />
      <div style={{ padding:"8px 28px 28px" }}>
        <h1 style={{ fontSize:26, fontWeight:900, color:"#0a0a0a", marginBottom:6 }}>Date of birth</h1>
        <p style={{ fontSize:14, color:"#9CA3AF", marginBottom:28 }}>You must be 18+ to use FIN CORE</p>
        <div style={{ display:"flex", gap:10 }}>
          <div style={{ width:70 }}>
            <Field label="Day">
              <input type="number" min="1" max="31" value={day} onChange={e=>setDay(e.target.value)} placeholder="DD"
                style={{ width:"100%", height:54, borderRadius:14, border:"1.5px solid #E5E7EB", padding:"0 12px", fontSize:16, fontWeight:600, outline:"none", background:"white", boxSizing:"border-box" }}/>
            </Field>
          </div>
          <div style={{ flex:1 }}>
            <Field label="Month">
              <select value={month} onChange={e=>setMonth(e.target.value)}
                style={{ width:"100%", height:54, borderRadius:14, border:"1.5px solid #E5E7EB", padding:"0 12px", fontSize:14, outline:"none", background:"white", appearance:"none", boxSizing:"border-box" }}>
                <option value="">Month</option>
                {MONTHS.map((m,i)=><option key={m} value={String(i+1)}>{m}</option>)}
              </select>
            </Field>
          </div>
          <div style={{ width:80 }}>
            <Field label="Year">
              <input type="number" min="1900" max="2006" value={year} onChange={e=>setYear(e.target.value)} placeholder="YYYY"
                style={{ width:"100%", height:54, borderRadius:14, border:"1.5px solid #E5E7EB", padding:"0 10px", fontSize:15, fontWeight:600, outline:"none", background:"white", boxSizing:"border-box" }}/>
            </Field>
          </div>
        </div>
      </div>
      <div style={{ flex:1 }} />
      <div style={{ padding:"0 24px 40px" }}><PrimaryBtn label="Continue" onClick={()=>onNext(day,month,year)} disabled={!valid}/></div>
    </div>
  );
}

// ─── SCREEN 7: Gender ─────────────────────────────────────────────────────────
function S07_Gender({ data, onBack, onNext }: { data:FormData; onBack:()=>void; onNext:(g:string)=>void }) {
  const [sel, setSel]=useState(data.gender);
  const opts=[{icon:"👨",label:"Male",value:"male"},{icon:"👩",label:"Female",value:"female"},{icon:"🧑",label:"Non-binary",value:"nonbinary"},{icon:"🤐",label:"Prefer not to say",value:"undisclosed"}];
  return (
    <div style={{ width:"100%", height:"100%", background:"white", display:"flex", flexDirection:"column", animation:"slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <Header step={7} total={30} label="Personal Info" onBack={onBack} />
      <div style={{ padding:"8px 28px 28px" }}>
        <h1 style={{ fontSize:26, fontWeight:900, color:"#0a0a0a", marginBottom:6 }}>Your gender</h1>
        <p style={{ fontSize:14, color:"#9CA3AF", marginBottom:28 }}>For regulatory purposes</p>
        <ChoiceGrid options={opts} selected={sel} onSelect={setSel}/>
      </div>
      <div style={{ flex:1 }} />
      <div style={{ padding:"0 24px 40px" }}><PrimaryBtn label="Continue" onClick={()=>onNext(sel)} disabled={!sel}/></div>
    </div>
  );
}

// ─── SCREEN 8: Address ────────────────────────────────────────────────────────
function S08_Address({ data, onBack, onNext, onSkip }: { data:FormData; onBack:()=>void; onNext:(v:string)=>void; onSkip?:()=>void }) {
  const [address, setAddress]=useState(data.address);
  return (
    <div style={{ width:"100%", height:"100%", background:"white", display:"flex", flexDirection:"column", animation:"slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <Header step={8} total={30} label="Address" onBack={onBack} onSkip={onSkip} />
      <div style={{ padding:"8px 28px 28px" }}>
        <h1 style={{ fontSize:26, fontWeight:900, color:"#0a0a0a", marginBottom:6 }}>Street address</h1>
        <p style={{ fontSize:14, color:"#9CA3AF", marginBottom:28 }}>Your current residential address</p>
        <Field label="Address line">
          <textarea value={address} onChange={e=>setAddress(e.target.value)} placeholder="123 Main Street, Apt 4B"
            style={{ width:"100%", height:100, borderRadius:14, border:"1.5px solid #E5E7EB", padding:"14px 16px", fontSize:15, color:"#0a0a0a", outline:"none", resize:"none", fontFamily:"inherit", background:"white", boxSizing:"border-box" }}/>
        </Field>
      </div>
      <div style={{ flex:1 }} />
      <div style={{ padding:"0 24px 40px" }}><PrimaryBtn label="Continue" onClick={()=>onNext(address)} disabled={address.length<5}/></div>
    </div>
  );
}

// ─── SCREEN 9: City / Postal ──────────────────────────────────────────────────
function S09_City({ data, onBack, onNext, onSkip }: { data:FormData; onBack:()=>void; onNext:(c:string,p:string)=>void; onSkip?:()=>void }) {
  const [city,setCity]=useState(data.city);
  const [postal,setPostal]=useState(data.postalCode);
  return (
    <div style={{ width:"100%", height:"100%", background:"white", display:"flex", flexDirection:"column", animation:"slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <Header step={9} total={30} label="Address" onBack={onBack} onSkip={onSkip} />
      <div style={{ padding:"8px 28px 28px", display:"flex", flexDirection:"column", gap:16 }}>
        <div>
          <h1 style={{ fontSize:26, fontWeight:900, color:"#0a0a0a", marginBottom:6 }}>City & postal code</h1>
          <p style={{ fontSize:14, color:"#9CA3AF", marginBottom:24 }}>Where you live</p>
        </div>
        <Field label="City"><TextInput placeholder="New York" value={city} onChange={setCity}/></Field>
        <Field label="Postal / ZIP code"><TextInput placeholder="10001" value={postal} onChange={setPostal}/></Field>
      </div>
      <div style={{ flex:1 }} />
      <div style={{ padding:"0 24px 40px" }}><PrimaryBtn label="Continue" onClick={()=>onNext(city,postal)} disabled={city.length<2||postal.length<3}/></div>
    </div>
  );
}

// ─── SCREEN 10: Country ───────────────────────────────────────────────────────
function S10_Country({ data, onBack, onNext, onSkip }: { data:FormData; onBack:()=>void; onNext:(v:string)=>void; onSkip?:()=>void }) {
  const [sel,setSel]=useState(data.country);
  const COUNTRIES=[
    {flag:"🇺🇸",name:"United States"},{flag:"🇬🇧",name:"United Kingdom"},{flag:"🇫🇷",name:"France"},
    {flag:"🇩🇪",name:"Germany"},{flag:"🇨🇦",name:"Canada"},{flag:"🇦🇺",name:"Australia"},
    {flag:"🇲🇦",name:"Morocco"},{flag:"🇸🇳",name:"Senegal"},{flag:"🇨🇮",name:"Côte d'Ivoire"},
    {flag:"🇧🇷",name:"Brazil"},{flag:"🇮🇳",name:"India"},{flag:"🇨🇳",name:"China"},
  ];
  return (
    <div style={{ width:"100%", height:"100%", background:"white", display:"flex", flexDirection:"column", animation:"slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <Header step={10} total={30} label="Address" onBack={onBack} onSkip={onSkip} />
      <div style={{ padding:"8px 28px 16px" }}>
        <h1 style={{ fontSize:26, fontWeight:900, color:"#0a0a0a", marginBottom:6 }}>Country of residence</h1>
        <p style={{ fontSize:14, color:"#9CA3AF", marginBottom:20 }}>Where you currently live</p>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"0 24px" }}>
        {COUNTRIES.map(c=>(
          <button key={c.name} onClick={()=>setSel(c.name)} style={{
            width:"100%", padding:"14px 16px", borderRadius:14, border:`1.5px solid ${sel===c.name?"#5B4FFF":"#E5E7EB"}`,
            background:sel===c.name?"#F0EFFF":"white", cursor:"pointer",
            display:"flex", alignItems:"center", gap:14, marginBottom:10, textAlign:"left",
          }}>
            <span style={{ fontSize:24 }}>{c.flag}</span>
            <span style={{ fontSize:15, fontWeight:600, color:sel===c.name?"#5B4FFF":"#0a0a0a" }}>{c.name}</span>
            {sel===c.name&&<svg style={{ marginLeft:"auto" }} width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#5B4FFF"/><path d="M8 12l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </button>
        ))}
      </div>
      <div style={{ padding:"16px 24px 40px" }}><PrimaryBtn label="Continue" onClick={()=>onNext(sel)} disabled={!sel}/></div>
    </div>
  );
}

// ─── SCREEN 11: Nationality ───────────────────────────────────────────────────
function S11_Nationality({ data, onBack, onNext, onSkip }: { data:FormData; onBack:()=>void; onNext:(v:string)=>void; onSkip?:()=>void }) {
  const [sel,setSel]=useState(data.nationality);
  const LIST=[
    {flag:"🇺🇸",name:"American"},{flag:"🇬🇧",name:"British"},{flag:"🇫🇷",name:"French"},
    {flag:"🇩🇪",name:"German"},{flag:"🇨🇦",name:"Canadian"},{flag:"🇦🇺",name:"Australian"},
    {flag:"🇲🇦",name:"Moroccan"},{flag:"🇸🇳",name:"Senegalese"},{flag:"🇧🇷",name:"Brazilian"},
    {flag:"🇮🇳",name:"Indian"},{flag:"🇨🇳",name:"Chinese"},{flag:"🇲🇽",name:"Mexican"},
  ];
  return (
    <div style={{ width:"100%", height:"100%", background:"white", display:"flex", flexDirection:"column", animation:"slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <Header step={11} total={30} label="Identity" onBack={onBack} onSkip={onSkip} />
      <div style={{ padding:"8px 28px 16px" }}>
        <h1 style={{ fontSize:26, fontWeight:900, color:"#0a0a0a", marginBottom:6 }}>Nationality</h1>
        <p style={{ fontSize:14, color:"#9CA3AF", marginBottom:20 }}>Your citizenship</p>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"0 24px" }}>
        {LIST.map(c=>(
          <button key={c.name} onClick={()=>setSel(c.name)} style={{
            width:"100%", padding:"14px 16px", borderRadius:14, border:`1.5px solid ${sel===c.name?"#5B4FFF":"#E5E7EB"}`,
            background:sel===c.name?"#F0EFFF":"white", cursor:"pointer",
            display:"flex", alignItems:"center", gap:14, marginBottom:10, textAlign:"left",
          }}>
            <span style={{ fontSize:24 }}>{c.flag}</span>
            <span style={{ fontSize:15, fontWeight:600, color:sel===c.name?"#5B4FFF":"#0a0a0a" }}>{c.name}</span>
            {sel===c.name&&<svg style={{ marginLeft:"auto" }} width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#5B4FFF"/><path d="M8 12l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
          </button>
        ))}
      </div>
      <div style={{ padding:"16px 24px 40px" }}><PrimaryBtn label="Continue" onClick={()=>onNext(sel)} disabled={!sel}/></div>
    </div>
  );
}

// ─── SCREEN 12: Occupation ────────────────────────────────────────────────────
function S12_Occupation({ data, onBack, onNext, onSkip }: { data:FormData; onBack:()=>void; onNext:(v:string)=>void; onSkip?:()=>void }) {
  const [sel,setSel]=useState(data.occupation);
  const opts=[
    {icon:"💼",label:"Employed",value:"employed"},{icon:"🏢",label:"Self-employed",value:"self-employed"},
    {icon:"🎓",label:"Student",value:"student"},{icon:"🏠",label:"Retired",value:"retired"},
    {icon:"🔍",label:"Job seeking",value:"unemployed"},{icon:"🌐",label:"Other",value:"other"},
  ];
  return (
    <div style={{ width:"100%", height:"100%", background:"white", display:"flex", flexDirection:"column", animation:"slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <Header step={12} total={30} label="Financial Profile" onBack={onBack} onSkip={onSkip} />
      <div style={{ padding:"8px 28px 28px" }}>
        <h1 style={{ fontSize:26, fontWeight:900, color:"#0a0a0a", marginBottom:6 }}>Employment status</h1>
        <p style={{ fontSize:14, color:"#9CA3AF", marginBottom:28 }}>Required for compliance</p>
        <ChoiceGrid options={opts} selected={sel} onSelect={setSel}/>
      </div>
      <div style={{ flex:1 }} />
      <div style={{ padding:"0 24px 40px" }}><PrimaryBtn label="Continue" onClick={()=>onNext(sel)} disabled={!sel}/></div>
    </div>
  );
}

// ─── SCREEN 13: Income source ─────────────────────────────────────────────────
function S13_Income({ data, onBack, onNext, onSkip }: { data:FormData; onBack:()=>void; onNext:(v:string)=>void; onSkip?:()=>void }) {
  const [sel,setSel]=useState(data.income);
  const opts=[
    {icon:"💰",label:"Salary",value:"salary"},{icon:"📈",label:"Investments",value:"investments"},
    {icon:"🏡",label:"Rental income",value:"rental"},{icon:"🎁",label:"Family / gifts",value:"family"},
    {icon:"🛒",label:"Business",value:"business"},{icon:"🌐",label:"Other",value:"other"},
  ];
  return (
    <div style={{ width:"100%", height:"100%", background:"white", display:"flex", flexDirection:"column", animation:"slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <Header step={13} total={30} label="Financial Profile" onBack={onBack} onSkip={onSkip} />
      <div style={{ padding:"8px 28px 28px" }}>
        <h1 style={{ fontSize:26, fontWeight:900, color:"#0a0a0a", marginBottom:6 }}>Source of income</h1>
        <p style={{ fontSize:14, color:"#9CA3AF", marginBottom:28 }}>Primary source of your funds</p>
        <ChoiceGrid options={opts} selected={sel} onSelect={setSel}/>
      </div>
      <div style={{ flex:1 }} />
      <div style={{ padding:"0 24px 40px" }}><PrimaryBtn label="Continue" onClick={()=>onNext(sel)} disabled={!sel}/></div>
    </div>
  );
}

// ─── SCREEN 14: ID Type ───────────────────────────────────────────────────────
function S14_IDType({ data, onBack, onNext, onSkip }: { data:FormData; onBack:()=>void; onNext:(v:string)=>void; onSkip?:()=>void }) {
  const [sel,setSel]=useState(data.idType);
  const opts=[
    {icon:"📘",label:"Passport",value:"passport"},{icon:"🪪",label:"National ID",value:"national-id"},
    {icon:"🚗",label:"Driver's license",value:"drivers-license"},{icon:"📄",label:"Residence permit",value:"residence"},
  ];
  return (
    <div style={{ width:"100%", height:"100%", background:"white", display:"flex", flexDirection:"column", animation:"slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <Header step={14} total={30} label="Identity Verification" onBack={onBack} onSkip={onSkip} />
      <div style={{ padding:"8px 28px 28px" }}>
        <h1 style={{ fontSize:26, fontWeight:900, color:"#0a0a0a", marginBottom:6 }}>Choose your ID type</h1>
        <p style={{ fontSize:14, color:"#9CA3AF", marginBottom:28 }}>Select the document you&apos;ll use to verify your identity</p>
        <ChoiceGrid options={opts} selected={sel} onSelect={setSel}/>
        <div style={{ marginTop:20, padding:"14px 16px", borderRadius:14, background:"#FFF7ED", border:"1.5px solid #FED7AA" }}>
          <p style={{ fontSize:12, color:"#92400E", lineHeight:1.5 }}>
            📋 Make sure your document is valid, not expired, and clearly readable.
          </p>
        </div>
      </div>
      <div style={{ flex:1 }} />
      <div style={{ padding:"0 24px 40px" }}><PrimaryBtn label="Continue" onClick={()=>onNext(sel)} disabled={!sel}/></div>
    </div>
  );
}

// ─── SCREEN 15: ID Front ─────────────────────────────────────────────────────
function S15_IDFront({ onBack, onNext, onSkip }: { onBack:()=>void; onNext:()=>void; onSkip?:()=>void }) {
  const [captured, setCaptured]=useState(false);
  return (
    <div style={{ width:"100%", height:"100%", background:"white", display:"flex", flexDirection:"column", animation:"slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <Header step={15} total={30} label="Identity Verification" onBack={onBack} onSkip={onSkip} />
      <div style={{ padding:"8px 28px 0" }}>
        <h1 style={{ fontSize:26, fontWeight:900, color:"#0a0a0a", marginBottom:6 }}>Front of your ID</h1>
        <p style={{ fontSize:14, color:"#9CA3AF" }}>Take a clear photo of the front side</p>
      </div>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"24px 28px" }}>
        <button onClick={()=>setCaptured(true)} style={{
          width:"100%", maxWidth:320, aspectRatio:"1.586",
          borderRadius:20, border:`3px dashed ${captured?"#5B4FFF":"#E5E7EB"}`,
          background:captured?"#F0EFFF":"#F9FAFB", cursor:"pointer",
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12,
        }}>
          {captured ? (
            <>
              <div style={{ width:56, height:56, borderRadius:28, background:"linear-gradient(135deg,#5B4FFF,#7C6FFF)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="28" height="22" viewBox="0 0 28 22" fill="none"><path d="M2 11l8 8L26 2" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <p style={{ fontSize:14, fontWeight:700, color:"#5B4FFF" }}>Photo captured ✓</p>
              <p style={{ fontSize:12, color:"#9CA3AF" }}>Tap to retake</p>
            </>
          ) : (
            <>
              <div style={{ width:56, height:56, borderRadius:28, background:"#E5E7EB", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="28" height="24" viewBox="0 0 28 24" fill="none"><rect x="1" y="5" width="26" height="18" rx="3" stroke="#9CA3AF" strokeWidth="2"/><circle cx="14" cy="14" r="4" stroke="#9CA3AF" strokeWidth="2"/><path d="M9 5l2-4h6l2 4" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <p style={{ fontSize:14, fontWeight:600, color:"#9CA3AF" }}>Tap to take photo</p>
            </>
          )}
        </button>
      </div>
      <div style={{ padding:"0 24px 40px" }}><PrimaryBtn label="Continue" onClick={onNext} disabled={!captured}/></div>
    </div>
  );
}

// ─── SCREEN 16: ID Back ───────────────────────────────────────────────────────
function S16_IDBack({ onBack, onNext, onSkip }: { onBack:()=>void; onNext:()=>void; onSkip?:()=>void }) {
  const [captured,setCaptured]=useState(false);
  return (
    <div style={{ width:"100%", height:"100%", background:"white", display:"flex", flexDirection:"column", animation:"slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <Header step={16} total={30} label="Identity Verification" onBack={onBack} onSkip={onSkip} />
      <div style={{ padding:"8px 28px 0" }}>
        <h1 style={{ fontSize:26, fontWeight:900, color:"#0a0a0a", marginBottom:6 }}>Back of your ID</h1>
        <p style={{ fontSize:14, color:"#9CA3AF" }}>Now take the back side</p>
      </div>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"24px 28px" }}>
        <button onClick={()=>setCaptured(true)} style={{
          width:"100%", maxWidth:320, aspectRatio:"1.586",
          borderRadius:20, border:`3px dashed ${captured?"#5B4FFF":"#E5E7EB"}`,
          background:captured?"#F0EFFF":"#F9FAFB", cursor:"pointer",
          display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12,
        }}>
          {captured ? (
            <>
              <div style={{ width:56, height:56, borderRadius:28, background:"linear-gradient(135deg,#5B4FFF,#7C6FFF)", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="28" height="22" viewBox="0 0 28 22" fill="none"><path d="M2 11l8 8L26 2" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <p style={{ fontSize:14, fontWeight:700, color:"#5B4FFF" }}>Photo captured ✓</p>
              <p style={{ fontSize:12, color:"#9CA3AF" }}>Tap to retake</p>
            </>
          ) : (
            <>
              <div style={{ width:56, height:56, borderRadius:28, background:"#E5E7EB", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="28" height="24" viewBox="0 0 28 24" fill="none"><rect x="1" y="5" width="26" height="18" rx="3" stroke="#9CA3AF" strokeWidth="2"/><circle cx="14" cy="14" r="4" stroke="#9CA3AF" strokeWidth="2"/><path d="M9 5l2-4h6l2 4" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/></svg>
              </div>
              <p style={{ fontSize:14, fontWeight:600, color:"#9CA3AF" }}>Tap to take photo</p>
            </>
          )}
        </button>
      </div>
      <div style={{ padding:"0 24px 40px" }}><PrimaryBtn label="Continue" onClick={onNext} disabled={!captured}/></div>
    </div>
  );
}

// ─── SCREEN 17: Selfie Intro ──────────────────────────────────────────────────
function S17_SelfieIntro({ onBack, onNext, onSkip }: { onBack:()=>void; onNext:()=>void; onSkip?:()=>void }) {
  const tips=[
    {icon:"☀️",text:"Good lighting on your face"},
    {icon:"😐",text:"Neutral expression"},
    {icon:"🚫",text:"No sunglasses or hat"},
    {icon:"📱",text:"Hold phone at eye level"},
  ];
  return (
    <div style={{ width:"100%", height:"100%", background:"white", display:"flex", flexDirection:"column", animation:"slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <Header step={17} total={30} label="Identity Verification" onBack={onBack} onSkip={onSkip} />
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 28px" }}>
        <div style={{
          width:120, height:120, borderRadius:60, background:"linear-gradient(135deg,#F0EFFF,#E0DEFF)",
          border:"4px solid #5B4FFF", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:28,
        }}>
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="22" r="10" stroke="#5B4FFF" strokeWidth="2.5"/>
            <path d="M8 48c0-11 9-20 20-20s20 9 20 20" stroke="#5B4FFF" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 style={{ fontSize:24, fontWeight:900, color:"#0a0a0a", textAlign:"center", marginBottom:8 }}>Selfie verification</h1>
        <p style={{ fontSize:14, color:"#9CA3AF", textAlign:"center", lineHeight:1.6, marginBottom:32 }}>
          We need a selfie to verify your identity matches your ID
        </p>
        <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:12 }}>
          {tips.map(t=>(
            <div key={t.text} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 16px", borderRadius:14, background:"#F9FAFB" }}>
              <span style={{ fontSize:22 }}>{t.icon}</span>
              <span style={{ fontSize:14, color:"#374151", fontWeight:500 }}>{t.text}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding:"0 24px 40px" }}><PrimaryBtn label="Take Selfie" onClick={onNext}/></div>
    </div>
  );
}

// ─── SCREEN 18: Selfie ───────────────────────────────────────────────────────
function S18_Selfie({ onBack, onNext, onSkip }: { onBack:()=>void; onNext:()=>void; onSkip?:()=>void }) {
  const [captured,setCaptured]=useState(false);
  return (
    <div style={{ width:"100%", height:"100%", background:"#0a0a0a", display:"flex", flexDirection:"column", animation:"slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <div style={{ padding:"20px 24px 0", display:"flex", alignItems:"center", gap:12 }}>
        <button onClick={onBack} style={{ width:40, height:40, borderRadius:20, border:"1.5px solid rgba(255,255,255,0.2)", background:"rgba(255,255,255,0.1)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
        </button>
        <span style={{ color:"rgba(255,255,255,0.7)", fontSize:14 }}>Step 18/30</span>
        {onSkip && <button onClick={onSkip} style={{ marginLeft:"auto", border:"none", background:"none", cursor:"pointer", color:"rgba(255,255,255,0.5)", fontSize:13, fontWeight:700 }}>Skip to dashboard →</button>}
      </div>
      <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
        <div style={{ width:240, height:300, borderRadius:120, border:`3px solid ${captured?"#10B981":"#5B4FFF"}`, position:"relative", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(91,79,255,0.05)" }}>
          {!captured ? (
            <svg width="80" height="90" viewBox="0 0 56 56" fill="none"><circle cx="28" cy="22" r="10" stroke="rgba(91,79,255,0.5)" strokeWidth="2"/><path d="M8 48c0-11 9-20 20-20s20 9 20 20" stroke="rgba(91,79,255,0.5)" strokeWidth="2" strokeLinecap="round"/></svg>
          ) : (
            <div style={{ width:60, height:60, borderRadius:30, background:"#10B981", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="30" height="24" viewBox="0 0 30 24" fill="none"><path d="M2 12l9 9L28 2" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          )}
        </div>
        <div style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", width:260, height:320, borderRadius:130 }}>
          {["top-left","top-right","bottom-left","bottom-right"].map(pos=>(
            <div key={pos} style={{
              position:"absolute",
              width:32, height:32,
              borderColor:"#5B4FFF", borderStyle:"solid",
              borderWidth:pos.includes("top")?"3px 0 0":"0 0 3px",
              borderRightWidth:pos.includes("right")?"3px":"0",
              borderLeftWidth:pos.includes("left")?"3px":"0",
              borderRadius:pos.includes("top-left")?"12px 0 0 0":pos.includes("top-right")?"0 12px 0 0":pos.includes("bottom-left")?"0 0 0 12px":"0 0 12px 0",
              ...(pos.includes("top")&&{top:0}),...(pos.includes("bottom")&&{bottom:0}),
              ...(pos.includes("left")&&{left:0}),...(pos.includes("right")&&{right:0}),
            }}/>
          ))}
        </div>
      </div>
      {!captured ? (
        <p style={{ textAlign:"center", color:"rgba(255,255,255,0.5)", fontSize:13, marginBottom:24 }}>
          Position your face in the oval
        </p>
      ) : (
        <p style={{ textAlign:"center", color:"#10B981", fontSize:13, fontWeight:600, marginBottom:24 }}>
          Perfect! Face verified ✓
        </p>
      )}
      <div style={{ padding:"0 24px 40px" }}>
        {!captured ? (
          <button onClick={()=>setCaptured(true)} style={{
            width:"100%", height:64, borderRadius:32, border:"none", cursor:"pointer",
            background:"linear-gradient(135deg,#5B4FFF,#7C6FFF)", color:"white", fontSize:16, fontWeight:700,
            boxShadow:"0 8px 24px rgba(91,79,255,0.5)",
          }}>Take Selfie</button>
        ) : (
          <PrimaryBtn label="Continue" onClick={onNext}/>
        )}
      </div>
    </div>
  );
}

// ─── SCREEN 19: KYC Review ───────────────────────────────────────────────────
function S19_Review({ data, onBack, onNext, onSkip }: { data:FormData; onBack:()=>void; onNext:()=>void; onSkip?:()=>void }) {
  const rows=[
    {label:"Full name",value:`${data.firstName} ${data.lastName}`},
    {label:"Phone",value:data.phone||"Not set"},
    {label:"Email",value:data.email||"Not set"},
    {label:"Date of birth",value:data.day&&data.month&&data.year?`${data.day}/${data.month}/${data.year}`:"Not set"},
    {label:"Gender",value:data.gender||"Not set"},
    {label:"Address",value:data.address||"Not set"},
    {label:"City",value:data.city||"Not set"},
    {label:"Country",value:data.country||"Not set"},
    {label:"Nationality",value:data.nationality||"Not set"},
    {label:"Occupation",value:data.occupation||"Not set"},
    {label:"Income source",value:data.income||"Not set"},
    {label:"ID type",value:data.idType||"Not set"},
  ];
  return (
    <div style={{ width:"100%", height:"100%", background:"white", display:"flex", flexDirection:"column", animation:"slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <Header step={19} total={30} label="Review" onBack={onBack} onSkip={onSkip} />
      <div style={{ padding:"8px 28px 16px" }}>
        <h1 style={{ fontSize:26, fontWeight:900, color:"#0a0a0a", marginBottom:6 }}>Review your info</h1>
        <p style={{ fontSize:14, color:"#9CA3AF" }}>Please confirm everything is correct</p>
      </div>
      <div style={{ flex:1, overflowY:"auto", padding:"0 24px" }}>
        {rows.map(r=>(
          <div key={r.label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"14px 0", borderBottom:"1px solid #F3F4F6" }}>
            <span style={{ fontSize:13, color:"#9CA3AF", fontWeight:500 }}>{r.label}</span>
            <span style={{ fontSize:14, fontWeight:600, color:"#0a0a0a", textAlign:"right", maxWidth:"55%" }}>{r.value}</span>
          </div>
        ))}
      </div>
      <div style={{ padding:"16px 24px 40px" }}><PrimaryBtn label="Submit for Verification" onClick={onNext}/></div>
    </div>
  );
}

// ─── SCREEN 20: KYC Pending ───────────────────────────────────────────────────
function S20_KYCPending({ onNext, onSkip }: { onNext:()=>void; onSkip?:()=>void }) {
  return (
    <div style={{ width:"100%", height:"100%", background:"white", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 28px", animation:"fadeInUp 0.4s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      {onSkip && <div style={{ position:"absolute", top:20, right:24 }}><button onClick={onSkip} style={{ border:"none", background:"none", cursor:"pointer", fontSize:13, fontWeight:700, color:"#9CA3AF", display:"flex", alignItems:"center", gap:4 }}>Skip to dashboard <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></button></div>}
      <div style={{
        width:100, height:100, borderRadius:50,
        background:"linear-gradient(135deg,#FFF7ED,#FED7AA)",
        border:"3px solid #F59E0B",
        display:"flex", alignItems:"center", justifyContent:"center", marginBottom:28,
        animation:"floatY 3s ease-in-out infinite",
      }}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#F59E0B" strokeWidth="2"/><path d="M12 7v5l3 3" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round"/></svg>
      </div>
      <h1 style={{ fontSize:26, fontWeight:900, color:"#0a0a0a", textAlign:"center", marginBottom:10 }}>
        Verification in progress
      </h1>
      <p style={{ fontSize:14, color:"#9CA3AF", textAlign:"center", lineHeight:1.6, marginBottom:32 }}>
        We're reviewing your documents. This usually takes 2–5 minutes. You'll receive a notification once verified.
      </p>
      <div style={{ width:"100%", padding:"16px", borderRadius:16, background:"#FFF7ED", border:"1.5px solid #FED7AA", marginBottom:40 }}>
        <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
          {["Documents received ✓","Identity check in progress...","Compliance check pending"].map((s,i)=>(
            <div key={s} style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:8, height:8, borderRadius:4, background:i===0?"#10B981":i===1?"#F59E0B":"#E5E7EB" }}/>
              <span style={{ fontSize:13, color:i===0?"#065F46":i===1?"#92400E":"#9CA3AF", fontWeight:i<2?600:400 }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
      <PrimaryBtn label="Continue setup" onClick={onNext}/>
    </div>
  );
}

// ─── SCREEN 21: PIN Intro ─────────────────────────────────────────────────────
function S21_PINIntro({ onNext, onSkip }: { onNext:()=>void; onSkip?:()=>void }) {
  return (
    <div style={{ width:"100%", height:"100%", background:"white", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 28px", animation:"slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      {onSkip && <div style={{ position:"absolute", top:20, right:24 }}><button onClick={onSkip} style={{ border:"none", background:"none", cursor:"pointer", fontSize:13, fontWeight:700, color:"#9CA3AF", display:"flex", alignItems:"center", gap:4 }}>Skip to dashboard <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></button></div>}
      <div style={{
        width:100, height:100, borderRadius:32,
        background:"linear-gradient(135deg,#5B4FFF,#7C6FFF)",
        display:"flex", alignItems:"center", justifyContent:"center", marginBottom:28,
        boxShadow:"0 20px 60px rgba(91,79,255,0.35)",
      }}>
        <svg width="44" height="44" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="10" rx="2" stroke="white" strokeWidth="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="white" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="16" r="1.5" fill="white"/></svg>
      </div>
      <h1 style={{ fontSize:26, fontWeight:900, color:"#0a0a0a", textAlign:"center", marginBottom:10 }}>Set up your PIN</h1>
      <p style={{ fontSize:14, color:"#9CA3AF", textAlign:"center", lineHeight:1.6, marginBottom:40 }}>
        A 6-digit PIN protects your account and authorizes payments. Never share it with anyone.
      </p>
      <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:12, marginBottom:40 }}>
        {["Quick & secure access","Required for payments","Can be changed anytime"].map(t=>(
          <div key={t} style={{ display:"flex", alignItems:"center", gap:14, padding:"12px 16px", borderRadius:14, background:"#F0EFFF" }}>
            <div style={{ width:28, height:28, borderRadius:14, background:"linear-gradient(135deg,#5B4FFF,#7C6FFF)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <svg width="14" height="11" viewBox="0 0 14 11" fill="none"><path d="M1 5.5l4 4 8-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span style={{ fontSize:14, color:"#374151", fontWeight:500 }}>{t}</span>
          </div>
        ))}
      </div>
      <PrimaryBtn label="Create my PIN" onClick={onNext}/>
    </div>
  );
}

// ─── SCREEN 22: PIN Create ────────────────────────────────────────────────────
function S22_PINCreate({ onBack, onNext, onSkip }: { onBack:()=>void; onNext:(pin:string)=>void; onSkip?:()=>void }) {
  const [pin,setPin]=useState("");
  const LEN=6;
  function handleKey(k:string) {
    if(k==="⌫") setPin(p=>p.slice(0,-1));
    else if(k!=="*" && pin.length<LEN){ const n=pin+k; setPin(n); if(n.length===LEN) setTimeout(()=>onNext(n),300); }
  }
  return (
    <div style={{ width:"100%", height:"100%", background:"white", display:"flex", flexDirection:"column", animation:"slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <Header step={22} total={30} label="Security" onBack={onBack} onSkip={onSkip} />
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 28px" }}>
        <div style={{ width:56, height:56, borderRadius:18, background:"linear-gradient(135deg,#5B4FFF,#7C6FFF)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24 }}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="10" rx="2" stroke="white" strokeWidth="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
        <h2 style={{ fontSize:22, fontWeight:900, color:"#0a0a0a", marginBottom:6 }}>Create your PIN</h2>
        <p style={{ fontSize:14, color:"#9CA3AF", marginBottom:32 }}>Enter a 6-digit code</p>
        <div style={{ display:"flex", gap:12, marginBottom:8 }}>
          {Array.from({length:LEN}).map((_,i)=>(
            <div key={i} style={{
              width:48, height:56, borderRadius:14,
              border:`${i<pin.length?"2px solid #5B4FFF":"1.5px solid #E5E7EB"}`,
              background:i<pin.length?"#5B4FFF":"white",
              display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s",
            }}>
              {i<pin.length&&<div style={{ width:10, height:10, borderRadius:5, background:"white" }}/>}
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:"#D1D5DB", padding:"12px 4px 8px", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1 }}>
        {KEYBOARD_ROWS.flat().map(k=>(
          <button key={k} onClick={()=>handleKey(k)} style={{
            height:56, border:"none", cursor:"pointer",
            background:k==="*"||k==="⌫"?"#ADB5BD":"white",
            fontSize:k==="⌫"?18:22, color:"#0a0a0a",
            display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:2,
          }}>
            {k==="⌫"?(
              <svg width="22" height="16" viewBox="0 0 24 18" fill="none"><path d="M9 1H22a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H9l-8-8 8-8z" stroke="#0a0a0a" strokeWidth="1.5" strokeLinejoin="round"/><path d="M15 6l-4 6M11 6l4 6" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round"/></svg>
            ):k!=="*"?(
              <>
                <span style={{ lineHeight:1 }}>{k}</span>
                <span style={{ fontSize:9, color:"#6B7280", letterSpacing:1, fontWeight:500 }}>
                  {({"2":"ABC","3":"DEF","4":"GHI","5":"JKL","6":"MNO","7":"PQRS","8":"TUV","9":"WXYZ"} as Record<string,string>)[k]||""}
                </span>
              </>
            ):null}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── SCREEN 23: PIN Confirm ───────────────────────────────────────────────────
function S23_PINConfirm({ pin, onBack, onNext, onSkip }: { pin:string; onBack:()=>void; onNext:()=>void; onSkip?:()=>void }) {
  const [confirm,setConfirm]=useState("");
  const [error,setError]=useState(false);
  const LEN=6;
  function handleKey(k:string) {
    if(k==="⌫"){ setConfirm(p=>p.slice(0,-1)); setError(false); }
    else if(k!=="*" && confirm.length<LEN){
      const n=confirm+k; setConfirm(n);
      if(n.length===LEN){
        if(n===pin) setTimeout(onNext,300);
        else { setTimeout(()=>{setError(true);setConfirm("");},300); }
      }
    }
  }
  return (
    <div style={{ width:"100%", height:"100%", background:"white", display:"flex", flexDirection:"column", animation:"slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <Header step={23} total={30} label="Security" onBack={onBack} onSkip={onSkip} />
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 28px" }}>
        <div style={{ width:56, height:56, borderRadius:18, background:error?"linear-gradient(135deg,#FEE2E2,#FECACA)":"linear-gradient(135deg,#5B4FFF,#7C6FFF)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:24, transition:"all 0.3s" }}>
          {error ? (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M12 8v4M12 16h.01" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round"/></svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><rect x="5" y="11" width="14" height="10" rx="2" stroke="white" strokeWidth="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
          )}
        </div>
        <h2 style={{ fontSize:22, fontWeight:900, color:error?"#EF4444":"#0a0a0a", marginBottom:6, transition:"color 0.3s" }}>
          {error?"Incorrect PIN":"Confirm your PIN"}
        </h2>
        <p style={{ fontSize:14, color:"#9CA3AF", marginBottom:32 }}>
          {error?"PINs don't match. Try again":"Re-enter your 6-digit code"}
        </p>
        <div style={{ display:"flex", gap:12, marginBottom:8 }}>
          {Array.from({length:LEN}).map((_,i)=>(
            <div key={i} style={{
              width:48, height:56, borderRadius:14,
              border:`${i<confirm.length?`2px solid ${error?"#EF4444":"#5B4FFF"}`:"1.5px solid #E5E7EB"}`,
              background:i<confirm.length?(error?"#FEE2E2":"#5B4FFF"):"white",
              display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.15s",
            }}>
              {i<confirm.length&&<div style={{ width:10, height:10, borderRadius:5, background:error?"#EF4444":"white" }}/>}
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:"#D1D5DB", padding:"12px 4px 8px", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:1 }}>
        {KEYBOARD_ROWS.flat().map(k=>(
          <button key={k} onClick={()=>handleKey(k)} style={{
            height:56, border:"none", cursor:"pointer",
            background:k==="*"||k==="⌫"?"#ADB5BD":"white",
            fontSize:k==="⌫"?18:22, color:"#0a0a0a",
            display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:2,
          }}>
            {k==="⌫"?(
              <svg width="22" height="16" viewBox="0 0 24 18" fill="none"><path d="M9 1H22a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H9l-8-8 8-8z" stroke="#0a0a0a" strokeWidth="1.5" strokeLinejoin="round"/><path d="M15 6l-4 6M11 6l4 6" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round"/></svg>
            ):k!=="*"?(
              <>
                <span style={{ lineHeight:1 }}>{k}</span>
                <span style={{ fontSize:9, color:"#6B7280", letterSpacing:1, fontWeight:500 }}>
                  {({"2":"ABC","3":"DEF","4":"GHI","5":"JKL","6":"MNO","7":"PQRS","8":"TUV","9":"WXYZ"} as Record<string,string>)[k]||""}
                </span>
              </>
            ):null}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── SCREEN 24: Biometric ─────────────────────────────────────────────────────
function S24_Biometric({ onBack, onNext, onSkip }: { onBack:()=>void; onNext:()=>void; onSkip:()=>void }) {
  return (
    <div style={{ width:"100%", height:"100%", background:"white", display:"flex", flexDirection:"column", animation:"slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <Header step={24} total={30} label="Security" onBack={onBack} />
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 28px" }}>
        <div style={{
          width:120, height:120, borderRadius:40,
          background:"linear-gradient(135deg,#0a0a0a,#374151)",
          display:"flex", alignItems:"center", justifyContent:"center", marginBottom:28,
          boxShadow:"0 20px 60px rgba(0,0,0,0.3)", animation:"floatY 3s ease-in-out infinite",
        }}>
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="18" r="7" stroke="white" strokeWidth="2"/>
            <path d="M14 44c0-7 5-12 12-12s12 5 12 12" stroke="white" strokeWidth="2" strokeLinecap="round"/>
            <path d="M4 26c0-12 10-22 22-22s22 10 22 22" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M10 26c0-9 7-16 16-16s16 7 16 16" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 style={{ fontSize:24, fontWeight:900, color:"#0a0a0a", textAlign:"center", marginBottom:10 }}>Enable Face ID</h1>
        <p style={{ fontSize:14, color:"#9CA3AF", textAlign:"center", lineHeight:1.6, marginBottom:40 }}>
          Use your face to log in instantly and authorize payments without entering your PIN
        </p>
        <div style={{ width:"100%", marginBottom:16 }}>
          <PrimaryBtn label="Enable Face ID" onClick={onNext}/>
        </div>
        <button onClick={onSkip} style={{ border:"none", background:"none", color:"#9CA3AF", fontSize:14, fontWeight:600, cursor:"pointer", padding:"12px" }}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

// ─── SCREEN 25: Notifications ─────────────────────────────────────────────────
function S25_Notifications({ onBack, onNext, onSkip }: { onBack:()=>void; onNext:()=>void; onSkip:()=>void }) {
  return (
    <div style={{ width:"100%", height:"100%", background:"white", display:"flex", flexDirection:"column", animation:"slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <Header step={25} total={30} label="Preferences" onBack={onBack} />
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 28px" }}>
        <div style={{
          width:100, height:100, borderRadius:32,
          background:"linear-gradient(135deg,#F0EFFF,#E0DEFF)", border:"3px solid #5B4FFF",
          display:"flex", alignItems:"center", justifyContent:"center", marginBottom:28,
        }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="#5B4FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="#5B4FFF" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 style={{ fontSize:24, fontWeight:900, color:"#0a0a0a", textAlign:"center", marginBottom:10 }}>Stay in the loop</h1>
        <p style={{ fontSize:14, color:"#9CA3AF", textAlign:"center", lineHeight:1.6, marginBottom:32 }}>
          Get notified about transactions, security alerts, and account updates
        </p>
        <div style={{ width:"100%", display:"flex", flexDirection:"column", gap:10, marginBottom:40 }}>
          {["💳 Payment confirmations","🔒 Security alerts","💰 Money received","📊 Weekly spending report"].map(t=>(
            <div key={t} style={{ display:"flex", alignItems:"center", gap:12, padding:"13px 16px", borderRadius:14, background:"#F9FAFB" }}>
              <span style={{ fontSize:18 }}>{t.split(" ")[0]}</span>
              <span style={{ fontSize:14, color:"#374151", fontWeight:500 }}>{t.slice(3)}</span>
            </div>
          ))}
        </div>
        <div style={{ width:"100%", marginBottom:12 }}>
          <PrimaryBtn label="Allow Notifications" onClick={onNext}/>
        </div>
        <button onClick={onSkip} style={{ border:"none", background:"none", color:"#9CA3AF", fontSize:14, fontWeight:600, cursor:"pointer", padding:"12px" }}>
          Not now
        </button>
      </div>
    </div>
  );
}

// ─── SCREEN 26: Avatar ───────────────────────────────────────────────────────
function S26_Avatar({ onBack, onNext, onSkip }: { onBack:()=>void; onNext:()=>void; onSkip?:()=>void }) {
  const [selected,setSelected]=useState<string|null>(null);
  const emojis=["😀","😎","🤩","🥳","🦊","🐼","🦁","🐸","🦋","🌟","🔥","💎"];
  return (
    <div style={{ width:"100%", height:"100%", background:"white", display:"flex", flexDirection:"column", animation:"slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <Header step={26} total={30} label="Profile" onBack={onBack} onSkip={onSkip} />
      <div style={{ padding:"8px 28px 0" }}>
        <h1 style={{ fontSize:26, fontWeight:900, color:"#0a0a0a", marginBottom:6 }}>Choose an avatar</h1>
        <p style={{ fontSize:14, color:"#9CA3AF", marginBottom:24 }}>Pick something that represents you</p>
      </div>
      {selected && (
        <div style={{ display:"flex", justifyContent:"center", marginBottom:20 }}>
          <div style={{
            width:80, height:80, borderRadius:40,
            background:"linear-gradient(135deg,#5B4FFF,#7C6FFF)",
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:"0 8px 24px rgba(91,79,255,0.35)",
            fontSize:40,
          }}>{selected}</div>
        </div>
      )}
      <div style={{ padding:"0 24px", display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12 }}>
        {emojis.map(e=>(
          <button key={e} onClick={()=>setSelected(e)} style={{
            width:"100%", aspectRatio:"1",
            borderRadius:20, border:`2.5px solid ${selected===e?"#5B4FFF":"#E5E7EB"}`,
            background:selected===e?"#F0EFFF":"#F9FAFB",
            cursor:"pointer", fontSize:32,
            display:"flex", alignItems:"center", justifyContent:"center",
            transition:"all 0.15s",
          }}>{e}</button>
        ))}
      </div>
      <div style={{ flex:1 }} />
      <div style={{ padding:"0 24px 40px" }}>
        <PrimaryBtn label={selected?"Continue":"Skip"} onClick={onNext}/>
      </div>
    </div>
  );
}

// ─── SCREEN 27: Username ─────────────────────────────────────────────────────
function S27_Username({ data, onBack, onNext, onSkip }: { data:FormData; onBack:()=>void; onNext:(v:string)=>void; onSkip?:()=>void }) {
  const [username,setUsername]=useState(data.username||`@${(data.firstName||"user").toLowerCase()}`);
  const clean = username.replace(/^@/,"");
  const valid = clean.length>=3 && /^[a-z0-9_]+$/.test(clean);
  return (
    <div style={{ width:"100%", height:"100%", background:"white", display:"flex", flexDirection:"column", animation:"slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <Header step={27} total={30} label="Profile" onBack={onBack} onSkip={onSkip} />
      <div style={{ padding:"8px 28px 28px" }}>
        <h1 style={{ fontSize:26, fontWeight:900, color:"#0a0a0a", marginBottom:6 }}>Pick a username</h1>
        <p style={{ fontSize:14, color:"#9CA3AF", marginBottom:28 }}>People can find you by your @username</p>
        <div style={{ position:"relative" }}>
          <span style={{ position:"absolute", left:16, top:"50%", transform:"translateY(-50%)", fontSize:15, color:"#5B4FFF", fontWeight:700 }}>@</span>
          <input
            value={clean} onChange={e=>setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g,""))}
            placeholder="yourname"
            style={{ width:"100%", height:54, borderRadius:14, border:`1.5px solid ${valid?"#5B4FFF":"#E5E7EB"}`, paddingLeft:34, paddingRight:16, fontSize:15, color:"#0a0a0a", outline:"none", background:"white", boxSizing:"border-box" }}
          />
          {valid && (
            <div style={{ position:"absolute", right:14, top:"50%", transform:"translateY(-50%)", width:22, height:22, borderRadius:11, background:"#10B981", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="12" height="9" viewBox="0 0 12 9" fill="none"><path d="M1 4l4 4 6-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          )}
        </div>
        {clean.length>0&&!valid&&<p style={{ fontSize:12, color:"#EF4444", marginTop:6 }}>Only letters, numbers and underscores. Min 3 chars.</p>}
      </div>
      <div style={{ flex:1 }} />
      <div style={{ padding:"0 24px 40px" }}><PrimaryBtn label="Continue" onClick={()=>onNext(clean)} disabled={!valid}/></div>
    </div>
  );
}

// ─── SCREEN 28: Referral ─────────────────────────────────────────────────────
function S28_Referral({ data, onBack, onNext, onSkip }: { data:FormData; onBack:()=>void; onNext:(v:string)=>void; onSkip?:()=>void }) {
  const [code,setCode]=useState(data.referral);
  const [applied,setApplied]=useState(false);
  function apply() { if(code.length>=4) setApplied(true); }
  return (
    <div style={{ width:"100%", height:"100%", background:"white", display:"flex", flexDirection:"column", animation:"slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <Header step={28} total={30} label="Bonuses" onBack={onBack} onSkip={onSkip} />
      <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 28px" }}>
        <div style={{ fontSize:64, marginBottom:24 }}>🎁</div>
        <h1 style={{ fontSize:26, fontWeight:900, color:"#0a0a0a", textAlign:"center", marginBottom:8 }}>
          Got a referral code?
        </h1>
        <p style={{ fontSize:14, color:"#9CA3AF", textAlign:"center", lineHeight:1.6, marginBottom:32 }}>
          Enter a friend&apos;s code and you both get a $10 bonus when you make your first transaction
        </p>
        <div style={{ width:"100%", display:"flex", gap:10, marginBottom:16 }}>
          <input
            value={code} onChange={e=>setCode(e.target.value.toUpperCase())} placeholder="e.g. MIKE2024"
            style={{ flex:1, height:52, borderRadius:14, border:`1.5px solid ${applied?"#10B981":"#E5E7EB"}`, padding:"0 16px", fontSize:15, outline:"none", background:"white", letterSpacing:1, fontWeight:600 }}
          />
          <button onClick={apply} style={{
            height:52, paddingLeft:20, paddingRight:20, borderRadius:14, border:"none",
            background:"linear-gradient(135deg,#5B4FFF,#7C6FFF)", color:"white",
            fontSize:14, fontWeight:700, cursor:"pointer",
          }}>Apply</button>
        </div>
        {applied && (
          <div style={{ width:"100%", padding:"14px 16px", borderRadius:14, background:"#D1FAE5", border:"1.5px solid #6EE7B7", display:"flex", alignItems:"center", gap:10 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" fill="#10B981"/><path d="M8 12l3 3 5-6" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            <span style={{ fontSize:14, fontWeight:600, color:"#065F46" }}>Code applied! $10 bonus unlocked 🎉</span>
          </div>
        )}
      </div>
      <div style={{ padding:"0 24px 40px", display:"flex", flexDirection:"column", gap:12 }}>
        <PrimaryBtn label={applied?"Continue with bonus":"Continue"} onClick={()=>onNext(code)}/>
        {!applied&&<button onClick={()=>onNext("")} style={{ border:"none", background:"none", color:"#9CA3AF", fontSize:14, fontWeight:600, cursor:"pointer", padding:"8px" }}>Skip</button>}
      </div>
    </div>
  );
}

// ─── SCREEN 29: Terms ────────────────────────────────────────────────────────
function S29_Terms({ onBack, onNext, onSkip }: { onBack:()=>void; onNext:()=>void; onSkip?:()=>void }) {
  const [accepted,setAccepted]=useState({terms:false,privacy:false,age:false});
  const allAccepted=accepted.terms&&accepted.privacy&&accepted.age;
  const items=[
    {key:"terms" as const,title:"Terms of Service",desc:"Rules governing your use of FIN CORE services"},
    {key:"privacy" as const,title:"Privacy Policy",desc:"How we collect, use and protect your data"},
    {key:"age" as const,title:"Age confirmation",desc:"I confirm I am 18 years old or older"},
  ];
  return (
    <div style={{ width:"100%", height:"100%", background:"white", display:"flex", flexDirection:"column", animation:"slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <Header step={29} total={30} label="Terms" onBack={onBack} onSkip={onSkip} />
      <div style={{ padding:"8px 28px 0" }}>
        <h1 style={{ fontSize:26, fontWeight:900, color:"#0a0a0a", marginBottom:6 }}>Almost there!</h1>
        <p style={{ fontSize:14, color:"#9CA3AF", marginBottom:28 }}>Please read and accept our terms to continue</p>
      </div>
      <div style={{ padding:"0 24px", display:"flex", flexDirection:"column", gap:12 }}>
        {items.map(item=>(
          <div key={item.key} onClick={()=>setAccepted(a=>({...a,[item.key]:!a[item.key]}))} style={{
            display:"flex", alignItems:"flex-start", gap:14, padding:"16px", borderRadius:16,
            border:`1.5px solid ${accepted[item.key]?"#5B4FFF":"#E5E7EB"}`,
            background:accepted[item.key]?"#F0EFFF":"white", cursor:"pointer", transition:"all 0.15s",
          }}>
            <div style={{
              width:24, height:24, borderRadius:7, flexShrink:0, marginTop:1,
              background:accepted[item.key]?"linear-gradient(135deg,#5B4FFF,#7C6FFF)":"white",
              border:accepted[item.key]?"none":"1.5px solid #D1D5DB",
              display:"flex", alignItems:"center", justifyContent:"center",
            }}>
              {accepted[item.key]&&<svg width="13" height="10" viewBox="0 0 13 10" fill="none"><path d="M1 5l4 4 7-8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </div>
            <div>
              <p style={{ fontSize:14, fontWeight:700, color:accepted[item.key]?"#5B4FFF":"#0a0a0a", marginBottom:2 }}>{item.title}</p>
              <p style={{ fontSize:12, color:"#9CA3AF" }}>{item.desc}</p>
            </div>
          </div>
        ))}
        <button onClick={()=>setAccepted({terms:true,privacy:true,age:true})} style={{
          border:"none", background:"none", color:"#5B4FFF", fontSize:13, fontWeight:600,
          cursor:"pointer", textAlign:"left", padding:"4px 0",
        }}>Accept all</button>
      </div>
      <div style={{ flex:1 }} />
      <div style={{ padding:"0 24px 40px" }}><PrimaryBtn label="Create Account" onClick={onNext} disabled={!allAccepted}/></div>
    </div>
  );
}

// ─── SCREEN 30: Success ───────────────────────────────────────────────────────
function S30_Success({ data }: { data:FormData }) {
  const router = useRouter();
  return (
    <div style={{ width:"100%", height:"100%", background:"white", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"0 28px", animation:"fadeInUp 0.5s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <div style={{
        width:110, height:110, borderRadius:55,
        background:"linear-gradient(135deg,#5B4FFF,#7C6FFF)",
        display:"flex", alignItems:"center", justifyContent:"center",
        boxShadow:"0 24px 70px rgba(91,79,255,0.4)", marginBottom:28,
        animation:"floatY 3s ease-in-out infinite",
      }}>
        <svg width="50" height="40" viewBox="0 0 50 40" fill="none">
          <path d="M4 20l14 14L46 4" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {/* Confetti dots */}
      {["#5B4FFF","#FFB830","#10B981","#F59E0B","#EF4444"].map((c,i)=>(
        <div key={i} style={{
          position:"absolute",
          width:10, height:10, borderRadius:5, background:c,
          top:`${15+i*8}%`, left:`${10+i*18}%`,
          animation:`floatY ${2+i*0.4}s ease-in-out infinite ${i*0.3}s`,
        }}/>
      ))}
      <h1 style={{ fontSize:32, fontWeight:900, color:"#0a0a0a", textAlign:"center", marginBottom:10, lineHeight:1.2 }}>
        Welcome to<br />
        <span style={{ background:"linear-gradient(135deg,#5B4FFF,#7C6FFF)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" }}>
          FIN CORE!
        </span>
      </h1>
      <p style={{ fontSize:15, color:"#9CA3AF", textAlign:"center", lineHeight:1.6, marginBottom:12 }}>
        Hi {data.firstName||"there"}, your account is ready 🎉
      </p>
      {data.referral&&(
        <div style={{ padding:"10px 20px", borderRadius:20, background:"#D1FAE5", border:"1.5px solid #6EE7B7", marginBottom:24 }}>
          <p style={{ fontSize:13, fontWeight:600, color:"#065F46" }}>🎁 $10 referral bonus added to your wallet</p>
        </div>
      )}
      <div style={{ width:"100%", marginBottom:12, marginTop:20 }}>
        <button onClick={()=>router.push("/home")} style={{
          width:"100%", height:56, borderRadius:28, border:"none",
          background:"linear-gradient(135deg,#5B4FFF,#7C6FFF)", color:"white",
          fontSize:16, fontWeight:700, cursor:"pointer",
          boxShadow:"0 8px 24px rgba(91,79,255,0.35)",
        }}>Go to Dashboard</button>
      </div>
      <button onClick={()=>router.push("/home")} style={{ border:"none", background:"none", color:"#9CA3AF", fontSize:14, cursor:"pointer" }}>
        Explore first
      </button>
    </div>
  );
}

// ─── Main Controller ──────────────────────────────────────────────────────────
const INITIAL: FormData = {
  phone:"", email:"", firstName:"", lastName:"",
  day:"", month:"", year:"", gender:"",
  address:"", city:"", postalCode:"", country:"", nationality:"",
  occupation:"", income:"", idType:"",
  pin:"", username:"", referral:"",
};

export default function SignUpPage() {
  const [step, setStep] = useState<Step>("landing");
  const [data, setData] = useState<FormData>(INITIAL);
  const upd = (patch: Partial<FormData>) => setData(d=>({...d,...patch}));
  const router = useRouter();
  const skipToDashboard = () => router.push("/home");

  return (
    <main style={{ position:"relative", width:"100%", height:"100dvh", overflow:"hidden", maxWidth:430, margin:"0 auto", background:"white" }}>
      {step==="landing"     && <S01_Landing onPhone={()=>setStep("phone")} onGoogle={()=>setStep("email")} onApple={()=>setStep("email")}/>}
      {step==="phone"       && <S02_Phone onBack={()=>setStep("landing")} onNext={p=>{upd({phone:p});setStep("otp");}}/>}
      {step==="otp"         && <S03_OTP phone={data.phone} onBack={()=>setStep("phone")} onNext={()=>setStep("email")}/>}
      {step==="email"       && <S04_Email data={data} onBack={()=>setStep("otp")} onNext={e=>{upd({email:e});setStep("name");}}/>}
      {step==="name"        && <S05_Name data={data} onBack={()=>setStep("email")} onNext={(f,l)=>{upd({firstName:f,lastName:l});setStep("dob");}}/>}
      {step==="dob"         && <S06_DOB data={data} onBack={()=>setStep("name")} onNext={(d,m,y)=>{upd({day:d,month:m,year:y});setStep("gender");}}/>}
      {step==="gender"      && <S07_Gender data={data} onBack={()=>setStep("dob")} onNext={g=>{upd({gender:g});setStep("address");}}/>}
      {step==="address"     && <S08_Address data={data} onBack={()=>setStep("gender")} onNext={a=>{upd({address:a});setStep("city");}} onSkip={skipToDashboard}/>}
      {step==="city"        && <S09_City data={data} onBack={()=>setStep("address")} onNext={(c,p)=>{upd({city:c,postalCode:p});setStep("country");}} onSkip={skipToDashboard}/>}
      {step==="country"     && <S10_Country data={data} onBack={()=>setStep("city")} onNext={c=>{upd({country:c});setStep("nationality");}} onSkip={skipToDashboard}/>}
      {step==="nationality" && <S11_Nationality data={data} onBack={()=>setStep("country")} onNext={n=>{upd({nationality:n});setStep("occupation");}} onSkip={skipToDashboard}/>}
      {step==="occupation"  && <S12_Occupation data={data} onBack={()=>setStep("nationality")} onNext={o=>{upd({occupation:o});setStep("income");}} onSkip={skipToDashboard}/>}
      {step==="income"      && <S13_Income data={data} onBack={()=>setStep("occupation")} onNext={i=>{upd({income:i});setStep("id-type");}} onSkip={skipToDashboard}/>}
      {step==="id-type"     && <S14_IDType data={data} onBack={()=>setStep("income")} onNext={t=>{upd({idType:t});setStep("id-front");}} onSkip={skipToDashboard}/>}
      {step==="id-front"    && <S15_IDFront onBack={()=>setStep("id-type")} onNext={()=>setStep("id-back")} onSkip={skipToDashboard}/>}
      {step==="id-back"     && <S16_IDBack onBack={()=>setStep("id-front")} onNext={()=>setStep("selfie-intro")} onSkip={skipToDashboard}/>}
      {step==="selfie-intro"&& <S17_SelfieIntro onBack={()=>setStep("id-back")} onNext={()=>setStep("selfie")} onSkip={skipToDashboard}/>}
      {step==="selfie"      && <S18_Selfie onBack={()=>setStep("selfie-intro")} onNext={()=>setStep("review")} onSkip={skipToDashboard}/>}
      {step==="review"      && <S19_Review data={data} onBack={()=>setStep("selfie")} onNext={()=>setStep("kyc-pending")} onSkip={skipToDashboard}/>}
      {step==="kyc-pending" && <S20_KYCPending onNext={()=>setStep("pin-intro")} onSkip={skipToDashboard}/>}
      {step==="pin-intro"   && <S21_PINIntro onNext={()=>setStep("pin-create")} onSkip={skipToDashboard}/>}
      {step==="pin-create"  && <S22_PINCreate onBack={()=>setStep("pin-intro")} onNext={p=>{upd({pin:p});setStep("pin-confirm");}} onSkip={skipToDashboard}/>}
      {step==="pin-confirm" && <S23_PINConfirm pin={data.pin} onBack={()=>setStep("pin-create")} onNext={()=>setStep("biometric")} onSkip={skipToDashboard}/>}
      {step==="biometric"   && <S24_Biometric onBack={()=>setStep("pin-confirm")} onNext={()=>setStep("notifications")} onSkip={()=>setStep("notifications")}/>}
      {step==="notifications"&&<S25_Notifications onBack={()=>setStep("biometric")} onNext={()=>setStep("avatar")} onSkip={()=>setStep("avatar")}/>}
      {step==="avatar"      && <S26_Avatar onBack={()=>setStep("notifications")} onNext={()=>setStep("username")} onSkip={skipToDashboard}/>}
      {step==="username"    && <S27_Username data={data} onBack={()=>setStep("avatar")} onNext={u=>{upd({username:u});setStep("referral");}} onSkip={skipToDashboard}/>}
      {step==="referral"    && <S28_Referral data={data} onBack={()=>setStep("username")} onNext={r=>{upd({referral:r});setStep("terms");}} onSkip={skipToDashboard}/>}
      {step==="terms"       && <S29_Terms onBack={()=>setStep("referral")} onNext={()=>setStep("success")} onSkip={skipToDashboard}/>}
      {step==="success"     && <S30_Success data={data}/>}
    </main>
  );
}
