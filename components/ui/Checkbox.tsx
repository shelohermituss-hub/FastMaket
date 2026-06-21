"use client";

import React, { useState } from "react";

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  indeterminate?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: "w-4 h-4", md: "w-5 h-5", lg: "w-6 h-6" };

export function Checkbox({ checked: ctrl, onChange, label, disabled = false, indeterminate = false, size = "md" }: CheckboxProps) {
  const [internal, setInternal] = useState(false);
  const isControlled = ctrl !== undefined;
  const checked = isControlled ? ctrl : internal;

  const handleChange = () => {
    if (disabled) return;
    if (!isControlled) setInternal((c) => !c);
    onChange?.(!checked);
  };

  return (
    <label className={`inline-flex items-center gap-2.5 ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
      <div
        role="checkbox"
        aria-checked={indeterminate ? "mixed" : checked}
        onClick={handleChange}
        className={`
          ${sizes[size]} rounded-md flex items-center justify-center shrink-0
          border-2 transition-all duration-150
          ${checked || indeterminate
            ? "border-transparent"
            : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900"}
        `}
        style={checked || indeterminate ? { background: "linear-gradient(135deg, #4040FF, #6B21FF)" } : undefined}
      >
        {checked && !indeterminate && (
          <svg viewBox="0 0 12 10" fill="none" className="w-3 h-3">
            <path d="M1 5l3.5 3.5L11 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
        {indeterminate && (
          <span className="w-2.5 h-0.5 bg-white rounded-full" />
        )}
      </div>
      {label && <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</span>}
    </label>
  );
}
