"use client";

import React from "react";

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: "xs" | "sm" | "md" | "lg";
  color?: "primary" | "success" | "warning" | "danger";
  animated?: boolean;
}

const trackHeight = { xs: "h-1", sm: "h-1.5", md: "h-2.5", lg: "h-4" };
const colorMap = {
  primary: "linear-gradient(90deg, #4040FF, #6B21FF)",
  success: "linear-gradient(90deg, #10B981, #059669)",
  warning: "linear-gradient(90deg, #F59E0B, #D97706)",
  danger: "linear-gradient(90deg, #EF4444, #DC2626)",
};

export function ProgressBar({ value, max = 100, label, showValue = false, size = "md", color = "primary", animated = true }: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div className="w-full flex flex-col gap-1.5">
      {(label || showValue) && (
        <div className="flex justify-between items-center">
          {label && <span className="text-xs font-medium text-gray-600 dark:text-gray-400">{label}</span>}
          {showValue && <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{Math.round(pct)}%</span>}
        </div>
      )}
      <div className={`w-full ${trackHeight[size]} rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden`}>
        <div
          className={`h-full rounded-full ${animated ? "transition-all duration-700 ease-out" : ""}`}
          style={{ width: `${pct}%`, background: colorMap[color] }}
        />
      </div>
    </div>
  );
}
