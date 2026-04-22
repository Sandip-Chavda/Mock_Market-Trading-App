import { COLORS } from "@/constants/theme";
import { usePortfolioStore } from "@/store/portfolioStore";
import { formatINR } from "@/utils/formatCurrency";
import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type SettingRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress?: () => void;
  danger?: boolean;
};

function SettingRow({ icon, label, value, onPress, danger }: SettingRowProps) {
  return (
    <TouchableOpacity
      className="flex-row items-center justify-between py-4 border-b border-border"
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View className="flex-row items-center">
        <View
          className={`w-8 h-8 rounded-lg items-center justify-center mr-3 ${danger ? "bg-red-100" : "bg-background"}`}
        >
          <Ionicons
            name={icon}
            size={18}
            color={danger ? COLORS.red : COLORS.primary}
          />
        </View>
        <Text
          className={`text-base font-medium ${danger ? "text-danger" : "text-primary-content"}`}
        >
          {label}
        </Text>
      </View>
      {value ? (
        <Text className="text-secondary text-sm">{value}</Text>
      ) : onPress ? (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={COLORS.textSecondary}
        />
      ) : null}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { cash, holdings, orders, resetPortfolio } = usePortfolioStore();

  const investedValue = holdings.reduce(
    (sum, h) => sum + h.avgPrice * h.quantity,
    0,
  );
  const currentValue = holdings.reduce(
    (sum, h) => sum + h.currentPrice * h.quantity,
    0,
  );
  const totalPnl = currentValue - investedValue;
  const isProfit = totalPnl >= 0;
  const totalPortfolioValue = cash + currentValue;

  const handleReset = () => {
    Alert.alert(
      "Reset Portfolio",
      "This will reset your portfolio to ₹1,00,000 and clear all holdings and orders. Are you sure?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reset",
          style: "destructive",
          onPress: () => {
            resetPortfolio();
            Alert.alert("Done", "Portfolio has been reset to ₹1,00,000");
          },
        },
      ],
    );
  };

  return (
    <View className="flex-1 bg-background">
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />

      {/* Header */}
      <View className="bg-surface pt-14 px-5 pb-4 border-b border-border">
        <Text className="text-2xl font-bold text-primary-content">Profile</Text>
        <Text className="text-sm text-secondary mt-1">Account & Settings</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20 }}
      >
        {/* Avatar + Name */}
        <View className="items-center mb-6">
          <View className="w-20 h-20 rounded-full bg-primary items-center justify-center mb-3">
            <Text className="text-white text-3xl font-bold">S</Text>
          </View>
          <Text className="text-xl font-bold text-primary-content">Sandip</Text>
          <Text className="text-sm text-secondary mt-1">
            Paper Trader · Mock Market
          </Text>
        </View>

        {/* Portfolio Stats Card */}
        <View className="bg-surface rounded-2xl p-4 border border-border mb-4">
          <Text className="text-base font-bold text-primary-content mb-3">
            Portfolio Summary
          </Text>
          <View className="flex-row justify-between mb-3">
            <View className="items-center flex-1">
              <Text className="text-xs text-secondary">Total Value</Text>
              <Text className="text-base font-bold text-primary-content mt-1">
                ₹{formatINR(totalPortfolioValue, 0)}
              </Text>
            </View>
            <View className="w-px bg-border" />
            <View className="items-center flex-1">
              <Text className="text-xs text-secondary">Overall P&L</Text>
              <Text
                className={`text-base font-bold mt-1 ${isProfit ? "text-success" : "text-danger"}`}
              >
                {isProfit ? "+" : "-"}₹{formatINR(Math.abs(totalPnl), 0)}
              </Text>
            </View>
            <View className="w-px bg-border" />
            <View className="items-center flex-1">
              <Text className="text-xs text-secondary">Orders</Text>
              <Text className="text-base font-bold text-primary-content mt-1">
                {orders.length}
              </Text>
            </View>
          </View>
        </View>

        {/* Account Section */}
        <View className="bg-surface rounded-2xl px-4 border border-border mb-4">
          <Text className="text-xs text-secondary font-semibold pt-4 pb-2">
            ACCOUNT
          </Text>
          <SettingRow icon="person-outline" label="Name" value="Sandip" />
          <SettingRow
            icon="cash-outline"
            label="Starting Balance"
            value="₹1,00,000"
          />
          <SettingRow
            icon="wallet-outline"
            label="Available Cash"
            value={`₹${formatINR(cash)}`}
          />
          <SettingRow
            icon="layers-outline"
            label="Holdings"
            value={`${holdings.length} stocks`}
          />
        </View>

        {/* App Section */}
        <View className="bg-surface rounded-2xl px-4 border border-border mb-4">
          <Text className="text-xs text-secondary font-semibold pt-4 pb-2">
            APP
          </Text>
          <SettingRow
            icon="information-circle-outline"
            label="Version"
            value="1.0.0"
          />
          <SettingRow
            icon="code-slash-outline"
            label="Built with"
            value="Expo + NativeWind"
          />
          <SettingRow
            icon="business-outline"
            label="Market"
            value="NSE India"
          />
        </View>

        {/* Danger Section */}
        <View className="bg-surface rounded-2xl px-4 border border-border mb-4">
          <Text className="text-xs text-secondary font-semibold pt-4 pb-2">
            DANGER ZONE
          </Text>
          <SettingRow
            icon="refresh-outline"
            label="Reset Portfolio"
            onPress={handleReset}
            danger
          />
        </View>
      </ScrollView>
    </View>
  );
}
