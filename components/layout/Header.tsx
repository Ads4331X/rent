import { Colors } from "@/constants/theme";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Header() {
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState("");

  useEffect(() => {
    const getUsername = async () => {
      //   console.log(await supabase.auth.getSession());

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;
      const username = session.user.user_metadata.user_name;
      const profile_pic = session.user.user_metadata.avatar_url;
      setUsername(username);
      setProfilePic(profile_pic);
    };

    getUsername();
  }, []);

  return (
    <SafeAreaView
      className="flex-1 px-6 py-4"
      style={{ backgroundColor: Colors.background }}
    >
      <View className="flex-row justify-between items-center ">
        <View
          className="flex
         flex-row gap-5 p-5 "
        >
          <Image
            className="float-start flex justify-start items-center p-2 rounded-full size-7"
            source={{
              uri: profilePic,
            }}
          />
          <Text className="color-red-400">Hi {username}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
