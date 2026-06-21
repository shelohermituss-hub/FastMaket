"use client";

import React, { useEffect } from "react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export function BottomSheet({ open, onClose, title, children }: BottomSheetProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div
        className="relative w-full bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl overflow-hidden"
        style={{ animation: "slideUp 0.35s cubic-bezier(0.32, 0.72, 0, 1)" }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
        {title && (
          <div className="px-5 pt-2 pb-4 border-b border-gray-100 dark:border-gray-800">
            <h3 className="text-base font-bold text-gray-900 dark:text-white text-center">{title}</h3>
          </div>
        )}
        <div className="px-5 py-4 pb-safe">{children}</div>
      </div>
    </div>
  );
}
