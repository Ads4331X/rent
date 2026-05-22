import { Colors } from "@/constants/theme";
import { Text, View } from "react-native";

export default function FloorOverview() {
  return (
    <View className="bg-red-600 py-4 my-4 rounded-lg w-[95%] self-center">
      <View className="mx-5 gap-3">
        <Text style={{ color: Colors.text }}>Monthly Overview</Text>
        <Text className="text-2xl font-bold" style={{ color: Colors.text }}>
          NRP: Total money earned
        </Text>
        <View>
          <Text className="font-extralight" style={{ color: Colors.text }}>
            Total Floors
          </Text>
          <Text className="font-bold text-xl" style={{ color: Colors.text }}>
            Numbers
          </Text>
        </View>
      </View>
    </View>
  );
}
