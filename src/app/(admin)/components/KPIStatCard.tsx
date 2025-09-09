"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "./Card";
import { Badge } from "./Badge";

export const KPIStatCard = ({
                                icon: Icon,
                                label,
                                value,
                                delta,
                                deltaType = "up",
                            }: {
    icon: LucideIcon;
    label: string;
    value: number;
    delta?: number;
    deltaType?: "up" | "down";
}) => (
    <Card className="h-full w-full shadow-sm rounded-2xl">
        <CardContent className="relative flex flex-col gap-2 py-4 px-7">
            {/* Top row: Icon + Delta */}
            <div className="flex items-center justify-between">
                <div className="grid size-10 place-items-center rounded-full bg-indigo-50">
                    <Icon className="size-5 text-indigo-600" />
                </div>
                {delta !== undefined && (
                    <Badge intent={deltaType === "up" ? "success" : "danger"}>
                        {deltaType === "up" ? "↑" : "↓"} {delta}%
                    </Badge>
                )}
            </div>

            {/* Value */}
            <div className="text-2xl font-bold text-gray-800">{value}</div>

            {/* Label */}
            <span className="text-2sm text-gray-500">{label}</span>
        </CardContent>
    </Card>
);
