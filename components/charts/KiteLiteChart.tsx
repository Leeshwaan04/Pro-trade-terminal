"use client";

import React, { useEffect, useRef, useState } from "react";
import { createChart, IChartApi, ISeriesApi, CandlestickData } from "lightweight-charts";
import { KiteDatafeed, ChartCandle } from "@/lib/charting/Datafeed";
import { useMarketStore } from "@/hooks/useMarketStore";
import { getInstrumentToken } from "@/lib/market-config";

interface KiteLiteChartProps {
    symbol: string;
    interval: string;
}

export const KiteLiteChart = ({ symbol, interval }: KiteLiteChartProps) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
    const datafeedRef = useRef<KiteDatafeed | null>(null);

    // Get live data from market store
    const lastTick = useMarketStore((s) => s.tickers[getInstrumentToken(symbol) || 0]);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        // Initialize Chart
        chartRef.current = createChart(chartContainerRef.current, {
            layout: {
                background: { color: "#000000" },
                textColor: "#d1d5db",
            },
            grid: {
                vertLines: { color: "#1a1a1a" },
                horzLines: { color: "#1a1a1a" },
            },
            crosshair: {
                mode: 0, // CrosshairMode.Normal
                vertLine: { color: "#00E5FF", width: 1, style: 2 },
                horzLine: { color: "#00E5FF", width: 1, style: 2 },
            },
            timeScale: {
                borderColor: "#333",
                timeVisible: true,
            },
        });

        // Add Candlestick Series
        seriesRef.current = (chartRef.current as any).addCandlestickSeries({
            upColor: "#4ade80",
            downColor: "#f87171",
            borderVisible: false,
            wickUpColor: "#4ade80",
            wickDownColor: "#f87171",
        });

        // Set Initial History
        const datafeed = new KiteDatafeed(symbol, interval);
        datafeedRef.current = datafeed;

        const loadData = async () => {
            const now = Date.now();
            const from = now - 30 * 24 * 60 * 60 * 1000; // 30 days
            const bars = await datafeed.getHistory(from, now);
            if (seriesRef.current && bars.length > 0) {
                // Remove duplicates and sort by time
                const uniqueBars = Array.from(new Map(bars.map(b => [b.time, b])).values())
                    .sort((a, b) => a.time - b.time) as CandlestickData[];

                seriesRef.current.setData(uniqueBars);
                chartRef.current?.timeScale().fitContent();
            }
        };

        loadData();

        // Responsive
        const handleResize = () => {
            chartRef.current?.applyOptions({
                width: chartContainerRef.current?.clientWidth,
                height: chartContainerRef.current?.clientHeight,
            });
        };
        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            chartRef.current?.remove();
        };
    }, [symbol, interval]);

    // Update real-time from store with Candle Aggregation
    const currentBarRef = useRef<CandlestickData | null>(null);

    useEffect(() => {
        if (lastTick && seriesRef.current) {
            const now = Date.now();
            // Floor time to interval start (simplification: using 60s for all sub-hour, otherwise 1d)
            const intervalSeconds = interval.includes("minute") ? parseInt(interval) * 60 : 86400;
            const barTime = (Math.floor(now / (intervalSeconds * 1000)) * intervalSeconds) as any;
            const price = lastTick.last_price;

            if (!currentBarRef.current || currentBarRef.current.time !== barTime) {
                // New Bar
                currentBarRef.current = {
                    time: barTime,
                    open: price,
                    high: price,
                    low: price,
                    close: price,
                };
            } else {
                // Update existing bar
                currentBarRef.current = {
                    ...currentBarRef.current,
                    high: Math.max(currentBarRef.current.high, price),
                    low: Math.min(currentBarRef.current.low, price),
                    close: price,
                };
            }

            seriesRef.current.update(currentBarRef.current);
        }
    }, [lastTick, interval]);

    return <div ref={chartContainerRef} className="w-full h-full" />;
};
