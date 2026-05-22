import { Colors } from "@/constants/theme";
import { Pressable, Text, View } from "react-native";

export default function PropertyFloors() {
  return (
    <View>
      <View className="flex flex-row items-center justify-between px-2">
        <Text
          className={` font-semibold text-xl`}
          style={{
            color: Colors.text,
          }}
        >
          Property Floors
        </Text>
        <Pressable>
          <Text style={{ color: Colors.primary }}>View All</Text>
        </Pressable>
      </View>
    </View>
  );
}
