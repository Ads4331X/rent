import { supabase } from "@/lib/supabase";

export const createFloor = async (name: string) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return { success: false, error: "Not logged in" };

  const { error } = await supabase
    .from("floors")
    .insert({ name, owner_id: session.user.id });

  if (error) {
    // Make the error message user friendly
    if (error.code === "23505")
      return { success: false, error: "A floor with this name already exists" };
    return { success: false, error: error.message };
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

export const deleteFloor = async (id: number) => {
  const { data, error } = await supabase.from("floors").delete().eq("id", id);
  if (error) return { success: false, error: error.message, data: [] };
  return {
    success: true,
    data: data,
  };
};

export const getFloorDetailWithId = async (floorID: any) => {
  const currentMonth = new Date().toISOString().slice(0, 7) + "-01"; // "2026-05-01"

  const { data, error } = await supabase
    .from("floors")
    .select(
      `name, bills (month, status, bill_items (name, quantity, rate), payments (amount_paid))`,
    )
    .eq("id", floorID)
    .eq("bills.month", currentMonth) // ← only current month's bill
    .single();

  if (error) return { success: false, error: error.message, data: null };

  const bill = data.bills[0] ?? null;
  const totalBilled =
    bill?.bill_items.reduce(
      (s: number, i: any) => s + i.quantity * i.rate,
      0,
    ) ?? 0;
  const totalPaid =
    bill?.payments.reduce((s: number, p: any) => s + p.amount_paid, 0) ?? 0;

  return {
    success: true,
    data: {
      name: data.name,
      status: bill?.status ?? "no bill",
      month: bill?.month ?? null,
      totalBilled,
      totalPaid,
      remaining: totalBilled - totalPaid,
      billItems: bill?.bill_items ?? [],
      payments: bill?.payments ?? [],
    },
  };
};
