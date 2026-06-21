"use client";

import React, { useState } from "react";

interface ToggleProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { track: "w-9 h-5", thumb: "w-4 h-4", translate: "translate-x-4" },
  md: { track: "w-12 h-6", thumb: "w-5 h-5", translate: "translate-x-6" },
  lg: { track: "w-14 h-7", thumb: "w-6 h-6", translate: "translate-x-7" },
};

export function Toggle({ checked: controlledChecked, onChange, disabled = false, label, size = "md" }: ToggleProps) {
  const [internalChecked, setInternalChecked] = useState(false);
  const isControlled = controlledChecked !== undefined;
  const checked = isControlled ? controlledChecked : internalChecked;
  const s = sizes[size];

  const handleToggle = () => {
    if (disabled) return;
    if (!isControlled) setInternalChecked((c) => !c);
    onChange?.(!checked);
  };

  return (
    <label className={`inline-flex items-center gap-3 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
      <button
        role="switch"
        aria-checked={checked}
        onClick={handleToggle}
        disabled={disabled}
        className={`relative ${s.track} rounded-full transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2`}
        style={{ background: checked ? "linear-gradient(135deg, #4040FF, #6B21FF)" : "#D1D5DB" }}
      >
        <span
          className={`absolute top-0.5 left-0.5 ${s.thumb} bg-white rounded-full shadow-sm transition-transform duration-300 ${checked ? s.translate : "translate-x-0"}`}
        />
      </button>
      {label && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
    </label>
  );
}
