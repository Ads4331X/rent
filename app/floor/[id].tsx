import { Colors } from "@/constants/theme";
import { getFloorDetailWithId } from "@/services/floorServices";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
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

  const fetchDetails = async () => {
    const res = await getFloorDetailWithId(id);
    console.log(res);

    if (res.success) {
      const data = {
        floorName: res.data?.name || "",

        rent: res.data?.billItems.find((i) => i.name === "Rent")?.rate || 0,

        electricityRate:
          res.data?.billItems.find((i) => i.name === "Electricity")?.rate || 0,

        electricityUnit:
          res.data?.billItems.find((i) => i.name === "Electricity")?.quantity ||
          0,

        water: res.data?.billItems.find((i) => i.name === "Water")?.rate || 0,

        garbage:
          res.data?.billItems.find((i) => i.name === "Garbage")?.rate || 0,
      };
      console.log(data);
      setForm(data);
    }
  };
  fetchDetails();

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <SafeAreaView
      className="w-full h-full"
      style={{ backgroundColor: Colors.background }}
    >
      <FloorDetails
        floorId={String(id)}
        editable={isEdit}
        form={form}
        onChange={handleChange}
      />
    </SafeAreaView>
  );
}
