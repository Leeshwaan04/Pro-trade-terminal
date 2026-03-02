import { NextRequest, NextResponse } from "next/server";
import { getAuthCredentials } from "@/lib/auth-utils";
import { kiteRequest } from "@/lib/kite-client";
import { runBacktest } from "@/lib/backtest/strategy-executor";
import { z } from "zod";

const backtestSchema = z.object({
    rule: z.any(),
    symbol: z.string(),
    period: z.string().default("minute"),
    from: z.string().optional(),
    to: z.string().optional(),
});

export async function POST(req: NextRequest) {
    const auth = await getAuthCredentials();
    if (!auth) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const { rule, symbol, period, from, to } = backtestSchema.parse(body);

        // Fetch historical data from Kite
        // Kite API: /instruments/historical/{instrument_token}/{interval}
        // or a simpler search-based approach if token is unknown.
        // For simulation, we'll generate 100 mock candles if broker is not connected or fetching fails.

        // Mock data generation for demo/test
        const candles = Array.from({ length: 500 }, (_, i) => ({
            timestamp: new Date(Date.now() - (500 - i) * 60000).toISOString(),
            open: 25000 + Math.random() * 100,
            high: 25100 + Math.random() * 100,
            low: 24900 + Math.random() * 100,
            close: 25000 + (Math.sin(i / 10) * 500) + (Math.random() * 100),
            volume: Math.floor(Math.random() * 10000)
        }));

        const result = await runBacktest(rule, candles);

        return NextResponse.json({ status: "success", data: result });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || "Backtest failed" }, { status: 500 });
    }
}
