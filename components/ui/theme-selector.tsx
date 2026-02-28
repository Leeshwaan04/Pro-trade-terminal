"use client";

import * as React from "react";
import { Check, Settings2 } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const themes = [
    {
        name: "Antigravity",
        value: "antigravity",
        color: "#00e5ff",
        bg: "#030508",
        desc: "Deep Space Neon (Default)"
    },
    {
        name: "Groww Classic",
        value: "groww",
        color: "#22c55e",
        bg: "#080a0c",
        desc: "Investing Green"
    },
    {
        name: "Midnight Protocol",
        value: "midnight",
        color: "#94a3b8",
        bg: "#000000",
        desc: "OLED Pitch Black"
    },
    {
        name: "Light Mode",
        value: "light",
        color: "#0284c7",
        bg: "#ffffff",
        desc: "Corporate Slate"
    }
];

export function ThemeSelector({ className }: { className?: string }) {
    const { theme, setTheme } = useTheme();

    // Default to antigravity if theme is missing or system
    const activeTheme = theme === "system" ? "antigravity" : theme || "antigravity";
    const activeConfig = themes.find(t => t.value === activeTheme) || themes[0];

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className={cn(
                        "relative flex items-center gap-1.5 px-3 py-1.5 overflow-hidden transition-all duration-300 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 text-xs font-black uppercase tracking-widest text-zinc-500 hover:text-white group",
                        className
                    )}
                    title="Select UI Theme"
                >
                    <div
                        className="w-2.5 h-2.5 rounded-full border border-white/20 shadow-sm transition-all duration-500 group-hover:scale-110"
                        style={{
                            backgroundColor: activeConfig.bg,
                            boxShadow: `0 0 10px ${activeConfig.color}40`,
                            borderColor: `${activeConfig.color}80`
                        }}
                    />
                    <span className="hidden sm:inline-block">Theme</span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-background/90 backdrop-blur-xl border-border/20">
                <DropdownMenuLabel className="text-xs font-black tracking-widest uppercase text-muted-foreground flex items-center gap-2">
                    <Settings2 className="w-3.5 h-3.5" />
                    Neural Engine
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/10" />
                {themes.map((t) => (
                    <DropdownMenuItem
                        key={t.value}
                        onClick={() => setTheme(t.value)}
                        className={cn(
                            "flex flex-col items-start gap-1 py-2 cursor-pointer transition-colors",
                            activeTheme === t.value ? "bg-primary/10 text-primary focus:bg-primary/15" : "text-muted-foreground focus:text-foreground focus:bg-white/5"
                        )}
                    >
                        <div className="flex items-center w-full gap-2">
                            <div
                                className="w-3 h-3 rounded-full flex-shrink-0"
                                style={{
                                    backgroundColor: t.bg,
                                    border: `1px solid ${t.color}`,
                                    boxShadow: activeTheme === t.value ? `0 0 8px ${t.color}60` : 'none'
                                }}
                            />
                            <span className="text-xs font-black uppercase tracking-wide flex-1">{t.name}</span>
                            {activeTheme === t.value && <Check className="w-3 h-3 text-primary" />}
                        </div>
                        <span className="text-[10px] opacity-60 ml-5 font-mono">{t.desc}</span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
