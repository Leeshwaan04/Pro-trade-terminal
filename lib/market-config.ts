export const MARKET_INSTRUMENTS = [
    { symbol: "NIFTY 50", token: 256265, exchange: "NSE", groww_token: "NIDX:26000" },
    { symbol: "BANKNIFTY", token: 260105, exchange: "NSE", groww_token: "NIDX:26009" },
    { symbol: "RELIANCE", token: 738561, exchange: "NSE", groww_token: "NSE:2885" },
    { symbol: "HDFCBANK", token: 341249, exchange: "NSE", groww_token: "NSE:1333" },
    { symbol: "INFY", token: 408065, exchange: "NSE", groww_token: "NSE:1594" },
    { symbol: "TCS", token: 2953213, exchange: "NSE", groww_token: "NSE:11536" },
    { symbol: "ICICIBANK", token: 1270529, exchange: "NSE", groww_token: "NSE:4963" },
    { symbol: "SBIN", token: 779521, exchange: "NSE", groww_token: "NSE:3045" },
    { symbol: "AXISBANK", token: 1510401, exchange: "NSE", groww_token: "NSE:5900" },
    { symbol: "TATASTEEL", token: 897537, exchange: "NSE", groww_token: "NSE:3499" },
    // Sectoral Indices (Tokens need verification)
    { symbol: "NIFTY IT", token: 19585, exchange: "NSE" },
    { symbol: "NIFTY AUTO", token: 16641, exchange: "NSE" },
    { symbol: "NIFTY METAL", token: 17409, exchange: "NSE" },
    { symbol: "NIFTY NEXT 50", token: 257025, exchange: "NSE" },
    // Global Indices (Proxies or Futures)
    { symbol: "NIKKEI 225", token: 0, exchange: "GLOBAL" },
    { symbol: "DAX", token: 0, exchange: "GLOBAL" },
    { symbol: "NASDAQ", token: 0, exchange: "GLOBAL" },
    { symbol: "DOW JONES", token: 0, exchange: "GLOBAL" },
];

export const getInstrumentToken = (symbol: string) => {
    return MARKET_INSTRUMENTS.find(i => i.symbol === symbol)?.token;
};

export const getGrowwToken = (symbol: string) => {
    return MARKET_INSTRUMENTS.find(i => i.symbol === symbol)?.groww_token;
};
