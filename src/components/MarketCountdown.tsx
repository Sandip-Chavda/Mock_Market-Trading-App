import { isUSMarketOpen } from "@/utils/marketStatus";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";

function getNextMarketEvent(): { label: string; secondsLeft: number } {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const month = now.getUTCMonth() + 1;
  const isDST = month >= 3 && month <= 11;
  const offset = isDST ? -4 : -5;
  const et = new Date(utc + 3600000 * offset);

  const day = et.getDay();
  const hours = et.getHours();
  const minutes = et.getMinutes();
  const seconds = et.getSeconds();
  const totalSeconds = hours * 3600 + minutes * 60 + seconds;

  const marketOpenSeconds = 9 * 3600 + 30 * 60; // 9:30 AM
  const marketCloseSeconds = 16 * 3600; // 4:00 PM

  const isOpen = isUSMarketOpen();

  if (isOpen) {
    // market is open — count down to close
    const secondsLeft = marketCloseSeconds - totalSeconds;
    return { label: "Closes in", secondsLeft };
  } else {
    // market is closed — count down to next open
    let secondsUntilOpen: number;

    if (day === 0) {
      // Sunday — next open is Monday 9:30 AM
      secondsUntilOpen = 24 * 3600 - totalSeconds + marketOpenSeconds;
    } else if (day === 6) {
      // Saturday — next open is Monday 9:30 AM
      secondsUntilOpen = 2 * 24 * 3600 - totalSeconds + marketOpenSeconds;
    } else if (totalSeconds < marketOpenSeconds) {
      // Before market open today
      secondsUntilOpen = marketOpenSeconds - totalSeconds;
    } else {
      // After market close — next open is tomorrow (skip weekend)
      const daysUntilOpen = day === 5 ? 3 : 1; // Friday → Monday
      secondsUntilOpen =
        daysUntilOpen * 24 * 3600 - totalSeconds + marketOpenSeconds;
    }

    return { label: "Opens in", secondsLeft: secondsUntilOpen };
  }
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
}

type Props = {
  compact?: boolean;
};

export default function MarketCountdown({ compact = false }: Props) {
  const [marketOpen, setMarketOpen] = useState(isUSMarketOpen());
  const [event, setEvent] = useState(getNextMarketEvent());

  useEffect(() => {
    const interval = setInterval(() => {
      setMarketOpen(isUSMarketOpen());
      setEvent(getNextMarketEvent());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (compact) {
    return (
      <View
        className={`flex-row items-center px-2 py-1 rounded-xl ${marketOpen ? "bg-green-100" : "bg-red-100"}`}
      >
        <View
          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${marketOpen ? "bg-green-500" : "bg-red-400"}`}
        />
        <Text
          className={`text-xs font-semibold ${marketOpen ? "text-success" : "text-danger"}`}
        >
          {marketOpen ? "Market Open" : "Market Closed"} · {event.label}{" "}
          {formatTime(event.secondsLeft)}
        </Text>
      </View>
    );
  }

  return (
    <View
      className={`rounded-xl px-3 py-2 border ${marketOpen ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
    >
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          <View
            className={`w-2 h-2 rounded-full mr-2 ${marketOpen ? "bg-green-500" : "bg-red-400"}`}
          />
          <Text
            className={`text-sm font-bold ${marketOpen ? "text-success" : "text-danger"}`}
          >
            Market {marketOpen ? "Open" : "Closed"}
          </Text>
        </View>
        <View>
          <Text className="text-xs text-secondary text-right">
            {event.label}
          </Text>
          <Text
            className={`text-sm font-bold ${marketOpen ? "text-success" : "text-danger"}`}
          >
            {formatTime(event.secondsLeft)}
          </Text>
        </View>
      </View>
    </View>
  );
}
