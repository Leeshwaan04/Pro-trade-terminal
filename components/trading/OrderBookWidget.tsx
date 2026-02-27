"use client";

import React, { useMemo } from "react";
import { useMarketStore } from "@/hooks/useMarketStore";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { WidgetHeader } from "@/components/ui/WidgetHeader";

const DEPTH_LEVELS = 5;

export const OrderBookWidget = ({ symbol = "NIFTY 50" }: { symbol?: string }) => {
    const ticker = useMarketStore(state => state.tickers[symbol]);

    // Use depth from store, or fallback to empty arrays
    const depth = useMemo(() => {
        if (!ticker?.depth) return { buy: [], sell: [] };
        return ticker.depth;
    }, [ticker?.depth]);

    const maxQty = Math.max(
        ...(depth.buy.length > 0 ? depth.buy.map(b => b.quantity) : [1]),
        ...(depth.sell.length > 0 ? depth.sell.map(a => a.quantity) : [1])
    );

    const isMobile = useMediaQuery("(max-width: 768px)");

    return (
        <div className="flex flex-col h-full bg-surface-1 font-mono select-none">
            <WidgetHeader id="order-book" title="MARKET DEPTH" symbol={symbol} />

            {/* Header Info (Total Qty) */}
            <div className="px-2 py-1 border-b border-white/5 bg-[#080a0c] flex justify-between items-end">
                <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">Total Qty</span>
                <span className="text-[9px] font-mono font-bold text-zinc-300">1.2M</span>
            </div>

            {/* Table Header */}
            <div className={cn(
                "grid text-[8px] font-bold uppercase tracking-widest text-zinc-500 border-b border-white/5 bg-[#0c0f13]",
                isMobile ? "grid-cols-2" : "grid-cols-3"
            )}>
                <div className="pl-2 py-1">Bid Price</div>
                <div className="text-right pr-2 py-1">Bid Qty</div>
                {!isMobile && <div className="text-right pr-2 py-1">Orders</div>}
            </div>

            {/* Bids List */}
            <div className="flex-1 overflow-hidden bg-[#080a0c]">
                {depth.buy.map((bid, i) => (
                    <div key={`bid-${i}`} className={cn(
                        "relative grid py-0.5 px-2 text-[9px] items-center group cursor-crosshair hover:bg-white/[0.02]",
                        isMobile ? "grid-cols-2" : "grid-cols-3"
                    )}>
                        <div
                            className="absolute inset-y-0 right-0 bg-up/10 origin-right transition-all duration-300"
                            style={{ width: `${(bid.quantity / maxQty) * 100}%` }}
                        />
                        <div className="text-up font-bold z-10 tabular-nums">{bid.price.toFixed(2)}</div>
                        <div className="text-right text-zinc-200 z-10 tabular-nums">{bid.quantity}</div>
                        {!isMobile && <div className="text-right text-zinc-600 z-10 tabular-nums">{bid.orders}</div>}
                    </div>
                ))}

                {/* Spread */}
                <div className="py-1 px-2 bg-[#0c0f13] border-y border-white/5 flex justify-between items-center my-0.5">
                    <span className="text-[8px] text-zinc-500 uppercase font-black tracking-widest">Spread</span>
                    <span className="text-[9px] font-bold font-mono text-zinc-400">
                        {depth.buy.length > 0 && depth.sell.length > 0
                            ? (depth.sell[0].price - depth.buy[0].price).toFixed(2)
                            : "0.00"}
                    </span>
                </div>

                {/* Asks Header */}
                <div className={cn(
                    "grid text-[8px] font-bold uppercase tracking-widest text-zinc-500 border-b border-white/5 bg-[#0c0f13]",
                    isMobile ? "grid-cols-2" : "grid-cols-3"
                )}>
                    <div className="pl-2 py-1">Ask Price</div>
                    <div className="text-right pr-2 py-1">Ask Qty</div>
                    {!isMobile && <div className="text-right pr-2 py-1">Orders</div>}
                </div>

                {/* Asks List */}
                {depth.sell.map((ask, i) => (
                    <div key={`ask-${i}`} className={cn(
                        "relative grid py-0.5 px-2 text-[9px] items-center group cursor-crosshair hover:bg-white/[0.02]",
                        isMobile ? "grid-cols-2" : "grid-cols-3"
                    )}>
                        <div
                            className="absolute inset-y-0 right-0 bg-down/10 origin-right transition-all duration-300"
                            style={{ width: `${(ask.quantity / maxQty) * 100}%` }}
                        />
                        <div className="text-down font-bold z-10 tabular-nums">{ask.price.toFixed(2)}</div>
                        <div className="text-right text-zinc-200 z-10 tabular-nums">{ask.quantity}</div>
                        {!isMobile && <div className="text-right text-zinc-600 z-10 tabular-nums">{ask.orders}</div>}
                    </div>
                ))}
            </div>

            {/* Bottom Controls */}
            <div className="p-1.5 border-t border-white/5 bg-[#0c0f13] flex gap-1">
                <button className="flex-1 bg-white/[0.02] border border-white/5 rounded-[2px] py-1 text-[8px] font-bold uppercase text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors">
                    Depth 20
                </button>
                <button className="flex-1 bg-white/[0.02] border border-white/5 rounded-[2px] py-1 text-[8px] font-bold uppercase text-zinc-400 hover:text-white hover:bg-white/[0.05] transition-colors">
                    Stats
                </button>
            </div>
        </div>
    );
};
