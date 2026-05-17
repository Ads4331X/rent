import { Colors, OtherLogin } from "@/constants/theme";
import { signInWithOAuth } from "@/services/userServices";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { Pressable, View } from "react-native";

export function OtherLoginMethods() {
  return (
    <View className="flex-row justify-center gap-4">
      {/* google */}
      <Pressable
        onPress={() => signInWithOAuth("google")}
        className={OtherLogin.socialButton}
      >
        <AntDesign name="google" size={22} color={Colors.text} />
      </Pressable>
      {/* facebook */}
      <Pressable
        onPress={() => signInWithOAuth("facebook")}
        className={OtherLogin.socialButton}
      >
        <Entypo name="facebook" size={22} color={Colors.text} />
      </Pressable>
      {/* github */}
      <Pressable
        onPress={() => signInWithOAuth("github")}
        className={OtherLogin.socialButton}
      >
        <AntDesign name="github" size={22} color={Colors.text} />
      </Pressable>
    </View>
  );
}
