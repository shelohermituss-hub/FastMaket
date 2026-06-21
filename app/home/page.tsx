"use client";

import { useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────
type Tab = "home" | "cards" | "transactions" | "profile";

// ─── Data ────────────────────────────────────────────────────────────────────
const CARDS = [
  { id: 1, brand: "VISA", last4: "5633", holder: "Michael Anthony", expiry: "09/28", balance: 12450.80, color: ["#5B4FFF","#7C6FFF"], type: "Debit" },
  { id: 2, brand: "MC",   last4: "2847", holder: "Michael Anthony", expiry: "03/27", balance: 3200.00,  color: ["#FF8C42","#FF6B00"], type: "Credit" },
  { id: 3, brand: "VISA", last4: "9012", holder: "Michael Anthony", expiry: "11/26", balance: 840.50,   color: ["#0a0a0a","#374151"], type: "Savings" },
];

const TRANSACTIONS = [
  { id:1,  icon:"🛒", name:"Amazon",          category:"Shopping",   amount:-89.99,  date:"Today, 14:22",       status:"completed" },
  { id:2,  icon:"☕", name:"Starbucks",        category:"Food",       amount:-6.50,   date:"Today, 09:15",       status:"completed" },
  { id:3,  icon:"💰", name:"Salary",           category:"Income",     amount:+4200.00,date:"Yesterday, 08:00",   status:"completed" },
  { id:4,  icon:"🎮", name:"PlayStation",      category:"Gaming",     amount:-14.99,  date:"Yesterday, 18:30",   status:"completed" },
  { id:5,  icon:"🚗", name:"Uber",             category:"Transport",  amount:-22.40,  date:"Mon, 10:45",         status:"completed" },
  { id:6,  icon:"🏥", name:"Pharmacy",         category:"Health",     amount:-38.00,  date:"Mon, 16:10",         status:"completed" },
  { id:7,  icon:"📺", name:"Netflix",          category:"Streaming",  amount:-15.99,  date:"Sun, 00:00",         status:"completed" },
  { id:8,  icon:"🍕", name:"Domino's Pizza",   category:"Food",       amount:-31.50,  date:"Sat, 20:12",         status:"completed" },
  { id:9,  icon:"✈️", name:"Air France",       category:"Travel",     amount:-540.00, date:"Sat, 11:00",         status:"pending"   },
  { id:10, icon:"💸", name:"Transfer to Lisa", category:"Transfer",   amount:-200.00, date:"Fri, 17:35",         status:"completed" },
  { id:11, icon:"🏠", name:"Rent",             category:"Housing",    amount:-1200.00,date:"Jun 1, 08:00",       status:"completed" },
  { id:12, icon:"🎵", name:"Spotify",          category:"Streaming",  amount:-9.99,   date:"Jun 1, 00:00",       status:"completed" },
  { id:13, icon:"🏋️", name:"Gym membership",   category:"Health",     amount:-45.00,  date:"May 31, 09:00",      status:"completed" },
  { id:14, icon:"💳", name:"Refund — Zara",    category:"Shopping",   amount:+64.00,  date:"May 30, 14:00",      status:"completed" },
];

const QUICK_ACTIONS = [
  { icon:"💸", label:"Send",    color:"#F0EFFF", tc:"#5B4FFF" },
  { icon:"➕", label:"Top Up",  color:"#F0FDF4", tc:"#16A34A" },
  { icon:"📤", label:"Withdraw",color:"#FFF7ED", tc:"#EA580C" },
  { icon:"⋯",  label:"More",    color:"#F3F4F6", tc:"#374151" },
];

// ─── Shared helpers ───────────────────────────────────────────────────────────
function fmt(n: number) {
  const abs = Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (n < 0 ? "-" : "+") + "$" + abs;
}

function CardWidget({ card, mini = false }: { card: typeof CARDS[0]; mini?: boolean }) {
  const W = mini ? 200 : 300, H = mini ? 120 : 180;
  return (
    <div style={{
      width: W, height: H, borderRadius: 20, overflow: "hidden", flexShrink: 0,
      background: `linear-gradient(135deg, ${card.color[0]}, ${card.color[1]})`,
      boxShadow: `0 12px 40px ${card.color[0]}55`, position: "relative",
    }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.18) 0%, transparent 60%)" }} />
      <div style={{ position: "absolute", width: H * 1.8, height: H * 1.8, borderRadius: "50%", background: "rgba(255,255,255,0.04)", top: -H * 0.6, right: -H * 0.4 }} />
      <div style={{ position: "relative", padding: mini ? "14px 16px" : "18px 20px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.65)", fontSize: mini ? 9 : 11, marginBottom: 2 }}>{card.type}</p>
            <p style={{ color: "white", fontSize: mini ? 11 : 13, fontWeight: 700, fontStyle: "italic", letterSpacing: 2 }}>FIN CORE</p>
          </div>
          {card.brand === "VISA" ? (
            <span style={{ color: "white", fontSize: mini ? 14 : 18, fontWeight: 900, fontStyle: "italic" }}>VISA</span>
          ) : (
            <div style={{ display: "flex" }}>
              <div style={{ width: mini ? 18 : 24, height: mini ? 18 : 24, borderRadius: "50%", background: "rgba(255,200,0,0.9)", marginRight: -6 }} />
              <div style={{ width: mini ? 18 : 24, height: mini ? 18 : 24, borderRadius: "50%", background: "rgba(255,80,0,0.8)" }} />
            </div>
          )}
        </div>
        <div>
          {!mini && <div style={{ width: 32, height: 22, borderRadius: 4, background: "linear-gradient(135deg,#D4AF37,#B8960C)", marginBottom: 10 }} />}
          <p style={{ color: "rgba(255,255,255,0.85)", fontSize: mini ? 11 : 14, fontWeight: 600, letterSpacing: mini ? 1 : 2, marginBottom: 4 }}>
            •••• •••• •••• {card.last4}
          </p>
          {!mini && (
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 9 }}>HOLDER</p>
                <p style={{ color: "white", fontSize: 11, fontWeight: 600 }}>{card.holder}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ color: "rgba(255,255,255,0.5)", fontSize: 9 }}>EXPIRES</p>
                <p style={{ color: "white", fontSize: 11, fontWeight: 600 }}>{card.expiry}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TxRow({ tx, border = true }: { tx: typeof TRANSACTIONS[0]; border?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "13px 0", borderBottom: border ? "1px solid #F3F4F6" : "none" }}>
      <div style={{
        width: 46, height: 46, borderRadius: 16, background: "#F3F4F6",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0,
      }}>{tx.icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 700, color: "#0a0a0a", marginBottom: 2 }}>{tx.name}</p>
        <p style={{ fontSize: 12, color: "#9CA3AF" }}>{tx.category} · {tx.date}</p>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <p style={{ fontSize: 14, fontWeight: 800, color: tx.amount > 0 ? "#10B981" : "#0a0a0a" }}>{fmt(tx.amount)}</p>
        {tx.status === "pending" && (
          <span style={{ fontSize: 10, fontWeight: 600, color: "#F59E0B", background: "#FEF3C7", padding: "2px 6px", borderRadius: 6 }}>Pending</span>
        )}
      </div>
    </div>
  );
}

