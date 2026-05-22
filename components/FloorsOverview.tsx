import { Colors } from "@/constants/theme";
import { Text, View } from "react-native";

export default function FloorOverview() {
  return (
    <View className="bg-red-600 py-2 my-4 rounded-lg flex justify-start items-start gap-2 w-[95%] m-auto">
      <View className="mx-5 flex-1 gap-3 ">
        <Text
          style={{
            color: Colors.text,
          }}
        >
          Monthly Overview
        </Text>
        <Text
          className={` text-2xl font-bold`}
          style={{
            color: Colors.text,
          }}
        >
          NRP: Total money earned
        </Text>
        <View>
          <Text
            className={` font-extralight `}
            style={{
              color: Colors.text,
            }}
          >
            Total Floors
          </Text>
          <Text
            className={` font-bold text-xl`}
            style={{
              color: Colors.text,
            }}
          >
            Numbers
          </Text>
        </View>
      </View>
    </View>
  );
}
