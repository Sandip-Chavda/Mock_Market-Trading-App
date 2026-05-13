import DisclaimerModal from "@/components/DisclaimerModal";
import { COLORS } from "@/constants/theme";
import { useThemeStore } from "@/store/themeStore";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../../global.css";
import OnboardingScreen from "./onboarding";

export default function RootLayout() {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const isDark = useThemeStore((state) => state.isDark);
  const { setColorScheme } = useColorScheme();

  useEffect(() => {
    setColorScheme(isDark ? "dark" : "light");
  }, [isDark]);

  const tabBarStyle = {
    backgroundColor: isDark ? "#161B22" : COLORS.surface,
    borderTopColor: isDark ? "#21262D" : COLORS.border,
    borderTopWidth: 1,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  };

  if (showOnboarding) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <OnboardingScreen
          onDone={() => {
            setShowOnboarding(false);
            setShowDisclaimer(true);
          }}
        />
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <DisclaimerModal
        visible={showDisclaimer}
        onAccept={() => setShowDisclaimer(false)}
      />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle,
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: isDark ? "#8B949E" : COLORS.textSecondary,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Market",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "trending-up" : "trending-up-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="portfolio"
          options={{
            title: "Portfolio",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "pie-chart" : "pie-chart-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: "Orders",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "receipt" : "receipt-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="stock/[symbol]"
          options={{
            title: "Stock Details",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "analytics" : "analytics-outline"}
                color={color}
                size={size}
              />
            ),
            href: null,
          }}
        />
        <Tabs.Screen
          name="onboarding"
          options={{
            title: "Onboarding",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "book" : "book-outline"}
                color={color}
                size={size}
              />
            ),
            href: null,
          }}
        />
      </Tabs>
    </GestureHandlerRootView>
  );
}
