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
  if (Platform.OS !== "web" && data?.url) {
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);

    if (result.type === "cancel" || result.type === "dismiss") {
      return { success: false, error: "OAuth flow was cancelled" };
    }

    if (result.type === "success" && result.url) {
      const url = new URL(result.url);
      const hash = new URLSearchParams(url.hash.replace("#", ""));
      const query = url.searchParams;

      const accessToken = hash.get("access_token") ?? query.get("access_token");
      const refreshToken =
        hash.get("refresh_token") ?? query.get("refresh_token");
      const code = query.get("code");
      const errorCode = hash.get("error") ?? query.get("error");

      if (errorCode) return { success: false, error: errorCode };

      // Set the session and wait for it to be confirmed before returning.
      // This ensures _layout.tsx onAuthStateChange has fired and session
      // state is updated before the caller does anything.
      await new Promise<void>((resolve, reject) => {
        // Listen for the SIGNED_IN event that fires after setSession/exchangeCodeForSession
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((event) => {
          if (event === "SIGNED_IN") {
            subscription.unsubscribe();
            resolve();
          }
        });

        // Trigger the session — SIGNED_IN will fire once this completes
        const settle = async () => {
          if (accessToken && refreshToken) {
            const { error } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken,
            });
            if (error) {
              subscription.unsubscribe();
              reject(error);
            }
          } else if (code) {
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            if (error) {
              subscription.unsubscribe();
              reject(error);
            }
          } else {
            subscription.unsubscribe();
            reject(new Error("No tokens or code found in redirect URL"));
          }
        };

        settle();

        // Safety net — don't hang forever
        setTimeout(() => {
          subscription.unsubscribe();
          resolve();
        }, 5000);
      });
    }
  }

  return { success: true };
};
