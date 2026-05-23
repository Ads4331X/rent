import { supabase } from "@/lib/supabase";

export const createFloor = async (name: string) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  const owner_id = session?.user.id;
  const { data: existing } = await supabase
    .from("floors")
    .select("name")
    .eq("name", name)
    .eq("owner_id", owner_id)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("floors")
      .update({ name })
      .eq("name", name)
      .eq("owner_id", owner_id);

    if (error) return { success: false, error: error.message };
  } else {
    const { error } = await supabase.from("floors").insert({
      name,
      owner_id,
    });

    if (error) return { success: false, error: error.message };
  }

  return { success: true, error: "" };
};
