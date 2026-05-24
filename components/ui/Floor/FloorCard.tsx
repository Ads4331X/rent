import { Colors } from "@/constants/theme";
import Entypo from "@expo/vector-icons/Entypo";
import { useState } from "react";
import { Alert, Platform, Pressable, Text, View } from "react-native";
import FloorCardMenu from "./FloorCardMenu";
import {
  calculateProgress,
  getPendingColor,
  getProgressColor,
  getStatusBgColor,
  getStatusColor,
} from "./utils/floorHelpers";
import { Floor, FloorMenuAction } from "./utils/types";

interface Props {
  floor: Floor;
  onAction?: (action: FloorMenuAction, floorId: number) => void;
}

export default function FloorCard({ floor, onAction }: Props) {
  const [menuVisible, setMenuVisible] = useState(false);
  const progress = calculateProgress(floor.totalPaid, floor.totalBilled);

  const confirmDelete = () => {
    if (Platform.OS === "web") {
      if (window.confirm(`Delete "${floor.name}"? This cannot be undone.`)) {
        onAction?.("delete", floor.id);
      }
    } else {
      Alert.alert(
        "Delete Floor",
        `Delete "${floor.name}"? This cannot be undone.`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => onAction?.("delete", floor.id),
          },
        ],
      );
    }
  };

  const handleMenuSelect = (action: FloorMenuAction) => {
    if (action === "delete") confirmDelete();
    else onAction?.(action, floor.id);
  };

  return (
    <>
      <View
        style={{
          backgroundColor: Colors.card,
          borderColor: "#1e293b",
          borderWidth: 1,
        }}
        className="rounded-2xl p-4 mb-3 mx-4"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2 flex-1">
            <View
              style={{ backgroundColor: "#f43f5e22" }}
              className="w-8 h-8 rounded-xl items-center justify-center"
            >
              <Text
                style={{ color: "#f43f5e" }}
                className="text-base font-bold"
              >
                {floor.name[0].toUpperCase()}
              </Text>
            </View>
            <Text
              style={{ color: Colors.text }}
              className="text-base font-bold flex-1"
              numberOfLines={1}
            >
              {floor.name}
            </Text>
          </View>

          <View className="flex-row items-center gap-2">
            <View
              style={{ backgroundColor: getStatusBgColor(floor.status) }}
              className="px-3 py-1 rounded-full"
            >
              <Text
                style={{ color: getStatusColor(floor.status) }}
                className="text-xs font-semibold capitalize"
              >
                {floor.status}
              </Text>
            </View>
            <Pressable onPress={() => setMenuVisible(true)} hitSlop={8}>
              <Entypo name="dots-three-horizontal" size={20} color="#475569" />
            </Pressable>
          </View>
        </View>

        {/* Progress Bar */}
        <View
          style={{ backgroundColor: "#1e293b" }}
          className="h-1.5 rounded-full mb-3"
        >
          <View
            style={{
              backgroundColor: getProgressColor(floor.status),
              width: `${Math.min(progress, 100)}%`,
              height: 6,
              borderRadius: 999,
            }}
          />
        </View>

        {/* Amounts */}
        <View className="flex-row justify-between">
          <View>
            <Text style={{ color: "#64748b" }} className="text-xs mb-0.5">
              Collected
            </Text>
            <Text style={{ color: "#22c55e" }} className="text-base font-bold">
              NRS {floor.totalPaid.toLocaleString()}
            </Text>
          </View>
          <View
            style={{ backgroundColor: "#1e293b", width: 1 }}
            className="mx-4"
          />
          <View className="items-end">
            <Text style={{ color: "#64748b" }} className="text-xs mb-0.5">
              Pending
            </Text>
            <Text
              style={{ color: getPendingColor(floor.remaining) }}
              className="text-base font-bold"
            >
              NRS {floor.remaining.toLocaleString()}
            </Text>
          </View>
        </View>
      </View>

      <FloorCardMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onSelect={handleMenuSelect}
      />
    </>
  );
}
