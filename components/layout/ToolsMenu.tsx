"use client";

import React from "react";
import {
    LineChart, BarChart2, Shield, Settings2,
    Cpu, BookOpen, Share2, Download, ExternalLink,
    ChevronRight, Info, History
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ToolItemProps {
    label: string;
    sub: string;
    icon: React.ElementType;
    badge?: string;
    onClick: () => void;
}

const ToolItem = ({ label, sub, icon: Icon, badge, onClick }: ToolItemProps) => (
    <button
        onClick={onClick}
        className="w-full flex items-center gap-3 p-2 rounded-md hover:bg-white/[0.02] transition-all group text-left border border-transparent hover:border-white/5"
    >
        <div className="p-2 rounded-[4px] bg-[#0c0f13] border border-white/5 group-hover:border-primary/40 group-hover:bg-primary/5 transition-all">
            <Icon className="w-4 h-4 text-zinc-500 group-hover:text-primary transition-colors" />
        </div>
        <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold text-zinc-200 uppercase tracking-widest">{label}</span>
                {badge && (
                    <span className="text-[7px] font-bold px-1 py-0.5 rounded-[2px] bg-primary/10 border border-primary/20 text-primary uppercase tracking-widest leading-none">
                        {badge}
                    </span>
                )}
            </div>
            <div className="text-[8px] text-zinc-500 font-medium tracking-wide">{sub}</div>
        </div>
        <ChevronRight className="w-3.5 h-3.5 text-zinc-700 group-hover:text-zinc-500 transition-all mr-1" />
    </button>
);

export const ToolsMenu = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
    if (!isOpen) return null;

    return (
        <div
            className="absolute top-full right-0 mt-2 w-72 bg-[#080a0c] border border-white/10 rounded-lg shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150 z-[110]"
            onMouseLeave={onClose}
        >
            <div className="px-3 py-2.5 border-b border-white/5 bg-[#0c0f13] flex items-center justify-between">
                <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Trading Utility Suite</span>
                <Info className="w-3 h-3 text-zinc-600" />
            </div>

            <div className="p-2 space-y-1">
                <ToolItem
                    label="P&L Dashboard"
                    sub="Detailed segment-wise performance analysis"
                    icon={LineChart}
                    badge="PRO"
                    onClick={() => { }}
                />
                <ToolItem
                    label="Strategy Builder"
                    sub="Simulate and deploy multi-leg options"
                    icon={Shield}
                    onClick={() => { }}
                />
                <ToolItem
                    label="Open Interest"
                    sub="Track real-time OI and Max Pain levels"
                    icon={BarChart2}
                    onClick={() => { }}
                />
                <ToolItem
                    label="Automate / API"
                    sub="Generate API keys and webhook settings"
                    icon={Cpu}
                    badge="BETA"
                    onClick={() => { }}
                />
                <ToolItem
                    label="Backtesting"
                    sub="Test logic against 10 years of data"
                    icon={History}
                    onClick={() => { }}
                />
            </div>

            <div className="p-1 mt-1 border-t border-white/5 bg-[#0c0f13]">
                <div className="grid grid-cols-2 gap-1 px-1 py-1">
                    <button className="flex items-center justify-center gap-1.5 py-1.5 rounded-[4px] bg-white/[0.02] hover:bg-white/[0.05] text-[8px] font-bold text-zinc-400 hover:text-zinc-200 transition-all uppercase tracking-widest">
                        <Download className="w-3 h-3" /> Export Labs
                    </button>
                    <button className="flex items-center justify-center gap-1.5 py-1.5 rounded-[4px] bg-white/[0.02] hover:bg-white/[0.05] text-[8px] font-bold text-zinc-400 hover:text-zinc-200 transition-all uppercase tracking-widest">
                        <Share2 className="w-3 h-3" /> Community
                    </button>
                </div>
            </div>

            <div className="px-3 py-2 bg-primary/5 text-center border-t border-primary/10 hover:bg-primary/10 transition-colors cursor-pointer">
                <span className="text-[8px] font-black text-primary uppercase tracking-[0.2em] flex items-center justify-center gap-1.5 pointer-events-none">
                    <ExternalLink className="w-3 h-3" /> Launch Cyber Terminal v3.2
                </span>
            </div>
        </div>
    );
};
