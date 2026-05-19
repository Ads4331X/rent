import { supabase } from "@/lib/supabase";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { Platform } from "react-native";

// Types
type createUserDetails = {
  username: string;
  email: string;
  password: string;
};

type loginUserDetails = {
  email: string;
  password: string;
};

// IMPORTANT: must be called at module level so the in-app browser
// can complete the OAuth session on mobile
WebBrowser.maybeCompleteAuthSession();

// Create user
export const createUserProfile = async ({
  username,
  email,
  password,
}: createUserDetails) => {
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) return { success: false, error: error.message };

  const { error: profileError } = await supabase.from("users").insert({
    id: data.user?.id,
    username,
    email,
  });

  if (profileError) return { success: false, error: profileError.message };

  return { success: true };
};

// Login user
export const loginUser = async ({ email, password }: loginUserDetails) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { success: false, error: error.message };
  return { success: true, data };
};

// Get user profile
export const getUserProfile = async (email: string) => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error) return { success: false, error: error.message };
  return { success: true, data };
};

export const signInWithOAuth = async (
  provider: "google" | "github" | "facebook",
) => {
  // On web, use the current origin so it works in both dev and prod.
  // On mobile, create a deep-link that Expo can intercept.
  const redirectTo =
    Platform.OS === "web"
      ? window.location.origin + "/"
      : Linking.createURL("/");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo,
      // skipBrowserRedirect must be true on mobile so we can open the URL
      // ourselves via WebBrowser and then manually grab the session below.
      skipBrowserRedirect: Platform.OS !== "web",
    },
  });

  if (error) return { success: false, error: error.message };

  // --- Mobile only ---
  // Open the OAuth URL in an in-app browser and wait for it to redirect back.
  if (Platform.OS !== "web" && data?.url) {
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

    // The browser returned a redirect URL — extract the tokens from it and
    // hand them to Supabase so the session is stored locally.
    if (result.type === "success" && result.url) {
      // Parse query params and hash fragment manually — Linking.parse()
      // doesn't expose `params` or `errorCode` in current Expo versions.
      const url = new URL(result.url);

      // Supabase can return tokens in EITHER the hash fragment (implicit flow)
      // OR as query params (PKCE flow). Check both.
      const hash = new URLSearchParams(url.hash.replace("#", ""));
      const query = url.searchParams;

      const accessToken = hash.get("access_token") ?? query.get("access_token");
      const refreshToken =
        hash.get("refresh_token") ?? query.get("refresh_token");
      const code = query.get("code");
      const errorCode = hash.get("error") ?? query.get("error");

      if (errorCode) return { success: false, error: errorCode };

      if (accessToken && refreshToken) {
        // Implicit flow — set the session directly from tokens
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (sessionError)
          return { success: false, error: sessionError.message };
      } else if (code) {
        // PKCE flow (GitHub etc.) — exchange the code for a session
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError)
          return { success: false, error: exchangeError.message };
      }
    } else if (result.type === "cancel" || result.type === "dismiss") {
      return { success: false, error: "OAuth flow was cancelled" };
    }
  }

  // The _layout.tsx onAuthStateChange listener will fire automatically
  // once the session is set, routing the user to /(tabs).
  return { success: true };
};
