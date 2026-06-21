"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Screen = "overview" | "transactions" | "detail" | "filtered" | "bar-chart" | "line-chart";

// ─── Data ─────────────────────────────────────────────────────────────────────
interface Transaction {
  id: number;
  logo: string;
  name: string;
  sub: string;
  amount: number;
  status?: string;
}

const TX_TODAY: Transaction[] = [
  { id:1, logo:"visa",   name:"Transfer to *5527",   sub:"Completed  1 Mar 2024", amount:-80   },
  { id:2, logo:"paypal", name:"Receive From PayPal",  sub:"04:45 pm",              amount:+1200 },
];
const TX_YESTERDAY: Transaction[] = [
  { id:3, logo:"person", name:"Transfer to Olivia",  sub:"04:45 pm",  amount:-80  },
];
const TX_NOV20: Transaction[] = [
  { id:4, logo:"person", name:"Transfer to james",   sub:"canceled",  amount:-900, status:"canceled" },
  { id:5, logo:"netflix",name:"Netflix",             sub:"Completed", amount:-20  },
];

const TX_DETAIL = {
  logo:"visa", name:"Visa", date:"October 17, 06:55 am", amount:-80,
  from:"Visa ***5527", category:"Fund Transfer", ref:"JHGF-20JG_66", fees:2.3,
};

