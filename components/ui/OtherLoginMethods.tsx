import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { Pressable, View } from "react-native";
import { OtherLogin } from "../../constants/theme";

export function OtherLoginMethods() {
  return (
    <View className="flex-row justify-center gap-5">
      <Pressable className={OtherLogin.socialButton}>
        <AntDesign name="google" size={24} color="black" />
      </Pressable>

      <Pressable className={OtherLogin.socialButton}>
        <Entypo name="facebook" size={24} color="black" />
      </Pressable>

      <Pressable className={OtherLogin.socialButton}>
        <AntDesign name="github" size={24} color="black" />
      </Pressable>
    </View>
  );
}
