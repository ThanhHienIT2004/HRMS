"use client";

import React from "react";
import { Check } from "lucide-react";

export const Toast = ({ message, onClose }: { message: string; onClose: () => void }) => (
    <div className="fixed bottom-6 right-6 z-50">
        <div className="rounded-2xl bg-black text-white/90 px-4 py-2 shadow-lg">
            <div className="flex items-center gap-2">
                <Check className="size-4" />
                <span className="text-sm">{message}</span>
                <button className="ml-2 text-white/70 hover:text-white" onClick={onClose}>
                    Close
                </button>
            </div>
        </div>
    </div>
);