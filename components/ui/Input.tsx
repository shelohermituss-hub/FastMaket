"use client";

import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: "default" | "filled";
}

export function Input({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  variant = "default",
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <span className="absolute left-3.5 text-gray-400 pointer-events-none">{leftIcon}</span>
        )}
        <input
          id={inputId}
          className={`
            w-full h-12 rounded-2xl border text-sm font-medium outline-none transition-all
            placeholder:text-gray-400 placeholder:font-normal
            ${leftIcon ? "pl-10" : "pl-4"}
            ${rightIcon ? "pr-10" : "pr-4"}
            ${variant === "filled"
              ? "bg-gray-100 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-700"
              : "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700"}
            ${error
              ? "border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-100 dark:focus:ring-red-900"
              : "focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 dark:focus:ring-indigo-900"}
            text-gray-900 dark:text-white
            ${className}
          `}
          {...props}
        />
        {rightIcon && (
          <span className="absolute right-3.5 text-gray-400 pointer-events-none">{rightIcon}</span>
        )}
      </div>
      {error && <p className="text-xs text-red-500 flex items-center gap-1">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
}
