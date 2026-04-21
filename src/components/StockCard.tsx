import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export type Stock = {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
};

type Props = {
  stock: Stock;
  onPress: (stock: Stock) => void;
};

export default function StockCard({ stock, onPress }: Props) {
  const isPositive = stock.change >= 0;

  return (
    <TouchableOpacity
      className="bg-surface rounded-xl p-4 mb-2.5 flex-row items-center justify-between border border-border"
      onPress={() => onPress(stock)}
      activeOpacity={0.7}
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
          <Text className="text-xs text-secondary mt-0.5" numberOfLines={1}>
            {stock.name}
          </Text>
        </View>
      </View>

      {/* Right */}
      <View className="items-end">
        <Text className="text-base font-bold text-primary-content">
          ₹{stock.price.toFixed(2)}
        </Text>
        <View
          className={`flex-row items-center px-2 py-0.5 rounded-lg mt-1 ${isPositive ? "bg-green-100" : "bg-red-100"}`}
        >
          <Ionicons
            name={isPositive ? "arrow-up" : "arrow-down"}
            size={11}
            color={isPositive ? COLORS.green : COLORS.red}
          />
          <Text
            className={`text-xs font-semibold ml-0.5 ${isPositive ? "text-success" : "text-danger"}`}
          >
            {Math.abs(stock.changePercent).toFixed(2)}%
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
