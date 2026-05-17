import { supabase } from "@/lib/supabase";

// sign with oauth
import { Platform } from "react-native";

import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

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

  const redirectTo = Linking.createURL("/");
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: { redirectTo, skipBrowserRedirect: true },
  });

  if (error) return { success: false, error: error.message };

  if (data?.url) {
    await WebBrowser.openAuthSessionAsync(data.url, redirectTo);
  }

  return { success: true };
};
