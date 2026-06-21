"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Step = "card" | "currency" | "budget" | "complete";

// ─── Helpers ─────────────────────────────────────────────────────────────────
function Header({ step, onBack }: { step: number; onBack: () => void }) {
  return (
    <div style={{ padding: "20px 24px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <button onClick={onBack} style={{
          width: 40, height: 40, borderRadius: 20, border: "1.5px solid #E5E7EB",
          background: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="#0a0a0a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div style={{ flex: 1, height: 4, background: "#F3F4F6", borderRadius: 2, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 2,
            background: "linear-gradient(90deg, #5B4FFF, #7C6FFF)",
            width: `${(step / 4) * 100}%`,
            transition: "width 0.4s ease",
          }} />
        </div>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF" }}>{step}/4</span>
      </div>
    </div>
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

// ─── SCREEN 1: Add Card ───────────────────────────────────────────────────────
function SetupCard({ onNext, onSkip }: { onNext: () => void; onSkip: () => void }) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [cardType, setCardType] = useState<"visa" | "mastercard" | null>(null);
  const [flipped, setFlipped] = useState(false);

  function formatCard(v: string) {
    const digits = v.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  }
  function formatExpiry(v: string) {
    const d = v.replace(/\D/g, "").slice(0, 4);
    return d.length >= 3 ? d.slice(0, 2) + "/" + d.slice(2) : d;
  }

  const raw = cardNumber.replace(/\s/g, "");
  if (raw.length === 1) {
    if (raw[0] === "4" && cardType !== "visa") setCardType("visa");
    else if ((raw[0] === "5" || raw[0] === "2") && cardType !== "mastercard") setCardType("mastercard");
  }

  const canAdd = raw.length === 16 && expiry.length === 5 && cvv.length >= 3 && name.length >= 2;

  return (
    <div style={{ width: "100%", height: "100%", background: "white", display: "flex", flexDirection: "column", animation: "slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <Header step={1} onBack={onSkip} />

      <div style={{ padding: "8px 28px 0" }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Setup — Step 1</p>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0a0a0a", marginBottom: 4 }}>Add your card</h1>
        <p style={{ fontSize: 14, color: "#9CA3AF" }}>Link a debit or credit card to get started</p>
      </div>

      {/* Card preview */}
      <div style={{ padding: "24px 28px", display: "flex", justifyContent: "center" }}>
        <div
          onClick={() => setFlipped(!flipped)}
          style={{
            width: 300, height: 180, borderRadius: 22, overflow: "hidden", cursor: "pointer",
            position: "relative", transition: "transform 0.5s",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
            transformStyle: "preserve-3d",
            boxShadow: "0 20px 60px rgba(91,79,255,0.3)",
          }}
        >
          {/* Front */}
          <div style={{
            position: "absolute", inset: 0, backfaceVisibility: "hidden",
            background: "linear-gradient(135deg, #5B4FFF 0%, #7C6FFF 50%, #9B8FFF 100%)",
            padding: "20px 22px", display: "flex", flexDirection: "column", justifyContent: "space-between",
          }}>
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.2) 0%, transparent 60%)" }} />
            <div style={{ position: "relative", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <span style={{ fontSize: 15, fontWeight: 800, color: "white", fontStyle: "italic", letterSpacing: 2 }}>FIN CORE</span>
              {cardType === "visa" && <span style={{ fontSize: 20, fontWeight: 900, color: "white", fontStyle: "italic" }}>VISA</span>}
              {cardType === "mastercard" && (
                <div style={{ display: "flex" }}>
                  <div style={{ width: 26, height: 26, borderRadius: 13, background: "rgba(255,200,0,0.9)", marginRight: -8 }} />
                  <div style={{ width: 26, height: 26, borderRadius: 13, background: "rgba(255,80,0,0.8)" }} />
                </div>
              )}
              {!cardType && <div style={{ width: 36, height: 22, borderRadius: 4, background: "rgba(255,255,255,0.2)" }} />}
            </div>
            <div style={{ position: "relative" }}>
              <div style={{ width: 36, height: 26, borderRadius: 4, background: "linear-gradient(135deg,#D4AF37,#B8960C)", marginBottom: 12 }} />
              <p style={{ color: "rgba(255,255,255,0.9)", fontSize: 16, fontWeight: 700, letterSpacing: 2, marginBottom: 6 }}>
                {raw.length > 0 ? formatCard(cardNumber) : "•••• •••• •••• ••••"}
              </p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, marginBottom: 2 }}>CARD HOLDER</p>
                  <p style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{name||"YOUR NAME"}</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 10, marginBottom: 2 }}>EXPIRES</p>
                  <p style={{ color: "white", fontSize: 13, fontWeight: 600 }}>{expiry||"MM/YY"}</p>
                </div>
              </div>
            </div>
          </div>
          {/* Back */}
          <div style={{
            position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)",
            background: "linear-gradient(135deg,#1a1a2e,#374151)",
            display: "flex", flexDirection: "column", justifyContent: "center",
          }}>
            <div style={{ height: 44, background: "#0a0a0a", width: "100%", marginBottom: 20 }} />
            <div style={{ padding: "0 20px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ flex: 1, height: 36, borderRadius: 4, background: "white", display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: 12 }}>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#0a0a0a", letterSpacing: 2 }}>{cvv||"•••"}</p>
              </div>
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.5)" }}>CVV</span>
            </div>
          </div>
        </div>
      </div>
      <p style={{ textAlign: "center", fontSize: 12, color: "#9CA3AF", marginTop: -8, marginBottom: 8 }}>Tap card to flip</p>

      {/* Form */}
      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 12, overflowY: "auto" }}>
        <div style={{ display: "flex", border: "1.5px solid #E5E7EB", borderRadius: 14, overflow: "hidden" }}>
          <input
            value={cardNumber} onChange={e => setCardNumber(formatCard(e.target.value))}
            placeholder="Card number" maxLength={19}
            onFocus={() => setFlipped(false)}
            style={{ flex: 1, height: 52, border: "none", outline: "none", padding: "0 16px", fontSize: 16, fontWeight: 600, letterSpacing: 1, color: "#0a0a0a", background: "transparent" }}
          />
          {cardType === "visa" && <div style={{ padding: "0 14px", display: "flex", alignItems: "center" }}><span style={{ fontSize: 18, fontWeight: 900, fontStyle: "italic", color: "#1A1F71" }}>VISA</span></div>}
          {cardType === "mastercard" && <div style={{ padding: "0 14px", display: "flex", alignItems: "center", gap: -4 }}>
            <div style={{ width: 20, height: 20, borderRadius: 10, background: "#EB001B" }} />
            <div style={{ width: 20, height: 20, borderRadius: 10, background: "#F79E1B", marginLeft: -8 }} />
          </div>}
        </div>
        <input
          value={name} onChange={e => setName(e.target.value.toUpperCase())}
          placeholder="Name on card"
          onFocus={() => setFlipped(false)}
          style={{ height: 52, borderRadius: 14, border: "1.5px solid #E5E7EB", padding: "0 16px", fontSize: 15, color: "#0a0a0a", outline: "none", background: "white", letterSpacing: 1 }}
        />
        <div style={{ display: "flex", gap: 12 }}>
          <input
            value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))}
            placeholder="MM/YY" maxLength={5}
            onFocus={() => setFlipped(false)}
            style={{ flex: 1, height: 52, borderRadius: 14, border: "1.5px solid #E5E7EB", padding: "0 16px", fontSize: 16, fontWeight: 600, color: "#0a0a0a", outline: "none", background: "white" }}
          />
          <input
            value={cvv} onChange={e => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="CVV" maxLength={4}
            onFocus={() => setFlipped(true)}
            style={{ width: 100, height: 52, borderRadius: 14, border: "1.5px solid #E5E7EB", padding: "0 16px", fontSize: 16, fontWeight: 600, color: "#0a0a0a", outline: "none", background: "white", letterSpacing: 3 }}
          />
        </div>
        <div style={{ padding: "10px 14px", borderRadius: 12, background: "#F0FDF4", border: "1.5px solid #86EFAC", display: "flex", alignItems: "center", gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="3" y="11" width="18" height="11" rx="2" stroke="#16A34A" strokeWidth="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#16A34A" strokeWidth="2" strokeLinecap="round"/></svg>
          <span style={{ fontSize: 12, color: "#15803D", fontWeight: 500 }}>256-bit SSL encryption — your card is safe</span>
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ padding: "16px 24px 40px", display: "flex", flexDirection: "column", gap: 10 }}>
        <PrimaryBtn label="Add Card" onClick={onNext} disabled={!canAdd} />
        <button onClick={onSkip} style={{ border: "none", background: "none", color: "#9CA3AF", fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "8px" }}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

// ─── SCREEN 2: Currency ───────────────────────────────────────────────────────
function SetupCurrency({ onNext, onBack }: { onNext: (c: string) => void; onBack: () => void }) {
  const [selected, setSelected] = useState("USD");
  const currencies = [
    { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸", rate: "1.00" },
    { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺", rate: "0.92" },
    { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧", rate: "0.79" },
    { code: "CAD", name: "Canadian Dollar", symbol: "CA$", flag: "🇨🇦", rate: "1.36" },
    { code: "CHF", name: "Swiss Franc", symbol: "Fr", flag: "🇨🇭", rate: "0.90" },
    { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵", rate: "149.5" },
    { code: "MAD", name: "Moroccan Dirham", symbol: "د.م.", flag: "🇲🇦", rate: "10.05" },
    { code: "XOF", name: "West African CFA", symbol: "CFA", flag: "🌍", rate: "603" },
    { code: "BRL", name: "Brazilian Real", symbol: "R$", flag: "🇧🇷", rate: "4.98" },
    { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳", rate: "83.1" },
  ];

  return (
    <div style={{ width: "100%", height: "100%", background: "white", display: "flex", flexDirection: "column", animation: "slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <Header step={2} onBack={onBack} />

      <div style={{ padding: "8px 28px 16px" }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Setup — Step 2</p>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0a0a0a", marginBottom: 4 }}>Base currency</h1>
        <p style={{ fontSize: 14, color: "#9CA3AF" }}>All balances will be shown in this currency</p>
      </div>

      {/* Preview chip */}
      <div style={{ padding: "0 24px 16px", display: "flex", justifyContent: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 20px", borderRadius: 20,
          background: "linear-gradient(135deg, #F0EFFF, #E0DEFF)", border: "1.5px solid #5B4FFF",
        }}>
          <span style={{ fontSize: 22 }}>{currencies.find(c => c.code === selected)?.flag}</span>
          <span style={{ fontSize: 16, fontWeight: 900, color: "#5B4FFF" }}>{selected}</span>
          <span style={{ fontSize: 13, color: "#7C6FFF" }}>{currencies.find(c => c.code === selected)?.symbol}</span>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "0 24px" }}>
        {currencies.map(c => (
          <button key={c.code} onClick={() => setSelected(c.code)} style={{
            width: "100%", padding: "14px 16px", borderRadius: 14, marginBottom: 8,
            border: `1.5px solid ${selected === c.code ? "#5B4FFF" : "#E5E7EB"}`,
            background: selected === c.code ? "#F0EFFF" : "white",
            cursor: "pointer", display: "flex", alignItems: "center", gap: 14, textAlign: "left",
            transition: "all 0.15s",
          }}>
            <span style={{ fontSize: 26, flexShrink: 0 }}>{c.flag}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: selected === c.code ? "#5B4FFF" : "#0a0a0a" }}>{c.code} — {c.name}</p>
              <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 2 }}>1 USD = {c.rate} {c.code}</p>
            </div>
            <span style={{ fontSize: 16, fontWeight: 800, color: selected === c.code ? "#5B4FFF" : "#9CA3AF" }}>{c.symbol}</span>
            {selected === c.code && (
              <div style={{ width: 22, height: 22, borderRadius: 11, background: "#5B4FFF", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="12" height="9" viewBox="0 0 12 9" fill="none"><path d="M1 4l4 4 6-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            )}
          </button>
        ))}
      </div>

      <div style={{ padding: "16px 24px 40px" }}>
        <PrimaryBtn label="Confirm Currency" onClick={() => onNext(selected)} />
      </div>
    </div>
  );
}

// ─── SCREEN 3: Budget ─────────────────────────────────────────────────────────
function SetupBudget({ currency, onNext, onBack }: { currency: string; onNext: (budget: number) => void; onBack: () => void }) {
  const [amount, setAmount] = useState("");
  const [period, setPeriod] = useState<"weekly" | "monthly">("monthly");
  const [alerts, setAlerts] = useState({ at50: true, at80: true, at100: true });

  const presets = [500, 1000, 2000, 5000];
  const num = parseFloat(amount.replace(/,/g, "")) || 0;
  const SYMBOLS: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", MAD: "د.م.", XOF: "CFA", JPY: "¥", BRL: "R$", INR: "₹", CAD: "CA$", CHF: "Fr" };
  const sym = SYMBOLS[currency] || "$";

  return (
    <div style={{ width: "100%", height: "100%", background: "white", display: "flex", flexDirection: "column", animation: "slideInRight 0.38s cubic-bezier(0.25,0.46,0.45,0.94)" }}>
      <Header step={3} onBack={onBack} />

      <div style={{ padding: "8px 28px 0" }}>
        <p style={{ fontSize: 12, fontWeight: 600, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>Setup — Step 3</p>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: "#0a0a0a", marginBottom: 4 }}>Set your budget</h1>
        <p style={{ fontSize: 14, color: "#9CA3AF" }}>Track and control your spending automatically</p>
      </div>

      {/* Period toggle */}
      <div style={{ padding: "20px 24px 0", display: "flex", background: "#F3F4F6", borderRadius: 16, margin: "16px 24px 0", position: "relative" }}>
        <div style={{
          position: "absolute", top: 4, bottom: 4,
          left: period === "weekly" ? 4 : "calc(50% + 2px)",
          width: "calc(50% - 6px)",
          borderRadius: 12, background: "white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          transition: "left 0.25s ease",
        }} />
        {(["weekly", "monthly"] as const).map(p => (
          <button key={p} onClick={() => setPeriod(p)} style={{
            flex: 1, height: 44, border: "none", background: "none", cursor: "pointer",
            fontSize: 14, fontWeight: 700,
            color: period === p ? "#5B4FFF" : "#9CA3AF",
            position: "relative", transition: "color 0.2s", borderRadius: 12,
          }}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </button>
        ))}
      </div>

      {/* Big input */}
      <div style={{ padding: "24px 28px 0", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 8 }}>{period === "weekly" ? "Weekly" : "Monthly"} spending limit</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <span style={{ fontSize: 36, fontWeight: 900, color: "#5B4FFF" }}>{sym}</span>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0"
            style={{
              fontSize: 52, fontWeight: 900, color: "#0a0a0a", border: "none", outline: "none",
              width: "160px", textAlign: "left", background: "transparent",
            }}
          />
        </div>
        {num > 0 && (
          <p style={{ fontSize: 13, color: "#9CA3AF" }}>
            ≈ {sym}{period === "monthly" ? (num / 30).toFixed(0) : (num * 4).toLocaleString()} per {period === "monthly" ? "day" : "month"}
          </p>
        )}
      </div>

      {/* Presets */}
      <div style={{ padding: "16px 24px 0", display: "flex", gap: 10 }}>
        {presets.map(p => (
          <button key={p} onClick={() => setAmount(String(p))} style={{
            flex: 1, height: 38, borderRadius: 10, border: `1.5px solid ${num === p ? "#5B4FFF" : "#E5E7EB"}`,
            background: num === p ? "#F0EFFF" : "white", cursor: "pointer",
            fontSize: 13, fontWeight: 700, color: num === p ? "#5B4FFF" : "#374151",
            transition: "all 0.15s",
          }}>{sym}{p >= 1000 ? `${p / 1000}k` : p}</button>
        ))}
      </div>

      {/* Alert toggles */}
      <div style={{ padding: "20px 24px 0" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 12 }}>Alert me when I reach</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {([["at50", "50%", "#F59E0B"], ["at80", "80%", "#EF4444"], ["at100", "100%", "#DC2626"]] as const).map(([key, label, color]) => (
            <div key={key} onClick={() => setAlerts(a => ({ ...a, [key]: !a[key] }))} style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 16px", borderRadius: 14, background: "#F9FAFB", cursor: "pointer",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: 5, background: color }} />
                <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>{label} of budget</span>
              </div>
              <div style={{
                width: 44, height: 26, borderRadius: 13,
                background: alerts[key] ? "linear-gradient(135deg,#5B4FFF,#7C6FFF)" : "#E5E7EB",
                position: "relative", transition: "background 0.2s",
              }}>
                <div style={{
                  position: "absolute", width: 20, height: 20, borderRadius: 10, background: "white",
                  top: 3, left: alerts[key] ? 21 : 3,
                  boxShadow: "0 2px 4px rgba(0,0,0,0.15)",
                  transition: "left 0.2s",
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1 }} />
      <div style={{ padding: "16px 24px 40px", display: "flex", flexDirection: "column", gap: 10 }}>
        <PrimaryBtn label="Set Budget" onClick={() => onNext(num)} disabled={num <= 0} />
        <button onClick={() => onNext(0)} style={{ border: "none", background: "none", color: "#9CA3AF", fontSize: 14, fontWeight: 600, cursor: "pointer", padding: "8px" }}>
          Skip for now
        </button>
      </div>
    </div>
  );
}

// ─── SCREEN 4: Complete ───────────────────────────────────────────────────────
function SetupComplete({ currency, budget }: { currency: string; budget: number }) {
  const router = useRouter();
  const SYMBOLS: Record<string, string> = { USD: "$", EUR: "€", GBP: "£", MAD: "د.م.", XOF: "CFA", JPY: "¥", BRL: "R$", INR: "₹", CAD: "CA$", CHF: "Fr" };
  const sym = SYMBOLS[currency] || "$";

  const checklist = [
    { icon: "✅", text: "Account verified" },
    { icon: "💳", text: "Card added" },
    { icon: "🌐", text: `Base currency: ${currency}` },
    { icon: "📊", text: budget > 0 ? `Budget set: ${sym}${budget.toLocaleString()}/mo` : "Budget: not set" },
  ];

  return (
    <div style={{
      width: "100%", height: "100%", background: "white", display: "flex", flexDirection: "column",
      animation: "fadeInUp 0.5s cubic-bezier(0.25,0.46,0.45,0.94)",
    }}>
      {/* Top purple section */}
      <div style={{
        background: "linear-gradient(160deg, #5B4FFF 0%, #7C6FFF 60%, #9B8FFF 100%)",
        padding: "60px 28px 48px", display: "flex", flexDirection: "column", alignItems: "center",
        position: "relative", overflow: "hidden",
      }}>
        {/* Background circles */}
        <div style={{ position: "absolute", width: 300, height: 300, borderRadius: 150, background: "rgba(255,255,255,0.05)", top: -80, right: -80 }} />
        <div style={{ position: "absolute", width: 200, height: 200, borderRadius: 100, background: "rgba(255,255,255,0.05)", bottom: -40, left: -40 }} />

        <div style={{
          width: 96, height: 96, borderRadius: 48, background: "rgba(255,255,255,0.2)",
          border: "3px solid rgba(255,255,255,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: 20, position: "relative",
          animation: "floatY 3s ease-in-out infinite",
        }}>
          <svg width="44" height="36" viewBox="0 0 44 36" fill="none">
            <path d="M4 18l12 12L40 4" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: "white", textAlign: "center", marginBottom: 8 }}>
          You&apos;re all set! 🎉
        </h1>
        <p style={{ fontSize: 15, color: "rgba(255,255,255,0.8)", textAlign: "center", lineHeight: 1.6 }}>
          Your FIN CORE account is ready.<br />Let&apos;s start managing your money.
        </p>

        {/* Confetti dots */}
        {["#FFB830","#FF6B6B","#4ECDC4","#FFE66D","#A8E6CF"].map((c, i) => (
          <div key={i} style={{
            position: "absolute", width: 8, height: 8, borderRadius: 4, background: c,
            top: `${20 + i * 12}%`, left: `${8 + i * 16}%`,
            animation: `floatY ${1.5 + i * 0.3}s ease-in-out infinite ${i * 0.2}s`,
          }} />
        ))}
      </div>

      {/* Summary card */}
      <div style={{ padding: "24px 24px 0" }}>
        <div style={{ borderRadius: 20, border: "1.5px solid #E5E7EB", overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", background: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
            <p style={{ fontSize: 12, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 1 }}>Setup Summary</p>
          </div>
          {checklist.map((item, i) => (
            <div key={i} style={{
              padding: "14px 16px", display: "flex", alignItems: "center", gap: 12,
              borderBottom: i < checklist.length - 1 ? "1px solid #F3F4F6" : "none",
            }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1 }} />

      {/* Quick actions */}
      <div style={{ padding: "0 24px 12px" }}>
        <p style={{ fontSize: 13, fontWeight: 700, color: "#374151", marginBottom: 12 }}>What do you want to do first?</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { icon: "💸", label: "Send Money", color: "#F0EFFF", textColor: "#5B4FFF" },
            { icon: "➕", label: "Top Up", color: "#F0FDF4", textColor: "#16A34A" },
            { icon: "📊", label: "Analytics", color: "#FFF7ED", textColor: "#EA580C" },
            { icon: "💳", label: "My Cards", color: "#FFF1F2", textColor: "#E11D48" },
          ].map(a => (
            <button key={a.label} onClick={() => router.push("/home")} style={{
              height: 56, borderRadius: 16, border: "none", cursor: "pointer",
              background: a.color, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            }}>
              <span style={{ fontSize: 20 }}>{a.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: a.textColor }}>{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "8px 24px 40px" }}>
        <button onClick={() => router.push("/home")} style={{
          width: "100%", height: 56, borderRadius: 28, border: "none",
          background: "linear-gradient(135deg,#5B4FFF,#7C6FFF)", color: "white",
          fontSize: 16, fontWeight: 700, cursor: "pointer",
          boxShadow: "0 8px 24px rgba(91,79,255,0.35)",
        }}>
          Go to Dashboard →
        </button>
      </div>
    </div>
  );
}

// ─── Controller ───────────────────────────────────────────────────────────────
export default function SetupPage() {
  const [step, setStep] = useState<Step>("card");
  const [currency, setCurrency] = useState("USD");
  const [budget, setBudget] = useState(0);

  return (
    <main style={{
      position: "relative", width: "100%", height: "100dvh",
      overflow: "hidden", maxWidth: 430, margin: "0 auto", background: "white",
    }}>
      {step === "card"     && <SetupCard onNext={() => setStep("currency")} onSkip={() => setStep("currency")} />}
      {step === "currency" && <SetupCurrency onBack={() => setStep("card")} onNext={c => { setCurrency(c); setStep("budget"); }} />}
      {step === "budget"   && <SetupBudget currency={currency} onBack={() => setStep("currency")} onNext={b => { setBudget(b); setStep("complete"); }} />}
      {step === "complete" && <SetupComplete currency={currency} budget={budget} />}
    </main>
  );
}
