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

export const getFloorWithBills = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return { success: false, error: "Not logged in", data: [] };

  const { data, error } = await supabase
    .from("floors")
    .select(`*, bills (*, bill_items (*), payments (*))`)
    .eq("owner_id", session.user.id)
    .order("created_at", { ascending: true });

  if (error) return { success: false, error: error.message, data: [] };

  // Transform so UI never has to deal with nested arrays
  const transformed = data.map((floor) => {
    const bill = floor.bills[0] ?? null;
    const totalBilled =
      bill?.bill_items.reduce((s: number, i: any) => s + i.amount, 0) ?? 0;
    const totalPaid =
      bill?.payments.reduce((s: number, p: any) => s + p.amount_paid, 0) ?? 0;

    return {
      id: floor.id,
      name: floor.name,
      status: bill?.status ?? "no bill",
      totalBilled,
      totalPaid,
      remaining: totalBilled - totalPaid,
    };
  });

  return { success: true, data: transformed };
};
