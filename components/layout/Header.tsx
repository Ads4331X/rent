import { supabase } from "@/lib/supabase";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";

export default function Header() {
  const [username, setUsername] = useState("");
  const [profilePic, setProfilePic] = useState<string | null>(null);

  useEffect(() => {
    const getUserInfo = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const metadata = session.user.user_metadata;

      // OAuth users (Google, GitHub, Facebook) have these in metadata
      if (metadata?.user_name || metadata?.full_name) {
        setUsername(metadata.user_name ?? metadata.full_name);
        setProfilePic(metadata.avatar_url ?? null);
        return;
      }

      // Email/password users — fetch from public.users table
      const { data, error } = await supabase
        .from("users")
        .select("username")
        .eq("id", session.user.id)
        .single();

      if (!error && data?.username) {
        setUsername(data.username);
      }
    };

    getUserInfo();
  }, []);

  return (
    <View className="flex-row justify-between items-center px-3 border-b-slate-500 border-b-2">
      <View className="flex justify-center items-center flex-row gap-5 p-5">
        {profilePic ? (
          <Image
            style={{ width: 28, height: 28, borderRadius: 14 }}
            source={{ uri: profilePic }}
            cachePolicy="memory-disk"
          />
        ) : (
          // Fallback avatar for email/password users
          <View className="rounded-full bg-rose-500 w-7 h-7 items-center justify-center">
            <Text className="text-white text-xs font-bold">
              {username ? username[0].toUpperCase() : "?"}
            </Text>
          </View>
        )}
        <Text className="color-red-400">Hi {username || "there"}</Text>
      </View>
      <Pressable
        className="bg-red-500 rounded-lg p-2"
        onPress={() => supabase.auth.signOut()}
      >
        <Text className="text-white">Logout</Text>
      </Pressable>
    </View>
  );
}
