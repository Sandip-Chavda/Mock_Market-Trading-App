import { COLORS } from "@/constants/theme";
import { Holding, usePortfolioStore } from "@/store/portfolioStore";
import { formatINR } from "@/utils/formatCurrency";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, StatusBar, Text, View } from "react-native";

function HoldingCard({ holding }: { holding: Holding }) {
  const isProfit = holding.currentPrice >= holding.avgPrice;
  const pnl = (holding.currentPrice - holding.avgPrice) * holding.quantity;
  const pnlPercent =
    ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100;
  const currentValue = holding.currentPrice * holding.quantity;

  return (
    <View className="bg-surface rounded-xl p-4 mb-2.5 border border-border">
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-lg bg-background items-center justify-center mr-3 border border-border">
            <Text className="text-xs font-bold text-primary">
              {holding.symbol.slice(0, 2)}
            </Text>
          </View>
          <View>
            <Text className="text-base font-bold text-primary-content">
              {holding.symbol}
            </Text>
            <Text className="text-xs text-secondary mt-0.5">
              {holding.quantity} shares
            </Text>
          </View>
        </View>
        <View className="items-end">
          <Text className="text-base font-bold text-primary-content">
            ₹{formatINR(currentValue)}
          </Text>
          <View
            className={`flex-row items-center px-2 py-0.5 rounded-lg mt-1 ${isProfit ? "bg-green-100" : "bg-red-100"}`}
          >
            <Ionicons
              name={isProfit ? "arrow-up" : "arrow-down"}
              size={11}
              color={isProfit ? COLORS.green : COLORS.red}
            />
            <Text
              className={`text-xs font-semibold ml-0.5 ${isProfit ? "text-success" : "text-danger"}`}
            >
              {Math.abs(pnlPercent).toFixed(2)}%
            </Text>
          </View>
        </View>
      </View>

      <View className="h-px bg-border my-3" />

      <View className="flex-row justify-between">
        <View>
          <Text className="text-xs text-secondary">Avg. Price</Text>
          <Text className="text-sm font-semibold text-primary-content mt-0.5">
            ₹{formatINR(holding.avgPrice)}
          </Text>
        </View>
        <View>
          <Text className="text-xs text-secondary">Current Price</Text>
          <Text className="text-sm font-semibold text-primary-content mt-0.5">
            ₹{formatINR(holding.currentPrice)}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-xs text-secondary">P&L</Text>
          <Text
            className={`text-sm font-semibold mt-0.5 ${isProfit ? "text-success" : "text-danger"}`}
          >
            {isProfit ? "+" : "-"}₹{formatINR(Math.abs(pnl))}
          </Text>
        </View>
      </View>
    </View>
  );
}

function PortfolioHeader() {
  const cash = usePortfolioStore((state) => state.cash);
  const holdings = usePortfolioStore((state) => state.holdings);

  const investedValue = holdings.reduce(
    (sum, h) => sum + h.avgPrice * h.quantity,
    0,
  );
  const currentValue = holdings.reduce(
    (sum, h) => sum + h.currentPrice * h.quantity,
    0,
  );
  const totalPnl = currentValue - investedValue;
  const totalPnlPercent =
    investedValue > 0 ? (totalPnl / investedValue) * 100 : 0;
  const isProfit = totalPnl >= 0;
  const totalPortfolioValue = cash + currentValue;

  return (
    <>
      <View className="bg-primary rounded-2xl p-5 mb-4">
        <Text className="text-white/80 text-sm font-medium">
          Total Portfolio Value
        </Text>
        <Text className="text-white text-3xl font-extrabold mt-1">
          ₹{formatINR(totalPortfolioValue)}
        </Text>
        <View className="flex-row items-center mt-2">
          <Ionicons
            name={isProfit ? "trending-up" : "trending-down"}
            size={16}
            color="rgba(255,255,255,0.9)"
          />
          <Text className="text-white/90 text-sm ml-1">
            {isProfit ? "+" : "-"}₹ ₹{formatINR(Math.abs(totalPnl))} (
            {Math.abs(totalPnlPercent).toFixed(2)}%)
          </Text>
        </View>
      </View>

      <View className="flex-row mb-4 gap-3">
        <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
          <Text className="text-xs text-secondary">Invested</Text>
          <Text className="text-base font-bold text-primary-content mt-1">
            ₹{formatINR(investedValue)}
          </Text>
        </View>
        <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
          <Text className="text-xs text-secondary">Available Cash</Text>
          <Text className="text-base font-bold text-primary-content mt-1">
            ₹{formatINR(cash)}
          </Text>
        </View>
      </View>

      {holdings.length > 0 && (
        <Text className="text-lg font-bold text-primary-content mb-3">
          Holdings
        </Text>
      )}
    </>
  );
}

export default function PortfolioScreen() {
  const holdings = usePortfolioStore((state) => state.holdings);

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      <View className="bg-surface pt-14 px-5 pb-4 border-b border-border">
        <Text className="text-2xl font-bold text-primary-content">
          Portfolio
        </Text>
        <Text className="text-sm text-secondary mt-1">
          Track your holdings & P&L
        </Text>
      </View>

      <FlatList
        data={holdings}
        keyExtractor={(item) => item.symbol}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
        ListHeaderComponent={<PortfolioHeader />}
        ListEmptyComponent={
          <View className="items-center mt-10">
            <Ionicons
              name="pie-chart-outline"
              size={48}
              color={COLORS.textSecondary}
            />
            <Text className="text-primary-content font-bold text-lg mt-4">
              No Holdings Yet
            </Text>
            <Text className="text-secondary text-sm mt-2 text-center">
              Buy stocks from the Market tab to start building your portfolio
            </Text>
          </View>
        }
        renderItem={({ item }) => <HoldingCard holding={item} />}
      />
    </View>
  );
}
