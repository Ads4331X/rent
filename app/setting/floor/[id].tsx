import { Colors } from "@/constants/theme";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function FloorSettingPage() {
  const { id } = useLocalSearchParams();
  const floorId = useMemo(() => String(id ?? ""), [id]);

  // Placeholder page (no settings UI existed in the repo yet).
  // This route exists so the "Setting" menu item can navigate correctly.
  const [loaded] = useState(true);

  useEffect(() => {
    // no-op
  }, []);

  return (
    <View className="flex-1" style={{ backgroundColor: Colors.background }}>
      <View className="px-4 pt-14 pb-6">
        <Pressable onPress={() => router.push("/")}>
          <AntDesign name="arrow-left" size={24} color="white" />
        </Pressable>

        <Text className="text-white text-2xl font-bold mt-4">Setting</Text>

        <Text className="text-slate-400 mt-2">Floor ID: {floorId || "-"}</Text>
      </View>

      {!loaded ? (
        <Text className="text-slate-400 px-4">Loading...</Text>
      ) : (
        <View className="px-4">
          <Text className="text-slate-300">
            Floor settings UI is not implemented yet.
          </Text>
        </View>
      )}
    </View>
  );
}
