import { supabase } from "@/lib/supabase";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

WebBrowser.maybeCompleteAuthSession();

export const loginUser = async ({ email, password }: any) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
};

export const signUpUser = async ({ email, password }: any) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
};

export const signInWithOAuth = async (
  provider: "google" | "github" | "facebook",
) => {
  if (Platform.OS === "web") {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: window.location.origin + "/" },
    });
    if (error) return { success: false, error: error.message };
    return { success: true, data };
  }

  const redirectTo = Linking.createURL("/");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      skipBrowserRedirect: true,
    },
  });

  if (error) return { success: false, error: error.message };
  if (!data.url) return { success: false, error: "No OAuth URL returned" };

  const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

  if (result.type !== "success") {
    return { success: false, error: "Browser was closed or cancelled" };
  }

  // Supabase returns tokens in the hash fragment: rent://#access_token=...&refresh_token=...
  // Linking.parse does NOT handle hash fragments, so we parse manually
  const rawUrl = result.url;
  const fragment = rawUrl.includes("#")
    ? rawUrl.split("#")[1]
    : (rawUrl.split("?")[1] ?? "");

  const params = Object.fromEntries(new URLSearchParams(fragment));

  if (!params.access_token || !params.refresh_token) {
    return { success: false, error: "No tokens in redirect URL" };
  }

  const { error: sessionError } = await supabase.auth.setSession({
    access_token: params.access_token,
    refresh_token: params.refresh_token,
  });

  if (sessionError) return { success: false, error: sessionError.message };

  // setSession succeeded → onAuthStateChange in _layout.tsx fires → router.replace("/(tabs)")
  return { success: true, data };
};
