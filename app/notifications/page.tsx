"use client";

import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";

const TYPE_ICON: Record<string, string> = {
  transfer: "↑",
  receive:  "↓",
  alert:    "!",
  promo:    "★",
};
const TYPE_COLOR: Record<string, string> = {
  transfer: "#5B4FFF",
  receive:  "#10B981",
  alert:    "#EF4444",
  promo:    "#F59E0B",
};

function fmtTime(ts: number) {
  const diff = Date.now() - ts;
  if (diff < 3600000)  return `${Math.max(1, Math.floor(diff / 60000))}m ago`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}d ago`;
  return new Date(ts).toLocaleDateString("en-US", { month:"short", day:"numeric" });
}

export default function NotificationsPage() {
  const router = useRouter();
  const { state, dispatch } = useApp();
  const { notifications } = state;

  const unread = notifications.filter(n => !n.read).length;

  return (
    <div style={{ maxWidth:430, margin:"0 auto", height:"100dvh", background:"#F8F9FA", display:"flex", flexDirection:"column", fontFamily:"var(--font-geist-sans)" }}>
      {/* Header */}
      <div style={{ background:"white", padding:"52px 24px 16px", borderBottom:"1px solid #F3F4F6" }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <button onClick={() => router.back()} style={{ background:"#F3F4F6", border:"none", borderRadius:12, width:40, height:40, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer" }}>
            <span style={{ fontSize:18 }}>←</span>
          </button>
          <h1 style={{ fontSize:17, fontWeight:700, color:"#111827" }}>Notifications</h1>
          {unread > 0 ? (
            <button onClick={() => dispatch({ type:"MARK_ALL_READ" })} style={{ background:"none", border:"none", color:"#5B4FFF", fontSize:12, fontWeight:600, cursor:"pointer" }}>
              Mark all read
            </button>
          ) : (
            <div style={{ width:40 }} />
          )}
        </div>
      </div>

      {/* List */}
      <div style={{ flex:1, overflowY:"auto", padding:"12px 16px", display:"flex", flexDirection:"column", gap:8 }}>
        {notifications.length === 0 && (
          <div style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:12, paddingTop:80 }}>
            <div style={{ fontSize:48 }}>🔔</div>
            <p style={{ color:"#9CA3AF", fontSize:14 }}>No notifications yet</p>
          </div>
        )}
        {notifications.map((n, i) => (
          <div key={n.id} onClick={() => {}} style={{
            background: n.read ? "white" : "#F0EFFE",
            borderRadius:16,
            padding:"14px 16px",
            display:"flex",
            gap:12,
            alignItems:"flex-start",
            animation:`fadeInUp 0.3s ease ${i*0.04}s both`,
            border: n.read ? "1px solid transparent" : "1px solid #D4D0FF",
          }}>
            {/* Icon */}
            <div style={{ width:44, height:44, borderRadius:22, background:TYPE_COLOR[n.type], display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <span style={{ color:"white", fontSize:18, fontWeight:900 }}>{TYPE_ICON[n.type]}</span>
            </div>
            {/* Content */}
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:2 }}>
                <span style={{ fontSize:14, fontWeight:700, color:"#111827" }}>{n.title}</span>
                <span style={{ fontSize:11, color:"#9CA3AF", flexShrink:0, marginLeft:8 }}>{fmtTime(n.timestamp)}</span>
              </div>
              <p style={{ fontSize:13, color:"#6B7280", margin:0 }}>{n.body}</p>
            </div>
            {/* Unread dot */}
            {!n.read && (
              <div style={{ width:8, height:8, borderRadius:4, background:"#5B4FFF", flexShrink:0, marginTop:4 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
