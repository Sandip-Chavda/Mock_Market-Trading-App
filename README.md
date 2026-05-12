# 📈 Mock Market

A paper trading simulator app built with React Native (Expo) that lets you practice stock trading with real live market data — without risking real money.

---

## 📱 Video Demo

> Add Video here after EAS build

---

## 📱 Screenshots

> Add screenshots here after EAS build

---

## ✨ Features

- 📊 **Live Market Data** — Real US stock prices fetched from Finnhub API every 30 seconds
- 💱 **INR Conversion** — Live USD to INR conversion using real forex rates
- 🕯️ **Candlestick & Line Charts** — Interactive charts with 1D, 1W, 1M, 3M, 1Y timeframes
- 💰 **Paper Trading** — Buy and sell stocks with ₹1,00,000 virtual starting balance
- 📂 **Portfolio Tracking** — Real-time holdings, invested value, current value and P&L
- 📋 **Order History** — Complete transaction history with buy/sell records
- 📉 **Realized & Unrealized P&L** — Track both open position gains and closed trade profits
- 🟢 **Market Status** — Live countdown showing time until market opens or closes
- 🔍 **Stock Search** — Search stocks by symbol or company name
- ⚠️ **Smart Warnings** — Know exactly how many shares you own before buying or selling
- 🌅 **Onboarding** — Clean 3-slide onboarding on first launch

---

## 🛠️ Tech Stack

| Category         | Technology                        |
| ---------------- | --------------------------------- |
| Framework        | React Native + Expo SDK 55        |
| Navigation       | Expo Router (file-based)          |
| Styling          | NativeWind v5 (Tailwind CSS)      |
| State Management | Zustand                           |
| Charts           | react-native-wagmi-charts         |
| API              | Finnhub (live stock + forex data) |
| Language         | TypeScript                        |
| Build            | EAS Build                         |

---

## 🏗️ Project Structure

```
src/
├── app/                    # Screens (Expo Router)
│   ├── index.tsx           # Market screen
│   ├── portfolio.tsx       # Portfolio screen
│   ├── orders.tsx          # Orders screen
│   ├── profile.tsx         # Profile screen
│   ├── onboarding.tsx      # Onboarding screen
│   ├── stock/
│   │   └── [symbol].tsx    # Stock detail screen
│   └── _layout.tsx         # Root layout + tab navigation
├── components/             # Reusable components
│   ├── StockCard.tsx
│   ├── SearchBar.tsx
│   ├── PortfolioSummaryCard.tsx
│   └── MarketCountdown.tsx
├── constants/
│   ├── theme.ts            # Colors, fonts, spacing
│   └── api.ts              # API config + stock list
├── store/
│   └── portfolioStore.ts   # Zustand store
├── types/
└── utils/
├── fetchQuote.ts       # Finnhub API calls
├── marketData.ts       # Fetch all stocks
├── marketStatus.ts     # Market open/closed logic
├── generateCandles.ts  # Mock OHLC chart data
└── formatCurrency.ts   # INR formatting
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI
- Expo Go app on your phone OR a development build

### Installation

```bash
# Clone the repo
git clone https://github.com/Sandip-Chavda/Mock_Market-Trading-App.git

cd Mock_Market-Trading-App

# Install dependencies
npm install

# Create environment file
cp .env.example .env
# Add your Finnhub API key to .env

# Start development server
npx expo start
```

### Environment Variables

```
EXPO_PUBLIC_FINNHUB_API_KEY=your_finnhub_api_key_here
```

Get a free API key at [finnhub.io](https://finnhub.io)

---

## 📊 Market Hours

This app uses **US stock market data** (NYSE/NASDAQ).

|              | Time (IST)       |
| ------------ | ---------------- |
| Market Open  | 7:00 PM          |
| Market Close | 1:30 AM          |
| Days         | Monday to Friday |

Live prices update only during market hours. Outside hours, last closing prices are shown.

---

## 🗺️ Future Roadmap

1. Disclaimer popup — on every cold start, one tap to dismiss, covers: learning purpose only, charts are demo, not real money, not financial advice
2. Light/Dark mode toggle — persist with AsyncStorage
3. Price alerts — notify when stock crosses a price you set
4. Stock news feed — Finnhub has a free news endpoint, show news per stock on detail screen
5. Portfolio chart — line chart showing portfolio value over time on Portfolio screen
6. Watchlist — save favourite stocks separately from full market list
7. Search improvements — filter by gainers, losers, most active
8. Share portfolio — screenshot of P&L card to share on WhatsApp/LinkedIn
9. Multiple portfolios — create separate portfolios for different strategies
10. Haptic feedback — subtle vibration on buy/sell confirmation

---

## 👨‍💻 Built By

**Sandip Chavda** — B.Tech Computer Engineer Built as a portfolio project to demonstrate full-stack mobile development skills.

- 🔗 [LinkedIn](https://linkedin.com/in/yourprofile)
- 🐱 [GitHub](https://github.com/yourusername)

---

## ⚠️ Disclaimer

Mock Market is a paper trading simulator for educational purposes only. All trades are simulated with virtual money. This is not financial advice.
