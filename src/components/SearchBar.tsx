import { COLORS } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { TextInput, View } from "react-native";

type Props = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export default function SearchBar({
  value,
  onChangeText,
  placeholder = "Search stocks...",
}: Props) {
  return (
    <View className="flex-row items-center bg-background rounded-xl px-3 py-0.5 mt-4 border border-border">
      <Ionicons name="search-outline" size={18} color={COLORS.textSecondary} />
      <TextInput
        className="ml-2 text-base text-primary-content flex-1"
        placeholder={placeholder}
        placeholderTextColor={COLORS.textSecondary}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
}
