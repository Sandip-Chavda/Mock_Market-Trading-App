import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const MOCK_STOCKS = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 189.43,
    change: 1.23,
    changePercent: 0.65,
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 141.8,
    change: -0.92,
    changePercent: -0.64,
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: 378.91,
    change: 2.45,
    changePercent: 0.65,
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 242.1,
    change: -5.3,
    changePercent: -2.14,
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 178.25,
    change: 3.1,
    changePercent: 1.77,
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: 875.4,
    change: 12.3,
    changePercent: 1.43,
  },
  {
    symbol: "META",
    name: "Meta Platforms",
    price: 501.23,
    change: -2.1,
    changePercent: -0.42,
  },
  {
    symbol: "NFLX",
    name: "Netflix Inc.",
    price: 628.9,
    change: 4.5,
    changePercent: 0.72,
  },
];

export default function MarketScreen() {
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

        {/* Search Bar */}
        <View className="flex-row items-center bg-background rounded-xl px-3 py-2.5 mt-4 border border-border">
          <Ionicons
            name="search-outline"
            size={18}
            color={COLORS.textSecondary}
          />
          <Text className="ml-2 text-secondary text-base">
            Search stocks...
          </Text>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        {/* Portfolio Summary Card */}
        <View className="bg-primary rounded-2xl p-5 mb-6">
          <Text className="text-white/80 text-sm font-medium">
            Virtual Portfolio
          </Text>
          <Text className="text-white text-3xl font-extrabold mt-1">
            $1,00,000.00
          </Text>
          <View className="flex-row items-center mt-2">
            <Ionicons
              name="trending-up"
              size={16}
              color="rgba(255,255,255,0.9)"
            />
            <Text className="text-white/90 text-sm ml-1">Starting Balance</Text>
          </View>
        </View>

        {/* Market List */}
        <Text className="text-lg font-bold text-primary-content mb-3">
          Markets
        </Text>

        {MOCK_STOCKS.map((stock) => (
          <TouchableOpacity
            key={stock.symbol}
            className="bg-surface rounded-xl p-4 mb-2.5 flex-row items-center justify-between border border-border"
          >
            {/* Left */}
            <View className="flex-row items-center">
              <View className="w-11 h-11 rounded-lg bg-background items-center justify-center mr-3 border border-border">
                <Text className="text-sm font-bold text-primary">
                  {stock.symbol.slice(0, 2)}
                </Text>
              </View>
              <View>
                <Text className="text-base font-bold text-primary-content">
                  {stock.symbol}
                </Text>
                <Text className="text-xs text-secondary mt-0.5">
                  {stock.name}
                </Text>
              </View>
            </View>

            {/* Right */}
            <View className="items-end">
              <Text className="text-base font-bold text-primary-content">
                ${stock.price.toFixed(2)}
              </Text>
              <View
                className={`flex-row items-center px-2 py-0.5 rounded-lg mt-1 ${stock.change >= 0 ? "bg-green-100" : "bg-red-100"}`}
              >
                <Ionicons
                  name={stock.change >= 0 ? "arrow-up" : "arrow-down"}
                  size={11}
                  color={stock.change >= 0 ? COLORS.green : COLORS.red}
                />
                <Text
                  className={`text-xs font-semibold ml-0.5 ${stock.change >= 0 ? "text-success" : "text-danger"}`}
                >
                  {Math.abs(stock.changePercent).toFixed(2)}%
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
