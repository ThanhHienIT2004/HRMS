"use client";

import React from "react";
import { LucideIcon } from "lucide-react";

export const IconButton = ({ icon: Icon, label, onClick, className = "" }: { icon: LucideIcon; label: string; onClick?: () => void; className?: string }) => (
    <button
        onClick={onClick}
        className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium hover:bg-gray-100 active:scale-[.98] transition ${className}`}
    >
        <Icon className="size-4" /> {label}
    </button>
);
export const ActionButton = ({ variant = "primary", children, onClick }: { variant?: "primary" | "danger"; children: React.ReactNode; onClick?: () => void }) => {
    const styles =
        variant === "primary"
            ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            : "bg-rose-50 text-rose-700 hover:bg-rose-100";
    return (
        <button
            onClick={onClick}
            className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-black/5 transition ${styles}`}
        >
            {children}
        </button>
    );
};