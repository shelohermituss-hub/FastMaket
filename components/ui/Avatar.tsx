"use client";

import React from "react";

// ─── Avatar ───────────────────────────────────────────────────────────────────
type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";
type AvatarStatus = "online" | "offline" | "away" | "busy" | null;

interface AvatarProps {
  src?: string;
  name?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  className?: string;
}

const sizeMap: Record<AvatarSize, { avatar: string; status: string; statusPos: string }> = {
  xs: { avatar: "w-6 h-6 text-[9px]", status: "w-2 h-2", statusPos: "bottom-0 right-0" },
  sm: { avatar: "w-8 h-8 text-xs", status: "w-2.5 h-2.5", statusPos: "bottom-0 right-0" },
  md: { avatar: "w-10 h-10 text-sm", status: "w-3 h-3", statusPos: "bottom-0 right-0" },
  lg: { avatar: "w-14 h-14 text-base", status: "w-3.5 h-3.5", statusPos: "bottom-0.5 right-0.5" },
  xl: { avatar: "w-20 h-20 text-xl", status: "w-4 h-4", statusPos: "bottom-1 right-1" },
};

const statusColor: Record<NonNullable<AvatarStatus>, string> = {
  online: "bg-green-500",
  offline: "bg-gray-400",
  away: "bg-amber-400",
  busy: "bg-red-500",
};

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

function stringToColor(str: string) {
  const colors = ["#4040FF", "#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#3B82F6", "#EF4444"];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

export function Avatar({ src, name = "?", size = "md", status = null, className = "" }: AvatarProps) {
  const s = sizeMap[size];
  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      <div
        className={`${s.avatar} rounded-full flex items-center justify-center font-semibold text-white overflow-hidden`}
        style={{ background: src ? undefined : stringToColor(name) }}
      >
        {src ? (
          <img src={src} alt={name} className="w-full h-full object-cover" />
        ) : (
          getInitials(name)
        )}
      </div>
      {status && (
        <span
          className={`absolute ${s.status} ${s.statusPos} ${statusColor[status]} rounded-full ring-2 ring-white dark:ring-gray-900`}
        />
      )}
    </div>
  );
}

// ─── Avatar Group ─────────────────────────────────────────────────────────────
interface AvatarGroupProps {
  users: { name: string; src?: string }[];
  max?: number;
  size?: AvatarSize;
}

export function AvatarGroup({ users, max = 4, size = "sm" }: AvatarGroupProps) {
  const visible = users.slice(0, max);
  const rest = users.length - max;
  const s = sizeMap[size];
  return (
    <div className="flex -space-x-2">
      {visible.map((u, i) => (
        <Avatar key={i} name={u.name} src={u.src} size={size} className="ring-2 ring-white dark:ring-gray-900" />
      ))}
      {rest > 0 && (
        <div
          className={`${s.avatar} rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-semibold ring-2 ring-white dark:ring-gray-900`}
        >
          +{rest}
        </div>
      )}
    </div>
  );
}
