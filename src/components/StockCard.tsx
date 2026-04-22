import { COLORS } from "@/constants/theme";
import { usePortfolioStore } from "@/store/portfolioStore";
import { formatINR } from "@/utils/formatCurrency";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
};

export default function StockCard({ stock }: Props) {
  const isPositive = stock.change >= 0;
  const router = useRouter();

  const holdings = usePortfolioStore((state) => state.holdings);
  const ownedHolding = holdings.find((h) => h.symbol === stock.symbol);
  const ownedQuantity = ownedHolding?.quantity ?? 0;

  return (
    <TouchableOpacity
      className="bg-surface rounded-xl p-4 mb-2.5 flex-row items-center justify-between border border-border"
      onPress={() =>
        router.push({
          pathname: "/stock/[symbol]",
          params: {
            symbol: stock.symbol,
            name: stock.name,
            price: stock.price,
            change: stock.change,
            changePercent: stock.changePercent,
          },
        })
      }
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
          {ownedQuantity > 0 && (
            <View className="flex-row items-center bg-orange-50 px-2 py-0.5 rounded-lg mt-1 self-start border border-primary/20">
              <Text className="text-primary text-xs font-semibold">
                {ownedQuantity} owned
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Right */}
      <View className="items-end">
        <Text className="text-base font-bold text-primary-content">
          ₹{formatINR(stock.price)}
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
