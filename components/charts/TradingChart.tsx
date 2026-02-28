"use client";

import React, { useState } from "react";
import { CustomCandlestickChart } from "./CustomCandlestickChart";
import { FloatingOrderTicket } from "@/components/trading/FloatingOrderTicket";
import { ChartControls } from "./ChartControls";
import { ChartToolbar } from "./ui/ChartToolbar";
import { IndicatorSearchDialog } from "./ui/IndicatorSearchDialog";
import { useLayoutStore } from "@/hooks/useLayoutStore";

interface TradingChartProps {
    symbol: string;
    widgetId?: string;
}

export const TradingChart = ({ symbol, widgetId }: TradingChartProps) => {
    const [timeframe, setTimeframe] = useState("1D");
    const [chartType, setChartType] = useState<"candle" | "line">("candle");
    const [showOrderTicket, setShowOrderTicket] = useState(false);
    const [showOIProfile, setShowOIProfile] = useState(false);

    const { syncInterval, syncedInterval, setSyncedInterval } = useLayoutStore();

    // Sync Interval from Global State
    React.useEffect(() => {
        if (syncInterval && syncedInterval !== timeframe) {
            setTimeframe(syncedInterval);
        }
    }, [syncInterval, syncedInterval]);

    const handleIntervalChange = (newInterval: string) => {
        setTimeframe(newInterval);
        if (syncInterval) {
            setSyncedInterval(newInterval);
        }
    };

    return (
        <div className="relative w-full h-full group bg-[var(--chart-bg)] flex flex-col overflow-hidden">
            {/* Chart Controls Bar */}
            <div className="flex-none w-full overflow-x-auto no-scrollbar border-b border-white/5">
                <div className="min-w-max">
                    <ChartControls
                        symbol={symbol}
                        widgetId={widgetId || "default-chart"}
                        period={timeframe}
                        onPeriodChange={handleIntervalChange}
                        interval={timeframe}
                        onIntervalChange={handleIntervalChange}
                        onTradeClick={() => setShowOrderTicket(!showOrderTicket)}
                        chartType={chartType}
                        onChartTypeChange={setChartType}
                        hideIndicators={false}
                        hideSnapshot={false}
                        showOIProfile={showOIProfile}
                        onToggleOIProfile={() => setShowOIProfile(!showOIProfile)}
                    />
                </div>
            </div>

            {/* Main Chart Area with Sidebar Toolbar */}
            <div className="flex-1 w-full relative min-h-0 overflow-hidden flex">
                {/* Left Drawing Toolbar */}
                <div className="flex-none hidden md:block border-r border-white/5">
                    <ChartToolbar symbol={symbol} />
                </div>

                {/* Custom Canvas Chart Engine */}
                <div className="flex-1 relative min-h-0 overflow-hidden">
                    <CustomCandlestickChart
                        symbol={symbol}
                        interval={timeframe}
                        chartType={chartType}
                        showOIProfile={showOIProfile}
                    />

                    {/* Floating Order Ticket Overlay */}
                    {showOrderTicket && (
                        <div className="absolute top-4 right-4 z-50">
                            <FloatingOrderTicket symbol={symbol} />
                        </div>
                    )}

                    {/* Indicator Search Overlay */}
                    <IndicatorSearchDialog />
                </div>
            </div>
        </div>
    );
};
