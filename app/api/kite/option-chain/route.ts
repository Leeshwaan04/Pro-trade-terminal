import { NextRequest, NextResponse } from "next/server";
import { getOptionChain } from "@/lib/kite-instruments";

const mapSymbolToKiteName = (symbol: string) => {
    if (symbol === "NIFTY 50") return "NIFTY";
    if (symbol === "NIFTY BANK" || symbol === "BANKNIFTY") return "BANKNIFTY";
    if (symbol === "FINNIFTY") return "FINNIFTY";
    if (symbol === "MIDCPNIFTY") return "MIDCPNIFTY";
    return symbol.replace(/\s+/g, ""); // fallback
};

export async function GET(req: NextRequest) {
    try {
        const symbolParam = req.nextUrl.searchParams.get("symbol") || "NIFTY 50";
        const kiteName = mapSymbolToKiteName(symbolParam);

        // Fetch instruments from the cached local CSV for the nearest expiry
        const instruments = await getOptionChain(kiteName);

        if (!instruments || instruments.length === 0) {
            return NextResponse.json({ success: false, error: "No instruments found for " + kiteName }, { status: 404 });
        }

        const expiry = instruments[0].expiry;

        // Group by strike
        const strikesMap = new Map<number, any>();

        instruments.forEach(inst => {
            if (!strikesMap.has(inst.strike)) {
                strikesMap.set(inst.strike, { strike: inst.strike, ce: null, pe: null });
            }

            const group = strikesMap.get(inst.strike);
            if (inst.instrument_type === "CE") {
                group.ce = inst;
            } else if (inst.instrument_type === "PE") {
                group.pe = inst;
            }
        });

        // Convert to sorted array
        const strikes = Array.from(strikesMap.values()).sort((a, b) => a.strike - b.strike);

        return NextResponse.json({
            success: true,
            symbol: kiteName,
            expiry,
            strikes
        });

    } catch (error: any) {
        console.error("Option Chain API Error:", error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
