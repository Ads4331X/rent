import { supabase } from "@/lib/supabase";
import { router, Stack, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import "../global.css";

export default function RootLayout() {
  const [session, setSession] = useState<any>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const segments = useSegments();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsInitializing(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (isInitializing) return;

    // segments[0] will be "auth" if in /auth/Login
    // segments[0] will be "(tabs)" if in the tab bar area
    // segments[0] will be undefined if at the root "/"
    const inAuthGroup = segments[0] === "auth";
    const inTabsGroup = segments[0] === "(tabs)";

    if (!session && !inAuthGroup) {
      // If not logged in and not in auth screens, force to Login
      router.replace("/auth/Login");
    } else if (session && inAuthGroup) {
      // If logged in and trying to access auth screens, force to Dashboard
    } else if (session && (inAuthGroup || !inTabsGroup)) {
      // If logged in and in auth group or just at root, force to Tabs
      router.replace("/(tabs)");
    }
  }, [session, isInitializing, segments]);

  if (isInitializing) return null; // Or a splash screen/loading indicator

  return <Stack screenOptions={{ headerShown: false }} />;
}