// ─── TAB 1: Home ─────────────────────────────────────────────────────────────
function HomeTab() {
  const [activeCard, setActiveCard] = useState(0);
  const card = CARDS[activeCard];
  const totalBalance = CARDS.reduce((s, c) => s + c.balance, 0);

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#F9FAFB" }}>
      {/* Purple header */}
      <div style={{
        background: "linear-gradient(160deg, #5B4FFF 0%, #7C6FFF 70%, #9B8FFF 100%)",
        padding: "24px 24px 80px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", width: 260, height: 260, borderRadius: 130, background: "rgba(255,255,255,0.06)", top: -80, right: -60 }} />
        <div style={{ position: "absolute", width: 160, height: 160, borderRadius: 80, background: "rgba(255,255,255,0.04)", bottom: 20, left: -40 }} />

        {/* Top bar */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28, position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 42, height: 42, borderRadius: 21, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>😎</div>
            <div>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>Good morning,</p>
              <p style={{ color: "white", fontSize: 16, fontWeight: 800 }}>Michael 👋</p>
            </div>
          </div>
          <button style={{ width: 42, height: 42, borderRadius: 21, background: "rgba(255,255,255,0.15)", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="white" strokeWidth="2" strokeLinecap="round"/><path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            <div style={{ position: "absolute", top: 10, right: 10, width: 8, height: 8, borderRadius: 4, background: "#FFB830", border: "2px solid #7C6FFF" }} />
          </button>
        </div>

        {/* Total balance */}
        <div style={{ position: "relative", textAlign: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 6 }}>Total balance</p>
          <p style={{ color: "white", fontSize: 38, fontWeight: 900, letterSpacing: -1 }}>
            ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginTop: 6 }}>
            <div style={{ width: 16, height: 16, borderRadius: 8, background: "#10B981", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="8" height="8" viewBox="0 0 10 10" fill="none"><path d="M5 8V2M2 5l3-3 3 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: 13, fontWeight: 600 }}>+2.4% this month</span>
          </div>
        </div>
      </div>

      {/* Card carousel (overlaps header) */}
      <div style={{ margin: "-56px 0 0", padding: "0 0 20px" }}>
        <div style={{ display: "flex", gap: 16, padding: "0 24px", overflowX: "auto", scrollSnapType: "x mandatory", scrollbarWidth: "none" }}>
          {CARDS.map((c, i) => (
            <div key={c.id} onClick={() => setActiveCard(i)} style={{ scrollSnapAlign: "start", flexShrink: 0 }}>
              <CardWidget card={c} />
            </div>
          ))}
        </div>
        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 6, marginTop: 12 }}>
          {CARDS.map((_, i) => (
            <div key={i} style={{ width: i === activeCard ? 20 : 6, height: 6, borderRadius: 3, background: i === activeCard ? "#5B4FFF" : "#D1D5DB", transition: "all 0.3s" }} />
          ))}
        </div>
      </div>

      {/* Card balance highlight */}
      <div style={{ margin: "0 24px 20px", padding: "16px", borderRadius: 16, background: "white", border: "1px solid #F3F4F6", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 2 }}>Selected card balance</p>
          <p style={{ fontSize: 22, fontWeight: 900, color: "#0a0a0a" }}>
            ${card.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div style={{ textAlign: "right" }}>
          <p style={{ fontSize: 12, color: "#9CA3AF", marginBottom: 2 }}>•••• {card.last4}</p>
          <span style={{ fontSize: 11, fontWeight: 700, color: "#5B4FFF", background: "#F0EFFF", padding: "3px 8px", borderRadius: 8 }}>{card.type}</span>
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ padding: "0 24px 20px" }}>
        <div style={{ display: "flex", gap: 12 }}>
          {QUICK_ACTIONS.map(a => (
            <button key={a.label} style={{
              flex: 1, height: 70, borderRadius: 18, border: "none", cursor: "pointer",
              background: a.color, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5,
            }}>
              <span style={{ fontSize: 24 }}>{a.icon}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: a.tc }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      <div style={{ padding: "0 24px 20px", display: "flex", gap: 12 }}>
        {[
          { label: "Income", value: "$4,200", icon: "📈", color: "#D1FAE5", tc: "#065F46" },
          { label: "Expenses", value: "$1,875", icon: "📉", color: "#FEE2E2", tc: "#991B1B" },
        ].map(s => (
          <div key={s.label} style={{ flex: 1, padding: "14px 16px", borderRadius: 16, background: s.color }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: s.tc }}>{s.label}</span>
              <span style={{ fontSize: 16 }}>{s.icon}</span>
            </div>
            <p style={{ fontSize: 20, fontWeight: 900, color: s.tc }}>{s.value}</p>
            <p style={{ fontSize: 11, color: s.tc, opacity: 0.7 }}>This month</p>
          </div>
        ))}
      </div>

      {/* Spending bar */}
      <div style={{ margin: "0 24px 20px", padding: "16px", borderRadius: 16, background: "white", border: "1px solid #F3F4F6" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Monthly budget</p>
          <p style={{ fontSize: 13, fontWeight: 700, color: "#5B4FFF" }}>$1,875 / $3,000</p>
        </div>
        <div style={{ height: 8, background: "#F3F4F6", borderRadius: 4, overflow: "hidden" }}>
          <div style={{ width: "62.5%", height: "100%", borderRadius: 4, background: "linear-gradient(90deg,#5B4FFF,#7C6FFF)" }} />
        </div>
        <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 6 }}>62% used · $1,125 remaining</p>
      </div>

      {/* Recent transactions */}
      <div style={{ padding: "0 24px 100px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ fontSize: 16, fontWeight: 900, color: "#0a0a0a" }}>Recent</p>
          <button style={{ border: "none", background: "none", color: "#5B4FFF", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>See all</button>
        </div>
        <div style={{ background: "white", borderRadius: 16, padding: "0 16px", border: "1px solid #F3F4F6" }}>
          {TRANSACTIONS.slice(0, 5).map((tx, i) => (
            <TxRow key={tx.id} tx={tx} border={i < 4} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TAB 2: Cards ────────────────────────────────────────────────────────────
function CardsTab() {
  const [active, setActive] = useState(0);
  const card = CARDS[active];

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#F9FAFB" }}>
      {/* Header */}
      <div style={{ padding: "24px 24px 20px", background: "white", borderBottom: "1px solid #F3F4F6" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: "#0a0a0a" }}>My Cards</h1>
          <button style={{
            height: 36, paddingLeft: 14, paddingRight: 14, borderRadius: 18, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg,#5B4FFF,#7C6FFF)", color: "white", fontSize: 13, fontWeight: 700,
          }}>+ Add card</button>
        </div>

        {/* Cards scroll */}
        <div style={{ display: "flex", gap: 14, overflowX: "auto", scrollbarWidth: "none", paddingBottom: 4 }}>
          {CARDS.map((c, i) => (
            <div key={c.id} onClick={() => setActive(i)} style={{ scrollSnapAlign: "start", flexShrink: 0, opacity: i === active ? 1 : 0.65, transition: "opacity 0.2s", transform: i === active ? "scale(1)" : "scale(0.96)", cursor: "pointer" }}>
              <CardWidget card={c} mini />
            </div>
          ))}
        </div>
      </div>

      {/* Card detail */}
      <div style={{ padding: "20px 24px" }}>
        <div style={{ background: "white", borderRadius: 20, overflow: "hidden", border: "1px solid #F3F4F6", marginBottom: 16 }}>
          <div style={{ padding: "16px 20px", background: `linear-gradient(135deg,${card.color[0]}15,${card.color[1]}10)`, borderBottom: "1px solid #F3F4F6" }}>
            <p style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1 }}>Card details</p>
          </div>
          {[
            ["Card number", `•••• •••• •••• ${card.last4}`],
            ["Card holder", card.holder],
            ["Expiry date", card.expiry],
            ["Card type", card.type],
            ["Status", "Active ✅"],
          ].map(([label, value], i, arr) => (
            <div key={label} style={{ padding: "14px 20px", display: "flex", justifyContent: "space-between", borderBottom: i < arr.length - 1 ? "1px solid #F9FAFB" : "none" }}>
              <span style={{ fontSize: 13, color: "#9CA3AF" }}>{label}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0a0a0a" }}>{value}</span>
            </div>
          ))}
        </div>

        {/* Balance */}
        <div style={{ background: `linear-gradient(135deg,${card.color[0]},${card.color[1]})`, borderRadius: 20, padding: "20px", marginBottom: 16 }}>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, marginBottom: 4 }}>Available balance</p>
          <p style={{ color: "white", fontSize: 30, fontWeight: 900 }}>${card.balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
          <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
            {["Freeze", "Limits", "Details"].map(a => (
              <button key={a} style={{
                flex: 1, height: 36, borderRadius: 10, border: "1.5px solid rgba(255,255,255,0.3)",
                background: "rgba(255,255,255,0.15)", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer",
              }}>{a}</button>
            ))}
          </div>
        </div>

        {/* Spending breakdown */}
        <div style={{ background: "white", borderRadius: 20, padding: "16px 20px", border: "1px solid #F3F4F6", marginBottom: 16 }}>
          <p style={{ fontSize: 14, fontWeight: 800, color: "#0a0a0a", marginBottom: 14 }}>Spending this month</p>
          {[
            { cat: "🛒 Shopping",  pct: 35, color: "#5B4FFF", amount: "$329" },
            { cat: "🍕 Food",      pct: 25, color: "#FF8C42", amount: "$235" },
            { cat: "🚗 Transport", pct: 20, color: "#10B981", amount: "$188" },
            { cat: "📺 Streaming", pct: 10, color: "#F59E0B", amount: "$94"  },
            { cat: "🌐 Other",     pct: 10, color: "#9CA3AF", amount: "$94"  },
          ].map(row => (
            <div key={row.cat} style={{ marginBottom: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}>{row.cat}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#0a0a0a" }}>{row.amount}</span>
              </div>
              <div style={{ height: 6, background: "#F3F4F6", borderRadius: 3, overflow: "hidden" }}>
                <div style={{ width: `${row.pct}%`, height: "100%", background: row.color, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Recent on this card */}
        <div style={{ background: "white", borderRadius: 20, padding: "16px 20px", border: "1px solid #F3F4F6", marginBottom: 90 }}>
          <p style={{ fontSize: 14, fontWeight: 800, color: "#0a0a0a", marginBottom: 4 }}>Recent transactions</p>
          {TRANSACTIONS.slice(0, 4).map((tx, i) => (
            <TxRow key={tx.id} tx={tx} border={i < 3} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── TAB 3: Transactions ─────────────────────────────────────────────────────
function TransactionsTab() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Income", "Shopping", "Food", "Transport", "Streaming"];

  const filtered = TRANSACTIONS.filter(tx => {
    const matchSearch = tx.name.toLowerCase().includes(search.toLowerCase()) || tx.category.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || tx.category === filter || (filter === "Income" && tx.amount > 0);
    return matchSearch && matchFilter;
  });

  const totalIn  = TRANSACTIONS.filter(t => t.amount > 0).reduce((s, t) => s + t.amount, 0);
  const totalOut = TRANSACTIONS.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#F9FAFB" }}>
      {/* Header */}
      <div style={{ padding: "24px 24px 16px", background: "white", position: "sticky", top: 0, zIndex: 10, borderBottom: "1px solid #F3F4F6" }}>
        <h1 style={{ fontSize: 22, fontWeight: 900, color: "#0a0a0a", marginBottom: 16 }}>Transactions</h1>

        {/* Search */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, height: 46, borderRadius: 14, border: "1.5px solid #E5E7EB", background: "#F9FAFB", padding: "0 14px", marginBottom: 12 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="8" stroke="#9CA3AF" strokeWidth="2"/><path d="M21 21l-4-4" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/></svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search transactions…"
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, color: "#0a0a0a" }} />
          {search && <button onClick={() => setSearch("")} style={{ border: "none", background: "none", cursor: "pointer", color: "#9CA3AF", fontSize: 18 }}>×</button>}
        </div>

        {/* Filter chips */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none" }}>
          {filters.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              height: 32, paddingLeft: 14, paddingRight: 14, borderRadius: 16, flexShrink: 0,
              border: `1.5px solid ${filter === f ? "#5B4FFF" : "#E5E7EB"}`,
              background: filter === f ? "#5B4FFF" : "white",
              color: filter === f ? "white" : "#374151",
              fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
            }}>{f}</button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div style={{ padding: "16px 24px", display: "flex", gap: 12 }}>
        <div style={{ flex: 1, padding: "12px 14px", borderRadius: 14, background: "#D1FAE5" }}>
          <p style={{ fontSize: 11, color: "#065F46", fontWeight: 600, marginBottom: 2 }}>Total in</p>
          <p style={{ fontSize: 18, fontWeight: 900, color: "#065F46" }}>+${totalIn.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
        </div>
        <div style={{ flex: 1, padding: "12px 14px", borderRadius: 14, background: "#FEE2E2" }}>
          <p style={{ fontSize: 11, color: "#991B1B", fontWeight: 600, marginBottom: 2 }}>Total out</p>
          <p style={{ fontSize: 18, fontWeight: 900, color: "#991B1B" }}>-${totalOut.toLocaleString("en-US", { minimumFractionDigits: 2 })}</p>
        </div>
      </div>

      {/* Transaction list */}
      <div style={{ padding: "0 24px 100px" }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "#9CA3AF" }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>🔍</p>
            <p style={{ fontSize: 15, fontWeight: 600 }}>No results for &quot;{search}&quot;</p>
          </div>
        ) : (
          <div style={{ background: "white", borderRadius: 16, padding: "0 16px", border: "1px solid #F3F4F6" }}>
            {filtered.map((tx, i) => <TxRow key={tx.id} tx={tx} border={i < filtered.length - 1} />)}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TAB 4: Profile ──────────────────────────────────────────────────────────
function ProfileTab() {
  const [darkMode, setDarkMode] = useState(false);
  const [notifs, setNotifs] = useState(true);
  const [biometric, setBiometric] = useState(true);

  const sections = [
    {
      title: "Account",
      items: [
        { icon: "👤", label: "Personal information", chevron: true },
        { icon: "🏦", label: "Bank accounts", chevron: true },
        { icon: "💳", label: "My cards", chevron: true, badge: "3" },
        { icon: "📱", label: "Linked devices", chevron: true },
      ],
    },
    {
      title: "Security",
      items: [
        { icon: "🔐", label: "Change PIN", chevron: true },
        { icon: "🔑", label: "Change password", chevron: true },
        { icon: "👁️", label: "Face ID / Biometrics", toggle: true, value: biometric, onToggle: () => setBiometric(b => !b) },
        { icon: "🛡️", label: "Two-factor authentication", chevron: true },
      ],
    },
    {
      title: "Preferences",
      items: [
        { icon: "🌙", label: "Dark mode", toggle: true, value: darkMode, onToggle: () => setDarkMode(d => !d) },
        { icon: "🔔", label: "Notifications", toggle: true, value: notifs, onToggle: () => setNotifs(n => !n) },
        { icon: "🌐", label: "Language", chevron: true, detail: "English" },
        { icon: "💰", label: "Base currency", chevron: true, detail: "USD" },
      ],
    },
    {
      title: "Support",
      items: [
        { icon: "❓", label: "Help center", chevron: true },
        { icon: "💬", label: "Chat with support", chevron: true },
        { icon: "⭐", label: "Rate the app", chevron: true },
        { icon: "📄", label: "Terms & Privacy", chevron: true },
      ],
    },
  ];

  return (
    <div style={{ flex: 1, overflowY: "auto", background: "#F9FAFB" }}>
      {/* Profile card */}
      <div style={{
        background: "linear-gradient(160deg,#5B4FFF,#7C6FFF)",
        padding: "32px 24px 40px", position: "relative", overflow: "hidden",
      }}>
        <div style={{ position: "absolute", width: 220, height: 220, borderRadius: 110, background: "rgba(255,255,255,0.06)", top: -60, right: -50 }} />
        <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative" }}>
          <div style={{ position: "relative" }}>
            <div style={{ width: 72, height: 72, borderRadius: 36, background: "rgba(255,255,255,0.2)", border: "3px solid rgba(255,255,255,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 36 }}>😎</div>
            <div style={{ position: "absolute", bottom: 0, right: 0, width: 22, height: 22, borderRadius: 11, background: "#FFB830", border: "2px solid #7C6FFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M8 1l3 3-7 7H1V8l7-7z" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
          <div>
            <p style={{ color: "white", fontSize: 20, fontWeight: 900 }}>Michael Anthony</p>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>@michael_a · +1 (555) 000-1234</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "4px 10px", marginTop: 6 }}>
              <div style={{ width: 6, height: 6, borderRadius: 3, background: "#10B981" }} />
              <span style={{ color: "white", fontSize: 11, fontWeight: 600 }}>KYC Verified</span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: 1, marginTop: 24, background: "rgba(255,255,255,0.1)", borderRadius: 16, overflow: "hidden", position: "relative" }}>
          {[
            { label: "Cards", value: "3" },
            { label: "Sent", value: "$2.1k" },
            { label: "Received", value: "$8.4k" },
          ].map((s, i) => (
            <div key={s.label} style={{ flex: 1, padding: "12px 0", textAlign: "center", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.15)" : "none" }}>
              <p style={{ color: "white", fontSize: 18, fontWeight: 900 }}>{s.value}</p>
              <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Referral banner */}
      <div style={{ margin: "16px 24px", padding: "14px 16px", borderRadius: 16, background: "linear-gradient(135deg,#FEF3C7,#FDE68A)", border: "1.5px solid #FCD34D", display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 28 }}>🎁</span>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: 13, fontWeight: 800, color: "#92400E" }}>Invite friends, earn $10</p>
          <p style={{ fontSize: 12, color: "#B45309" }}>Your code: MIKE2024</p>
        </div>
        <button style={{ height: 32, paddingLeft: 14, paddingRight: 14, borderRadius: 10, border: "none", background: "#F59E0B", color: "white", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Share</button>
      </div>

      {/* Settings sections */}
      <div style={{ padding: "0 24px 100px" }}>
        {sections.map(section => (
          <div key={section.title} style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{section.title}</p>
            <div style={{ background: "white", borderRadius: 16, overflow: "hidden", border: "1px solid #F3F4F6" }}>
              {section.items.map((item, i) => (
                <div key={item.label} style={{ display: "flex", alignItems: "center", padding: "14px 16px", borderBottom: i < section.items.length - 1 ? "1px solid #F9FAFB" : "none", cursor: "pointer" }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: "#F3F4F6", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginRight: 12, flexShrink: 0 }}>{item.icon}</div>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#0a0a0a" }}>{item.label}</span>
                  {"badge" in item && item.badge && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: "#5B4FFF", background: "#F0EFFF", padding: "2px 8px", borderRadius: 8, marginRight: 8 }}>{item.badge}</span>
                  )}
                  {"detail" in item && item.detail && (
                    <span style={{ fontSize: 13, color: "#9CA3AF", marginRight: 8 }}>{item.detail}</span>
                  )}
                  {"toggle" in item && item.toggle ? (
                    <div onClick={item.onToggle} style={{ width: 44, height: 26, borderRadius: 13, background: item.value ? "linear-gradient(135deg,#5B4FFF,#7C6FFF)" : "#E5E7EB", position: "relative", cursor: "pointer", transition: "background 0.2s", flexShrink: 0 }}>
                      <div style={{ position: "absolute", width: 20, height: 20, borderRadius: 10, background: "white", top: 3, left: item.value ? 21 : 3, boxShadow: "0 2px 4px rgba(0,0,0,0.15)", transition: "left 0.2s" }} />
                    </div>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Log out */}
        <button style={{
          width: "100%", height: 52, borderRadius: 16, border: "1.5px solid #FEE2E2",
          background: "#FFF5F5", color: "#EF4444", fontSize: 15, fontWeight: 700, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/><polyline points="16 17 21 12 16 7" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><line x1="21" y1="12" x2="9" y2="12" stroke="#EF4444" strokeWidth="2" strokeLinecap="round"/></svg>
          Log out
        </button>
      </div>
    </div>
  );
}

// ─── Bottom Navigation ────────────────────────────────────────────────────────
function BottomNav({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  const tabs: { id: Tab; label: string; icon: (active: boolean) => React.ReactNode }[] = [
    {
      id: "home", label: "Home",
      icon: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M3 12L12 3l9 9" stroke={a ? "#5B4FFF" : "#9CA3AF"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M9 21V12h6v9" stroke={a ? "#5B4FFF" : "#9CA3AF"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 10v11h14V10" stroke={a ? "#5B4FFF" : "#9CA3AF"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    },
    {
      id: "cards", label: "Cards",
      icon: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="3" stroke={a ? "#5B4FFF" : "#9CA3AF"} strokeWidth="2.5"/><path d="M2 10h20" stroke={a ? "#5B4FFF" : "#9CA3AF"} strokeWidth="2.5"/><path d="M6 15h4" stroke={a ? "#5B4FFF" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round"/></svg>,
    },
    {
      id: "transactions", label: "History",
      icon: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M2 12h20" stroke={a ? "#5B4FFF" : "#9CA3AF"} strokeWidth="2.5" strokeLinecap="round"/><path d="M7 7l10 10M17 7L7 17" stroke={a ? "#5B4FFF" : "#9CA3AF"} strokeWidth="0"/><rect x="3" y="3" width="18" height="18" rx="3" stroke={a ? "#5B4FFF" : "#9CA3AF"} strokeWidth="2.5"/><path d="M8 12h8M12 8v8" stroke={a ? "#5B4FFF" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round"/></svg>,
    },
    {
      id: "profile", label: "Profile",
      icon: (a) => <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke={a ? "#5B4FFF" : "#9CA3AF"} strokeWidth="2.5"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" stroke={a ? "#5B4FFF" : "#9CA3AF"} strokeWidth="2.5" strokeLinecap="round"/></svg>,
    },
  ];

  return (
    <div style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 430,
      background: "white", borderTop: "1px solid #F3F4F6",
      display: "flex", paddingBottom: 8,
      boxShadow: "0 -8px 32px rgba(0,0,0,0.06)",
      zIndex: 50,
    }}>
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => onChange(tab.id)} style={{
          flex: 1, border: "none", background: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "12px 0 4px",
        }}>
          {tab.icon(active === tab.id)}
          <span style={{ fontSize: 10, fontWeight: active === tab.id ? 700 : 500, color: active === tab.id ? "#5B4FFF" : "#9CA3AF" }}>
            {tab.label}
          </span>
          {active === tab.id && <div style={{ width: 4, height: 4, borderRadius: 2, background: "#5B4FFF" }} />}
        </button>
      ))}
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [tab, setTab] = useState<Tab>("home");

  return (
    <main style={{ position: "relative", width: "100%", height: "100dvh", maxWidth: 430, margin: "0 auto", background: "#F9FAFB", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {tab === "home"         && <HomeTab />}
      {tab === "cards"        && <CardsTab />}
      {tab === "transactions" && <TransactionsTab />}
      {tab === "profile"      && <ProfileTab />}
      <BottomNav active={tab} onChange={setTab} />
    </main>
  );
}
