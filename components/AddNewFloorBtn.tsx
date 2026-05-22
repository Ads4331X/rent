import { Colors } from "@/constants/theme";
import Entypo from "@expo/vector-icons/Entypo";

import { Pressable } from "react-native";
export default function AddNewFloorBtn() {
  return (
    <Pressable
      style={{ backgroundColor: Colors.primary }}
      className="w-min
      rounded-full p-2 m-2 items-center justify-center flex absolute bottom-0 right-0  "
    >
      <Entypo name="plus" size={30} color="white" />
    </Pressable>
  );
}
