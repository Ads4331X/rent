import { Colors } from "@/constants/theme";
import { View } from "react-native";
import { SkeletonBox } from "../SkeletonBox";

export default function FloorCardSkeleton() {
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
        <View className="flex-row items-center gap-2 flex-1">
          <SkeletonBox width={32} height={32} />
          <SkeletonBox width={120} height={18} />
        </View>
        <SkeletonBox width={64} height={24} />
      </View>
      <SkeletonBox width={300} height={6} marginBottom={12} />
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
