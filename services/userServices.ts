import { supabase } from "@/lib/supabase";
import { router } from "expo-router";
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

// oauth
export const signInWithOAuth = async (
  provider: "google" | "github" | "facebook",
) => {
  if (Platform.OS === "web") {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: "http://localhost:8081" },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }
  const redirectTo = "rent://";
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo, skipBrowserRedirect: true },
  });

  if (error) return { success: false, error: error.message };
  console.log(redirectTo);

  if (data?.url) {
    const result = await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
    console.log("result type:", result.type);
    console.log("result:", JSON.stringify(result));

    if (result.type === "success" && result.url) {
      const hash = result.url.split("#")[1];
      const params = new URLSearchParams(hash);
      const access_token = params.get("access_token");
      const refresh_token = params.get("refresh_token");

      console.log("access_token:", access_token);
      console.log("refresh_token:", refresh_token);

      if (access_token && refresh_token) {
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });
        console.log("setSession error:", error);
        if (!error) {
          router.replace("/(tabs)");
        }
      }
      console.log("setSession error:", error);
    }
  }

  return { success: true };
};
