"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useApp, fmtMoney, groupByDate, type Transaction, type Card } from "@/lib/store";

type Tab = "home" | "statistics" | "transfer" | "card" | "account";

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ msg, ok }: { msg:string; ok:boolean }) {
  return (
    <div style={{
      position:"fixed", top:24, left:"50%", transform:"translateX(-50%)",
      background: ok?"#10B981":"#EF4444", color:"white",
      padding:"12px 24px", borderRadius:28, fontSize:13, fontWeight:700,
      boxShadow:"0 8px 24px rgba(0,0,0,0.2)", zIndex:9999,
      animation:"fadeInUp 0.3s ease",
      whiteSpace:"nowrap",
    }}>{msg}</div>
  );
}

// ─── Logo ─────────────────────────────────────────────────────────────────────
function TxLogo({ type, size=44 }: { type:string; size?:number }) {
  const s: React.CSSProperties = { width:size, height:size, borderRadius:size/2, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 };
  if (type==="visa")    return <div style={{...s,background:"#1A1F71"}}><span style={{color:"white",fontSize:11,fontWeight:900,letterSpacing:1}}>VISA</span></div>;
  if (type==="paypal")  return <div style={{...s,background:"#003087"}}><span style={{color:"white",fontSize:16,fontWeight:900}}>P</span></div>;
  if (type==="netflix") return <div style={{...s,background:"#E50914"}}><span style={{color:"white",fontSize:13,fontWeight:900}}>N</span></div>;
  if (type==="amazon")  return <div style={{...s,background:"#FF9900"}}><span style={{color:"white",fontSize:13,fontWeight:900}}>a</span></div>;
  if (type==="spotify") return <div style={{...s,background:"#1DB954"}}><span style={{color:"white",fontSize:16}}>♪</span></div>;
  if (type==="meta")    return <div style={{...s,background:"#1877F2"}}><span style={{color:"white",fontSize:16,fontWeight:900}}>f</span></div>;
  if (type==="person")  return <div style={{...s,background:"#D1D5DB"}}><span style={{fontSize:size*0.45}}>👤</span></div>;
  return <div style={{...s,background:"#F3F4F6"}}><span style={{fontSize:20}}>💳</span></div>;
}

