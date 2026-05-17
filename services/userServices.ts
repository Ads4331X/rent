import { supabase } from "@/lib/supabase";

// create

type createUserDetails = {
  username: string;
  email: string;
  password: string;
};

export const createUserProfile = async ({
  username,
  email,
  password,
}: createUserDetails) => {
  const { error } = await supabase.from("users").insert({
    username: username,
    email: email,
    password: password,
    created_at: new Date(),
  });
  if (error) return { success: false, error: error.message };
  return { success: true };
};

// get user getUserProfile

type getUserDetails = {
  email: string;
  password: string;
};
export const getUserProfile = async ({ email, password }: getUserDetails) => {
  const { data, error } = await supabase
    .from("users")
    .select("email , password")
    .eq("email", email)
    .eq("password", password);

  if (error) return { success: false, error: error.message };
  if (!data || data.length === 0) {
    return { success: false, error: "Invalid credentials" };
  }
  return {
    success: true,
    data,
  };
};
