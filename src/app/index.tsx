import PortfolioSummaryCard from "@/components/PortfolioSummaryCard";
import SearchBar from "@/components/SearchBar";
import StockCard, { Stock } from "@/components/StockCard";
import { COLORS } from "@/constants/theme";
import { usePortfolioStore } from "@/store/portfolioStore";
import { fetchAllStocks } from "@/utils/marketData";
import { isUSMarketOpen } from "@/utils/marketStatus";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StatusBar,
  Text,
  View,
} from "react-native";

const POLL_INTERVAL = 30000; // 30 seconds

export default function MarketScreen() {
  const cash = usePortfolioStore((state) => state.cash);

  const marketOpen = isUSMarketOpen();

  const [stocks, setStocks] = useState<Stock[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const loadStocks = useCallback(async () => {
    try {
      const data = await fetchAllStocks();
      if (data.length > 0) {
        setStocks(data);
        setError(false);
        setLastUpdated(new Date());
      } else {
        setError(true);
      }
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStocks();
    const interval = setInterval(loadStocks, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [loadStocks]);

  const filteredStocks = useMemo(() => {
    if (!search.trim()) return stocks;
    const query = search.toLowerCase();
    return stocks.filter(
      (s) =>
        s.symbol.toLowerCase().includes(query) ||
        s.name.toLowerCase().includes(query),
    );
  }, [search, stocks]);

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      {/* Header */}
      <View className="bg-surface pt-14 px-5 pb-4 border-b border-border">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-sm text-secondary font-medium">
              Welcome back
            </Text>
            <Text className="text-2xl text-primary-content font-bold">
              Mock Market
            </Text>
          </View>
          <View className="bg-primary w-10 h-10 rounded-full items-center justify-center">
            <Text className="text-white font-bold text-base">S</Text>
          </View>
        </View>
        <SearchBar value={search} onChangeText={setSearch} />
        {lastUpdated && (
          <View className="flex-row items-center justify-between mt-2">
            <Text className="text-xs text-secondary">
              Updated{" "}
              {lastUpdated.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <View
              className={`flex-row items-center px-2 py-0.5 rounded-lg ${marketOpen ? "bg-green-100" : "bg-red-100"}`}
            >
              <View
                className={`w-1.5 h-1.5 rounded-full mr-1.5 ${marketOpen ? "bg-green-500" : "bg-red-400"}`}
              />
              <Text
                className={`text-xs font-semibold ${marketOpen ? "text-success" : "text-danger"}`}
              >
                USA {marketOpen ? "Market Open" : "Market Closed"}
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Loading State */}
      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text className="text-secondary text-sm mt-3">
            Fetching live prices...
          </Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-10">
          <Text className="text-primary-content font-bold text-lg text-center">
            Unable to fetch prices
          </Text>
          <Text className="text-secondary text-sm mt-2 text-center">
            Check your internet connection or API key
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredStocks}
          keyExtractor={(item) => item.symbol}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20 }}
          ListHeaderComponent={
            <>
              <PortfolioSummaryCard balance={cash} />
              <Text className="text-lg font-bold text-primary-content mb-3">
                Live Markets
              </Text>
            </>
          }
          ListEmptyComponent={
            <View className="items-center mt-10">
              <Text className="text-secondary text-base">No stocks found</Text>
            </View>
          }
          renderItem={({ item }) => <StockCard stock={item} />}
        />
      )}
    </View>
  );
}
