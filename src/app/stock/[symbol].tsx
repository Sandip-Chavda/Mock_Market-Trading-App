import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const TIME_FILTERS = ["1D", "1W", "1M", "3M", "1Y"];

const MOCK_CHART_BARS = [
  40, 65, 45, 70, 55, 80, 60, 75, 50, 85, 65, 90, 70, 88, 72,
];

export default function StockDetailScreen() {
  const { symbol, name, price, change, changePercent } = useLocalSearchParams<{
    symbol: string;
    name: string;
    price: string;
    change: string;
    changePercent: string;
  }>();
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState("1D");
  const [quantity, setQuantity] = useState(1);

  const isPositive = parseFloat(change) >= 0;
  const priceNum = parseFloat(price);
  const changeNum = parseFloat(change);
  const changePercentNum = parseFloat(changePercent);
  const totalCost = (priceNum * quantity).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
  });

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
            ₹{priceNum.toFixed(2)}
          </Text>
          <View
            className={`flex-row items-center mt-1 self-start px-2 py-1 rounded-lg ${isPositive ? "bg-green-100" : "bg-red-100"}`}
          >
            <Ionicons
              name={isPositive ? "arrow-up" : "arrow-down"}
              size={13}
              color={isPositive ? COLORS.green : COLORS.red}
            />
            <Text
              className={`text-sm font-semibold ml-1 ${isPositive ? "text-success" : "text-danger"}`}
            >
              ₹{Math.abs(changeNum).toFixed(2)} (
              {Math.abs(changePercentNum).toFixed(2)}%)
            </Text>
          </View>

          {/* Time Filters */}
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

          {/* Chart */}
          <View className="bg-surface rounded-2xl p-4 mt-4 border border-border">
            <View className="flex-row items-end justify-between h-32">
              {MOCK_CHART_BARS.map((height, index) => (
                <View
                  key={index}
                  style={{ height: `${height}%` as any }}
                  className={`w-4 rounded-sm ${isPositive ? "bg-green-400" : "bg-red-400"}`}
                />
              ))}
            </View>
            <Text className="text-xs text-secondary text-center mt-3">
              Mock chart — live data coming soon
            </Text>
          </View>

          {/* Stock Stats */}
          <View className="bg-surface rounded-2xl p-4 mt-4 border border-border">
            <Text className="text-base font-bold text-primary-content mb-3">
              Statistics
            </Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-secondary text-sm">Open</Text>
              <Text className="text-primary-content text-sm font-semibold">
                ₹{(priceNum - changeNum).toFixed(2)}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-secondary text-sm">Day High</Text>
              <Text className="text-primary-content text-sm font-semibold">
                ₹{(priceNum * 1.02).toFixed(2)}
              </Text>
            </View>
            <View className="flex-row justify-between mb-2">
              <Text className="text-secondary text-sm">Day Low</Text>
              <Text className="text-primary-content text-sm font-semibold">
                ₹{(priceNum * 0.98).toFixed(2)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-secondary text-sm">52W High</Text>
              <Text className="text-primary-content text-sm font-semibold">
                ₹{(priceNum * 1.35).toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Quantity Selector */}
          <View className="bg-surface rounded-2xl p-4 mt-4 border border-border">
            <Text className="text-base font-bold text-primary-content mb-3">
              Order
            </Text>
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
          </View>

          <View className="h-6" />
        </View>
      </ScrollView>

      {/* Buy / Sell Buttons */}
      <View className="flex-row px-5 py-4 bg-surface border-t border-border">
        <TouchableOpacity className="flex-1 bg-green-500 py-4 rounded-xl items-center mr-2">
          <Text className="text-white font-bold text-base">Buy</Text>
        </TouchableOpacity>
        <TouchableOpacity className="flex-1 bg-danger py-4 rounded-xl items-center ml-2">
          <Text className="text-white font-bold text-base">Sell</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