// ─── Logo ─────────────────────────────────────────────────────────────────────
function TxLogo({ type, size=44 }: { type:string; size?:number }) {
  const s: React.CSSProperties = { width:size, height:size, borderRadius:size/2, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 };
  if (type==="visa")    return <div style={{ ...s, background:"#1A1F71" }}><span style={{ color:"white", fontSize:12, fontWeight:900, letterSpacing:1 }}>VISA</span></div>;
  if (type==="paypal")  return <div style={{ ...s, background:"#003087" }}><span style={{ color:"white", fontSize:16, fontWeight:900 }}>P</span></div>;
  if (type==="netflix") return <div style={{ ...s, background:"#E50914" }}><span style={{ color:"white", fontSize:14, fontWeight:900 }}>N</span></div>;
  if (type==="person")  return <div style={{ ...s, background:"#D1D5DB", overflow:"hidden" }}><span style={{ fontSize:size*0.45 }}>👤</span></div>;
  if (type==="income")  return <div style={{ ...s, background:"#D1FAE5" }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M23 6L13.5 15.5l-5-5L1 17" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 6h6v6" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>;
  if (type==="subs")    return <div style={{ ...s, background:"#DBEAFE" }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="#3B82F6" strokeWidth="2"/><path d="M2 10h20" stroke="#3B82F6" strokeWidth="2"/><path d="M6 15h4" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round"/></svg></div>;
  if (type==="spend")   return <div style={{ ...s, background:"#FEE2E2" }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M23 18L13.5 8.5l-5 5L1 7" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M17 18h6v-6" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg></div>;
  return <div style={{ ...s, background:"#F3F4F6" }}><span style={{ fontSize:20 }}>💳</span></div>;
}

// ─── Shared Header ─────────────────────────────────────────────────────────────
function PageHeader({ title, onBack, right }: { title:string; onBack:()=>void; right?: React.ReactNode }) {
  return (
    <div style={{ padding:"20px 20px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", background:"transparent" }}>
      <button onClick={onBack} style={{ width:36, height:36, borderRadius:18, border:"1.5px solid rgba(255,255,255,0.2)", background:"rgba(255,255,255,0.15)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <p style={{ fontSize:16, fontWeight:700 }}>{title}</p>
      {right || <button style={{ width:36, height:36, borderRadius:18, border:"1.5px solid rgba(255,255,255,0.2)", background:"rgba(255,255,255,0.15)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
      </button>}
    </div>
  );
}

// ─── SCREEN 1: Overview ────────────────────────────────────────────────────────
function OverviewScreen({ onBack, onViewAll, onBarChart, onLineChart }: {
  onBack:()=>void; onViewAll:()=>void; onBarChart:()=>void; onLineChart:()=>void;
}) {
  const bars = [
    { label:"Jan", pct:15, active:false },
    { label:"Feb", pct:52, active:false },
    { label:"May", pct:34, active:false },
    { label:"Apr", pct:70, active:true  },
  ];
  const contacts = [
    { type:"person", name:"James" }, { type:"netflix", name:"Netflix" },
    { type:"person", name:"Michael" }, { type:"visa", name:"Amazon" },
  ];

  return (
    <div style={{ flex:1, overflowY:"auto", background:"white", paddingBottom:20 }}>
      {/* Header */}
      <div style={{ padding:"20px 20px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button onClick={onBack} style={{ width:36, height:36, borderRadius:18, border:"1.5px solid #E5E7EB", background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <p style={{ fontSize:16, fontWeight:700, color:"#1A1A1A" }}>Overview</p>
        <button style={{ width:36, height:36, borderRadius:18, border:"1.5px solid #E5E7EB", background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#1A1A1A" strokeWidth="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>

      {/* Balance */}
      <div style={{ padding:"0 20px 8px" }}>
        <p style={{ fontSize:13, color:"#5B4FFF", fontWeight:600, marginBottom:4 }}>Account Balance</p>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <p style={{ fontSize:32, fontWeight:900, color:"#1A1A1A" }}>$40,568.00</p>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={onLineChart} style={{ width:32, height:32, borderRadius:16, border:"1.5px solid #E5E7EB", background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <button onClick={onBarChart} style={{ width:32, height:32, borderRadius:16, border:"1.5px solid #E5E7EB", background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div style={{ padding:"16px 20px 24px" }}>
        {/* Tooltip */}
        <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:8, paddingRight:"calc(0% + 0px)" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:6, background:"#1A1A1A", borderRadius:10, padding:"6px 12px" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M23 6L13.5 15.5l-5-5L1 17" stroke="#5B4FFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            <span style={{ color:"white", fontSize:12, fontWeight:600 }}>$2300.21</span>
          </div>
        </div>
        {/* Bars */}
        <div style={{ display:"flex", gap:16, alignItems:"flex-end", height:140 }}>
          {bars.map(b=>(
            <div key={b.label} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:8 }}>
              <div style={{
                width:"100%",
                height: Math.round((b.pct/70)*120),
                borderRadius:10,
                background: b.active ? "linear-gradient(180deg,#5B4FFF,#7C6FFF)" : "#F0F0F5",
              }}/>
              <span style={{ fontSize:11, color:"#9CA3AF" }}>{b.pct}%</span>
              <span style={{ fontSize:11, color:"#9CA3AF" }}>{b.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Transferred money */}
      <div style={{ padding:"0 20px 20px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <p style={{ fontSize:16, fontWeight:700, color:"#1A1A1A" }}>Transferred money</p>
          <button style={{ border:"none", background:"none", cursor:"pointer", display:"flex", alignItems:"center", gap:4, color:"#9CA3AF", fontSize:13, fontWeight:600 }}>
            Manage
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
        <div style={{ display:"flex", gap:-8 }}>
          {contacts.map((c,i)=>(
            <div key={i} style={{ marginLeft: i>0 ? -12 : 0, width:44, height:44, borderRadius:22, border:"3px solid white", overflow:"hidden", position:"relative", zIndex:contacts.length-i }}>
              <TxLogo type={c.type} size={44}/>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions */}
      <div style={{ padding:"0 20px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
          <p style={{ fontSize:16, fontWeight:700, color:"#1A1A1A" }}>Transaction</p>
          <button onClick={onViewAll} style={{ border:"none", background:"none", cursor:"pointer", color:"#5B4FFF", fontSize:13, fontWeight:600, display:"flex", alignItems:"center", gap:4 }}>
            View All
          </button>
        </div>
        <div style={{ background:"#F8F8F8", borderRadius:16, padding:"4px 0" }}>
          {TX_TODAY.map((tx,i)=>(
            <div key={tx.id} style={{ display:"flex", alignItems:"center", gap:12, padding:"14px 16px", borderBottom: i<TX_TODAY.length-1 ? "1px solid #F0F0F0" : "none" }}>
              <TxLogo type={tx.logo}/>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:14, fontWeight:600, color:"#1A1A1A", marginBottom:2 }}>{tx.name}</p>
                <p style={{ fontSize:12, color:"#9CA3AF" }}>{tx.sub}</p>
              </div>
              <span style={{ fontSize:14, fontWeight:700, color: tx.amount>0?"#10B981":"#1A1A1A" }}>
                {tx.amount>0?`+$${tx.amount}`:`-$${Math.abs(tx.amount)}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 2: Transaction List ────────────────────────────────────────────────
function TransactionListScreen({ onBack, onTx, onFilter }: {
  onBack:()=>void; onTx:(tx:Transaction)=>void; onFilter:()=>void;
}) {
  const [search, setSearch] = useState("");
  const groups = [
    { label:"Today",       txs: TX_TODAY      },
    { label:"Yesterday",   txs: TX_YESTERDAY   },
    { label:"20 november", txs: TX_NOV20       },
  ];

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", background:"white" }}>
      {/* Header */}
      <div style={{ padding:"20px 20px 0px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button onClick={onBack} style={{ width:36, height:36, borderRadius:18, border:"1.5px solid #E5E7EB", background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <p style={{ fontSize:16, fontWeight:700, color:"#1A1A1A" }}>Transaction</p>
        <button style={{ width:36, height:36, borderRadius:18, border:"1.5px solid #E5E7EB", background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#1A1A1A" strokeWidth="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>

      {/* Search */}
      <div style={{ padding:"16px 20px 0" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, background:"#F5F5F5", borderRadius:28, padding:"0 16px", height:48 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth="2"/><path d="m21 21-4.35-4.35" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/></svg>
          <input
            value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Search" style={{ flex:1, border:"none", outline:"none", background:"transparent", fontSize:15, color:"#1A1A1A" }}
          />
          <button onClick={onFilter} style={{ width:32, height:32, borderRadius:10, border:"none", background:"#E8E6FF", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="#5B4FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ padding:"14px 20px 6px" }}>
        <div style={{ height:3, background:"#F0F0F0", borderRadius:2, overflow:"hidden" }}>
          <div style={{ height:"100%", width:"40%", background:"#5B4FFF", borderRadius:2 }}/>
        </div>
        <p style={{ fontSize:12, color:"#9CA3AF", marginTop:6 }}>Statistics in november</p>
      </div>

      {/* Groups */}
      <div style={{ flex:1, overflowY:"auto", paddingBottom:20 }}>
        {groups.map(g=>(
          <div key={g.label} style={{ padding:"0 20px" }}>
            <p style={{ fontSize:13, fontWeight:600, color:"#9CA3AF", marginTop:16, marginBottom:10 }}>{g.label}</p>
            <div style={{ display:"flex", flexDirection:"column", gap:2 }}>
              {g.txs.filter(tx=>tx.name.toLowerCase().includes(search.toLowerCase())).map(tx=>(
                <button key={tx.id} onClick={()=>onTx(tx)} style={{
                  display:"flex", alignItems:"center", gap:12, padding:"14px 16px",
                  background:"#F8F8F8", borderRadius:16, border:"none", cursor:"pointer", width:"100%", textAlign:"left",
                  marginBottom:8,
                }}>
                  <TxLogo type={tx.logo}/>
                  <div style={{ flex:1 }}>
                    <p style={{ fontSize:14, fontWeight:600, color:"#1A1A1A", marginBottom:2 }}>{tx.name}</p>
                    <p style={{ fontSize:12, color: tx.status==="canceled" ? "#EF4444" : "#9CA3AF" }}>{tx.sub}</p>
                  </div>
                  <span style={{ fontSize:14, fontWeight:700, color: tx.amount>0?"#10B981":"#1A1A1A" }}>
                    {tx.amount>0?`+$${tx.amount}`:`-$${Math.abs(tx.amount)}`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SCREEN 3: Transaction Detail ─────────────────────────────────────────────
function TransactionDetailScreen({ tx, onBack, onDone }: {
  tx: Transaction | null; onBack:()=>void; onDone:()=>void;
}) {
  const detail = tx || { ...TX_DETAIL, amount:-80 };
  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", background:"white" }}>
      {/* Header */}
      <div style={{ padding:"20px 20px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button onClick={onBack} style={{ width:36, height:36, borderRadius:18, border:"1.5px solid #E5E7EB", background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <p style={{ fontSize:16, fontWeight:700, color:"#1A1A1A" }}>Transaction</p>
        <button style={{ width:36, height:36, borderRadius:18, border:"1.5px solid #E5E7EB", background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#1A1A1A" strokeWidth="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>

      {/* Drag handle */}
      <div style={{ display:"flex", justifyContent:"center", marginBottom:24 }}>
        <div style={{ width:40, height:4, borderRadius:2, background:"#E5E7EB" }}/>
      </div>

      {/* Logo + amount */}
      <div style={{ flex:1, overflowY:"auto", padding:"0 20px" }}>
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:28 }}>
          <TxLogo type={detail.logo || "visa"} size={64}/>
          <p style={{ fontSize:18, fontWeight:700, color:"#1A1A1A", marginTop:12, marginBottom:4 }}>{TX_DETAIL.name}</p>
          <p style={{ fontSize:13, color:"#9CA3AF" }}>{TX_DETAIL.date}</p>
          <p style={{ fontSize:36, fontWeight:900, color: detail.amount>0 ? "#10B981" : "#EF4444", marginTop:12 }}>
            {detail.amount>0 ? "+" : "-"}${Math.abs(detail.amount || TX_DETAIL.amount)}.00
          </p>
        </div>

        {/* Payment info */}
        <div style={{ background:"#F8F8F8", borderRadius:20, overflow:"hidden", marginBottom:20 }}>
          <p style={{ padding:"16px 20px 12px", fontSize:14, fontWeight:600, color:"#9CA3AF" }}>Payment info</p>
          {[
            { label:"Payment from",    value:TX_DETAIL.from     },
            { label:"Categories",      value:TX_DETAIL.category },
            { label:"Reference number",value:TX_DETAIL.ref      },
            { label:"Fees",            value:`$${TX_DETAIL.fees}`},
          ].map((row,i,arr)=>(
            <div key={row.label} style={{
              display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"14px 20px",
              borderBottom: i<arr.length-1 ? "1px solid #F0F0F0" : "none",
            }}>
              <span style={{ fontSize:13, color:"#9CA3AF" }}>{row.label}</span>
              <span style={{ fontSize:13, fontWeight:600, color:"#1A1A1A" }}>{row.value}</span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:20 }}>
          <button style={{
            height:80, borderRadius:16, border:"1.5px solid #E5E7EB", background:"white",
            cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#5B4FFF" strokeWidth="2" strokeLinecap="round"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#5B4FFF" strokeWidth="2" strokeLinecap="round"/></svg>
            <span style={{ fontSize:13, fontWeight:600, color:"#1A1A1A" }}>View Receipt</span>
          </button>
          <button style={{
            height:80, borderRadius:16, border:"1.5px solid #E5E7EB", background:"white",
            cursor:"pointer", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:8,
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 8h1a4 4 0 010 8h-1" stroke="#5B4FFF" strokeWidth="2" strokeLinecap="round"/><path d="M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z" stroke="#5B4FFF" strokeWidth="2"/><path d="M6 1v3M10 1v3M14 1v3" stroke="#5B4FFF" strokeWidth="2" strokeLinecap="round"/></svg>
            <span style={{ fontSize:13, fontWeight:600, color:"#1A1A1A" }}>Split Your Payment</span>
          </button>
        </div>

        {/* Done + Share */}
        <button onClick={onDone} style={{
          width:"100%", height:56, borderRadius:28, border:"none",
          background:"#5B4FFF", color:"white", fontSize:16, fontWeight:700, cursor:"pointer",
          boxShadow:"0 8px 24px rgba(91,79,255,0.35)", marginBottom:12,
        }}>Done</button>
        <button style={{
          width:"100%", height:56, borderRadius:28, border:"1.5px solid #E5E7EB",
          background:"white", color:"#1A1A1A", fontSize:16, fontWeight:700, cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginBottom:20,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="18" cy="5" r="3" stroke="#1A1A1A" strokeWidth="2"/><circle cx="6" cy="12" r="3" stroke="#1A1A1A" strokeWidth="2"/><circle cx="18" cy="19" r="3" stroke="#1A1A1A" strokeWidth="2"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/></svg>
          Share Receipt
        </button>
      </div>
    </div>
  );
}

// ─── SCREEN 4: Filtered Transactions ──────────────────────────────────────────
function FilteredListScreen({ onBack, onTx }: { onBack:()=>void; onTx:(tx:Transaction)=>void }) {
  const [activeFilters, setActiveFilters] = useState(["Bank transfer","Services"]);
  const [search, setSearch] = useState("");
  const groups = [
    { label:"Today",       txs: TX_TODAY      },
    { label:"Yesterday",   txs: TX_YESTERDAY   },
    { label:"20 november", txs: TX_NOV20       },
  ];
  const removeFilter = (f:string) => setActiveFilters(a=>a.filter(x=>x!==f));

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", background:"white" }}>
      <div style={{ padding:"20px 20px 0px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <button onClick={onBack} style={{ width:36, height:36, borderRadius:18, border:"1.5px solid #E5E7EB", background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <p style={{ fontSize:16, fontWeight:700, color:"#1A1A1A" }}>Transaction</p>
        <button style={{ width:36, height:36, borderRadius:18, border:"1.5px solid #E5E7EB", background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="18" rx="2" stroke="#1A1A1A" strokeWidth="2"/><path d="M16 2v4M8 2v4M3 10h18" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/></svg>
        </button>
      </div>

      <div style={{ padding:"16px 20px 0" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, background:"#F5F5F5", borderRadius:28, padding:"0 16px", height:48, marginBottom:14 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth="2"/><path d="m21 21-4.35-4.35" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/></svg>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search"
            style={{ flex:1, border:"none", outline:"none", background:"transparent", fontSize:15 }}/>
          <button onClick={onBack} style={{ width:32, height:32, borderRadius:10, border:"none", background:"#E8E6FF", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="#5B4FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        {/* Filter chips */}
        {activeFilters.length > 0 && (
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginBottom:16, alignItems:"center" }}>
            <span style={{ fontSize:12, color:"#9CA3AF" }}>Categories:</span>
            {activeFilters.map(f=>(
              <button key={f} onClick={()=>removeFilter(f)} style={{
                display:"flex", alignItems:"center", gap:6, padding:"5px 12px",
                borderRadius:20, border:"1px solid #E5E7EB", background:"#F0EFFF", cursor:"pointer",
              }}>
                <span style={{ fontSize:12, fontWeight:600, color:"#5B4FFF" }}>{f}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#5B4FFF" strokeWidth="2.5" strokeLinecap="round"/></svg>
              </button>
            ))}
            <button onClick={()=>setActiveFilters([])} style={{ border:"none", background:"none", cursor:"pointer", fontSize:12, fontWeight:600, color:"#5B4FFF" }}>Clear all</button>
          </div>
        )}
      </div>

      <div style={{ flex:1, overflowY:"auto", paddingBottom:20 }}>
        {groups.map(g=>(
          <div key={g.label} style={{ padding:"0 20px" }}>
            <p style={{ fontSize:13, fontWeight:600, color:"#9CA3AF", marginTop:16, marginBottom:10 }}>{g.label}</p>
            {g.txs.map(tx=>(
              <button key={tx.id} onClick={()=>onTx(tx)} style={{
                display:"flex", alignItems:"center", gap:12, padding:"14px 16px",
                background:"#F8F8F8", borderRadius:16, border:"none", cursor:"pointer", width:"100%", textAlign:"left", marginBottom:8,
              }}>
                <TxLogo type={tx.logo}/>
                <div style={{ flex:1 }}>
                  <p style={{ fontSize:14, fontWeight:600, color:"#1A1A1A", marginBottom:2 }}>{tx.name}</p>
                  <p style={{ fontSize:12, color: tx.status==="canceled"?"#EF4444":"#9CA3AF" }}>{tx.sub}</p>
                </div>
                <span style={{ fontSize:14, fontWeight:700, color: tx.amount>0?"#10B981":"#1A1A1A" }}>
                  {tx.amount>0?`+$${tx.amount}`:`-$${Math.abs(tx.amount)}`}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── SCREEN 5: Bar Chart Overview (purple bg) ─────────────────────────────────
function BarChartScreen({ onBack }: { onBack:()=>void }) {
  const [period, setPeriod] = useState<"Month"|"Year">("Month");
  const months = ["Jan","Feb","May","Apr","Jun","Aug","Sep"];
  const values = [1400, 1100, 1900, 2800, 2000, 1500, 700];
  const maxV = Math.max(...values);
  const categories = [
    { type:"income", label:"Income",        sub:"$12302.00  1 Mar 2024" },
    { type:"subs",   label:"Subscriptions", sub:"20 subscriptions"      },
    { type:"spend",  label:"Spending",      sub:"$3500.00"              },
  ];

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", background:"#5B4FFF" }}>
      {/* Header */}
      <div style={{ padding:"20px 20px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", color:"white" }}>
        <button onClick={onBack} style={{ width:36, height:36, borderRadius:18, border:"1.5px solid rgba(255,255,255,0.25)", background:"rgba(255,255,255,0.15)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <p style={{ fontSize:16, fontWeight:700, color:"white" }}>Overview</p>
        <div style={{ width:36 }}/>
      </div>

      {/* Account + period selector */}
      <div style={{ padding:"0 20px 20px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <p style={{ fontSize:18, fontWeight:700, color:"white" }}>Account *5527</p>
        <button style={{ display:"flex", alignItems:"center", gap:6, background:"rgba(255,255,255,0.2)", borderRadius:20, padding:"6px 14px", border:"none", cursor:"pointer" }}>
          <span style={{ fontSize:13, fontWeight:600, color:"white" }}>Month</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
        </button>
      </div>

      {/* Y-axis labels + bars */}
      <div style={{ padding:"0 20px 8px", flex:"0 0 auto" }}>
        <div style={{ display:"flex", gap:0 }}>
          {/* Y axis */}
          <div style={{ display:"flex", flexDirection:"column", justifyContent:"space-between", paddingRight:8, height:180 }}>
            {["$4k","$3k","$2k","$1.5k","$1k","$0"].map(l=>(
              <span key={l} style={{ fontSize:10, color:"rgba(255,255,255,0.5)" }}>{l}</span>
            ))}
          </div>
          {/* Bars */}
          <div style={{ flex:1, display:"flex", gap:6, alignItems:"flex-end", height:180, position:"relative" }}>
            {/* Grid lines */}
            {[0,1,2,3,4,5].map(i=>(
              <div key={i} style={{ position:"absolute", left:0, right:0, top:`${(i/5)*100}%`, height:1, background:"rgba(255,255,255,0.1)" }}/>
            ))}
            {months.map((m,i)=>(
              <div key={m} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4, position:"relative", zIndex:1 }}>
                <div style={{
                  width:"100%",
                  height: Math.round((values[i]/maxV)*160),
                  borderRadius:"6px 6px 0 0",
                  background: i===3 ? "white" : "rgba(255,255,255,0.25)",
                }}/>
                <span style={{ fontSize:9, color:"rgba(255,255,255,0.6)", marginTop:4 }}>{m}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Legend */}
        <div style={{ display:"flex", gap:16, justifyContent:"center", marginTop:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:8, height:8, borderRadius:4, background:"white" }}/>
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.8)", fontWeight:600 }}>Earned</span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
            <div style={{ width:8, height:8, borderRadius:4, background:"rgba(255,255,255,0.4)" }}/>
            <span style={{ fontSize:12, color:"rgba(255,255,255,0.8)" }}>Spend</span>
          </div>
        </div>
      </div>

      {/* White bottom sheet */}
      <div style={{ flex:1, background:"white", borderRadius:"28px 28px 0 0", padding:"8px 0 0", overflowY:"auto" }}>
        <div style={{ display:"flex", justifyContent:"center", padding:"12px 0 4px" }}>
          <div style={{ width:36, height:4, borderRadius:2, background:"#E5E7EB" }}/>
        </div>
        <div style={{ padding:"8px 20px 20px" }}>
          {categories.map((c,i)=>(
            <div key={c.label} style={{
              display:"flex", alignItems:"center", gap:14, padding:"16px 0",
              borderBottom: i<categories.length-1 ? "1px solid #F3F4F6" : "none",
            }}>
              <TxLogo type={c.type}/>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:14, fontWeight:600, color:"#1A1A1A", marginBottom:2 }}>{c.label}</p>
                <p style={{ fontSize:12, color:"#9CA3AF" }}>{c.sub}</p>
              </div>
              <button style={{ width:32, height:32, borderRadius:16, border:"1.5px solid #E5E7EB", background:"white", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M12 5l7 7-7 7" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── SCREEN 6: Line Chart Overview (gradient bg) ──────────────────────────────
function LineChartScreen({ onBack }: { onBack:()=>void }) {
  const [period, setPeriod] = useState<"24H"|"Week"|"Month"|"Year">("24H");
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun","Mon"];
  const points = [800,1200,1000,1800,2200,1600,3200,3800];
  const maxP = Math.max(...points); const minP = Math.min(...points);
  const W = 320; const H = 160;
  const pts = points.map((v,i)=>({
    x: (i/(points.length-1))*W,
    y: H - ((v-minP)/(maxP-minP))*H*0.8 - H*0.1,
  }));
  const pathD = pts.map((p,i)=>i===0?`M${p.x},${p.y}`:`L${p.x},${p.y}`).join(" ");
  const areaD = `${pathD} L${pts[pts.length-1].x},${H} L0,${H} Z`;

  const txs = [
    { logo:"visa",   name:"Transfer To *5527",  sub:"Completed  1 Mar 2024", amount:-80   },
    { logo:"netflix",name:"Netflix",             sub:"3 Sep 2024",            amount:-29   },
    { logo:"person", name:"Transfer To James",   sub:"04:45 pm",              amount:-900  },
  ];

  return (
    <div style={{ flex:1, display:"flex", flexDirection:"column", background:"#5B4FFF" }}>
      {/* Gradient header area */}
      <div style={{
        background:"linear-gradient(180deg,#5B4FFF 0%,#9B6FFF 50%,#F59E0B 100%)",
        paddingBottom:32,
      }}>
        <div style={{ padding:"20px 20px 16px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <button onClick={onBack} style={{ width:36, height:36, borderRadius:18, border:"1.5px solid rgba(255,255,255,0.25)", background:"rgba(255,255,255,0.15)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M12 19l-7-7 7-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <p style={{ fontSize:16, fontWeight:700, color:"white" }}>Overview</p>
          <div style={{ width:36 }}/>
        </div>

        {/* Balance + chart toggle */}
        <div style={{ padding:"0 20px 16px", display:"flex", alignItems:"flex-start", justifyContent:"space-between" }}>
          <div>
            <p style={{ fontSize:13, color:"rgba(255,255,255,0.7)", marginBottom:4 }}>Total Account Balance</p>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <p style={{ fontSize:28, fontWeight:900, color:"white" }}>40,568.06</p>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M23 6L13.5 15.5l-5-5L1 17" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={onBack} style={{ width:36, height:36, borderRadius:18, border:"1.5px solid rgba(255,255,255,0.25)", background:"rgba(255,255,255,0.15)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M23 6L13.5 15.5l-5-5L1 17" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
            <button style={{ width:36, height:36, borderRadius:18, border:"1.5px solid rgba(255,255,255,0.25)", background:"rgba(255,255,255,0.3)", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="12" width="4" height="9" rx="1" stroke="white" strokeWidth="2"/><rect x="10" y="7" width="4" height="14" rx="1" stroke="white" strokeWidth="2"/><rect x="17" y="3" width="4" height="18" rx="1" stroke="white" strokeWidth="2"/></svg>
            </button>
          </div>
        </div>

        {/* Period tabs */}
        <div style={{ padding:"0 20px 16px" }}>
          <div style={{ display:"flex", background:"rgba(255,255,255,0.2)", borderRadius:28, padding:3 }}>
            {(["24H","Week","Month","Year"] as const).map(p=>(
              <button key={p} onClick={()=>setPeriod(p)} style={{
                flex:1, height:36, borderRadius:24, border:"none", cursor:"pointer",
                background: period===p ? "white" : "transparent",
                color: period===p ? "#5B4FFF" : "rgba(255,255,255,0.8)",
                fontSize:13, fontWeight:period===p?700:500,
              }}>{p}</button>
            ))}
          </div>
        </div>

        {/* Line chart SVG */}
        <div style={{ padding:"0 20px" }}>
          <div style={{ display:"flex", justifyContent:"space-between", marginBottom:4 }}>
            {["5k","4k","3k","2k","1k","0k"].map(l=>(
              <span key={l} style={{ fontSize:10, color:"rgba(255,255,255,0.5)" }}>{l}</span>
            ))}
          </div>
          <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow:"visible" }}>
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="white" stopOpacity="0.3"/>
                <stop offset="100%" stopColor="white" stopOpacity="0.02"/>
              </linearGradient>
            </defs>
            <path d={areaD} fill="url(#areaGrad)"/>
            <path d={pathD} stroke="white" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            {/* Dot on last point */}
            <circle cx={pts[pts.length-1].x} cy={pts[pts.length-1].y} r="5" fill="white"/>
          </svg>
          <div style={{ display:"flex", justifyContent:"space-between", marginTop:4 }}>
            {days.map((d,i)=>(
              <span key={i} style={{ fontSize:9, color:"rgba(255,255,255,0.6)" }}>{d}</span>
            ))}
          </div>
        </div>
      </div>

      {/* White bottom */}
      <div style={{ flex:1, background:"white", borderRadius:"28px 28px 0 0", padding:"0 0 20px", overflowY:"auto", marginTop:-20 }}>
        <div style={{ padding:"16px 20px 8px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <p style={{ fontSize:16, fontWeight:700, color:"#1A1A1A" }}>Last Transaction</p>
          <button style={{ border:"none", background:"none", cursor:"pointer", color:"#5B4FFF", fontSize:13, fontWeight:600 }}>View All</button>
        </div>
        <div style={{ padding:"0 20px", display:"flex", flexDirection:"column", gap:8 }}>
          {txs.map((tx,i)=>(
            <div key={i} style={{ display:"flex", alignItems:"center", gap:12, background:"#F8F8F8", borderRadius:16, padding:"14px 16px" }}>
              <TxLogo type={tx.logo}/>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:14, fontWeight:600, color:"#1A1A1A", marginBottom:2 }}>{tx.name}</p>
                <p style={{ fontSize:12, color:"#9CA3AF" }}>{tx.sub}</p>
              </div>
              <span style={{ fontSize:14, fontWeight:700, color: tx.amount>0?"#10B981":"#1A1A1A" }}>
                {tx.amount>0?`+$${tx.amount}`:`-${Math.abs(tx.amount)}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main Controller ───────────────────────────────────────────────────────────
export default function OverviewPage() {
  const router = useRouter();
  const [screen, setScreen] = useState<Screen>("overview");
  const [selectedTx, setSelectedTx] = useState<Transaction|null>(null);

  const goBack = () => {
    if (screen==="transactions" || screen==="bar-chart" || screen==="line-chart") setScreen("overview");
    else if (screen==="detail")   setScreen("transactions");
    else if (screen==="filtered") setScreen("transactions");
    else router.back();
  };

  return (
    <main style={{ position:"relative", width:"100%", height:"100dvh", overflow:"hidden", maxWidth:430, margin:"0 auto", display:"flex", flexDirection:"column" }}>
      {screen==="overview"     && <OverviewScreen onBack={goBack} onViewAll={()=>setScreen("transactions")} onBarChart={()=>setScreen("bar-chart")} onLineChart={()=>setScreen("line-chart")}/>}
      {screen==="transactions" && <TransactionListScreen onBack={goBack} onTx={tx=>{setSelectedTx(tx);setScreen("detail");}} onFilter={()=>setScreen("filtered")}/>}
      {screen==="detail"       && <TransactionDetailScreen tx={selectedTx} onBack={goBack} onDone={()=>setScreen("transactions")}/>}
      {screen==="filtered"     && <FilteredListScreen onBack={goBack} onTx={tx=>{setSelectedTx(tx);setScreen("detail");}}/>}
      {screen==="bar-chart"    && <BarChartScreen onBack={goBack}/>}
      {screen==="line-chart"   && <LineChartScreen onBack={goBack}/>}
    </main>
  );
}
