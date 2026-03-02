import { getInstrumentToken } from "../market-config";

export interface ChartCandle {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume?: number;
}

export class KiteDatafeed {
    private symbol: string;
    private interval: string;
    private onRealtimeCallback: ((candle: ChartCandle) => void) | null = null;

    constructor(symbol: string, interval: string = "15minute") {
        this.symbol = symbol;
        this.interval = interval;
    }

    /**
     * Fetch historical bars from the backend proxy
     */
    async getHistory(from: number, to: number): Promise<ChartCandle[]> {
        const token = getInstrumentToken(this.symbol);
        if (!token) return [];

        try {
            // Updated to match app/api/kite/history/route.ts expect
            const url = `/api/kite/history?instrument_token=${token}&interval=${this.interval}&from=${new Date(from).toISOString().split('T')[0]}&to=${new Date(to).toISOString().split('T')[0]}`;
            const res = await fetch(url);
            const data = await res.json();

            if (data.status === "success" && data.data && data.data.candles) {
                return data.data.candles.map((c: any[]) => ({
                    time: new Date(c[0]).getTime() / 1000,
                    open: c[1],
                    high: c[2],
                    low: c[3],
                    close: c[4],
                    volume: c[5]
                }));
            }
        } catch (error) {
            console.error("[Datafeed] Fetch error:", error);
        }
        return [];
    }

    /**
     * Subscribe to real-time updates (bridging to SSE stream)
     */
    subscribeBars(callback: (candle: ChartCandle) => void) {
        this.onRealtimeCallback = callback;
        // The actual connection logic is handled by the useKiteTicker hook or similar
        // but the Datafeed provides the interface for the chart to 'consume' it.
    }

    updateRealtime(tick: any) {
        if (!this.onRealtimeCallback) return;

        // Convert tick to the current interval bar
        // This is complex logic (O-H-L-C accumulation).
        // For now, simplify or assume the tick is the latest close.
        const bar: ChartCandle = {
            time: Math.floor(Date.now() / 1000),
            open: tick.last_price,
            high: tick.last_price,
            low: tick.last_price,
            close: tick.last_price,
            volume: tick.volume
        };
        this.onRealtimeCallback(bar);
    }
}
