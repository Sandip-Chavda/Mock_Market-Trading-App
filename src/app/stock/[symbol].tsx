import { COLORS } from "@/constants/theme";
import { usePortfolioStore } from "@/store/portfolioStore";
import { CandleData, fetchQuote, fetchUSDINR } from "@/utils/fetchQuote";
import { formatINR } from "@/utils/formatCurrency";
import { generateMockCandles } from "@/utils/generateCandles";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { CandlestickChart, LineChart } from "react-native-wagmi-charts";

const TIME_FILTERS = ["1D", "1W", "1M", "3M", "1Y"];

export default function StockDetailScreen() {
  const { symbol, name, price, change, changePercent } = useLocalSearchParams<{
    symbol: string;
    name: string;
    price: string;
    change: string;
    changePercent: string;
  }>();
  const router = useRouter();

  const { buyStock, sellStock } = usePortfolioStore();
  const { width } = useWindowDimensions();
  const holdings = usePortfolioStore((state) => state.holdings);
  const updatePrices = usePortfolioStore((state) => state.updatePrices);

  const [selectedFilter, setSelectedFilter] = useState("1D");
  const [quantity, setQuantity] = useState(1);
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [chartType, setChartType] = useState<"candle" | "line">("candle");
  const [chartLoading, setChartLoading] = useState(true);
  const [usdInr, setUsdInr] = useState(83.5);

  const currentHolding = holdings.find((h) => h.symbol === symbol);
  const ownedQuantity = currentHolding?.quantity ?? 0;

  const priceNum = parseFloat(price);
  const changeNum = parseFloat(change);
  const changePercentNum = parseFloat(changePercent);

  const [livePrice, setLivePrice] = useState(priceNum);
  const [liveChange, setLiveChange] = useState(changeNum);
  const [liveChangePercent, setLiveChangePercent] = useState(changePercentNum);
  const liveIsPositive = liveChange >= 0;

  const totalCost = formatINR(livePrice * quantity);

  useEffect(() => {
    const loadChart = async () => {
      setChartLoading(true);
      const rate = await fetchUSDINR();
      setUsdInr(rate);
      const mockCandles = generateMockCandles(priceNum, selectedFilter);
      setCandles(mockCandles);
      setChartLoading(false);
    };
    loadChart();
  }, [selectedFilter, symbol, priceNum]);

  useEffect(() => {
    const refreshPrice = async () => {
      const rate = await fetchUSDINR();
      const quote = await fetchQuote(symbol);
      if (quote && quote.c > 0) {
        setLivePrice(parseFloat((quote.c * rate).toFixed(2)));
        setLiveChange(parseFloat((quote.d * rate).toFixed(2)));
        setLiveChangePercent(parseFloat(quote.dp.toFixed(2)));
        updatePrices(symbol, parseFloat((quote.c * rate).toFixed(2)));
      }
    };

    refreshPrice();
    const interval = setInterval(refreshPrice, 30000);
    return () => clearInterval(interval);
  }, [symbol]);

  const handleBuy = () => {
    const error = buyStock(symbol, name, priceNum, quantity);
    if (error) {
      Alert.alert("Cannot Buy", error);
    } else {
      Alert.alert("Success", `Bought ${quantity} share(s) of ${symbol}`);
    }
  };

  const handleSell = () => {
    const error = sellStock(symbol, name, priceNum, quantity);
    if (error) {
      Alert.alert("Cannot Sell", error);
    } else {
      Alert.alert("Success", `Sold ${quantity} share(s) of ${symbol}`);
    }
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      {/* Header */}
      <View className="bg-surface pt-14 px-5 pb-4 border-b border-border flex-row items-center">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View className="flex-1">
          <Text className="text-lg font-bold text-primary-content">
            {symbol}
          </Text>
          <Text className="text-xs text-secondary" numberOfLines={1}>
            {name}
          </Text>
        </View>
        <View className="w-9 h-9 rounded-lg bg-background items-center justify-center border border-border">
          <Text className="text-xs font-bold text-primary">
            {symbol?.slice(0, 2)}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-5">
          {/* Price */}
          <Text className="text-4xl font-extrabold text-primary-content">
            ₹{formatINR(livePrice)}
          </Text>
          <View
            className={`flex-row items-center mt-1 self-start px-2 py-1 rounded-lg ${liveIsPositive ? "bg-green-100" : "bg-red-100"}`}
          >
            <Ionicons
              name={liveIsPositive ? "arrow-up" : "arrow-down"}
              size={13}
              color={liveIsPositive ? COLORS.green : COLORS.red}
            />
            <Text
              className={`text-sm font-semibold ml-1 ${liveIsPositive ? "text-success" : "text-danger"}`}
            >
              ₹{formatINR(Math.abs(liveChange))} (
              {Math.abs(liveChangePercent).toFixed(2)}%)
            </Text>
          </View>

          {/* Time Filter */}
          <View className="flex-row mt-5 bg-surface rounded-xl p-1 border border-border">
            {TIME_FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter}
                className={`flex-1 py-2 rounded-lg items-center ${selectedFilter === filter ? "bg-primary" : ""}`}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  className={`text-xs font-semibold ${selectedFilter === filter ? "text-white" : "text-secondary"}`}
                >
                  {filter}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Chart Type Toggle */}
          <View className="flex-row mt-3 bg-surface rounded-xl p-1 border border-border">
            <TouchableOpacity
              className={`flex-1 py-2 rounded-lg items-center flex-row justify-center gap-1 ${chartType === "candle" ? "bg-primary" : ""}`}
              onPress={() => setChartType("candle")}
            >
              <Ionicons
                name="bar-chart-outline"
                size={14}
                color={chartType === "candle" ? "#fff" : COLORS.textSecondary}
              />
              <Text
                className={`text-xs font-semibold ml-1 ${chartType === "candle" ? "text-white" : "text-secondary"}`}
              >
                Candle
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 py-2 rounded-lg items-center flex-row justify-center gap-1 ${chartType === "line" ? "bg-primary" : ""}`}
              onPress={() => setChartType("line")}
            >
              <Ionicons
                name="trending-up-outline"
                size={14}
                color={chartType === "line" ? "#fff" : COLORS.textSecondary}
              />
              <Text
                className={`text-xs font-semibold ml-1 ${chartType === "line" ? "text-white" : "text-secondary"}`}
              >
                Line
              </Text>
            </TouchableOpacity>
          </View>

          {/* Chart */}
          <View className="bg-surface rounded-2xl p-4 mt-4 border border-border">
            {chartLoading ? (
              <View className="h-48 items-center justify-center">
                <ActivityIndicator size="large" color={COLORS.primary} />
                <Text className="text-secondary text-xs mt-2">
                  Loading chart...
                </Text>
              </View>
            ) : candles.length === 0 ? (
              <View className="h-48 items-center justify-center">
                <Text className="text-secondary text-sm">
                  No chart data available
                </Text>
                <Text className="text-secondary text-xs mt-1">
                  Market may be closed
                </Text>
              </View>
            ) : chartType === "candle" ? (
              <CandlestickChart.Provider
                data={candles.map((c) => ({
                  open: c.open * usdInr,
                  high: c.high * usdInr,
                  low: c.low * usdInr,
                  close: c.close * usdInr,
                  timestamp: c.timestamp,
                }))}
              >
                <CandlestickChart height={200} width={width - 72}>
                  <CandlestickChart.Candles
                    positiveColor={COLORS.green}
                    negativeColor={COLORS.red}
                  />
                  <CandlestickChart.Crosshair>
                    <CandlestickChart.Tooltip />
                  </CandlestickChart.Crosshair>
                </CandlestickChart>
                <View className="flex-row justify-between mt-2">
                  <CandlestickChart.PriceText
                    type="open"
                    style={{ fontSize: 11, color: COLORS.textSecondary }}
                  />
                  <CandlestickChart.PriceText
                    type="high"
                    style={{ fontSize: 11, color: COLORS.green }}
                  />
                  <CandlestickChart.PriceText
                    type="low"
                    style={{ fontSize: 11, color: COLORS.red }}
                  />
                  <CandlestickChart.PriceText
                    type="close"
                    style={{ fontSize: 11, color: COLORS.textPrimary }}
                  />
                </View>
              </CandlestickChart.Provider>
            ) : (
              <LineChart.Provider
                data={candles.map((c) => ({
                  value: c.close * usdInr,
                  timestamp: c.timestamp,
                }))}
              >
                <LineChart height={200} width={width - 72}>
                  <LineChart.Path
                    color={liveIsPositive ? COLORS.green : COLORS.red}
                  />
                  <LineChart.CursorCrosshair>
                    <LineChart.Tooltip />
                  </LineChart.CursorCrosshair>
                </LineChart>
                <LineChart.PriceText
                  style={{
                    fontSize: 11,
                    color: COLORS.textSecondary,
                    marginTop: 4,
                  }}
                />
              </LineChart.Provider>
            )}
          </View>

          {/* Statistics */}
          <View className="bg-surface rounded-2xl p-4 mt-4 border border-border">
            <Text className="text-base font-bold text-primary-content mb-3">
              Statistics
            </Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-secondary text-sm">Open</Text>
              <Text className="text-primary-content text-sm font-semibold">
                ₹{formatINR(livePrice - liveChange)}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-secondary text-sm">Day High</Text>
              <Text className="text-primary-content text-sm font-semibold">
                ₹{formatINR(livePrice * 1.02)}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-secondary text-sm">Day Low</Text>
              <Text className="text-primary-content text-sm font-semibold">
                ₹{formatINR(livePrice * 0.98)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-secondary text-sm">52W High</Text>
              <Text className="text-primary-content text-sm font-semibold">
                ₹{formatINR(livePrice * 1.35)}
              </Text>
            </View>
          </View>

          {/* Order */}
          <View className="bg-surface rounded-2xl p-4 mt-4 border border-border">
            <Text className="text-base font-bold text-primary-content mb-3">
              Order
            </Text>

            <View className="flex-row items-center justify-between mb-3 bg-background rounded-xl px-3 py-2.5 border border-border">
              <View className="flex-row items-center">
                <Ionicons
                  name="layers-outline"
                  size={16}
                  color={COLORS.primary}
                />
                <Text className="text-sm text-secondary ml-2">You own</Text>
              </View>
              <Text className="text-sm font-bold text-primary-content">
                {ownedQuantity > 0 ? `${ownedQuantity} shares` : "No shares"}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-secondary text-sm">Quantity</Text>
              <View className="flex-row items-center">
                <TouchableOpacity
                  className="w-8 h-8 bg-background rounded-lg items-center justify-center border border-border"
                  onPress={() => setQuantity((q) => Math.max(1, q - 1))}
                >
                  <Ionicons
                    name="remove"
                    size={16}
                    color={COLORS.textPrimary}
                  />
                </TouchableOpacity>
                <Text className="text-primary-content font-bold text-base mx-4">
                  {quantity}
                </Text>
                <TouchableOpacity
                  className="w-8 h-8 bg-background rounded-lg items-center justify-center border border-border"
                  onPress={() => setQuantity((q) => q + 1)}
                >
                  <Ionicons name="add" size={16} color={COLORS.textPrimary} />
                </TouchableOpacity>
              </View>
            </View>

            <View className="flex-row justify-between mt-3">
              <Text className="text-secondary text-sm">Total Cost</Text>
              <Text className="text-primary-content text-sm font-bold">
                ₹{totalCost}
              </Text>
            </View>

            {quantity > ownedQuantity && ownedQuantity > 0 && (
              <View className="flex-row items-center mt-3 bg-red-100 px-3 py-2 rounded-xl">
                <Ionicons name="warning-outline" size={14} color={COLORS.red} />
                <Text className="text-danger text-xs ml-2">
                  You only have {ownedQuantity} shares to sell
                </Text>
              </View>
            )}

            {ownedQuantity === 0 && (
              <View className="flex-row items-center mt-3 bg-orange-50 px-3 py-2 rounded-xl">
                <Ionicons
                  name="information-circle-outline"
                  size={14}
                  color={COLORS.primary}
                />
                <Text className="text-primary text-xs ml-2">
                  You don't own any shares of {symbol}
                </Text>
              </View>
            )}
          </View>

          <View className="h-6" />
        </View>
      </ScrollView>

      {/* Buy / Sell Buttons */}
      <View className="flex-row px-5 py-4 bg-surface border-t border-border">
        <TouchableOpacity
          className="flex-1 bg-danger py-4 rounded-xl items-center mr-2"
          onPress={handleSell}
        >
          <Text className="text-white font-bold text-base">Sell</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="flex-1 bg-green-500 py-4 rounded-xl items-center ml-2"
          onPress={handleBuy}
        >
          <Text className="text-white font-bold text-base">Buy</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
