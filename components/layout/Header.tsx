import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";

export default function Header() {
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    const getUsername = async () => {
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
    <View className="flex-row justify-between items-center px-3 border-b-slate-500 border-b-2">
      <View
        className="flex justify-center items-center
         flex-row gap-5 p-5 "
      >
        {profilePic && (
          <Image
            className="float-start flex justify-start items-center p-2 rounded-full size-7"
            source={{
              uri: profilePic,
            }}
          />
        )}
        <Text className="color-red-400">Hi {username}</Text>
      </View>
      <Pressable
        className=" bg-red-500 w-fit rounded-lg p-2"
        onPress={() => supabase.auth.signOut()}
      >
        <Text className="text-white ">Logout</Text>
      </Pressable>
    </View>
  );
}
