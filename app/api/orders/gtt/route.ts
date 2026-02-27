/**
 * POST /api/orders/gtt
 * Places a Good Till Triggered (GTT) order
 */
import { NextRequest, NextResponse } from "next/server";
import { getAuthCredentials } from "@/lib/auth-utils";
import { placeGTTOrder, KiteError, KiteGTTParams } from "@/lib/kite-client";

export async function POST(req: NextRequest) {
    const auth = await getAuthCredentials();
    if (!auth) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    try {
        const body = await req.json();

        // Validate GTT parameters
        if (!body.type || !body.condition || !body.orders) {
            return NextResponse.json(
                { error: "Missing required GTT parameters (type, condition, orders)" },
                { status: 400 }
            );
        }

        const gttParams: KiteGTTParams = {
            type: body.type,
            condition: body.condition,
            orders: body.orders
        };

        const result = await placeGTTOrder(auth.apiKey!, auth.accessToken, gttParams);
        return NextResponse.json({ status: "success", data: result });
    } catch (error: any) {
        if (error instanceof KiteError) {
            return NextResponse.json(
                { error: error.message },
                { status: error.httpStatus }
            );
        }
        return NextResponse.json({ error: "Failed to place GTT order" }, { status: 500 });
    }
}
