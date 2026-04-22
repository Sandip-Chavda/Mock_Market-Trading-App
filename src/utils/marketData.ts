import { Stock } from "@/components/StockCard";
import { US_STOCKS } from "@/constants/api";
import { fetchQuote, fetchUSDINR } from "./fetchQuote";

export async function fetchAllStocks(): Promise<Stock[]> {
  const usdInr = await fetchUSDINR();

  const results = await Promise.allSettled(
    US_STOCKS.map(async ({ symbol, name }) => {
      const quote = await fetchQuote(symbol);
      if (!quote) return null;

      return {
        symbol,
        name,
        price: parseFloat((quote.c * usdInr).toFixed(2)),
        change: parseFloat((quote.d * usdInr).toFixed(2)),
        changePercent: parseFloat(quote.dp.toFixed(2)),
      } as Stock;
    }),
  );

  return results
    .filter(
      (r): r is PromiseFulfilledResult<Stock> =>
        r.status === "fulfilled" && r.value !== null,
    )
    .map((r) => r.value);
}
