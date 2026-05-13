import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

type Slide = {
  id: string;
  type: "image" | "icon";
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
};

const SLIDES: Slide[] = [
  {
    id: "1",
    type: "image",
    title: "Welcome to Mock Market",
    subtitle:
      "Practice stock trading without risking real money. Start with ₹1,00,000 virtual cash.",
  },
  {
    id: "2",
    type: "icon",
    icon: "pulse",
    title: "Live Market Data",
    subtitle:
      "Real US stock prices updated every 30 seconds, converted to Indian Rupees in real time.",
  },
  {
    id: "3",
    type: "icon",
    icon: "pie-chart",
    title: "Track Your Portfolio",
    subtitle:
      "Monitor your holdings, P&L and complete order history. Buy, sell and grow your skills.",
  },
];

type Props = {
  onDone: () => void;
};

export default function OnboardingScreen({ onDone }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      onDone();
    }
  };

  const handleSkip = () => onDone();

  const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    if (index !== currentIndex) setCurrentIndex(index);
  };

  return (
    <View className="flex-1" style={{ backgroundColor: "#FFF8F3" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF8F3" />

      {/* Skip Button */}
      <View className="absolute top-14 right-5 z-10">
        {currentIndex < SLIDES.length - 1 && (
          <TouchableOpacity onPress={handleSkip} className="px-4 py-2">
            <Text className="text-secondary font-semibold text-sm">Skip</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Slides */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        renderItem={({ item }) => (
          <View
            style={{ width }}
            className="flex-1 items-center justify-center px-8"
          >
            {/* Illustration */}
            {item.type === "image" ? (
              <View
                className="w-56 h-56 rounded-full items-center justify-center mb-10 overflow-hidden"
                style={{ backgroundColor: "#FFE0C2" }}
              >
                <Image
                  source={require("../../assets/images/mmicon1.png")}
                  style={{ width: 224, height: 224, borderRadius: 112 }}
                  resizeMode="cover"
                />
              </View>
            ) : (
              <View
                className="w-56 h-56 rounded-full items-center justify-center mb-10"
                style={{ backgroundColor: "#FFE0C2" }}
              >
                <Ionicons name={item.icon!} size={100} color={COLORS.primary} />
              </View>
            )}

            {/* Text */}
            <Text
              className="text-3xl font-extrabold text-primary-content text-center"
              style={{ lineHeight: 38 }}
            >
              {item.title}
            </Text>
            <Text
              className="text-base text-secondary text-center mt-4"
              style={{ lineHeight: 24 }}
            >
              {item.subtitle}
            </Text>
          </View>
        )}
      />

      {/* Bottom Section */}
      <View className="px-8 pb-12">
        {/* Dots */}
        <View className="flex-row justify-center mb-8">
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={{
                width: index === currentIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor:
                  index === currentIndex ? COLORS.primary : COLORS.border,
                marginHorizontal: 4,
              }}
            />
          ))}
        </View>

        {/* Button */}
        <TouchableOpacity
          className="bg-primary py-4 rounded-2xl items-center"
          onPress={handleNext}
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-base">
            {currentIndex === SLIDES.length - 1 ? "Get Started" : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
