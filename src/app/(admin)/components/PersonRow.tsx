"use client";

import React from "react";
import { MoreHorizontal } from "lucide-react";

export const PersonRow = ({
                              name,
                              id,
                              avatar,
                              right,
                              onClick,
                          }: {
    name: string;
    id: string;
    avatar: string;
    right?: React.ReactNode;
    onClick?: () => void;
}) => (
    <div className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-gray-50">
        {/* Avatar + Tên */}
        <div className="flex items-center gap-3">
            <img src={avatar} alt={name} className="h-9 w-9 rounded-full object-cover" />
            <div>
                <div className="font-medium">{name}</div>
                <div className="text-xs text-gray-500">{id}</div>
            </div>
        </div>

        {/* Bên phải */}
        <div className="flex items-center gap-2">
            {right && <div className="text-xs font-medium">{right}</div>}
            {onClick && (
                <button
                    onClick={onClick}
                    className="rounded-full p-1.5 hover:bg-gray-100"
                >
                    <MoreHorizontal className="size-4 text-gray-600" />
                </button>
            )}
        </div>
    </div>
);
