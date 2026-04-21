import { COLORS } from "@/constants/theme";
import { Order, usePortfolioStore } from "@/store/portfolioStore";
import { Ionicons } from "@expo/vector-icons";
import { FlatList, StatusBar, Text, View } from "react-native";

function OrderCard({ order }: { order: Order }) {
  const isBuy = order.type === "BUY";
  const date = new Date(order.timestamp);
  const formattedDate = date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const formattedTime = date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View className="bg-surface rounded-xl p-4 mb-2.5 border border-border">
      {/* Top Row */}
      <View className="flex-row justify-between items-center">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-lg bg-background items-center justify-center mr-3 border border-border">
            <Text className="text-xs font-bold text-primary">
              {order.symbol.slice(0, 2)}
            </Text>
          </View>
          <View>
            <Text className="text-base font-bold text-primary-content">
              {order.symbol}
            </Text>
            <Text className="text-xs text-secondary mt-0.5" numberOfLines={1}>
              {order.name}
            </Text>
          </View>
        </View>

        {/* Buy/Sell Badge */}
        <View
          className={`px-3 py-1 rounded-lg ${isBuy ? "bg-green-100" : "bg-red-100"}`}
        >
          <Text
            className={`text-sm font-bold ${isBuy ? "text-success" : "text-danger"}`}
          >
            {order.type}
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View className="h-px bg-border my-3" />

      {/* Bottom Row */}
      <View className="flex-row justify-between items-center">
        <View>
          <Text className="text-xs text-secondary">Quantity</Text>
          <Text className="text-sm font-semibold text-primary-content mt-0.5">
            {order.quantity} shares
          </Text>
        </View>
        <View>
          <Text className="text-xs text-secondary">Price</Text>
          <Text className="text-sm font-semibold text-primary-content mt-0.5">
            ₹{order.price.toFixed(2)}
          </Text>
        </View>
        <View className="items-end">
          <Text className="text-xs text-secondary">Total</Text>
          <Text
            className={`text-sm font-semibold mt-0.5 ${isBuy ? "text-danger" : "text-success"}`}
          >
            {isBuy ? "-" : "+"}₹
            {order.total.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
          </Text>
        </View>
      </View>

      {/* Timestamp */}
      <Text className="text-xs text-secondary mt-2">
        {formattedDate} at {formattedTime}
      </Text>
    </View>
  );
}

function OrdersHeader({
  totalOrders,
  buyCount,
  sellCount,
}: {
  totalOrders: number;
  buyCount: number;
  sellCount: number;
}) {
  return (
    <View className="flex-row mb-4 gap-3">
      <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
        <Text className="text-xs text-secondary">Total Orders</Text>
        <Text className="text-base font-bold text-primary-content mt-1">
          {totalOrders}
        </Text>
      </View>
      <View className="flex-1 bg-surface rounded-xl p-4 border border-border">
        <Text className="text-xs text-secondary">Buy / Sell</Text>
        <Text className="text-base font-bold text-primary-content mt-1">
          <Text className="text-success">{buyCount}</Text>
          <Text className="text-secondary"> / </Text>
          <Text className="text-danger">{sellCount}</Text>
        </Text>
      </View>
    </View>
  );
}

export default function OrdersScreen() {
  const orders = usePortfolioStore((state) => state.orders);

  const buyCount = orders.filter((o) => o.type === "BUY").length;
  const sellCount = orders.filter((o) => o.type === "SELL").length;

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      {/* Header */}
      <View className="bg-surface pt-14 px-5 pb-4 border-b border-border">
        <Text className="text-2xl font-bold text-primary-content">Orders</Text>
        <Text className="text-sm text-secondary mt-1">
          Your transaction history
        </Text>
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
        ListHeaderComponent={
          orders.length > 0 ? (
            <OrdersHeader
              totalOrders={orders.length}
              buyCount={buyCount}
              sellCount={sellCount}
            />
          ) : null
        }
        ListEmptyComponent={
          <View className="items-center mt-10">
            <Ionicons
              name="receipt-outline"
              size={48}
              color={COLORS.textSecondary}
            />
            <Text className="text-primary-content font-bold text-lg mt-4">
              No Orders Yet
            </Text>
            <Text className="text-secondary text-sm mt-2 text-center">
              Buy or sell stocks from the Market tab to see your order history
            </Text>
          </View>
        }
        renderItem={({ item }) => <OrderCard order={item} />}
      />
    </View>
  );
}