// ─── Card Visual ───────────────────────────────────────────────────────────────
function CardVisual({ card, style }: { card:Card; style?:React.CSSProperties }) {
  return (
    <div style={{ width:"100%", borderRadius:20, padding:"20px 24px", background:card.gradient, position:"relative", overflow:"hidden", ...style }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:28,height:28,borderRadius:14,background:"rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <span style={{ fontSize:12 }}>👤</span>
          </div>
          <span style={{ color:"white",fontSize:12,fontWeight:600 }}>{card.holder}</span>
        </div>
        <span style={{ fontSize:20 }}>{card.flag}</span>
      </div>
      <p style={{ color:"rgba(255,255,255,0.7)",fontSize:10,marginBottom:2 }}>Total balance</p>
      <p style={{ color:"white",fontSize:22,fontWeight:800,marginBottom:14 }}>${fmtMoney(card.balance)}</p>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-end" }}>
        <div>
          <p style={{ color:"rgba(255,255,255,0.6)",fontSize:9,marginBottom:2 }}>card number</p>
          <p style={{ color:"white",fontSize:12,fontWeight:600,letterSpacing:2 }}>{card.number}</p>
        </div>
        <div style={{ textAlign:"right" }}>
          <p style={{ color:"rgba(255,255,255,0.6)",fontSize:9,marginBottom:2 }}>Expires</p>
          <p style={{ color:"white",fontSize:12,fontWeight:600 }}>{card.expiry}</p>
        </div>
      </div>
      <div style={{ position:"absolute",top:-20,right:-20,width:100,height:100,borderRadius:50,background:"rgba(255,255,255,0.07)" }}/>
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ title, onClose, children }: { title:string; onClose:()=>void; children:React.ReactNode }) {
  return (
    <div style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:1000,display:"flex",alignItems:"flex-end",justifyContent:"center" }} onClick={onClose}>
      <div style={{ width:"100%",maxWidth:430,background:"white",borderRadius:"24px 24px 0 0",padding:"0 0 40px",animation:"slideUp 0.3s ease" }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex",justifyContent:"center",padding:"12px 0 4px" }}>
          <div style={{ width:36,height:4,borderRadius:2,background:"#E5E7EB" }}/>
        </div>
        <div style={{ padding:"12px 20px 20px",display:"flex",justifyContent:"space-between",alignItems:"center" }}>
          <p style={{ fontSize:16,fontWeight:700,color:"#1A1A1A" }}>{title}</p>
          <button onClick={onClose} style={{ width:32,height:32,borderRadius:16,border:"1.5px solid #E5E7EB",background:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div style={{ padding:"0 20px" }}>{children}</div>
      </div>
    </div>
  );
}

// ─── Bottom Nav ───────────────────────────────────────────────────────────────
function BottomNav({ active, onTab, unread }: { active:Tab; onTab:(t:Tab)=>void; unread:number }) {
  const tabs: { key:Tab; label:string; icon:React.ReactNode }[] = [
    { key:"home", label:"Home", icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { key:"statistics", label:"Statistics", icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="3" y="12" width="4" height="9" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="10" y="7" width="4" height="14" rx="1" stroke="currentColor" strokeWidth="2"/><rect x="17" y="3" width="4" height="18" rx="1" stroke="currentColor" strokeWidth="2"/></svg> },
    { key:"transfer", label:"Transfer", icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M7 16V4m0 0L3 8m4-4l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 8v12m0 0l4-4m-4 4l-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
    { key:"card", label:"Card", icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="3" stroke="currentColor" strokeWidth="2"/><path d="M2 10h20" stroke="currentColor" strokeWidth="2"/></svg> },
    { key:"account", label:"Account", icon:<svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/><path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
  ];
  return (
    <div style={{ background:"white",borderTop:"1px solid #F3F4F6",display:"flex",padding:"10px 0 20px" }}>
      {tabs.map(t=>(
        <button key={t.key} onClick={()=>onTab(t.key)} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,border:"none",background:"none",cursor:"pointer",color:active===t.key?"#5B4FFF":"#9CA3AF",position:"relative" }}>
          {t.key==="account" && unread>0 && (
            <div style={{ position:"absolute",top:-2,right:"calc(50% - 16px)",width:16,height:16,borderRadius:8,background:"#EF4444",display:"flex",alignItems:"center",justifyContent:"center" }}>
              <span style={{ fontSize:9,fontWeight:700,color:"white" }}>{unread}</span>
            </div>
          )}
          {t.icon}
          <span style={{ fontSize:10,fontWeight:active===t.key?700:500 }}>{t.label}</span>
        </button>
      ))}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 1 — HOME
// ═══════════════════════════════════════════════════════════════════════════════
function HomeTab({ onTransfer }: { onTransfer:()=>void }) {
  const router = useRouter();
  const { state, unreadCount } = useApp();
  const { user, totalBalance, transactions, contacts, notifications } = state;

  return (
    <div style={{ flex:1,overflowY:"auto",background:"white",paddingBottom:4 }}>
      {/* Header */}
      <div style={{ padding:"20px 20px 12px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div style={{ display:"flex",flexDirection:"column",gap:5,justifyContent:"center",cursor:"pointer" }}>
          <div style={{ height:2,width:22,background:"#1A1A1A",borderRadius:1 }}/>
          <div style={{ height:2,width:16,background:"#1A1A1A",borderRadius:1 }}/>
          <div style={{ height:2,width:22,background:"#1A1A1A",borderRadius:1 }}/>
        </div>
        <div style={{ display:"flex",gap:16,alignItems:"center" }}>
          <button style={{ border:"none",background:"none",cursor:"pointer",position:"relative" }} onClick={()=>router.push("/notifications")}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            {unreadCount>0 && <div style={{ position:"absolute",top:-2,right:-2,width:14,height:14,borderRadius:7,background:"#EF4444",display:"flex",alignItems:"center",justifyContent:"center" }}><span style={{ fontSize:8,fontWeight:700,color:"white" }}>{unreadCount}</span></div>}
          </button>
          <div style={{ width:38,height:38,borderRadius:19,background:"linear-gradient(135deg,#5B4FFF,#7C6FFF)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer" }}>
            <span style={{ color:"white",fontSize:14,fontWeight:700 }}>{user.avatar}</span>
          </div>
        </div>
      </div>

      {/* Greeting */}
      <div style={{ padding:"0 20px 20px" }}>
        <p style={{ fontSize:16,color:"#9CA3AF",marginBottom:2 }}>{user.firstName} {user.lastName}</p>
        <p style={{ fontSize:12,color:"#B0B0B0",marginBottom:16 }}>Total Account Balance</p>
        <p style={{ fontSize:36,fontWeight:900,color:"#1A1A1A",letterSpacing:-1 }}>${fmtMoney(totalBalance)}</p>
      </div>

      {/* Action Buttons */}
      <div style={{ padding:"0 20px 24px",display:"flex",gap:12,alignItems:"center" }}>
        <button onClick={()=>router.push("/receive")} style={{ flex:1,height:48,borderRadius:24,border:"1.5px solid #E5E7EB",background:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12l7 7 7-7" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ fontSize:14,fontWeight:600,color:"#1A1A1A" }}>Receive</span>
        </button>
        <button onClick={onTransfer} style={{ flex:1,height:48,borderRadius:24,border:"none",background:"#5B4FFF",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 4px 16px rgba(91,79,255,0.4)" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M5 12l7-7 7 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ fontSize:14,fontWeight:600,color:"white" }}>Transfer</span>
        </button>
        <button onClick={()=>router.push("/add-money")} style={{ width:48,height:48,borderRadius:24,border:"1.5px solid #E5E7EB",background:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round"/></svg>
        </button>
      </div>

      {/* Promo Banner */}
      <div style={{ margin:"0 20px 24px",borderRadius:20,background:"#F5F4FF",padding:"20px",display:"flex",alignItems:"center",justifyContent:"space-between",overflow:"hidden",position:"relative" }}>
        <div>
          <p style={{ fontSize:14,fontWeight:700,color:"#1A1A1A",lineHeight:1.4,marginBottom:8 }}>Order your free debit<br/>card today</p>
          <p style={{ fontSize:11,color:"#9CA3AF",marginBottom:12 }}>limited Offer</p>
          <button onClick={()=>router.push("/add-card")} style={{ border:"none",background:"none",cursor:"pointer",display:"flex",alignItems:"center",gap:4,padding:0 }}>
            <span style={{ fontSize:13,fontWeight:700,color:"#5B4FFF" }}>Order Now</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#5B4FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        <div style={{ width:110,height:70,borderRadius:10,background:"linear-gradient(135deg,#7B6EF6,#5B4FFF)",position:"relative",flexShrink:0,boxShadow:"0 8px 24px rgba(91,79,255,0.4)",transform:"rotate(-8deg) translateX(8px)" }}>
          <p style={{ position:"absolute",top:8,left:10,color:"white",fontSize:8,fontWeight:700 }}>Fincore</p>
          <p style={{ position:"absolute",bottom:18,left:10,color:"rgba(255,255,255,0.8)",fontSize:7,letterSpacing:1 }}>1113 7877 5522 2578</p>
          <p style={{ position:"absolute",bottom:8,left:10,color:"rgba(255,255,255,0.6)",fontSize:6 }}>VALID 06/26</p>
        </div>
      </div>

      {/* Send Money */}
      <div style={{ padding:"0 20px 20px" }}>
        <p style={{ fontSize:16,fontWeight:700,color:"#1A1A1A",marginBottom:16 }}>Send Money</p>
        <div style={{ display:"flex",gap:12,alignItems:"center",overflowX:"auto",paddingBottom:4 }}>
          <button onClick={()=>router.push("/contacts")} style={{ width:52,height:52,borderRadius:26,border:"1.5px solid #E5E7EB",background:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round"/></svg>
          </button>
          {contacts.map(c=>(
            <button key={c.id} onClick={onTransfer} style={{ display:"flex",alignItems:"center",gap:8,padding:"8px 14px 8px 8px",borderRadius:26,border:"1.5px solid #E5E7EB",background:"white",cursor:"pointer",flexShrink:0 }}>
              <div style={{ width:36,height:36,borderRadius:18,background:c.color,display:"flex",alignItems:"center",justifyContent:"center" }}>
                <span style={{ color:"white",fontSize:12,fontWeight:700 }}>{c.initials}</span>
              </div>
              <span style={{ fontSize:13,fontWeight:600,color:"#1A1A1A" }}>{c.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div style={{ padding:"0 20px 20px" }}>
        <div style={{ display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16 }}>
          <p style={{ fontSize:16,fontWeight:700,color:"#1A1A1A" }}>Transaction</p>
          <button onClick={()=>router.push("/overview")} style={{ border:"none",background:"none",cursor:"pointer",color:"#5B4FFF",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:4 }}>
            View All<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#5B4FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
          {transactions.slice(0,5).map(tx=>(
            <div key={tx.id} style={{ display:"flex",alignItems:"center",gap:12 }}>
              <TxLogo type={tx.logo}/>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:14,fontWeight:600,color:"#1A1A1A",marginBottom:2 }}>{tx.name}</p>
                <p style={{ fontSize:12,color:tx.status==="canceled"?"#EF4444":"#9CA3AF" }}>{tx.date}</p>
              </div>
              <span style={{ fontSize:14,fontWeight:700,color:tx.amount>0?"#10B981":tx.status==="canceled"?"#EF4444":"#1A1A1A" }}>
                {tx.amount>0?`+$${fmtMoney(tx.amount)}`:`-$${fmtMoney(Math.abs(tx.amount))}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 2 — STATISTICS
// ═══════════════════════════════════════════════════════════════════════════════
function StatisticsTab() {
  const router = useRouter();
  const { state, income, spending } = useApp();
  const [period, setPeriod] = useState<"Day"|"Week"|"Month"|"Year">("Month");
  const [category, setCategory] = useState<"Income"|"Spend"|"Bills">("Income");

  // Compute bars from real transactions
  const bills = state.transactions.filter(t=>["Streaming","Housing"].includes(t.category)).reduce((s,t)=>s+Math.abs(t.amount),0);
  const maxBar = Math.max(income, spending, bills, 1);
  const bars = [
    { label:"Income", value:income,   height:Math.round((income/maxBar)*180),   color:"linear-gradient(180deg,#5B4FFF,#9B8FFF)" },
    { label:"Spend",  value:spending, height:Math.round((spending/maxBar)*180),  color:"linear-gradient(180deg,#7B70FF,#B0A8FF)" },
    { label:"Bills",  value:bills,    height:Math.round((bills/maxBar)*180)||30, color:"linear-gradient(180deg,#9B95FF,#C8C4FF)" },
  ];

  const filtered = category==="Income"
    ? state.transactions.filter(t=>t.amount>0)
    : category==="Spend"
    ? state.transactions.filter(t=>t.amount<0 && !["Streaming","Housing"].includes(t.category))
    : state.transactions.filter(t=>["Streaming","Housing"].includes(t.category));

  return (
    <div style={{ flex:1,overflowY:"auto",background:"white",paddingBottom:4 }}>
      <div style={{ padding:"20px 20px 16px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <button onClick={()=>router.push("/overview")} style={{ width:36,height:36,borderRadius:18,border:"1.5px solid #E5E7EB",background:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button style={{ width:36,height:36,borderRadius:18,border:"1.5px solid #E5E7EB",background:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h10M4 18h7" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>
      <div style={{ padding:"0 20px 28px" }}>
        <h1 style={{ fontSize:24,fontWeight:900,color:"#1A1A1A",lineHeight:1.2,marginBottom:20 }}>Financial statistics<br/>for this month</h1>
        <div style={{ display:"flex",background:"#F5F5F5",borderRadius:24,padding:4,marginBottom:16 }}>
          {(["Day","Week","Month","Year"] as const).map(p=>(
            <button key={p} onClick={()=>setPeriod(p)} style={{ flex:1,height:36,borderRadius:20,border:"none",cursor:"pointer",background:period===p?"#5B4FFF":"transparent",color:period===p?"white":"#9CA3AF",fontSize:13,fontWeight:period===p?700:500 }}>{p}</button>
          ))}
        </div>
        <p style={{ fontSize:13,color:"#9CA3AF",textAlign:"center",marginBottom:24 }}>{new Date().toLocaleDateString("en-US",{day:"numeric",month:"long",year:"numeric"})}</p>

        {/* Income label */}
        <div style={{ marginBottom:8 }}>
          <p style={{ fontSize:12,color:"#9CA3AF" }}>Income</p>
          <p style={{ fontSize:20,fontWeight:800,color:"#1A1A1A" }}>${fmtMoney(income)}</p>
        </div>

        {/* Bars */}
        <div style={{ display:"flex",gap:16,alignItems:"flex-end",height:200,marginBottom:8 }}>
          {bars.map(b=>(
            <div key={b.label} style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:6 }}>
              {b.label==="Spend" && (
                <div style={{ background:"#5B4FFF",borderRadius:8,padding:"3px 8px" }}>
                  <span style={{ color:"white",fontSize:10,fontWeight:600 }}>${fmtMoney(b.value)}</span>
                </div>
              )}
              <div style={{ width:"100%",height:Math.max(b.height,20),borderRadius:12,background:b.color }}/>
              <span style={{ fontSize:11,color:"#9CA3AF" }}>{b.label}</span>
            </div>
          ))}
        </div>

        {/* Category tabs */}
        <div style={{ display:"flex",background:"#F5F5F5",borderRadius:24,padding:4,marginBottom:20 }}>
          {(["Income","Spend","Bills"] as const).map(c=>(
            <button key={c} onClick={()=>setCategory(c)} style={{ flex:1,height:36,borderRadius:20,border:"none",cursor:"pointer",background:category===c?"white":"transparent",color:"#1A1A1A",fontSize:13,fontWeight:category===c?700:500,boxShadow:category===c?"0 2px 8px rgba(0,0,0,0.08)":"none" }}>{c}</button>
          ))}
        </div>

        {/* Transaction list filtered */}
        <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
          {filtered.slice(0,5).map(tx=>(
            <div key={tx.id} style={{ display:"flex",alignItems:"center",gap:12 }}>
              <TxLogo type={tx.logo}/>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:14,fontWeight:600,color:"#1A1A1A",marginBottom:2 }}>{tx.name}</p>
                <p style={{ fontSize:12,color:"#9CA3AF" }}>{tx.date}</p>
              </div>
              <span style={{ fontSize:14,fontWeight:700,color:tx.amount>0?"#10B981":"#1A1A1A" }}>
                {tx.amount>0?`+$${fmtMoney(tx.amount)}`:`-$${fmtMoney(Math.abs(tx.amount))}`}
              </span>
            </div>
          ))}
          {filtered.length===0 && <p style={{ fontSize:13,color:"#9CA3AF",textAlign:"center",padding:"20px 0" }}>No transactions in this category</p>}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 3 — TRANSFER
// ═══════════════════════════════════════════════════════════════════════════════
function TransferTab({ onDone }: { onDone:()=>void }) {
  const { state, transfer } = useApp();
  const [amount, setAmount] = useState("");
  const [selectedId, setSelectedId] = useState<string|null>(null);
  const [note, setNote] = useState("");
  const [toast, setToast] = useState<{msg:string;ok:boolean}|null>(null);
  const [step, setStep] = useState<"form"|"confirm"|"success">("form");

  const showToast = (msg:string,ok:boolean) => {
    setToast({msg,ok});
    setTimeout(()=>setToast(null),2500);
  };

  const selectedContact = state.contacts.find(c=>c.id===selectedId);
  const amt = parseFloat(amount)||0;
  const canProceed = amt>0 && amt<=state.totalBalance && !!selectedId;

  function handleConfirm() {
    if (!selectedContact) return;
    const ok = transfer(selectedContact.name, amt, note);
    if (ok) { setStep("success"); setTimeout(()=>{ setStep("form"); setAmount(""); setSelectedId(null); setNote(""); onDone(); },2000); }
    else showToast("Insufficient balance",false);
  }

  if (step==="confirm" && selectedContact) return (
    <div style={{ flex:1,display:"flex",flexDirection:"column",background:"white",padding:"20px" }}>
      {toast && <Toast msg={toast.msg} ok={toast.ok}/>}
      <button onClick={()=>setStep("form")} style={{ width:36,height:36,borderRadius:18,border:"1.5px solid #E5E7EB",background:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/></svg>
      </button>
      <h2 style={{ fontSize:22,fontWeight:900,color:"#1A1A1A",marginBottom:6 }}>Confirm Transfer</h2>
      <p style={{ fontSize:14,color:"#9CA3AF",marginBottom:32 }}>Please review the details below</p>
      <div style={{ background:"#F8F8F8",borderRadius:20,padding:"20px",marginBottom:24,display:"flex",flexDirection:"column",gap:16 }}>
        {[
          { l:"Recipient", v:selectedContact.name },
          { l:"Account",   v:selectedContact.accountNumber },
          { l:"Amount",    v:`$${fmtMoney(amt)}` },
          { l:"Fee",       v:"$0.00" },
          { l:"Total",     v:`$${fmtMoney(amt)}` },
          ...(note?[{ l:"Note", v:note }]:[]),
        ].map(row=>(
          <div key={row.l} style={{ display:"flex",justifyContent:"space-between" }}>
            <span style={{ fontSize:13,color:"#9CA3AF" }}>{row.l}</span>
            <span style={{ fontSize:13,fontWeight:700,color:"#1A1A1A" }}>{row.v}</span>
          </div>
        ))}
      </div>
      <div style={{ flex:1 }}/>
      <button onClick={handleConfirm} style={{ width:"100%",height:56,borderRadius:28,border:"none",background:"linear-gradient(135deg,#5B4FFF,#7C6FFF)",color:"white",fontSize:16,fontWeight:700,cursor:"pointer",boxShadow:"0 8px 24px rgba(91,79,255,0.35)" }}>
        Confirm & Send
      </button>
    </div>
  );

  if (step==="success") return (
    <div style={{ flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",background:"white",padding:"0 28px" }}>
      <div style={{ width:80,height:80,borderRadius:40,background:"linear-gradient(135deg,#10B981,#34D399)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:20,animation:"floatY 3s ease-in-out infinite" }}>
        <svg width="36" height="28" viewBox="0 0 36 28" fill="none"><path d="M2 14l10 10L34 2" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </div>
      <p style={{ fontSize:22,fontWeight:900,color:"#1A1A1A",marginBottom:8 }}>Transfer Sent!</p>
      <p style={{ fontSize:14,color:"#9CA3AF" }}>${fmtMoney(amt)} sent to {selectedContact?.name}</p>
    </div>
  );

  return (
    <div style={{ flex:1,overflowY:"auto",background:"white",paddingBottom:4 }}>
      {toast && <Toast msg={toast.msg} ok={toast.ok}/>}
      <div style={{ padding:"20px 20px 0",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <button onClick={onDone} style={{ width:36,height:36,borderRadius:18,border:"1.5px solid #E5E7EB",background:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round"/></svg>
        </button>
        <p style={{ fontSize:16,fontWeight:700,color:"#1A1A1A" }}>Transfer Money</p>
        <div style={{ width:36 }}/>
      </div>

      {/* Amount */}
      <div style={{ background:"#F8F8FF",borderRadius:20,margin:"16px 20px",padding:"24px 20px",textAlign:"center" }}>
        <p style={{ fontSize:13,color:"#9CA3AF",marginBottom:8 }}>Enter Amount</p>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"center",gap:4 }}>
          <span style={{ fontSize:28,fontWeight:800,color:"#5B4FFF" }}>$</span>
          <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0.00"
            style={{ fontSize:36,fontWeight:900,color:"#1A1A1A",border:"none",outline:"none",background:"transparent",width:160,textAlign:"center" }}/>
        </div>
        <p style={{ fontSize:12,color:amt>state.totalBalance?"#EF4444":"#9CA3AF",marginTop:8 }}>
          Available: ${fmtMoney(state.totalBalance)}
        </p>
      </div>

      {/* Send To */}
      <div style={{ padding:"0 20px 20px" }}>
        <p style={{ fontSize:16,fontWeight:700,color:"#1A1A1A",marginBottom:16 }}>Send To</p>
        <div style={{ display:"flex",gap:12,marginBottom:20 }}>
          {state.contacts.map(c=>(
            <button key={c.id} onClick={()=>setSelectedId(c.id)} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:6,border:"none",background:"none",cursor:"pointer" }}>
              <div style={{ width:52,height:52,borderRadius:26,background:c.color,display:"flex",alignItems:"center",justifyContent:"center",border:selectedId===c.id?"3px solid #5B4FFF":"3px solid transparent",boxShadow:selectedId===c.id?"0 0 0 3px rgba(91,79,255,0.2)":"none",transition:"all 0.15s" }}>
                <span style={{ color:"white",fontSize:14,fontWeight:700 }}>{c.initials}</span>
              </div>
              <span style={{ fontSize:11,color:selectedId===c.id?"#5B4FFF":"#9CA3AF",fontWeight:selectedId===c.id?700:500 }}>{c.name}</span>
            </button>
          ))}
        </div>

        {/* Note */}
        <div style={{ marginBottom:20 }}>
          <input value={note} onChange={e=>setNote(e.target.value)} placeholder="Add a note (optional)"
            style={{ width:"100%",height:48,borderRadius:14,border:"1.5px solid #E5E7EB",padding:"0 16px",fontSize:14,outline:"none",background:"white",boxSizing:"border-box" }}/>
        </div>

        {/* Quick amounts */}
        <div style={{ display:"flex",gap:10,marginBottom:28 }}>
          {[50,100,200,500].map(v=>(
            <button key={v} onClick={()=>setAmount(String(v))} style={{ flex:1,height:40,borderRadius:20,border:amount===String(v)?"2px solid #5B4FFF":"1.5px solid #E5E7EB",background:amount===String(v)?"#F0EFFF":"white",color:amount===String(v)?"#5B4FFF":"#1A1A1A",fontSize:13,fontWeight:600,cursor:"pointer" }}>${v}</button>
          ))}
        </div>

        {/* Selected contact info */}
        {selectedContact && (
          <div style={{ background:"#F0EFFF",borderRadius:16,padding:"14px 16px",marginBottom:20,display:"flex",alignItems:"center",gap:12 }}>
            <div style={{ width:40,height:40,borderRadius:20,background:selectedContact.color,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <span style={{ color:"white",fontWeight:700 }}>{selectedContact.initials}</span>
            </div>
            <div>
              <p style={{ fontSize:14,fontWeight:700,color:"#5B4FFF" }}>{selectedContact.name}</p>
              <p style={{ fontSize:12,color:"#9CA3AF" }}>{selectedContact.phone}</p>
            </div>
          </div>
        )}

        <button onClick={()=>canProceed&&setStep("confirm")} disabled={!canProceed} style={{ width:"100%",height:56,borderRadius:28,border:"none",background:canProceed?"linear-gradient(135deg,#5B4FFF,#7C6FFF)":"#E5E7EB",color:canProceed?"white":"#9CA3AF",fontSize:16,fontWeight:700,cursor:canProceed?"pointer":"default",boxShadow:canProceed?"0 8px 24px rgba(91,79,255,0.35)":"none" }}>
          Continue →
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 4 — CARD
// ═══════════════════════════════════════════════════════════════════════════════
function CardTab() {
  const router = useRouter();
  const { state, dispatch, addMoney, withdraw } = useApp();
  const [subTab, setSubTab] = useState<"Cards"|"Wallets">("Cards");
  const [activeIdx, setActiveIdx] = useState(0);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [modalAmount, setModalAmount] = useState("");
  const [toast, setToast] = useState<{msg:string;ok:boolean}|null>(null);

  const showToast = (msg:string,ok:boolean) => { setToast({msg,ok}); setTimeout(()=>setToast(null),2500); };

  const activeCard = state.cards[activeIdx] || state.cards[0];

  function handleDeposit() {
    const amt = parseFloat(modalAmount)||0;
    if (amt<=0) { showToast("Enter a valid amount",false); return; }
    addMoney(amt, activeCard?.id);
    showToast(`$${amt.toFixed(2)} added successfully`,true);
    setShowDepositModal(false); setModalAmount("");
  }

  function handleWithdraw() {
    const amt = parseFloat(modalAmount)||0;
    if (amt<=0) { showToast("Enter a valid amount",false); return; }
    const ok = withdraw(amt, activeCard?.id);
    if (ok) { showToast(`$${amt.toFixed(2)} withdrawn`,true); setShowWithdrawModal(false); setModalAmount(""); }
    else showToast("Insufficient balance",false);
  }

  function handleRemoveCard(cardId:string) {
    if (state.cards.length<=1) { showToast("Cannot remove last card",false); return; }
    dispatch({ type:"REMOVE_CARD", cardId });
    setActiveIdx(0);
    showToast("Card removed",true);
  }

  const cardTxs = state.transactions.filter(t=>t.cardId===activeCard?.id).slice(0,5);

  return (
    <div style={{ flex:1,overflowY:"auto",background:"white",paddingBottom:4 }}>
      {toast && <Toast msg={toast.msg} ok={toast.ok}/>}
      {showDepositModal && (
        <Modal title="Add Money" onClose={()=>setShowDepositModal(false)}>
          <p style={{ fontSize:13,color:"#9CA3AF",marginBottom:16 }}>To card {activeCard?.brand} *{activeCard?.last4}</p>
          <input type="number" value={modalAmount} onChange={e=>setModalAmount(e.target.value)} placeholder="Enter amount"
            style={{ width:"100%",height:54,borderRadius:14,border:"1.5px solid #E5E7EB",padding:"0 16px",fontSize:16,outline:"none",boxSizing:"border-box",marginBottom:16 }}/>
          <div style={{ display:"flex",gap:10,marginBottom:20 }}>
            {[100,250,500,1000].map(v=>(
              <button key={v} onClick={()=>setModalAmount(String(v))} style={{ flex:1,height:36,borderRadius:18,border:modalAmount===String(v)?"2px solid #5B4FFF":"1.5px solid #E5E7EB",background:modalAmount===String(v)?"#F0EFFF":"white",color:modalAmount===String(v)?"#5B4FFF":"#1A1A1A",fontSize:12,fontWeight:600,cursor:"pointer" }}>${v}</button>
            ))}
          </div>
          <button onClick={handleDeposit} style={{ width:"100%",height:56,borderRadius:28,border:"none",background:"linear-gradient(135deg,#5B4FFF,#7C6FFF)",color:"white",fontSize:16,fontWeight:700,cursor:"pointer" }}>Add Money</button>
        </Modal>
      )}
      {showWithdrawModal && (
        <Modal title="Withdraw" onClose={()=>setShowWithdrawModal(false)}>
          <p style={{ fontSize:13,color:"#9CA3AF",marginBottom:16 }}>From card {activeCard?.brand} *{activeCard?.last4}</p>
          <input type="number" value={modalAmount} onChange={e=>setModalAmount(e.target.value)} placeholder="Enter amount"
            style={{ width:"100%",height:54,borderRadius:14,border:"1.5px solid #E5E7EB",padding:"0 16px",fontSize:16,outline:"none",boxSizing:"border-box",marginBottom:20 }}/>
          <button onClick={handleWithdraw} style={{ width:"100%",height:56,borderRadius:28,border:"none",background:"linear-gradient(135deg,#EF4444,#DC2626)",color:"white",fontSize:16,fontWeight:700,cursor:"pointer" }}>Withdraw</button>
        </Modal>
      )}

      {/* Header */}
      <div style={{ padding:"20px 20px 12px",display:"flex",alignItems:"center",gap:12 }}>
        <div style={{ width:38,height:38,borderRadius:19,background:"linear-gradient(135deg,#5B4FFF,#7C6FFF)",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <span style={{ color:"white",fontSize:14,fontWeight:700 }}>{state.user.avatar}</span>
        </div>
        <div style={{ flex:1,display:"flex",background:"#F5F5F5",borderRadius:20,overflow:"hidden" }}>
          {(["Cards","Wallets"] as const).map(t=>(
            <button key={t} onClick={()=>setSubTab(t)} style={{ flex:1,height:36,border:"none",cursor:"pointer",background:subTab===t?"white":"transparent",fontSize:13,fontWeight:subTab===t?700:500,color:subTab===t?"#1A1A1A":"#9CA3AF",borderRadius:18,margin:2 }}>{t}</button>
          ))}
        </div>
        <button style={{ width:36,height:36,borderRadius:18,border:"1.5px solid #E5E7EB",background:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#1A1A1A" strokeWidth="2"/><path d="m21 21-4.35-4.35" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>

      {/* Balance */}
      <div style={{ padding:"8px 20px 16px",display:"flex",alignItems:"center",justifyContent:"space-between" }}>
        <div>
          <p style={{ fontSize:12,color:"#9CA3AF",marginBottom:4 }}>Total Account Balance</p>
          <p style={{ fontSize:24,fontWeight:900,color:"#1A1A1A" }}>${fmtMoney(state.totalBalance)}</p>
        </div>
        <div style={{ display:"flex",gap:10 }}>
          <button onClick={()=>router.push("/add-card")} style={{ width:36,height:36,borderRadius:18,border:"1.5px solid #E5E7EB",background:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <button style={{ width:36,height:36,borderRadius:18,border:"1.5px solid #E5E7EB",background:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2a4 4 0 014 4v1H8V6a4 4 0 014-4zm-6 5h12v11a2 2 0 01-2 2H8a2 2 0 01-2-2V7z" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ padding:"0 20px 20px",display:"flex",gap:10,alignItems:"center" }}>
        <button onClick={()=>setShowDepositModal(true)} style={{ flex:1,height:44,borderRadius:22,border:"1.5px solid #E5E7EB",background:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 19V5M5 12l7-7 7 7" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ fontSize:13,fontWeight:600 }}>Deposit</span>
        </button>
        <button style={{ width:44,height:44,borderRadius:22,border:"none",background:"#5B4FFF",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="1.5" fill="white"/><circle cx="6" cy="12" r="1.5" fill="white"/><circle cx="18" cy="12" r="1.5" fill="white"/></svg>
        </button>
        <button onClick={()=>setShowWithdrawModal(true)} style={{ flex:1,height:44,borderRadius:22,border:"1.5px solid #E5E7EB",background:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12l7 7 7-7" stroke="#1A1A1A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ fontSize:13,fontWeight:600 }}>Withdraw</span>
        </button>
      </div>

      {/* Add card CTA */}
      <div style={{ padding:"0 20px 16px",display:"flex",alignItems:"center",gap:16 }}>
        <button onClick={()=>router.push("/add-card")} style={{ width:40,height:40,borderRadius:20,border:"2px dashed #D1D5DB",background:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="#9CA3AF" strokeWidth="2.5" strokeLinecap="round"/></svg>
        </button>
        <div>
          <p style={{ fontSize:12,color:"#9CA3AF" }}>Add Your</p>
          <p style={{ fontSize:15,fontWeight:700,color:"#1A1A1A" }}>New Card</p>
        </div>
        <div style={{ flex:1 }}/>
        <button onClick={()=>router.push("/add-card")} style={{ height:36,paddingLeft:14,paddingRight:14,borderRadius:18,border:"none",background:"#5B4FFF",color:"white",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:4 }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
          Connect Bank
        </button>
      </div>

      {/* Card stack (scrollable) */}
      <div style={{ padding:"0 20px",display:"flex",flexDirection:"column",gap:10,marginBottom:16 }}>
        {state.cards.map((c,i)=>(
          <div key={c.id} onClick={()=>setActiveIdx(i)} style={{ position:"relative",cursor:"pointer",opacity:i===activeIdx?1:0.75,transform:i===activeIdx?"scale(1)":"scale(0.97)",transition:"all 0.2s" }}>
            <CardVisual card={c}/>
            {i===activeIdx && (
              <button onClick={e=>{e.stopPropagation();handleRemoveCard(c.id);}} style={{ position:"absolute",top:12,right:12,width:28,height:28,borderRadius:14,background:"rgba(0,0,0,0.3)",border:"none",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </button>
            )}
            {c.isDefault && (
              <div style={{ position:"absolute",bottom:12,left:12,background:"rgba(255,255,255,0.25)",borderRadius:10,padding:"2px 8px" }}>
                <span style={{ fontSize:10,fontWeight:600,color:"white" }}>Default</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Active card transactions */}
      {activeCard && cardTxs.length>0 && (
        <div style={{ padding:"0 20px 20px" }}>
          <p style={{ fontSize:14,fontWeight:700,color:"#1A1A1A",marginBottom:12 }}>Card Transactions</p>
          {cardTxs.map(tx=>(
            <div key={tx.id} style={{ display:"flex",alignItems:"center",gap:12,marginBottom:12 }}>
              <TxLogo type={tx.logo}/>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:13,fontWeight:600,color:"#1A1A1A",marginBottom:2 }}>{tx.name}</p>
                <p style={{ fontSize:11,color:"#9CA3AF" }}>{tx.date}</p>
              </div>
              <span style={{ fontSize:13,fontWeight:700,color:tx.amount>0?"#10B981":"#1A1A1A" }}>
                {tx.amount>0?`+$${fmtMoney(tx.amount)}`:`-$${fmtMoney(Math.abs(tx.amount))}`}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// TAB 5 — ACCOUNT
// ═══════════════════════════════════════════════════════════════════════════════
function AccountTab() {
  const router = useRouter();
  const { state, dispatch, unreadCount } = useApp();
  const { user } = state;
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ firstName:user.firstName, lastName:user.lastName, email:user.email, phone:user.phone, address:user.address });
  const [toast, setToast] = useState<{msg:string;ok:boolean}|null>(null);

  const showToast = (msg:string,ok:boolean) => { setToast({msg,ok}); setTimeout(()=>setToast(null),2500); };

  function saveProfile() {
    dispatch({ type:"UPDATE_USER", patch:{ ...form, avatar:`${form.firstName[0]}${form.lastName[0]}`.toUpperCase() } });
    setEditing(false);
    showToast("Profile updated",true);
  }

  const sections = [
    {
      items:[
        { icon:"👤", label:"Personal Details",  action:()=>setEditing(true) },
        { icon:"🔔", label:"Notifications",      badge:unreadCount>0?unreadCount:undefined, action:()=>router.push("/notifications") },
        { icon:"🔲", label:"Set Up Face ID",     toggle:true, value:user.faceId, onToggle:()=>dispatch({type:"UPDATE_USER",patch:{faceId:!user.faceId}}) },
        { icon:"🔒", label:"Privacy & Security", action:()=>showToast("Coming soon",true) },
      ]
    },
    {
      items:[
        { icon:"⚙️", label:"Settings",              action:()=>showToast("Coming soon",true) },
        { icon:"📋", label:"Terms And Conditions",  action:()=>showToast("Coming soon",true) },
        { icon:"💬", label:"Support",               action:()=>showToast("Coming soon",true) },
      ]
    },
  ];

  return (
    <div style={{ flex:1,overflowY:"auto",background:"#F8F8F8",paddingBottom:4 }}>
      {toast && <Toast msg={toast.msg} ok={toast.ok}/>}

      {editing && (
        <Modal title="Edit Profile" onClose={()=>setEditing(false)}>
          {(["firstName","lastName","email","phone","address"] as const).map(k=>(
            <div key={k} style={{ marginBottom:14 }}>
              <label style={{ fontSize:12,fontWeight:600,color:"#374151",display:"block",marginBottom:6,textTransform:"capitalize" }}>{k.replace(/([A-Z])/g," $1")}</label>
              <input value={form[k]} onChange={e=>setForm(f=>({...f,[k]:e.target.value}))}
                style={{ width:"100%",height:48,borderRadius:14,border:"1.5px solid #E5E7EB",padding:"0 14px",fontSize:14,outline:"none",boxSizing:"border-box" }}/>
            </div>
          ))}
          <button onClick={saveProfile} style={{ width:"100%",height:52,borderRadius:28,border:"none",background:"linear-gradient(135deg,#5B4FFF,#7C6FFF)",color:"white",fontSize:15,fontWeight:700,cursor:"pointer",marginTop:4 }}>Save Changes</button>
        </Modal>
      )}

      {/* Header */}
      <div style={{ padding:"20px 20px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",background:"white" }}>
        <button onClick={()=>router.back()} style={{ width:36,height:36,borderRadius:18,border:"1.5px solid #E5E7EB",background:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
        <p style={{ fontSize:16,fontWeight:700,color:"#1A1A1A" }}>Profile</p>
        <button style={{ width:36,height:36,borderRadius:18,border:"none",background:"none",cursor:"pointer" }}/>
      </div>

      {/* Avatar + name */}
      <div style={{ background:"white",padding:"16px 20px 28px",display:"flex",flexDirection:"column",alignItems:"center" }}>
        <div style={{ width:80,height:80,borderRadius:40,background:"linear-gradient(135deg,#5B4FFF,#7C6FFF)",display:"flex",alignItems:"center",justifyContent:"center",marginBottom:12,cursor:"pointer" }} onClick={()=>setEditing(true)}>
          <span style={{ color:"white",fontSize:28,fontWeight:700 }}>{user.avatar}</span>
        </div>
        <p style={{ fontSize:18,fontWeight:700,color:"#1A1A1A",marginBottom:4 }}>{user.firstName} {user.lastName}</p>
        <p style={{ fontSize:13,color:"#9CA3AF",marginBottom:12 }}>{user.email}</p>
        <div style={{ display:"flex",alignItems:"center",gap:6,background:"#5B4FFF",borderRadius:16,padding:"4px 14px" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/></svg>
          <span style={{ fontSize:12,fontWeight:600,color:"white" }}>Verified</span>
        </div>
      </div>

      <div style={{ height:8,background:"#F8F8F8" }}/>

      {/* Stats row */}
      <div style={{ background:"white",padding:"16px 20px",display:"flex",justifyContent:"space-around",marginBottom:8 }}>
        {[
          { label:"Cards",    value:state.cards.length },
          { label:"Transactions", value:state.transactions.length },
          { label:"Contacts", value:state.contacts.length },
        ].map(s=>(
          <div key={s.label} style={{ textAlign:"center" }}>
            <p style={{ fontSize:20,fontWeight:900,color:"#5B4FFF",marginBottom:2 }}>{s.value}</p>
            <p style={{ fontSize:11,color:"#9CA3AF" }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Menu sections */}
      {sections.map((sec,si)=>(
        <div key={si}>
          <div style={{ background:"white",marginBottom:8 }}>
            {sec.items.map((item,ii)=>(
              <div key={ii} onClick={"action" in item&&item.action?item.action:undefined} style={{ display:"flex",alignItems:"center",gap:14,padding:"16px 20px",borderBottom:ii<sec.items.length-1?"1px solid #F3F4F6":"none",cursor:"action" in item&&item.action?"pointer":"default" }}>
                <div style={{ width:38,height:38,borderRadius:19,background:"#F0EFFF",display:"flex",alignItems:"center",justifyContent:"center" }}>
                  <span style={{ fontSize:18 }}>{item.icon}</span>
                </div>
                <span style={{ flex:1,fontSize:14,fontWeight:600,color:"#1A1A1A" }}>{item.label}</span>
                {"badge" in item && item.badge && (
                  <div style={{ width:20,height:20,borderRadius:10,background:"#EF4444",display:"flex",alignItems:"center",justifyContent:"center",marginRight:8 }}>
                    <span style={{ fontSize:10,fontWeight:700,color:"white" }}>{item.badge}</span>
                  </div>
                )}
                {"toggle" in item ? (
                  <button onClick={e=>{e.stopPropagation();item.onToggle?.();}} style={{ width:46,height:26,borderRadius:13,border:"none",cursor:"pointer",background:item.value?"#5B4FFF":"#E5E7EB",position:"relative",transition:"background 0.2s" }}>
                    <div style={{ width:20,height:20,borderRadius:10,background:"white",position:"absolute",top:3,transition:"left 0.2s",left:item.value?23:3,boxShadow:"0 2px 4px rgba(0,0,0,0.2)" }}/>
                  </button>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Logout */}
      <div style={{ padding:"16px 20px 28px" }}>
        <button onClick={()=>router.push("/login")} style={{ display:"flex",alignItems:"center",gap:10,padding:"14px 20px",background:"#FFF0F0",borderRadius:16,border:"none",cursor:"pointer",width:"100%" }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ fontSize:14,fontWeight:700,color:"#EF4444" }}>Log Out</span>
        </button>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
export default function HomePage() {
  const [tab, setTab] = useState<Tab>("home");
  const { unreadCount } = useApp();

  return (
    <main style={{ position:"relative",width:"100%",height:"100dvh",overflow:"hidden",maxWidth:430,margin:"0 auto",background:"white",display:"flex",flexDirection:"column" }}>
      <div style={{ flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minHeight:0 }}>
        {tab==="home"       && <HomeTab onTransfer={()=>setTab("transfer")}/>}
        {tab==="statistics" && <StatisticsTab/>}
        {tab==="transfer"   && <TransferTab onDone={()=>setTab("home")}/>}
        {tab==="card"       && <CardTab/>}
        {tab==="account"    && <AccountTab/>}
      </div>
      <BottomNav active={tab} onTab={setTab} unread={unreadCount}/>
    </main>
  );
}
