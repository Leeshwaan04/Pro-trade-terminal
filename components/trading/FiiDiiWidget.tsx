"use client";

import React from "react";
import { WidgetHeader } from "@/components/ui/WidgetHeader";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from "recharts";

// Mock Data representing Daily Institutional Activity
const data = [
    { date: "22 Feb", fii: -1200, dii: 1800 },
    { date: "23 Feb", fii: -800, dii: 1200 },
    { date: "26 Feb", fii: 450, dii: -200 },
    { date: "27 Feb", fii: 1500, dii: -800 },
    { date: "28 Feb", fii: -2800, dii: 3200 }, // Huge sell-off day absorbed by DIIs
];

export const FiiDiiWidget = () => {
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-[#0c0f13] border border-white/10 p-2 rounded shadow-xl font-mono text-[10px]">
                    <div className="text-white font-bold mb-1 border-b border-white/10 pb-1">{label}</div>
                    <div className="text-zinc-300">FII: <span className={payload[0].value >= 0 ? 'text-up' : 'text-down'}>{payload[0].value} Cr</span></div>
                    <div className="text-zinc-300">DII: <span className={payload[1].value >= 0 ? 'text-up' : 'text-down'}>{payload[1].value} Cr</span></div>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="flex flex-col h-full bg-surface-1 font-mono">
            <WidgetHeader id="fii-dii" title="FII/DII FLOWS" />

            <div className="flex-1 p-2 pt-4">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={data}
                        margin={{ top: 0, right: 10, left: -20, bottom: 0 }}
                        barGap={1}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#71717a', fontSize: 8, fontWeight: 'bold' }}
                            dy={5}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#71717a', fontSize: 8, fontWeight: 'bold' }}
                            domain={[-4000, 4000]}
                            tickFormatter={(val) => `${val / 1000}k`}
                        />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />

                        <Bar dataKey="fii" radius={[2, 2, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-fii-${index}`} fill={entry.fii >= 0 ? '#10b981' : '#ef4444'} />
                            ))}
                        </Bar>
                        <Bar dataKey="dii" radius={[2, 2, 0, 0]}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-dii-${index}`} fill={entry.dii >= 0 ? '#3b82f6' : '#f59e0b'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="px-3 py-2 bg-[#080a0c] border-t border-white/5 flex gap-4 text-[9px] font-bold text-zinc-400">
                <div className="flex items-center gap-1">
                    <div className="w-1.5 h-4 bg-gradient-to-b from-green-500 to-red-500 rounded-sm"></div> FII
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-1.5 h-4 bg-gradient-to-b from-blue-500 to-yellow-500 rounded-sm"></div> DII
                </div>
            </div>
        </div>
    );
};
