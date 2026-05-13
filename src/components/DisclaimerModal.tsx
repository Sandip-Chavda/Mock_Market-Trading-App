import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { Modal, Text, TouchableOpacity, View } from "react-native";

type Props = {
  visible: boolean;
  onAccept: () => void;
};

export default function DisclaimerModal({ visible, onAccept }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
    >
      <View
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        className="flex-1 items-center justify-center px-6"
      >
        <View className="bg-surface rounded-3xl p-6 w-full">
          {/* Icon */}
          <View className="items-center mb-4">
            <View className="w-16 h-16 rounded-full bg-orange-50 items-center justify-center">
              <Ionicons
                name="information-circle"
                size={40}
                color={COLORS.primary}
              />
            </View>
          </View>

          {/* Title */}
          <Text className="text-xl font-extrabold text-primary-content text-center mb-1">
            Important Notice
          </Text>
          <Text className="text-sm text-secondary text-center mb-5">
            Please read before continuing
          </Text>

          {/* Disclaimer Points */}
          <View className="bg-background rounded-2xl p-4 mb-5 border border-border">
            <View className="flex-row items-start mb-3">
              <View className="w-6 h-6 rounded-full bg-orange-100 items-center justify-center mr-3 mt-0.5">
                <Ionicons
                  name="school-outline"
                  size={14}
                  color={COLORS.primary}
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-primary-content">
                  Learning Purpose Only
                </Text>
                <Text className="text-xs text-secondary mt-0.5">
                  Mock Market is a paper trading simulator built for educational
                  purposes only.
                </Text>
              </View>
            </View>

            <View className="flex-row items-start mb-3">
              <View className="w-6 h-6 rounded-full bg-orange-100 items-center justify-center mr-3 mt-0.5">
                <Ionicons
                  name="pulse-outline"
                  size={14}
                  color={COLORS.primary}
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-primary-content">
                  Real Live Stock Prices
                </Text>
                <Text className="text-xs text-secondary mt-0.5">
                  Stock prices are fetched live from Finnhub API and converted
                  to INR in real time. Price changes reflect actual US market
                  movements.
                </Text>
              </View>
            </View>

            <View className="flex-row items-start mb-3">
              <View className="w-6 h-6 rounded-full bg-orange-100 items-center justify-center mr-3 mt-0.5">
                <Ionicons
                  name="bar-chart-outline"
                  size={14}
                  color={COLORS.primary}
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-primary-content">
                  Demo Charts Only
                </Text>
                <Text className="text-xs text-secondary mt-0.5">
                  Charts are generated for demonstration purposes and do not
                  represent real market movements.
                </Text>
              </View>
            </View>

            <View className="flex-row items-start mb-3">
              <View className="w-6 h-6 rounded-full bg-orange-100 items-center justify-center mr-3 mt-0.5">
                <Ionicons
                  name="wallet-outline"
                  size={14}
                  color={COLORS.primary}
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-primary-content">
                  No Real Money
                </Text>
                <Text className="text-xs text-secondary mt-0.5">
                  All trades are simulated with virtual money. No real funds are
                  involved at any point.
                </Text>
              </View>
            </View>

            <View className="flex-row items-start">
              <View className="w-6 h-6 rounded-full bg-orange-100 items-center justify-center mr-3 mt-0.5">
                <Ionicons
                  name="alert-circle-outline"
                  size={14}
                  color={COLORS.primary}
                />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-primary-content">
                  Not Financial Advice
                </Text>
                <Text className="text-xs text-secondary mt-0.5">
                  Nothing in this app constitutes financial advice. Always
                  consult a professional before real investing.
                </Text>
              </View>
            </View>
          </View>

          {/* Accept Button */}
          <TouchableOpacity
            className="bg-primary py-4 rounded-2xl items-center"
            onPress={onAccept}
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold text-base">I Understand</Text>
          </TouchableOpacity>

          {/* Footer */}
          <Text className="text-xs text-secondary text-center mt-3">
            Mock Market v1.0.0 · For educational use only
          </Text>
        </View>
      </View>
    </Modal>
  );
}
