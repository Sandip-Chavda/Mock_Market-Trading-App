import { CandleData } from "@/utils/fetchQuote";

export function generateMockCandles(
  currentPrice: number,
  filter: string,
): CandleData[] {
  const now = Date.now();

  const config: Record<
    string,
    { count: number; intervalMs: number; volatility: number }
  > = {
    "1D": { count: 48, intervalMs: 30 * 60 * 1000, volatility: 0.003 },
    "1W": { count: 42, intervalMs: 4 * 60 * 60 * 1000, volatility: 0.006 },
    "1M": { count: 30, intervalMs: 24 * 60 * 60 * 1000, volatility: 0.012 },
    "3M": { count: 90, intervalMs: 24 * 60 * 60 * 1000, volatility: 0.015 },
    "1Y": { count: 52, intervalMs: 7 * 24 * 60 * 60 * 1000, volatility: 0.025 },
  };

  const { count, intervalMs, volatility } = config[filter] ?? config["1M"];

  const candles: CandleData[] = [];
  let price = currentPrice * (1 - volatility * count * 0.3); // start slightly below current

  for (let i = 0; i < count; i++) {
    const timestamp = now - (count - i) * intervalMs;
    const change = price * volatility * (Math.random() * 2 - 1);
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) * (1 + Math.random() * volatility);
    const low = Math.min(open, close) * (1 - Math.random() * volatility);

    candles.push({
      open: parseFloat(open.toFixed(2)),
      high: parseFloat(high.toFixed(2)),
      low: parseFloat(low.toFixed(2)),
      close: parseFloat(close.toFixed(2)),
      timestamp,
    });

    price = close;
  }

  // force last candle close to match current real price
  if (candles.length > 0) {
    candles[candles.length - 1].close = currentPrice;
  }

  return candles;
}
