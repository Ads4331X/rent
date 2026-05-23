import { Colors } from "@/constants/theme";
import { getFloorWithBills } from "@/services/floorServices";
import React, { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SkeletonBox } from "../SkeletonBox";

type Floor = {
  id: number;
  name: string;
  status: string;
  totalBilled: number;
  totalPaid: number;
  remaining: number;
};

type Props = { refresh: number };

const statusColor = (status: string) => {
  switch (status) {
    case "paid":
      return "#22c55e";
    case "pending":
      return "#f59e0b";
    default:
      return "#64748b";
  }
};

const statusBg = (status: string) => {
  switch (status) {
    case "paid":
      return "#14532d33";
    case "pending":
      return "#78350f33";
    default:
      return "#1e293b";
  }
};

function FloorCard({ floor }: { floor: Floor }) {
  const collected = floor.totalPaid;
  const pending = floor.remaining;
  const total = floor.totalBilled;
  const progress = total > 0 ? (collected / total) * 100 : 0;

  return (
    <View
      style={{
        backgroundColor: Colors.card,
        borderColor: "#1e293b",
        borderWidth: 1,
      }}
      className="rounded-2xl p-4 mb-3 mx-4"
    >
      {/* Header row */}
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2 flex-1">
          <View
            style={{ backgroundColor: "#f43f5e22" }}
            className="w-8 h-8 rounded-xl items-center justify-center"
          >
            <Text style={{ color: "#f43f5e" }} className="text-base font-bold">
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

        {/* Status badge */}
        <View
          style={{ backgroundColor: statusBg(floor.status) }}
          className="px-3 py-1 rounded-full"
        >
          <Text
            style={{ color: statusColor(floor.status) }}
            className="text-xs font-semibold capitalize"
          >
            {floor.status}
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View className="mb-3">
        <View
          style={{ backgroundColor: "#1e293b" }}
          className="h-1.5 rounded-full w-full"
        >
          <View
            style={{
              backgroundColor: floor.status === "paid" ? "#22c55e" : "#f43f5e",
              width: `${Math.min(progress, 100)}%`,
              height: 6,
              borderRadius: 999,
            }}
          />
        </View>
      </View>

      {/* Amounts row */}
      <View className="flex-row justify-between">
        <View className="flex-1">
          <Text style={{ color: "#64748b" }} className="text-xs mb-0.5">
            Collected
          </Text>
          <Text style={{ color: "#22c55e" }} className="text-base font-bold">
            NRS {collected.toLocaleString()}
          </Text>
        </View>

        {/* Divider */}
        <View
          style={{ backgroundColor: "#1e293b", width: 1 }}
          className="mx-4"
        />

        <View className="flex-1 items-end">
          <Text style={{ color: "#64748b" }} className="text-xs mb-0.5">
            Pending
          </Text>
          <Text
            style={{ color: pending > 0 ? "#f59e0b" : "#22c55e" }}
            className="text-base font-bold"
          >
            NRS {pending.toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
}

function FloorCardSkeleton() {
  return (
    <View
      style={{
        backgroundColor: Colors.card,
        borderColor: "#1e293b",
        borderWidth: 1,
      }}
      className="rounded-2xl p-4 mb-3 mx-4"
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center gap-2">
          <SkeletonBox width={32} height={32} />
          <SkeletonBox width={120} height={18} />
        </View>
        <SkeletonBox width={64} height={24} />
      </View>
      <SkeletonBox width={"100%" as any} height={6} marginBottom={12} />
      <View className="flex-row justify-between">
        <View className="gap-1">
          <SkeletonBox width={60} height={12} />
          <SkeletonBox width={90} height={20} />
        </View>
        <View className="gap-1 items-end">
          <SkeletonBox width={60} height={12} />
          <SkeletonBox width={90} height={20} />
        </View>
      </View>
    </View>
  );
}

export default function InfoCard({ refresh }: Props) {
  const [loading, setLoading] = useState(true);
  const [floors, setFloors] = useState<Floor[]>([]);

  useEffect(() => {
    const fetchFloors = async () => {
      setLoading(true);
      const res = await getFloorWithBills();
      setFloors(res.data ?? []);
      setLoading(false);
    };
    fetchFloors();
  }, [refresh]);

  if (loading) {
    return (
      <View className="mt-2">
        <FloorCardSkeleton />
        <FloorCardSkeleton />
      </View>
    );
  }

  if (floors.length === 0) {
    return (
      <View className="items-center justify-center py-16">
        <Text style={{ color: "#475569" }} className="text-base">
          No floors yet. Add one below!
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={floors}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <FloorCard floor={item} />}
      showsVerticalScrollIndicator={false}
      className="mt-2"
      contentContainerStyle={{ paddingBottom: 100 }}
    />
  );
}
