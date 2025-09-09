"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "./Card";

const COLORS = ["#3B82F6", "#111827"]; // Xanh dương cho Nữ, đen cho Nam

export const EmployeesDonut = ({ men, women }: { men: number; women: number }) => {
    const data = [
        { name: "Nam", value: men, color: COLORS[1] },
        { name: "Nữ", value: women, color: COLORS[0] },
    ];
    const total = men + women;

    return (
        <Card className="w-full md:w-auto rounded-2xl shadow-md">
            <CardContent className="flex items-center gap-6 py-6">
                {/* Bên trái: label */}
                <div>
                    <div className="mb-2 text-2xl font-semibold text-gray-600">
                        Tổng
                    </div>
                    <ul className="space-y-2 text-sm">
                        {data.map((item, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                <span
                    className="inline-block size-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                />
                                <span>
                  {item.name}: {item.value}
                </span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Donut chart */}
                <div className="relative h-28 w-28">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <defs>
                                {/* Gradient cho nữ */}
                                <linearGradient id="femaleGradient" x1="0" y1="0" x2="1" y2="0">
                                    <stop offset="0%" stopColor="#B8C2FF" />
                                    <stop offset="100%" stopColor="#6183FF" />
                                </linearGradient>
                            </defs>

                            <Pie
                                data={data}
                                innerRadius={35}
                                outerRadius={50}
                                dataKey="value"
                                stroke="none"
                                cornerRadius={10}
                            >
                                <Cell fill="#111111" /> {/* Nam - đen/xám */}
                                <Cell fill="url(#femaleGradient)" /> {/* Nữ - gradient */}
                            </Pie>
                        </PieChart>

                    </ResponsiveContainer>
                    {/* Tổng số ở giữa */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-gray-800">{total}</span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
