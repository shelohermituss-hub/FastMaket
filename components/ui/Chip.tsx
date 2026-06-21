"use client";

import React from "react";

interface ChipProps {
  label: string;
  onRemove?: () => void;
  icon?: React.ReactNode;
  avatar?: string;
  selected?: boolean;
  onClick?: () => void;
  variant?: "default" | "filled";
  size?: "sm" | "md";
}

export function Chip({ label, onRemove, icon, avatar, selected = false, onClick, variant = "default", size = "md" }: ChipProps) {
  const sizeClass = size === "sm" ? "h-7 px-2.5 text-xs gap-1.5" : "h-9 px-3.5 text-sm gap-2";

  return (
    <div
      onClick={onClick}
      className={`
        inline-flex items-center rounded-full font-medium border transition-all duration-150
        ${onClick ? "cursor-pointer active:scale-95" : ""}
        ${sizeClass}
        ${selected
          ? "border-transparent text-white"
          : variant === "filled"
            ? "bg-gray-100 dark:bg-gray-800 border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-indigo-300"
        }
      `}
      style={selected ? { background: "linear-gradient(135deg, #4040FF, #6B21FF)" } : undefined}
    >
      {avatar && (
        <img src={avatar} alt={label} className={`rounded-full object-cover ${size === "sm" ? "w-4 h-4" : "w-5 h-5"}`} />
      )}
      {!avatar && icon && <span className="shrink-0">{icon}</span>}
      <span>{label}</span>
      {onRemove && (
        <button
          onClick={(e) => { e.stopPropagation(); onRemove(); }}
          className={`rounded-full flex items-center justify-center hover:bg-black/10 transition-colors ${size === "sm" ? "w-4 h-4" : "w-5 h-5"}`}
          aria-label="Remove"
        >
          <svg width="10" height="10" viewBox="0 0 12 12" fill="currentColor">
            <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      )}
    </div>
  );
}
