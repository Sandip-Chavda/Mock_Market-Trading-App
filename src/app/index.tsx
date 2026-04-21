import PortfolioSummaryCard from "@/components/PortfolioSummaryCard";
import SearchBar from "@/components/SearchBar";
import StockCard, { Stock } from "@/components/StockCard";
import { useMemo, useState } from "react";
import { FlatList, StatusBar, Text, View } from "react-native";

const MOCK_STOCKS: Stock[] = [
  {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd.",
    price: 2875.4,
    change: 32.1,
    changePercent: 1.13,
  },
  {
    symbol: "TCS",
    name: "Tata Consultancy Services",
    price: 3921.75,
    change: -45.2,
    changePercent: -1.14,
  },
  {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd.",
    price: 1642.3,
    change: 18.9,
    changePercent: 1.16,
  },
  {
    symbol: "INFY",
    name: "Infosys Ltd.",
    price: 1456.85,
    change: -12.3,
    changePercent: -0.84,
  },
  {
    symbol: "ICICIBANK",
    name: "ICICI Bank Ltd.",
    price: 1089.5,
    change: 9.75,
    changePercent: 0.9,
  },
  {
    symbol: "HINDUNILVR",
    name: "Hindustan Unilever Ltd.",
    price: 2341.6,
    change: -8.4,
    changePercent: -0.36,
  },
  {
    symbol: "SBIN",
    name: "State Bank of India",
    price: 812.45,
    change: 11.2,
    changePercent: 1.4,
  },
  {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel Ltd.",
    price: 1678.9,
    change: 22.35,
    changePercent: 1.35,
  },
  {
    symbol: "WIPRO",
    name: "Wipro Ltd.",
    price: 456.7,
    change: -3.2,
    changePercent: -0.7,
  },
  {
    symbol: "BAJFINANCE",
    name: "Bajaj Finance Ltd.",
    price: 7234.15,
    change: 87.5,
    changePercent: 1.22,
  },
];

export default function MarketScreen() {
  const [search, setSearch] = useState("");

  const filteredStocks = useMemo(() => {
    if (!search.trim()) return MOCK_STOCKS;
    const query = search.toLowerCase();
    return MOCK_STOCKS.filter(
      (s) =>
        s.symbol.toLowerCase().includes(query) ||
        s.name.toLowerCase().includes(query),
    );
  }, [search]);

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
      </View>

      <FlatList
        data={filteredStocks}
        keyExtractor={(item) => item.symbol}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
        ListHeaderComponent={
          <>
            <PortfolioSummaryCard balance={100000} />
            <Text className="text-lg font-bold text-primary-content mb-3">
              Markets
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
    </View>
  );
}
