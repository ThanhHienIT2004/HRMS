"use client";

import React from "react";
import { PersonRow } from "./PersonRow";
import { Badge } from "./Badge";
import { formatDate } from "@/app/(admin)/utils/format";
import { ActionButton } from "./IconButtons";

export const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`rounded-2xl bg-white shadow-sm ring-1 ring-black/5 ${className}`}>{children}</div>
);

export const CardHeader = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`px-5 pt-5 pb-3 flex items-center justify-between ${className}`}>{children}</div>
);

export const CardContent = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
    <div className={`px-3 pb-3 ${className}`}>{children}</div>
);

// ----------------- Early risers -----------------
export const EarlyRisersCard = ({ data }: { data: any[] }) => (
    <Card className="h-full">
        <CardHeader>
            <div className="font-semibold text-emerald-700">Đúng giờ / Đi sớm</div>
            <div className="text-xs text-gray-500">{formatDate(new Date())}</div>
        </CardHeader>
        <CardContent className="space-y-1">
            {data.map((p) => (
                <PersonRow
                    key={p.id}
                    {...p}
                    right={<Badge intent="success">Sớm {p.timeFormatted}</Badge>}
                />
            ))}
        </CardContent>
    </Card>
);

// ----------------- Late arrivals -----------------
export const LateArrivalsCard = ({ data }: { data: any[] }) => (
    <Card className="h-full">
        <CardHeader>
            <div className="font-semibold text-rose-700">Đi muộn</div>
            <div className="text-xs text-gray-500">{formatDate(new Date())}</div>
        </CardHeader>
        <CardContent className="space-y-1">
            {data.map((p) => (
                <PersonRow
                    key={p.id}
                    {...p}
                    right={<Badge intent="danger">Muộn {p.delayFormatted}</Badge>}
                />
            ))}
        </CardContent>
    </Card>
);

// ----------------- Missing punch -----------------
export const MissingPunchCard = ({ data }: { data: any[] }) => (
    <Card className="h-full">
        <CardHeader>
            <div className="font-semibold text-indigo-700">Thiếu chấm công</div>
            <div className="text-xs text-gray-500">{formatDate(new Date())}</div>
        </CardHeader>
        <CardContent className="space-y-1">
            {data.map((p) => (
                <PersonRow
                    key={p.id}
                    {...p}
                    right={<ActionButton variant="danger">{p.action}</ActionButton>}
                />
            ))}
        </CardContent>
    </Card>
);
