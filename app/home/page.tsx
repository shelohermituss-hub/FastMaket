"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Tab = "home" | "statistics" | "transfer" | "card" | "account";

// ─── Data ─────────────────────────────────────────────────────────────────────
const TRANSACTIONS = [
  { id:1,  logo:"visa",    name:"Transfer To *5527",    sub:"Completed  1 Mar 2024",   amount:-80,    positive:false },
  { id:2,  logo:"paypal",  name:"Receive From PayPal",  sub:"04:45 pm",                amount:+1200,  positive:true  },
  { id:3,  logo:"meta",    name:"Meta",                 sub:"04:45 pm",                amount:-60,    positive:false },
  { id:4,  logo:"netflix", name:"Netflix",              sub:"09:45 pm",                amount:-29,    positive:false },
  { id:5,  logo:"person",  name:"Receive From James",   sub:"04:45 pm",                amount:+3200,  positive:true  },
  { id:6,  logo:"paypal",  name:"Receive From PayPal",  sub:"04:45 pm",                amount:+1200,  positive:true  },
];

const CONTACTS = [
  { name:"Michael", initials:"MA", color:"#5B4FFF" },
  { name:"Olivia",  initials:"OL", color:"#F59E0B" },
  { name:"James",   initials:"JM", color:"#10B981" },
  { name:"Sarah",   initials:"SA", color:"#EF4444" },
];

const STAT_TRANSACTIONS = [
  { logo:"wallet",   name:"Online Payments", sub:"$12302.00  1 Mar 2024",  arrow:true },
  { logo:"shopping", name:"Shopping",        sub:"$3200.00   2 Mar 2024",  arrow:true },
  { logo:"paypal",   name:"Receive PayPal",  sub:"$1200.00   3 Mar 2024",  arrow:true },
];

// ─── Logo Components ──────────────────────────────────────────────────────────
function TxLogo({ type }: { type: string }) {
  const s: React.CSSProperties = { width:44, height:44, borderRadius:22, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 };
  if (type === "visa")    return <div style={{ ...s, background:"#1A1F71" }}><span style={{ color:"white", fontSize:13, fontWeight:900, letterSpacing:1 }}>VISA</span></div>;
  if (type === "paypal")  return <div style={{ ...s, background:"#003087" }}><span style={{ color:"white", fontSize:18, fontWeight:900 }}>P</span></div>;
  if (type === "meta")    return <div style={{ ...s, background:"#1877F2" }}><span style={{ color:"white", fontSize:18, fontWeight:900 }}>f</span></div>;
  if (type === "netflix") return <div style={{ ...s, background:"#E50914" }}><span style={{ color:"white", fontSize:14, fontWeight:900 }}>N</span></div>;
  if (type === "person")  return <div style={{ ...s, background:"#5B4FFF" }}><span style={{ color:"white", fontSize:20 }}>👤</span></div>;
  if (type === "wallet")  return <div style={{ ...s, background:"#FFF3E0" }}><span style={{ fontSize:20 }}>🧾</span></div>;
  if (type === "shopping") return <div style={{ ...s, background:"#E8F5E9" }}><span style={{ fontSize:20 }}>🛍️</span></div>;
  return <div style={{ ...s, background:"#F3F4F6" }}><span style={{ fontSize:20 }}>💳</span></div>;
}

