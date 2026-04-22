import { formatINR } from "@/utils/formatCurrency";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type Props = {
  balance: number;
  label?: string;
};

export default function PortfolioSummaryCard({
  balance,
  label = "Starting Balance",
}: Props) {
  return (
    <View className="bg-primary rounded-2xl p-5 mb-6">
      <Text className="text-white/80 text-sm font-medium">
        Virtual Portfolio
      </Text>
      <Text className="text-white text-3xl font-extrabold mt-1">
        ₹{formatINR(balance)}
      </Text>
      <View className="flex-row items-center mt-2">
        <Ionicons name="trending-up" size={16} color="rgba(255,255,255,0.9)" />
        <Text className="text-white/90 text-sm ml-1">{label}</Text>
      </View>
    </View>
  );
}
