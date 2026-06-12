import { Colors } from "@/constants/theme";
import {
  addPayment,
  getFloorDetailWithId,
  updateFloorDetails,
} from "@/services/floorServices";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FloorDetails from "./FloorDetails";

export default function Page() {
  const { id, edit } = useLocalSearchParams();
  const isEdit = edit === "true";

  const [form, setForm] = useState({
    floorName: "",
    rent: 0,
    electricityRate: 0,
    electricityUnit: 0,
    water: 0,
    garbage: 0,
  });
  const [billMonth, setBillMonth] = useState<string | null>(null);
  const [billId, setBillId] = useState<number | null>(null);
  const [totalBilled, setTotalBilled] = useState(0);
  const [totalPaid, setTotalPaid] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fetchDetails = async () => {
    const res = await getFloorDetailWithId(id);

    if (res.success) {
      const data = {
        floorName: res.data?.name || "",

        rent: res.data?.billItems.find((i) => i.name === "Rent")?.rate || 0,

        electricityRate:
          res.data?.billItems.find((i) => i.name === "Electricity Units")
            ?.rate || 0,

        electricityUnit:
          res.data?.billItems.find((i) => i.name === "Electricity Units")
            ?.quantity || 0,

        water: res.data?.billItems.find((i) => i.name === "Water")?.rate || 0,

        garbage:
          res.data?.billItems.find((i) => i.name === "Garbage")?.rate || 0,
      };

      setForm(data);
      setBillMonth(res.data?.month ?? null);
      setBillId(res.data?.id ?? null);
      setTotalBilled(res.data?.totalBilled ?? 0);
      setTotalPaid(res.data?.totalPaid ?? 0);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setError("");

    const res = await updateFloorDetails(id, form, billId);

    setSaving(false);

    if (!res.success) {
      setError(res.error ?? "Failed to save");
      return;
    }

    await fetchDetails();
    router.replace(`/floor/${id}` as any);
  };

  const handleAddPayment = async (amount: number) => {
    if (!billId) {
      setError("No bill found for this month yet");
      return;
    }
    setError("");

    const res = await addPayment(billId, amount, totalBilled, totalPaid);

    if (!res.success) {
      setError(res.error ?? "Failed to record payment");
      return;
    }

    await fetchDetails();
  };

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: Colors.background }}
    >
      <FloorDetails
        floorId={String(id)}
        editable={isEdit}
        form={form}
        onChange={handleChange}
        onSave={handleSave}
        onAddPayment={handleAddPayment}
        saving={saving}
        month={billMonth}
        totalBilled={totalBilled}
        totalPaid={totalPaid}
      />
      {!!error && (
        <Text className="text-red-500 text-center px-4 pb-4">{error}</Text>
      )}
    </SafeAreaView>
  );
}
