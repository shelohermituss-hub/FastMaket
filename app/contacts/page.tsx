"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp, type Contact } from "@/lib/store";

type Modal = null | "add" | "view";

export default function ContactsPage() {
  const router = useRouter();
  const { state, dispatch, transfer } = useApp();
  const { contacts, cards, activeCardId } = state;

  const [modal, setModal] = useState<Modal>(null);
  const [selected, setSelected] = useState<Contact | null>(null);
  const [search, setSearch] = useState("");

  // Add contact form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [account, setAccount] = useState("");
  const [color, setColor] = useState("#5B4FFF");

  // Transfer from view modal
  const [txAmount, setTxAmount] = useState("");
  const [txNote, setTxNote] = useState("");
  const [txDone, setTxDone] = useState(false);
  const [txError, setTxError] = useState("");

  const COLORS = ["#5B4FFF","#F59E0B","#10B981","#EF4444","#06B6D4","#8B5CF6","#EC4899"];

  const filtered = contacts.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  function handleAdd() {
    if (!name.trim() || !phone.trim()) return;
    const initials = name.trim().split(" ").map((w:string)=>w[0]).slice(0,2).join("").toUpperCase();
    dispatch({
      type: "ADD_CONTACT",
      contact: { name: name.trim(), initials, color, phone: phone.trim(), accountNumber: account.trim() || "****0000" }
    });
    setName(""); setPhone(""); setAccount(""); setColor("#5B4FFF");
    setModal(null);
  }

  function handleTransfer() {
    const amt = parseFloat(txAmount);
    if (!amt || amt <= 0) { setTxError("Enter a valid amount"); return; }
    if (!selected) return;
    const ok = transfer(selected.name, amt, txNote || undefined, activeCardId);
    if (!ok) { setTxError("Insufficient balance"); return; }
    setTxDone(true);
    setTxError("");
  }

  function openView(c: Contact) {
    setSelected(c);
    setTxAmount(""); setTxNote(""); setTxDone(false); setTxError("");
    setModal("view");
  }

  return (
    <div style={{ maxWidth:430, margin:"0 auto", height:"100dvh", background:"#F8F9FA", display:"flex", flexDirection:"column", fontFamily:"var(--font-geist-sans)" }}>
      {/* Header */}
      <div style={{ background:"white", padding:"52px 24px 16px", borderBottom:"1px solid #F3F4F6" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
          <button onClick={() => router.back()} style={{ background:"#F3F4F6", border:"none", borderRadius:12, width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <span style={{ fontSize:18 }}>←</span>
          </button>
          <h1 style={{ fontSize:17, fontWeight:700, color:"#111827" }}>Contacts</h1>
          <button onClick={() => setModal("add")} style={{ background:"linear-gradient(135deg,#5B4FFF,#7C6FFF)", border:"none", borderRadius:12, width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <span style={{ color:"white", fontSize:22, lineHeight:1 }}>+</span>
          </button>
        </div>
        {/* Search */}
        <div style={{ display:"flex", alignItems:"center", background:"#F3F4F6", borderRadius:12, padding:"10px 14px", gap:8 }}>
          <span style={{ color:"#9CA3AF" }}>🔍</span>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search contacts..."
            style={{ flex:1, border:"none", outline:"none", background:"transparent", fontSize:14, color:"#111827" }}
          />
        </div>
      </div>

      {/* List */}
      <div style={{ flex:1, overflowY:"auto", padding:"12px 16px", display:"flex", flexDirection:"column", gap:8 }}>
        {filtered.length === 0 && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, paddingTop:80 }}>
            <div style={{ fontSize:48 }}>👥</div>
            <p style={{ color:"#9CA3AF", fontSize:14 }}>No contacts found</p>
          </div>
        )}
        {filtered.map((c, i) => (
          <button key={c.id} onClick={() => openView(c)} style={{
            background:"white", border:"none", borderRadius:16, padding:"14px 16px",
            display:"flex", alignItems:"center", gap:14, cursor:"pointer", textAlign:"left",
            animation:`fadeInUp 0.3s ease ${i*0.05}s both`,
          }}>
            <div style={{ width:48, height:48, borderRadius:24, background:c.color, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ color:"white", fontSize:16, fontWeight:800 }}>{c.initials}</span>
            </div>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:15, fontWeight:700, color:"#111827", margin:0 }}>{c.name}</p>
              <p style={{ fontSize:12, color:"#9CA3AF", margin:"2px 0 0" }}>{c.phone}</p>
            </div>
            <div style={{ display:"flex", gap:8 }}>
              <div style={{ width:32, height:32, borderRadius:16, background:"#F0EFFE", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <span style={{ fontSize:14 }}>↑</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* View/Transfer modal */}
      {modal === "view" && selected && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:100 }}>
          <div style={{ width:"100%", maxWidth:430, background:"white", borderRadius:"24px 24px 0 0", padding:"24px 20px 40px", animation:"slideUp 0.3s ease" }}>
            <div style={{ width:40, height:4, borderRadius:2, background:"#E5E7EB", margin:"0 auto 20px" }} />

            {/* Contact header */}
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", marginBottom:24 }}>
              <div style={{ width:72, height:72, borderRadius:36, background:selected.color, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:12 }}>
                <span style={{ color:"white", fontSize:26, fontWeight:800 }}>{selected.initials}</span>
              </div>
              <h2 style={{ fontSize:20, fontWeight:800, color:"#111827", margin:0 }}>{selected.name}</h2>
              <p style={{ fontSize:13, color:"#9CA3AF", margin:"4px 0 0" }}>{selected.phone}</p>
              <p style={{ fontSize:12, color:"#9CA3AF", margin:"2px 0 0" }}>Account: {selected.accountNumber}</p>
            </div>

            {txDone ? (
              <div style={{ textAlign:"center", padding:"20px 0" }}>
                <div style={{ fontSize:48, marginBottom:8 }}>✅</div>
                <p style={{ fontSize:16, fontWeight:700, color:"#111827" }}>Transfer Sent!</p>
                <p style={{ fontSize:13, color:"#6B7280" }}>${parseFloat(txAmount).toFixed(2)} sent to {selected.name}</p>
                <button onClick={() => setModal(null)} style={{ marginTop:16, width:"100%", padding:"14px 0", borderRadius:14, background:"linear-gradient(135deg,#5B4FFF,#7C6FFF)", border:"none", color:"white", fontSize:15, fontWeight:700, cursor:"pointer" }}>Done</button>
              </div>
            ) : (
              <>
                <p style={{ fontSize:13, fontWeight:600, color:"#6B7280", marginBottom:8 }}>Send Money</p>
                <div style={{ display:"flex", alignItems:"center", background:"#F3F4F6", borderRadius:14, padding:"14px 16px", marginBottom:10 }}>
                  <span style={{ fontSize:20, fontWeight:800, color:"#374151", marginRight:8 }}>$</span>
                  <input type="number" min="1" value={txAmount} onChange={e=>{setTxAmount(e.target.value);setTxError("");}} placeholder="0.00"
                    style={{ flex:1, border:"none", outline:"none", background:"transparent", fontSize:24, fontWeight:800, color:"#111827" }} />
                </div>
                <input type="text" value={txNote} onChange={e=>setTxNote(e.target.value)} placeholder="Add a note (optional)"
                  style={{ width:"100%", padding:"12px 14px", borderRadius:12, border:"1.5px solid #E5E7EB", fontSize:14, color:"#111827", outline:"none", boxSizing:"border-box", marginBottom:10 }} />
                {txError && <p style={{ color:"#EF4444", fontSize:12, marginBottom:8 }}>{txError}</p>}
                <div style={{ display:"flex", gap:10 }}>
                  <button onClick={() => setModal(null)} style={{ flex:1, padding:"14px 0", borderRadius:14, background:"#F3F4F6", border:"none", color:"#374151", fontSize:15, fontWeight:600, cursor:"pointer" }}>Cancel</button>
                  <button onClick={handleTransfer} style={{ flex:2, padding:"14px 0", borderRadius:14, background:"linear-gradient(135deg,#5B4FFF,#7C6FFF)", border:"none", color:"white", fontSize:15, fontWeight:700, cursor:"pointer" }}>Send</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Add contact modal */}
      {modal === "add" && (
        <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.5)", display:"flex", alignItems:"flex-end", justifyContent:"center", zIndex:100 }}>
          <div style={{ width:"100%", maxWidth:430, background:"white", borderRadius:"24px 24px 0 0", padding:"24px 20px 40px", animation:"slideUp 0.3s ease" }}>
            <div style={{ width:40, height:4, borderRadius:2, background:"#E5E7EB", margin:"0 auto 20px" }} />
            <h2 style={{ fontSize:18, fontWeight:800, color:"#111827", marginBottom:20 }}>New Contact</h2>

            {/* Color picker */}
            <div style={{ display:"flex", gap:8, marginBottom:16 }}>
              {COLORS.map(c => (
                <button key={c} onClick={() => setColor(c)} style={{ width:32, height:32, borderRadius:16, background:c, border:`3px solid ${color===c?"#111827":"transparent"}`, cursor:"pointer", padding:0 }} />
              ))}
            </div>

            {[
              { label:"Name", value:name, set:setName, placeholder:"Full name" },
              { label:"Phone", value:phone, set:setPhone, placeholder:"+1 555 000 0000" },
              { label:"Account #", value:account, set:setAccount, placeholder:"••••1234" },
            ].map(f => (
              <div key={f.label} style={{ marginBottom:12 }}>
                <p style={{ fontSize:12, color:"#6B7280", marginBottom:6 }}>{f.label}</p>
                <input type="text" value={f.value} onChange={e=>f.set(e.target.value)} placeholder={f.placeholder}
                  style={{ width:"100%", padding:"12px 14px", borderRadius:12, border:"1.5px solid #E5E7EB", fontSize:14, color:"#111827", outline:"none", boxSizing:"border-box" }} />
              </div>
            ))}

            <div style={{ display:"flex", gap:10, marginTop:8 }}>
              <button onClick={() => setModal(null)} style={{ flex:1, padding:"14px 0", borderRadius:14, background:"#F3F4F6", border:"none", color:"#374151", fontSize:15, fontWeight:600, cursor:"pointer" }}>Cancel</button>
              <button onClick={handleAdd} disabled={!name.trim()||!phone.trim()} style={{ flex:2, padding:"14px 0", borderRadius:14, background:(!name.trim()||!phone.trim())?"#D1D5DB":"linear-gradient(135deg,#5B4FFF,#7C6FFF)", border:"none", color:"white", fontSize:15, fontWeight:700, cursor:"pointer" }}>Add Contact</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
