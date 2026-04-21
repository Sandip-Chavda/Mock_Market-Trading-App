import { create } from "zustand";

export type Holding = {
  symbol: string;
  name: string;
  quantity: number;
  avgPrice: number;
  currentPrice: number;
};

export type Order = {
  id: string;
  symbol: string;
  name: string;
  type: "BUY" | "SELL";
  quantity: number;
  price: number;
  total: number;
  timestamp: number;
};

type PortfolioState = {
  cash: number;
  holdings: Holding[];
  orders: Order[];
  buyStock: (
    symbol: string,
    name: string,
    price: number,
    quantity: number,
  ) => string | null;
  sellStock: (
    symbol: string,
    name: string,
    price: number,
    quantity: number,
  ) => string | null;
  updatePrices: (symbol: string, currentPrice: number) => void;
  resetPortfolio: () => void;
};

export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  cash: 100000,
  holdings: [],
  orders: [],

  buyStock: (symbol, name, price, quantity) => {
    const total = price * quantity;
    const { cash, holdings, orders } = get();

    if (total > cash) return "Insufficient balance";

    const existingHolding = holdings.find((h) => h.symbol === symbol);

    const updatedHoldings = existingHolding
      ? holdings.map((h) =>
          h.symbol === symbol
            ? {
                ...h,
                quantity: h.quantity + quantity,
                avgPrice:
                  (h.avgPrice * h.quantity + price * quantity) /
                  (h.quantity + quantity),
                currentPrice: price,
              }
            : h,
        )
      : [
          ...holdings,
          { symbol, name, quantity, avgPrice: price, currentPrice: price },
        ];

    const newOrder: Order = {
      id: Date.now().toString(),
      symbol,
      name,
      type: "BUY",
      quantity,
      price,
      total,
      timestamp: Date.now(),
    };

    set({
      cash: cash - total,
      holdings: updatedHoldings,
      orders: [newOrder, ...orders],
    });

    return null;
  },

  sellStock: (symbol, name, price, quantity) => {
    const { holdings, cash, orders } = get();
    const holding = holdings.find((h) => h.symbol === symbol);

    if (!holding) return "You don't own this stock";
    if (holding.quantity < quantity)
      return `You only have ${holding.quantity} shares`;

    const total = price * quantity;

    const updatedHoldings =
      holding.quantity === quantity
        ? holdings.filter((h) => h.symbol !== symbol)
        : holdings.map((h) =>
            h.symbol === symbol ? { ...h, quantity: h.quantity - quantity } : h,
          );

    const newOrder: Order = {
      id: Date.now().toString(),
      symbol,
      name,
      type: "SELL",
      quantity,
      price,
      total,
      timestamp: Date.now(),
    };

    set({
      cash: cash + total,
      holdings: updatedHoldings,
      orders: [newOrder, ...orders],
    });

    return null;
  },

  updatePrices: (symbol, currentPrice) => {
    set((state) => ({
      holdings: state.holdings.map((h) =>
        h.symbol === symbol ? { ...h, currentPrice } : h,
      ),
    }));
  },

  resetPortfolio: () => {
    set({
      cash: 100000,
      holdings: [],
      orders: [],
    });
  },
}));
