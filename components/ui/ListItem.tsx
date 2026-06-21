"use client";

import React from "react";
import { Avatar } from "./Avatar";
import { Toggle } from "./Toggle";

interface ListItemProps {
  title: string;
  subtitle?: string;
  amount?: string;
  amountColor?: "positive" | "negative" | "neutral";
  avatar?: { src?: string; name: string };
  iconBg?: string;
  icon?: React.ReactNode;
  rightAction?: "toggle" | "arrow" | "amount" | React.ReactNode;
  toggled?: boolean;
  onToggle?: (v: boolean) => void;
  onClick?: () => void;
  divider?: boolean;
}

const amountColors = {
  positive: "text-green-500",
  negative: "text-red-500",
  neutral: "text-gray-700 dark:text-gray-300",
};

export function ListItem({
  title,
  subtitle,
  amount,
  amountColor = "neutral",
  avatar,
  iconBg,
  icon,
  rightAction,
  toggled,
  onToggle,
  onClick,
  divider = true,
}: ListItemProps) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 ${onClick ? "cursor-pointer active:bg-gray-50 dark:active:bg-gray-800/50" : ""} ${divider ? "border-b border-gray-100 dark:border-gray-800 last:border-0" : ""}`}
    >
      {/* Left icon or avatar */}
      {avatar && <Avatar name={avatar.name} src={avatar.src} size="md" />}
      {icon && !avatar && (
        <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ background: iconBg || "#F3F4F6" }}>
          {icon}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{title}</p>
        {subtitle && <p className="text-xs text-gray-400 truncate mt-0.5">{subtitle}</p>}
      </div>

      {/* Right */}
      {rightAction === "toggle" && (
        <Toggle checked={toggled} onChange={onToggle} size="sm" />
      )}
      {rightAction === "arrow" && (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-gray-400 shrink-0">
          <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
      {rightAction === "amount" && amount && (
        <span className={`text-sm font-bold shrink-0 ${amountColors[amountColor]}`}>{amount}</span>
      )}
      {rightAction && rightAction !== "toggle" && rightAction !== "arrow" && rightAction !== "amount" && (
        <div className="shrink-0">{rightAction as React.ReactNode}</div>
      )}
    </div>
  );
}
