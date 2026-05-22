import { Colors, OtherLogin } from "@/constants/theme";
import { signInWithOAuth } from "@/services/authServices";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import { useState } from "react";
import { Pressable, View } from "react-native";

export function OtherLoginMethods() {
  const [loading, setLoading] = useState(false);

  const handleOAuth = async (provider: "google" | "github" | "facebook") => {
    if (loading) return;
    setLoading(true);
    await signInWithOAuth(provider);
    setLoading(false);
  };

  return (
    <View className="flex-row justify-center gap-4">
      <Pressable
        onPress={() => handleOAuth("google")}
        disabled={loading}
        className={OtherLogin.socialButton}
      >
        <AntDesign name="google" size={22} color={Colors.text} />
      </Pressable>
      <Pressable
        onPress={() => handleOAuth("facebook")}
        disabled={loading}
        className={OtherLogin.socialButton}
      >
        <Entypo name="facebook" size={22} color={Colors.text} />
      </Pressable>
      <Pressable
        onPress={() => handleOAuth("github")}
        disabled={loading}
        className={OtherLogin.socialButton}
      >
        <AntDesign name="github" size={22} color={Colors.text} />
      </Pressable>
    </View>
  );
}
