import { Colors } from "@/constants/theme";
import { Text, View } from "react-native";

export default function InfoCard() {
  return (
    <View
      style={{
        backgroundColor: Colors.card,
      }}
      className="rounded-lg , p-2 m-2 flex justify-around flex-wrap"
    >
      <View className="flex-row items-center p-2 gap-2 justify-between w-full">
        <Text style={{ color: Colors.text }} className="text-xl font-semibold">
          Floor Name
        </Text>
        <Text style={{ color: Colors.text }}>Status</Text>
      </View>
      <View className="flex-row items-center p-2 gap-2 justify-between w-full">
        <View>
          <Text style={{ color: Colors.label }} className="text-lg">
            Collected
          </Text>
          <Text
            style={{ color: Colors.text }}
            className="text-xl font-semibold"
          >
            Nrs: Number
          </Text>
        </View>
        <View>
          <Text style={{ color: Colors.label }} className="text-lg text-right">
            Pending
          </Text>
          <Text
            style={{ color: Colors.text }}
            className="text-xl font-semibold "
          >
            Nrs: Number
          </Text>
        </View>
      </View>
    </View>
  );
}
