import { supabase } from "@/lib/supabase";
import { router, Stack, useSegments } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import "../global.css";

export default function RootLayout() {
  const [session, setSession] = useState<any>(undefined); // undefined = not yet known
  const segments = useSegments();
  const hasNavigated = useRef(false);

  useEffect(() => {
    let mounted = true;

    // onAuthStateChange fires for EVERY auth event including the initial
    // session load AND after OAuth tokens are exchanged. Relying solely on
    // this (instead of getSession + this) means we always wait for the
    // definitive state rather than racing against token exchange.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;
      setSession(newSession);
    });

    // getSession covers the case where the user is already logged in and
    // onAuthStateChange won't fire at all (no event to trigger it).
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      // Only set session from getSession if onAuthStateChange hasn't already
      // provided a value (undefined means nothing has fired yet).
      setSession((prev: any) => (prev === undefined ? data.session : prev));
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // session === undefined means we haven't heard back from Supabase yet
    if (session === undefined) return;

    // Prevent double-navigating (e.g. getSession + onAuthStateChange both fire)
    if (hasNavigated.current) return;

    const inAuth = segments[0] === "auth";

    if (!session && !inAuth) {
      hasNavigated.current = true;
      router.replace("/auth/Login");
      return;
    }

    if (session && inAuth) {
      hasNavigated.current = true;
      router.replace("/(tabs)");
      return;
    }
  }, [session, segments]);

  // Reset navigation guard whenever session actually changes (login/logout)
  useEffect(() => {
    if (session !== undefined) hasNavigated.current = false;
  }, [session]);

  // Render nothing until we know the auth state — no flash possible
  if (session === undefined) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
    </GestureHandlerRootView>
  );
}
