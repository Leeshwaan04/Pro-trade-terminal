import { AdvancedRule, Condition, Action } from "@/hooks/useRuleEngineStore";
import { calculateSMA, calculateEMA, calculateRSI } from "./indicators";

export interface Trade {
    type: 'BUY' | 'SELL';
    price: number;
    time: string;
    quantity: number;
    pnl: number;
}

export interface BacktestResult {
    totalProfit: number;
    winRate: number;
    maxDrawdown: number;
    sharpeRatio: number;
    trades: Trade[];
    equityCurve: number[];
}

export async function runBacktest(
    rule: AdvancedRule,
    candles: any[],
    initialCapital: number = 100000
): Promise<BacktestResult> {
    const prices = candles.map(c => c.close);
    const times = candles.map(c => c.timestamp);

    // Pre-calculate indicators
    const indicators: Record<string, (number | null)[]> = {};

    rule.conditions.forEach(c => {
        if (!c.indicator) return;
        const key = `${c.type}_${c.indicator.period || 14}`;
        if (indicators[key]) return;

        if (c.type === 'SMA') {
            indicators[key] = calculateSMA(prices, c.indicator.period || 14);
        } else if (c.type === 'EMA') {
            indicators[key] = calculateEMA(prices, c.indicator.period || 14);
        } else if (c.type === 'RSI') {
            indicators[key] = calculateRSI(prices, c.indicator.period || 14);
        }
    });

    let balance = initialCapital;
    let position = 0;
    const trades: Trade[] = [];
    const equityCurve: number[] = [initialCapital];
    let maxBalance = initialCapital;
    let maxDD = 0;

    for (let i = 1; i < candles.length; i++) {
        const currentPrice = prices[i];
        const currentTime = times[i];

        // Check conditions
        const allMet = rule.conditions.every(cond => {
            let valToCompare: number | null = null;
            if (cond.type === 'PRICE') {
                valToCompare = currentPrice;
            } else if (cond.indicator) {
                const key = `${cond.type}_${cond.indicator.period || 14}`;
                valToCompare = indicators[key][i];
            }

            if (valToCompare === null) return false;

            const targetVal = typeof cond.value === 'string' ? parseFloat(cond.value) : cond.value;

            switch (cond.operator) {
                case '>': return valToCompare > targetVal;
                case '<': return valToCompare < targetVal;
                case '>=': return valToCompare >= targetVal;
                case '<=': return valToCompare <= targetVal;
                case '==': return valToCompare === targetVal;
                default: return false;
            }
        });

        if (allMet) {
            // Execute first action (simulated)
            const action = rule.actions[0];
            if (action && action.type === 'PLACE_ORDER') {
                const side = action.params.side;
                const qty = action.params.quantity || 1;

                if (side === 'BUY' && position <= 0) {
                    const cost = qty * currentPrice;
                    if (balance >= cost) {
                        position += qty;
                        balance -= cost;
                        trades.push({ type: 'BUY', price: currentPrice, time: currentTime, quantity: qty, pnl: 0 });
                    }
                } else if (side === 'SELL' && position >= 0) {
                    position -= qty;
                    balance += qty * currentPrice;
                    trades.push({ type: 'SELL', price: currentPrice, time: currentTime, quantity: qty, pnl: 0 });
                }
            }
        }

        const currentEquity = balance + (position * currentPrice);
        equityCurve.push(currentEquity);

        maxBalance = Math.max(maxBalance, currentEquity);
        maxDD = Math.max(maxDD, (maxBalance - currentEquity) / maxBalance);
    }

    // Final PnL calculation for trades
    // ... simplified ...

    const totalProfit = equityCurve[equityCurve.length - 1] - initialCapital;
    const winRate = trades.length > 0 ? (trades.filter(t => t.pnl > 0).length / trades.length) : 0;

    return {
        totalProfit,
        winRate,
        maxDrawdown: maxDD * 100,
        sharpeRatio: totalProfit / (maxDD || 1), // Simplified sharpe
        trades,
        equityCurve
    };
}
