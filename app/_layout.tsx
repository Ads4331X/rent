import { supabase } from "@/lib/supabase";
import { router, Stack } from "expo-router";
import { useEffect } from "react";
import "../global.css";

export default function RootLayout() {
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        router.replace("/Dashboard");
      } else {
        router.replace("/auth/Login");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return <Stack screenOptions={{ headerShown: false }} />;
}
