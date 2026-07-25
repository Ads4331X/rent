import { supabase } from "@/lib/supabase";

type FloorDefaults = {
  rent: number;
  water: number;
  garbage: number;
  electricityRate: number;
};

export const createFloor = async (name: string, defaults: FloorDefaults) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (!session) return { success: false, error: "Not logged in" };

  // 1. Create the floor, and get its id back so we can attach defaults to it.
  const { data: floor, error: floorError } = await supabase
    .from("floors")
    .insert({ name, owner_id: session.user.id })
    .select("id")
    .single();

  if (floorError) {
    if (floorError.code === "23505")
      return {
        success: false,
        error: "A floor with this name already exists",
      };
    return { success: false, error: floorError.message };
  }

  // 2. Attach the default values the user set in the "Add Floor" form.
  const { error: defaultsError } = await supabase
    .from("floor_defaults")
    .insert({
      floor_id: floor.id,
      rent: defaults.rent,
      water: defaults.water,
      garbage: defaults.garbage,
      electricity_rate: defaults.electricityRate,
    });

  if (defaultsError) {
    // Floor was created but defaults failed to save — clean up so we don't
    // leave a floor with no defaults row behind.
    await supabase.from("floors").delete().eq("id", floor.id);
    return { success: false, error: defaultsError.message };
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

  const transformed = data.map((floor) => {
    const bill = floor.bills[0] ?? null;
    const totalBilled =
      bill?.bill_items.reduce((s: number, i: any) => s + Number(i.amount), 0) ??
      0;
    const totalPaid =
      bill?.payments.reduce(
        (s: number, p: any) => s + Number(p.amount_paid),
        0,
      ) ?? 0;

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
  const { data, error } = await supabase
    .from("floors")
    .select(
      `name, bills (id, month, status, bill_items (name, quantity, rate), payments (amount_paid))`,
    )
    .eq("id", floorID)
    .single();

  if (error) return { success: false, error: error.message, data: null };

  const bill = data.bills?.length
    ? [...data.bills].sort((a: any, b: any) =>
        b.month.localeCompare(a.month),
      )[0]
    : null;

  const totalBilled =
    bill?.bill_items.reduce(
      (s: number, i: any) => s + Number(i.quantity) * Number(i.rate),
      0,
    ) ?? 0;
  const totalPaid =
    bill?.payments.reduce(
      (s: number, p: any) => s + Number(p.amount_paid),
      0,
    ) ?? 0;

  return {
    success: true,
    data: {
      id: bill?.id ?? null,
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

export const updateFloorDetails = async (
  floorId: any,
  form: Record<string, string | number>,
  billId: number | null,
) => {
  // 1. Update floor name
  const { error: nameError } = await supabase
    .from("floors")
    .update({ name: form.floorName })
    .eq("id", floorId);

  if (nameError) return { success: false, error: nameError.message };

  // 2. Upsert floor_defaults (the standard values)
  const { error: defaultsError } = await supabase
    .from("floor_defaults")
    .upsert({
      floor_id: floorId,
      rent: Number(form.rent),
      water: Number(form.water),
      garbage: Number(form.garbage),
      electricity_rate: Number(form.electricityRate),
      updated_at: new Date().toISOString(),
    });

  if (defaultsError) return { success: false, error: defaultsError.message };

  // 3. If a current bill exists, ensure the standard bill_items rows exist
  //    (and update them) using upsert.
  if (billId) {
    const items = [
      {
        bill_id: billId,
        name: "Rent",
        quantity: 1,
        rate: Number(form.rent),
      },
      {
        bill_id: billId,
        name: "Water",
        quantity: 1,
        rate: Number(form.water),
      },
      {
        bill_id: billId,
        name: "Garbage",
        quantity: 1,
        rate: Number(form.garbage),
      },
      {
        bill_id: billId,
        name: "Electricity Units",
        quantity: Number(form.electricityUnit),
        rate: Number(form.electricityRate),
      },
    ];

    // No unique constraint on (bill_id, name) => use delete+insert to ensure
    // the standard items always exist for the bill.
    const { error: deleteError } = await supabase
      .from("bill_items")
      .delete()
      .eq("bill_id", billId);

    if (deleteError) return { success: false, error: deleteError.message };

    const { error: insertError } = await supabase
      .from("bill_items")
      .insert(items);

    if (insertError) return { success: false, error: insertError.message };
  }

  return { success: true };
};

export const addPayment = async (
  billId: number,
  amount: number,
  totalBilled: number,
  currentTotalPaid: number,
) => {
  if (!billId) return { success: false, error: "No bill found" };
  if (!amount || amount <= 0)
    return { success: false, error: "Enter a valid amount" };

  const { error: insertError } = await supabase
    .from("payments")
    .insert({ bill_id: billId, amount_paid: amount });

  if (insertError) return { success: false, error: insertError.message };

  // If this payment covers the remaining balance, mark bill as paid
  const newTotalPaid = currentTotalPaid + amount;
  if (newTotalPaid >= totalBilled) {
    const { error: updateError } = await supabase
      .from("bills")
      .update({ status: "paid" })
      .eq("id", billId);

    if (updateError) return { success: false, error: updateError.message };
  }

  return { success: true };
};
