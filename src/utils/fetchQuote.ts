import { FINNHUB_API_KEY, FINNHUB_BASE_URL } from "@/constants/api";

export type Quote = {
  c: number; // current price USD
  d: number; // change USD
  dp: number; // change percent
  h: number; // day high USD
  l: number; // day low USD
  o: number; // open USD
};

export async function fetchUSDINR(): Promise<number> {
  try {
    const response = await fetch(
      `${FINNHUB_BASE_URL}/quote?symbol=OANDA:USD_INR&token=${FINNHUB_API_KEY}`,
    );
    if (!response.ok) return 83.5;
    const data = await response.json();
    if (!data.c || data.c === 0) return 83.5;
    return data.c;
  } catch {
    return 83.5; // fallback rate
  }
}

export async function fetchQuote(symbol: string): Promise<Quote | null> {
  try {
    const response = await fetch(
      `${FINNHUB_BASE_URL}/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`,
    );
    if (!response.ok) return null;
    const data = await response.json();
    if (!data.c || data.c === 0) return null;
    return data;
  } catch {
    return null;
  }
}
