import { supabase } from "@/lib/supabase";

// create

type userDetails = {
  username: string;
  email: string;
  password: string;
};

export const createUserProfile = async ({
  username,
  email,
  password,
}: userDetails) => {
  const { data, error } = await supabase.from("users").insert({
    username: username,
    email: email,
    password: password,
    created_at: new Date(),
  });
  if (error) return { success: false, error: error.message };
  else return { success: true };
};
