import { supabase } from "@/lib/supabase";

/* -------------------------
   CREATE / UPDATE PROFILE
-------------------------- */
type CreateProfileParams = {
  userId: string;
  username: string;
  email: string;
};

export const createUserProfile = async ({
  userId,
  username,
  email,
}: CreateProfileParams) => {
  if (!userId) {
    return { success: false, error: "userId is required" };
  }

  const { data: existing } = await supabase
    .from("users")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("users")
      .update({ username, email })
      .eq("id", userId);

    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase.from("users").insert({
      id: userId,
      username,
      email,
    });

    if (error) return { success: false, error: error.message };
  }

  return { success: true };
};

/* -------------------------
   GET PROFILE
-------------------------- */
export const getUserProfile = async (userId: string) => {
  if (!userId) {
    return { success: false, error: "userId is required" };
  }

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) return { success: false, error: error.message };

  return { success: true, data };
};