// ─── Credit Card Component ─────────────────────────────────────────────────────
function CreditCard({ gradient, flag, name, number, expires, balance, style }: {
  gradient: string; flag: string; name: string; number: string;
  expires: string; balance: string; style?: React.CSSProperties;
}) {
  return (
    <div style={{
      width:"100%", borderRadius:20, padding:"20px 24px",
      background: gradient, position:"relative", overflow:"hidden",
      ...style,
    }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:30, height:30, borderRadius:15, background:"rgba(255,255,255,0.2)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ fontSize:14 }}>👤</span>
          </div>
          <span style={{ color:"white", fontSize:13, fontWeight:600 }}>{name}</span>
        </div>
        <span style={{ fontSize:22 }}>{flag}</span>
      </div>
      <p style={{ color:"rgba(255,255,255,0.7)", fontSize:11, marginBottom:2 }}>Total balance</p>
      <p style={{ color:"white", fontSize:22, fontWeight:800, marginBottom:16 }}>{balance}</p>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
        <div>
          <p style={{ color:"rgba(255,255,255,0.7)", fontSize:10, marginBottom:2 }}>card number</p>
          <p style={{ color:"white", fontSize:13, fontWeight:600, letterSpacing:2 }}>{number}</p>
        </div>
        <div style={{ textAlign:"right" }}>
          <p style={{ color:"rgba(255,255,255,0.7)", fontSize:10, marginBottom:2 }}>Expires</p>
          <p style={{ color:"white", fontSize:13, fontWeight:600 }}>{expires}</p>
        </div>
      </div>
      {/* Decorative circles */}
      <div style={{ position:"absolute", top:-20, right:-20, width:100, height:100, borderRadius:50, background:"rgba(255,255,255,0.08)" }}/>
      <div style={{ position:"absolute", bottom:-30, right:40, width:80, height:80, borderRadius:40, background:"rgba(255,255,255,0.05)" }}/>
    </div>
  );
}

// ─── Bottom Nav ────────────────────────────────────────────────────────────────
function BottomNav({ active, onTab }: { active: Tab; onTab:(t:Tab)=>void }) {
  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key:"home", label:"Home", icon:(
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )},
    { key:"statistics", label:"Statistics", icon:(
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="12" width="4" height="9" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="10" y="7" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="2"/>
        <rect x="17" y="3" width="4" height="18" rx="1" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )},
    { key:"transfer", label:"Transfer", icon:(
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M7 16V4m0 0L3 8m4-4l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M17 8v12m0 0l4-4m-4 4l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )},
    { key:"card", label:"Card", icon:(
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="2"/>
        <path d="M2 10h20" stroke="currentColor" strokeWidth="2"/>
      </svg>
    )},
    { key:"account", label:"Account", icon:(
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
        <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      </svg>
    )},
  ];
  return (
    <div style={{
      position:"absolute", bottom:0, left:0, right:0,
      background:"white", borderTop:"1px solid #F3F4F6",
      display:"flex", padding:"10px 0 20px",
    }}>
      {tabs.map(t=>(
        <button key={t.key} onClick={()=>onTab(t.key)} style={{
          flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4,
          border:"none", background:"none", cursor:"pointer",
          color: active===t.key ? "#5B4FFF" : "#9CA3AF",
        }}>
          {t.icon}
          <span style={{ fontSize:10, fontWeight:active===t.key?700:500 }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── TAB 1: Home ───────────────────────────────────────────────────────────────
function HomeTab() {
  const router = useRouter();
  return (
    <div style={{ flex:1, overflowY:"auto", background:"white", paddingBottom:80 }}>
      {/* Header */}
      <div style={{ padding:"20px 20px 12px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ width:36, height:36, display:"flex", flexDirection:"column", gap:5, justifyContent:"center" }}>
          <div style={{ height:2, width:22, background:"#1A1A1A", borderRadius:1 }}/>
          <div style={{ height:2, width:16, background:"#1A1A1A", borderRadius:1 }}/>
          <div style={{ height:2, width:22, background:"#1A1A1A", borderRadius:1 }}/>
        </div>
        <div style={{ display:"flex", gap:16, alignItems:"center" }}>
          <button style={{ border:"none", background:"none", cursor:"pointer", position:"relative" }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div style={{ width:38, height:38, borderRadius:19, background:"linear-gradient(135deg,#F59E0B,#D97706)", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <span style={{ color:"white", fontSize:15, fontWeight:700 }}>M</span>
          </div>
        </div>
      </div>

      {/* Greeting + Balance */}
      <div style={{ padding:"0 20px 20px" }}>
        <p style={{ fontSize:16, color:"#9CA3AF", marginBottom:2 }}>Michael Anthony</p>
        <p style={{ fontSize:12, color:"#B0B0B0", marginBottom:16 }}>Total Account Balance</p>
        <p style={{ fontSize:36, fontWeight:900, color:"#1A1A1A", letterSpacing:-1 }}>$40,568.00</p>
      </div>

      {/* Action Buttons */}
      <div style={{ padding:"0 20px 24px", display:"flex", gap:12, alignItems:"center" }}>
        <button style={{
          flex:1, height:48, borderRadius:24, border:"1.5px solid #E5E7EB",
          background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12l7 7 7-7" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ fontSize:14, fontWeight:600, color:"#1A1A1A" }}>Receive</span>
        </button>
        <button style={{
          flex:1, height:48, borderRadius:24, border:"none",
          background:"#5B4FFF", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8,
          boxShadow:"0 4px 16px rgba(91,79,255,0.4)",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M5 12l7-7 7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ fontSize:14, fontWeight:600, color:"white" }}>Transfer</span>
        </button>
        <button style={{
          width:48, height:48, borderRadius:24, border:"1.5px solid #E5E7EB",
          background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round"/></svg>
        </button>
      </div>

      {/* Promo Banner */}
      <div style={{ margin:"0 20px 24px" }}>
        <div style={{
          borderRadius:20, background:"#F5F4FF", padding:"20px",
          display:"flex", alignItems:"center", justifyContent:"space-between", overflow:"hidden", position:"relative",
        }}>
          <div>
            <p style={{ fontSize:14, fontWeight:700, color:"#1A1A1A", lineHeight:1.4, marginBottom:8 }}>
              Order your free debit<br/>card today
            </p>
            <p style={{ fontSize:11, color:"#9CA3AF", marginBottom:12 }}>limited Offer</p>
            <button style={{ border:"none", background:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:4, padding:0 }}>
              <span style={{ fontSize:13, fontWeight:700, color:"#5B4FFF" }}>Order Now</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12l7 7 7-7" stroke="#5B4FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
          {/* Card visual */}
          <div style={{
            width:110, height:70, borderRadius:10,
            background:"linear-gradient(135deg,#7B6EF6,#5B4FFF)",
            position:"relative", flexShrink:0,
            boxShadow:"0 8px 24px rgba(91,79,255,0.4)",
            transform:"rotate(-8deg) translateX(8px)",
          }}>
            <p style={{ position:"absolute", top:8, left:10, color:"white", fontSize:8, fontWeight:700, letterSpacing:0.5 }}>Fincore</p>
            <p style={{ position:"absolute", bottom:18, left:10, color:"rgba(255,255,255,0.8)", fontSize:7, letterSpacing:1 }}>1113 7877 5522 2578</p>
            <p style={{ position:"absolute", bottom:8, left:10, color:"rgba(255,255,255,0.6)", fontSize:6 }}>VALID 06/26</p>
            <div style={{ position:"absolute", bottom:8, right:8, width:16, height:16, borderRadius:8, background:"rgba(255,255,255,0.2)" }}/>
          </div>
        </div>
      </div>

      {/* Send Money */}
      <div style={{ padding:"0 20px 20px" }}>
        <p style={{ fontSize:16, fontWeight:700, color:"#1A1A1A", marginBottom:16 }}>Send Money</p>
        <div style={{ display:"flex", gap:12, alignItems:"center" }}>
          <button style={{
            width:52, height:52, borderRadius:26, border:"1.5px solid #E5E7EB",
            background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </button>
          {CONTACTS.map(c=>(
            <button key={c.name} style={{
              display:"flex", alignItems:"center", gap:8, padding:"8px 14px 8px 8px",
              borderRadius:26, border:"1.5px solid #E5E7EB", background:"white", cursor:"pointer",
            }}>
              <div style={{ width:36, height:36, borderRadius:18, background:c.color, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ color:"white", fontSize:12, fontWeight:700 }}>{c.initials}</span>
              </div>
              <span style={{ fontSize:13, fontWeight:600, color:"#1A1A1A" }}>{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div style={{ padding:"0 20px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <p style={{ fontSize:16, fontWeight:700, color:"#1A1A1A" }}>Transaction</p>
          <button onClick={()=>router.push("/overview")} style={{ border:"none", background:"none", cursor:"pointer", color:"#5B4FFF", fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>
            View All
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#5B4FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {TRANSACTIONS.slice(0,5).map(tx=>(
            <div key={tx.id} style={{ display:"flex", alignItems:"center", gap:12 }}>
              <TxLogo type={tx.logo}/>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:14, fontWeight:600, color:"#1A1A1A", marginBottom:2 }}>{tx.name}</p>
                <p style={{ fontSize:12, color:"#9CA3AF" }}>{tx.sub}</p>
              </div>
              <span style={{ fontSize:14, fontWeight:700, color: tx.positive ? "#10B981" : "#1A1A1A" }}>
                {tx.positive ? "+" : ""}{tx.amount < 0 ? `-$${Math.abs(tx.amount)}` : `+$${tx.amount}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TAB 2: Statistics ─────────────────────────────────────────────────────────
function StatisticsTab() {
  const router = useRouter();
  const [period, setPeriod] = useState<"Day"|"Week"|"Month"|"Year">("Month");
  const [category, setCategory] = useState<"Income"|"Spend"|"Bills">("Income");
  const bars = [
    { label:"Income", value:60300.21, height:180, color:"linear-gradient(180deg,#5B4FFF,#9B8FFF)" },
    { label:"Spend",  value:12300.21, height:110, color:"linear-gradient(180deg,#7B70FF,#B0A8FF)" },
    { label:"Bills",  value:1500.21,  height:70,  color:"linear-gradient(180deg,#9B95FF,#C8C4FF)" },
  ];
  return (
    <div style={{ flex:1, overflowY:"auto", background:"white", paddingBottom:80 }}>
      {/* Header */}
      <div style={{ padding:"20px 20px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button onClick={()=>router.push("/overview")} style={{ width:36, height:36, borderRadius:18, border:"1.5px solid #E5E7EB", background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button style={{ width:36, height:36, borderRadius:18, border:"1.5px solid #E5E7EB", background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h10M4 18h7" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>

      <div style={{ padding:"0 20px 28px" }}>
        <h1 style={{ fontSize:26, fontWeight:900, color:"#1A1A1A", lineHeight:1.2, marginBottom:20 }}>
          Financial statistics<br/>for this month
        </h1>

        {/* Period tabs */}
        <div style={{ display:"flex", background:"#F5F5F5", borderRadius:24, padding:4, marginBottom:16 }}>
          {(["Day","Week","Month","Year"] as const).map(p=>(
            <button key={p} onClick={()=>setPeriod(p)} style={{
              flex:1, height:36, borderRadius:20, border:"none", cursor:"pointer",
              background: period===p ? "#5B4FFF" : "transparent",
              color: period===p ? "white" : "#9CA3AF",
              fontSize:13, fontWeight:period===p?700:500,
            }}>{p}</button>
          ))}
        </div>

        <p style={{ fontSize:13, color:"#9CA3AF", textAlign:"center", marginBottom:24 }}>16 October 2024</p>

        {/* Income label */}
        <div style={{ marginBottom:8 }}>
          <p style={{ fontSize:12, color:"#9CA3AF" }}>Income</p>
          <p style={{ fontSize:20, fontWeight:800, color:"#1A1A1A" }}>$60300.21</p>
        </div>

        {/* Bar chart */}
        <div style={{ display:"flex", gap:16, alignItems:"flex-end", height:200, marginBottom:24 }}>
          {bars.map(b=>(
            <div key={b.label} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
              {b.label==="Spend" && (
                <div style={{ background:"#5B4FFF", borderRadius:8, padding:"4px 8px", marginBottom:4 }}>
                  <span style={{ color:"white", fontSize:11, fontWeight:600 }}>${b.value.toLocaleString()}</span>
                </div>
              )}
              <div style={{ width:"100%", height:b.height, borderRadius:12, background:b.color }}/>
            </div>
          ))}
        </div>

        {/* Category tabs */}
        <div style={{ display:"flex", background:"#F5F5F5", borderRadius:24, padding:4, marginBottom:24 }}>
          {(["Income","Spend","Bills"] as const).map(c=>(
            <button key={c} onClick={()=>setCategory(c)} style={{
              flex:1, height:36, borderRadius:20, border:"none", cursor:"pointer",
              background: category===c ? "white" : "transparent",
              color: "#1A1A1A", fontSize:13, fontWeight:category===c?700:500,
              boxShadow: category===c ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
            }}>{c}</button>
          ))}
        </div>

        {/* Transaction list */}
        <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
          {STAT_TRANSACTIONS.map((t,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12 }}>
              <TxLogo type={t.logo}/>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:14, fontWeight:600, color:"#1A1A1A", marginBottom:2 }}>{t.name}</p>
                <p style={{ fontSize:12, color:"#9CA3AF" }}>{t.sub}</p>
              </div>
              <button style={{ width:32, height:32, borderRadius:16, border:"none", background:"#F5F5F5", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TAB 3: Transfer ───────────────────────────────────────────────────────────
function TransferTab() {
  const [amount, setAmount] = useState("");
  const [selected, setSelected] = useState(0);
  return (
    <div style={{ flex:1, overflowY:"auto", background:"white", paddingBottom:80 }}>
      <div style={{ padding:"20px 20px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button style={{ width:36, height:36, borderRadius:18, border:"1.5px solid #E5E7EB", background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <p style={{ fontSize:16, fontWeight:700, color:"#1A1A1A" }}>Transfer Money</p>
        <div style={{ width:36 }}/>
      </div>

      <div style={{ padding:"0 20px" }}>
        {/* Amount input */}
        <div style={{ background:"#F8F8FF", borderRadius:20, padding:"24px 20px", marginBottom:24, textAlign:"center" }}>
          <p style={{ fontSize:13, color:"#9CA3AF", marginBottom:8 }}>Enter Amount</p>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>
            <span style={{ fontSize:28, fontWeight:800, color:"#5B4FFF" }}>$</span>
            <input
              type="number" value={amount} onChange={e=>setAmount(e.target.value)}
              placeholder="0.00"
              style={{ fontSize:36, fontWeight:900, color:"#1A1A1A", border:"none", outline:"none", background:"transparent", width:160, textAlign:"center" }}
            />
          </div>
          <p style={{ fontSize:12, color:"#9CA3AF", marginTop:8 }}>Available: $40,568.00</p>
        </div>

        {/* Send to */}
        <p style={{ fontSize:16, fontWeight:700, color:"#1A1A1A", marginBottom:16 }}>Send Money</p>
        <div style={{ display:"flex", gap:12, marginBottom:28 }}>
          <button style={{
            width:52, height:52, borderRadius:26, border:"2px dashed #E5E7EB",
            background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center",
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </button>
          {CONTACTS.map((c,i)=>(
            <button key={c.name} onClick={()=>setSelected(i)} style={{
              display:"flex", flexDirection:"column", alignItems:"center", gap:6,
              border:"none", background:"none", cursor:"pointer",
            }}>
              <div style={{
                width:52, height:52, borderRadius:26, background:c.color,
                display:"flex", alignItems:"center", justifyContent:"center",
                border: selected===i ? "2.5px solid #5B4FFF" : "2.5px solid transparent",
                boxShadow: selected===i ? "0 0 0 3px rgba(91,79,255,0.2)" : "none",
              }}>
                <span style={{ color:"white", fontSize:14, fontWeight:700 }}>{c.initials}</span>
              </div>
              <span style={{ fontSize:11, color: selected===i ? "#5B4FFF":"#9CA3AF", fontWeight:selected===i?700:500 }}>{c.name}</span>
            </button>
          ))}
        </div>

        {/* Quick amounts */}
        <p style={{ fontSize:14, fontWeight:600, color:"#9CA3AF", marginBottom:12 }}>Quick Amount</p>
        <div style={{ display:"flex", gap:10, marginBottom:32 }}>
          {[50,100,200,500].map(v=>(
            <button key={v} onClick={()=>setAmount(String(v))} style={{
              flex:1, height:40, borderRadius:20,
              border: amount===String(v) ? "2px solid #5B4FFF" : "1.5px solid #E5E7EB",
              background: amount===String(v) ? "#F0EFFF" : "white",
              color: amount===String(v) ? "#5B4FFF" : "#1A1A1A",
              fontSize:13, fontWeight:600, cursor:"pointer",
            }}>${v}</button>
          ))}
        </div>

        {/* Send button */}
        <button style={{
          width:"100%", height:56, borderRadius:28, border:"none",
          background: amount && selected>=0 ? "linear-gradient(135deg,#5B4FFF,#7C6FFF)" : "#E5E7EB",
          color: amount && selected>=0 ? "white" : "#9CA3AF",
          fontSize:16, fontWeight:700, cursor:"pointer",
          boxShadow: amount && selected>=0 ? "0 8px 24px rgba(91,79,255,0.35)" : "none",
        }}>
          Send Money ↑
        </button>
      </div>
    </div>
  );
}

// ─── TAB 4: Card ──────────────────────────────────────────────────────────────
function CardTab() {
  const [subTab, setSubTab] = useState<"Cards"|"Wallets">("Cards");
  const cards = [
    { gradient:"linear-gradient(135deg,#5B4FFF,#9B8FFF)", flag:"🇺🇸", name:"Michael Anthony", balance:"$20,284.00", number:"2507 5645 6685 5633", expires:"01/25" },
    { gradient:"linear-gradient(135deg,#374151,#1A1A1A)", flag:"🇩🇪", name:"Michael Anthony", balance:"$12,568.00", number:"4012 3456 7890 1234", expires:"03/26" },
    { gradient:"linear-gradient(135deg,#F59E0B,#D97706)", flag:"🇬🇧", name:"Michael Anthony", balance:"$20,568.06", number:"2507 5645 6685 5633", expires:"01/25" },
  ];

  return (
    <div style={{ flex:1, overflowY:"auto", background:"white", paddingBottom:80 }}>
      {/* Header */}
      <div style={{ padding:"20px 20px 12px", display:"flex", alignItems:"center", gap:12 }}>
        <div style={{ width:38, height:38, borderRadius:19, background:"linear-gradient(135deg,#F59E0B,#D97706)", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <span style={{ color:"white", fontSize:15, fontWeight:700 }}>M</span>
        </div>
        <div style={{ flex:1, display:"flex", background:"#F5F5F5", borderRadius:20, overflow:"hidden" }}>
          {(["Cards","Wallets"] as const).map(t=>(
            <button key={t} onClick={()=>setSubTab(t)} style={{
              flex:1, height:36, border:"none", cursor:"pointer",
              background: subTab===t ? "white" : "transparent",
              fontSize:13, fontWeight:subTab===t?700:500,
              color: subTab===t ? "#1A1A1A" : "#9CA3AF",
              borderRadius:18, margin:2,
            }}>{t}</button>
          ))}
        </div>
        <button style={{ width:36, height:36, borderRadius:18, border:"1.5px solid #E5E7EB", background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#1A1A1A" strokeWidth="2"/><path d="m21 21-4.35-4.35" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>

      {/* Balance */}
      <div style={{ padding:"8px 20px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div>
          <p style={{ fontSize:12, color:"#9CA3AF", marginBottom:4 }}>Total Account Balance</p>
          <p style={{ fontSize:24, fontWeight:900, color:"#1A1A1A" }}>40,568.06</p>
        </div>
        <div style={{ display:"flex", gap:10 }}>
          <button style={{ width:36, height:36, borderRadius:18, border:"1.5px solid #E5E7EB", background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <button style={{ width:36, height:36, borderRadius:18, border:"1.5px solid #E5E7EB", background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="#1A1A1A" strokeWidth="2"/><path d="M12 2v3M12 19v3M4.22 4.22l2.12 2.12M17.66 17.66l2.12 2.12M2 12h3M19 12h3M4.22 19.78l2.12-2.12M17.66 6.34l2.12-2.12" stroke="#1A1A1A" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ padding:"0 20px 20px", display:"flex", gap:10, alignItems:"center" }}>
        <button style={{ flex:1, height:44, borderRadius:22, border:"1.5px solid #E5E7EB", background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M5 12l7-7 7 7" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ fontSize:13, fontWeight:600 }}>Deposit</span>
        </button>
        <button style={{ width:44, height:44, borderRadius:22, border:"none", background:"#5B4FFF", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="1.5" fill="white"/><circle cx="6" cy="12" r="1.5" fill="white"/><circle cx="18" cy="12" r="1.5" fill="white"/>
          </svg>
        </button>
        <button style={{ flex:1, height:44, borderRadius:22, border:"1.5px solid #E5E7EB", background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12l7 7 7-7" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ fontSize:13, fontWeight:600 }}>Withdraw</span>
        </button>
      </div>

      {/* Add card */}
      <div style={{ padding:"0 20px 16px", display:"flex", alignItems:"center", gap:16 }}>
        <button style={{ width:40, height:40, borderRadius:20, border:"2px dashed #D1D5DB", background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round"/></svg>
        </button>
        <div>
          <p style={{ fontSize:12, color:"#9CA3AF" }}>Add Your</p>
          <p style={{ fontSize:15, fontWeight:700, color:"#1A1A1A" }}>New Card</p>
        </div>
        <div style={{ flex:1 }}/>
        <button style={{ height:36, paddingLeft:14, paddingRight:14, borderRadius:18, border:"none", background:"#5B4FFF", color:"white", fontSize:12, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", gap:6 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
          Connect Bank
        </button>
        <button style={{ height:36, paddingLeft:14, paddingRight:14, borderRadius:18, border:"1.5px solid #E5E7EB", background:"white", color:"#1A1A1A", fontSize:12, fontWeight:600, cursor:"pointer" }}>
          Remove Card
        </button>
      </div>

      {/* Card stack */}
      <div style={{ padding:"0 20px", display:"flex", flexDirection:"column", gap:12 }}>
        {cards.map((c,i)=>(
          <CreditCard key={i} {...c}/>
        ))}
      </div>
    </div>
  );
}

// ─── TAB 5: Account ────────────────────────────────────────────────────────────
function AccountTab() {
  const router = useRouter();
  const [faceId, setFaceId] = useState(true);

  const menuSections = [
    {
      items:[
        { icon:"👤", label:"Personal Details", arrow:true },
        { icon:"🔔", label:"Notifications", arrow:true },
        { icon:"🔲", label:"Set Up Face ID", toggle:true },
        { icon:"🔒", label:"Privacy & Security", arrow:true },
      ]
    },
    {
      items:[
        { icon:"⚙️", label:"Settings", arrow:true },
        { icon:"📋", label:"Terms And Conditions", arrow:true },
        { icon:"💬", label:"Support", arrow:true },
      ]
    },
  ];

  return (
    <div style={{ flex:1, overflowY:"auto", background:"#F8F8F8", paddingBottom:80 }}>
      {/* Header */}
      <div style={{ padding:"20px 20px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"white" }}>
        <button style={{ width:36, height:36, borderRadius:18, border:"1.5px solid #E5E7EB", background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <p style={{ fontSize:16, fontWeight:700, color:"#1A1A1A" }}>Profile</p>
        <button style={{ width:36, height:36, borderRadius:18, border:"none", background:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h10M4 18h7" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>

      {/* Avatar */}
      <div style={{ background:"white", padding:"20px 20px 28px", display:"flex", flexDirection:"column", alignItems:"center" }}>
        <div style={{
          width:80, height:80, borderRadius:40, background:"linear-gradient(135deg,#F59E0B,#D97706)",
          display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12,
          fontSize:36,
        }}>
          👤
        </div>
        <p style={{ fontSize:18, fontWeight:700, color:"#1A1A1A", marginBottom:8 }}>Michael Anthony</p>
        <div style={{ display:"flex", alignItems:"center", gap:6, background:"#5B4FFF", borderRadius:16, padding:"4px 14px" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/></svg>
          <span style={{ fontSize:12, fontWeight:600, color:"white" }}>Verified</span>
        </div>
      </div>

      <div style={{ height:8, background:"#F8F8F8" }}/>

      {/* Menu sections */}
      {menuSections.map((section, si)=>(
        <div key={si}>
          <div style={{ background:"white", marginBottom:8 }}>
            {section.items.map((item, ii)=>(
              <div key={ii} style={{
                display:"flex", alignItems:"center", gap:14, padding:"16px 20px",
                borderBottom: ii < section.items.length-1 ? "1px solid #F3F4F6" : "none",
                cursor:"pointer",
              }}>
                <div style={{ width:38, height:38, borderRadius:19, background:"#F0EFFF", display:"flex", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:18 }}>{item.icon}</span>
                </div>
                <span style={{ flex:1, fontSize:14, fontWeight:600, color:"#1A1A1A" }}>{item.label}</span>
                {"toggle" in item ? (
                  <button onClick={()=>setFaceId(!faceId)} style={{
                    width:46, height:26, borderRadius:13, border:"none", cursor:"pointer",
                    background: faceId ? "#5B4FFF" : "#E5E7EB", position:"relative", transition:"background 0.2s",
                  }}>
                    <div style={{
                      width:20, height:20, borderRadius:10, background:"white",
                      position:"absolute", top:3, transition:"left 0.2s",
                      left: faceId ? 23 : 3,
                      boxShadow:"0 2px 4px rgba(0,0,0,0.2)",
                    }}/>
                  </button>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Log Out */}
      <div style={{ padding:"16px 20px 8px" }}>
        <button onClick={()=>router.push("/login")} style={{
          display:"flex", alignItems:"center", gap:10, padding:"14px 20px",
          background:"#FFF0F0", borderRadius:16, border:"none", cursor:"pointer", width:"100%",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ fontSize:14, fontWeight:700, color:"#EF4444" }}>Log Out</span>
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [tab, setTab] = useState<Tab>("home");
  return (
    <main style={{ position:"relative", width:"100%", height:"100dvh", overflow:"hidden", maxWidth:430, margin:"0 auto", background:"white", display:"flex", flexDirection:"column" }}>
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden", position:"relative" }}>
        {tab==="home"       && <HomeTab/>}
        {tab==="statistics" && <StatisticsTab/>}
        {tab==="transfer"   && <TransferTab/>}
        {tab==="card"       && <CardTab/>}
        {tab==="account"    && <AccountTab/>}
      </div>
      <BottomNav active={tab} onTab={setTab}/>
    </main>
  );
}
