"use client";

import React from "react";

interface TopNavProps {
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: React.ReactNode;
  avatar?: { src?: string; name?: string };
  transparent?: boolean;
}

export function TopNav({ title, subtitle, onBack, rightAction, avatar, transparent = false }: TopNavProps) {
  return (
    <div
      className={`flex items-center justify-between px-5 py-3 ${
        transparent ? "bg-transparent" : "bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800"
      }`}
    >
      {/* Left */}
      <div className="flex items-center gap-3 min-w-0">
        {onBack && (
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 active:scale-90 transition-transform"
            aria-label="Back"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 dark:text-gray-300" />
            </svg>
          </button>
        )}
        {avatar && (
          <div className="w-9 h-9 rounded-full bg-indigo-500 flex items-center justify-center shrink-0 overflow-hidden">
            {avatar.src
              ? <img src={avatar.src} alt={avatar.name} className="w-full h-full object-cover" />
              : <span className="text-white text-sm font-semibold">{avatar.name?.[0]}</span>
            }
          </div>
        )}
        {(title || subtitle) && (
          <div className="min-w-0">
            {title && <p className="text-base font-bold text-gray-900 dark:text-white truncate">{title}</p>}
            {subtitle && <p className="text-xs text-gray-400 truncate">{subtitle}</p>}
          </div>
        )}
      </div>

      {/* Right */}
      {rightAction && <div className="shrink-0">{rightAction}</div>}
    </div>
  );
}
