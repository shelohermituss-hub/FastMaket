"use client";

import React, { useEffect } from "react";
import { Button } from "./Button";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  image?: string;
  primaryAction?: { label: string; onClick: () => void; loading?: boolean };
  secondaryAction?: { label: string; onClick: () => void };
  children?: React.ReactNode;
}

export function Dialog({ open, onClose, title, description, image, primaryAction, secondaryAction, children }: DialogProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div
        className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
        style={{ animation: "fadeInUp 0.3s ease-out" }}
      >
        {image && (
          <div className="w-full h-44 overflow-hidden">
            <img src={image} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        <div className="p-6">
          {title && <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 text-center">{title}</h2>}
          {description && <p className="text-sm text-gray-500 dark:text-gray-400 text-center leading-relaxed mb-6">{description}</p>}
          {children}
          <div className="flex flex-col gap-3 mt-4">
            {primaryAction && (
              <Button fullWidth size="lg" loading={primaryAction.loading} onClick={primaryAction.onClick}>
                {primaryAction.label}
              </Button>
            )}
            {secondaryAction && (
              <Button fullWidth size="lg" variant="ghost" onClick={secondaryAction.onClick}>
                {secondaryAction.label}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
