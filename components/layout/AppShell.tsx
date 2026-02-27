"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Settings, Terminal, LogOut, LayoutGrid, Settings2, ShieldCheck, ChevronDown } from "lucide-react";
import { useMarketStore } from "@/hooks/useMarketStore";
import { useKiteTicker } from "@/hooks/useKiteTicker";
import { MARKET_INSTRUMENTS } from "@/lib/market-config";
import { LayoutManager } from "@/components/layout/LayoutManager";
import { WorkspaceTabs } from "@/components/layout/WorkspaceTabs";
import { WidgetPicker } from "@/components/layout/WidgetPicker";
import { ToolsMenu } from "@/components/layout/ToolsMenu";
import { CommandCenter } from "@/components/ui/command-center";
import { GlobalHotkeys } from "@/components/trading/GlobalHotkeys";
import { useLayoutSwipe } from "@/hooks/useLayoutSwipe";
import { useAccountSync } from "@/hooks/useAccountSync";
import { PnLTicker } from "@/components/trading/PnLTicker";
import { MarketSentiment } from "@/components/trading/MarketSentiment";
import { SettingsDialog } from "@/components/ui/settings-dialog";
import { ProfileMenu } from "@/components/layout/ProfileMenu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useLayoutStore } from "@/hooks/useLayoutStore";
import { useAuthStore } from "@/hooks/useAuthStore";
import { LoginScreen } from "@/components/auth/LoginScreen";
import { AuthInitializer } from "@/components/auth/AuthInitializer";
import { IndicesTicker } from "@/components/market/IndicesTicker";
import { SafetyToggle } from "@/components/layout/SafetyToggle";
import { Toaster } from "@/components/ui/toaster";
import { MobileNavBar } from "@/components/layout/MobileNavBar";
import { CursorFollower } from "@/components/ui/CursorFollower";
import { PiPWindow } from "@/components/charts/PiPWindow";

const INSTRUMENT_TOKENS = MARKET_INSTRUMENTS.map(i => i.token);

