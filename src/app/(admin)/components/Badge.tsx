"use client";

import React from "react";

export const Badge = ({ children, intent = "neutral" }: { children: React.ReactNode; intent?: "neutral" | "success" | "danger" | "info" }) => {
    const styles = {
        neutral: "bg-gray-100 text-gray-700",
        success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
        danger: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
        info: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200",
    }[intent];
    return (
        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${styles}`}>
            {children}
        </span>
    );
};