export default function AppShell() {
    const [isWidgetPickerOpen, setIsWidgetPickerOpen] = useState(false);
    const [isToolsMenuOpen, setIsToolsMenuOpen] = useState(false);

    // Connect to Kite WebSocket for live data
    useKiteTicker({
        instrumentTokens: INSTRUMENT_TOKENS
    });

    useLayoutSwipe();
    useAccountSync();

    const searchParams = useSearchParams();
    const isLoggedInBase = useAuthStore(state => state.isLoggedIn);
    const testAuth = searchParams.get('testAuth');
    const isLoggedIn = isLoggedInBase || testAuth === '1';
    const user = useAuthStore(state => state.user);
    const connectionStatus = useMarketStore(state => state.connectionStatus);
    const unifiedMargin = useMarketStore(state => state.unifiedMargin);
    const { activeBroker } = useAuthStore();
    const { setCommandCenterOpen, setSettingsOpen, setActiveWorkspace } = useLayoutStore();

    useEffect(() => {
        const layoutParam = searchParams.get('layout');
        if (layoutParam && (layoutParam === 'algo' || layoutParam === 'algorithmic')) {
            setActiveWorkspace('algorithmic');
        }
    }, [searchParams, setActiveWorkspace]);

    if (!isLoggedIn) {
        return (
            <>
                <AuthInitializer />
                <LoginScreen />
            </>
        );
    }

    return (
        <div className="h-screen w-full flex flex-col overflow-hidden selection:bg-primary/30 selection:text-primary relative font-sans">
            {/* ─── Global Background Effects ─── */}
            <div className="absolute inset-0 bg-[#080a0c] z-0" />
            <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] pointer-events-none z-0" />

            <PiPWindow />
            <AuthInitializer />
            <GlobalHotkeys />
            <CursorFollower />
            <CommandCenter />
            <SettingsDialog />
            <Toaster />

            {/* Header - Flat, Dense Refactor */}
            <header data-testid="app-header" className="h-[40px] border-b border-white/5 flex items-center justify-between gap-4 bg-[#0c0f13] z-20 shrink-0">
                {/* LEFT SECTION (Logo + Tabs) */}
                <div className="flex items-center h-full min-w-0">
                    <div className="flex items-center gap-2 px-3 shrink-0 group cursor-pointer border-r border-white/5 h-full">
                        <Terminal className="w-3.5 h-3.5 text-primary" />
                        <div className="flex items-baseline gap-1">
                            <span className="text-[11px] font-black tracking-tight text-zinc-100">CYBER</span>
                            <span className="text-[8px] font-bold tracking-[0.2em] text-primary/70">TRADE</span>
                        </div>
                    </div>

                    {/* Workspace Tabs - Flat underline style */}
                    <div className="flex-1 min-w-0 h-full flex items-end overflow-hidden">
                        <WorkspaceTabs />
                    </div>
                </div>

                {/* MIDDLE SECTION (P&L + Market Status) */}
                <div className="hidden lg:flex items-center gap-4 shrink-0 h-full">
                    <div className="flex items-center gap-3 px-3 h-full border-x border-white/5 cursor-pointer hover:bg-white/[0.02] transition-colors group">
                        <span className="text-[7.5px] font-bold text-zinc-500 uppercase tracking-widest">P&L</span>
                        <div className="flex items-center gap-1">
                            <PnLTicker />
                            <ChevronDown className="w-2.5 h-2.5 text-zinc-600 group-hover:text-zinc-400" />
                        </div>
                    </div>
                    <div className="flex items-center h-full">
                        <MarketSentiment />
                    </div>
                </div>

                {/* RIGHT SECTION (Actions + Profile) */}
                <div className="flex items-center h-full shrink-0 relative">
                    {/* Tools Menu Trigger */}
                    <div className="relative h-full flex items-center">
                        <button
                            className="hidden md:flex items-center gap-1 h-full px-3 border-x border-white/5 text-[8.5px] font-bold text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.02] transition-all uppercase tracking-widest"
                            onClick={() => setIsToolsMenuOpen(!isToolsMenuOpen)}
                        >
                            <Settings2 className="w-3 h-3" />
                            Tools
                        </button>
                        <ToolsMenu isOpen={isToolsMenuOpen} onClose={() => setIsToolsMenuOpen(false)} />
                    </div>

                    {/* Widget Picker Trigger */}
                    <button
                        className="flex items-center gap-1 h-full px-3 text-[8.5px] font-bold text-primary hover:bg-primary/5 transition-all uppercase tracking-widest border-r border-white/5"
                        onClick={() => setIsWidgetPickerOpen(true)}
                    >
                        <LayoutGrid className="w-3.5 h-3.5" />
                        + Widgets
                    </button>

                    <WidgetPicker isOpen={isWidgetPickerOpen} onClose={() => setIsWidgetPickerOpen(false)} />

                    <div className="h-full flex items-center gap-1 px-2">
                        <SafetyToggle />
                        <ProfileMenu />
                    </div>
                </div>
            </header>

            {/* Indices Ticker Bar */}
            <div className="h-[24px] border-b border-white/5 bg-[#080a0c] flex items-center z-10 shrink-0">
                <IndicesTicker />
            </div>

            {/* Main Grid Layout - DYNAMIC MANAGER */}
            <main className="flex-1 overflow-hidden relative z-0">
                <LayoutManager />
            </main>

            {/* Footer Status Bar */}
            <footer className="h-[20px] border-t border-white/5 bg-[#0c0f13] text-[8px] flex items-center justify-between px-3 text-zinc-500 select-none shrink-0 font-mono z-20 font-bold tracking-widest uppercase">
                <div className="flex items-center gap-4 h-full">
                    <span className="flex items-center gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full animate-pulse shadow-[0_0_8px_var(--up)] ${connectionStatus === 'CONNECTED' || searchParams.get('mock') === 'true' ? 'bg-up' :
                            connectionStatus === 'CONNECTING' ? 'bg-amber-500' : 'bg-down'
                            }`}></span>
                        <span className={`text-glow ${connectionStatus === 'CONNECTED' || searchParams.get('mock') === 'true' ? 'text-up' :
                            connectionStatus === 'CONNECTING' ? 'text-amber-500' : 'text-down'
                            }`}>
                            {searchParams.get('mock') === 'true' ? (activeBroker || 'MOCK') + ' LIVE' :
                                connectionStatus === 'CONNECTED' ? (activeBroker || 'NSE') + ' LIVE' : connectionStatus}
                        </span>
                    </span>
                    <span className="flex items-center gap-1">
                        MARGIN:
                        <span className="text-up font-bold">₹{unifiedMargin.totalMargin.toLocaleString('en-IN')}</span>
                        {Object.keys(unifiedMargin.brokers).length > 1 && (
                            <span className="ml-2 px-1.5 py-0.5 rounded bg-up/10 text-up text-[8px] font-black border border-up/20 animate-pulse">
                                FUSED 🛰️
                            </span>
                        )}
                    </span>
                    <span className="flex items-center gap-1">
                        LATENCY:
                        <span className={connectionStatus === 'CONNECTED' ? "text-up" : "text-amber-500"}>{connectionStatus === 'CONNECTED' ? '4ms' : '-'}</span>
                    </span>
                    <span className="opacity-30">|</span>
                    <span className="hover:text-primary transition-colors cursor-pointer">v0.4.0-cyber</span>
                    {user && <span className="opacity-50">• {user.user_id}</span>}
                </div>
                <div className="flex gap-4 uppercase tracking-widest text-[9px]">
                    <span className="text-muted-foreground/30">{isLoggedIn ? 'Unified Adapter' : 'Demo Mode'}</span>
                </div>
            </footer >

            <MobileNavBar />
        </div >
    );
}
