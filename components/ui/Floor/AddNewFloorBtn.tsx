import { Colors } from "@/constants/theme";
import { createFloor } from "@/services/floorServices";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

// Fixed control height so stepper buttons stay a normal tap-size
// regardless of how wide their flex container is (mobile OR web) —
// the sheet content itself now stretches full-width on web.
const STEP_BTN_HEIGHT = 40;

type Props = {
  onFloorAdded: () => void;
};

type FieldKey =
  | "defaultRent"
  | "defaultWater"
  | "defaultGarbage"
  | "defaultElectricityUnit";

// ----- Reusable counter row for default values -----
type CounterRowProps = {
  label: string;
  value: number;
  onChange: (val: number) => void;
  step: number;
  icon: React.ComponentProps<typeof Feather>["name"];
  color: string;
  bg: string;
  error?: string;
  suffix?: string;
};

function CounterRow({
  label,
  value,
  onChange,
  step,
  icon,
  color,
  bg,
  error,
  suffix,
}: CounterRowProps) {
  const dec = () => onChange(Math.max(0, value - step));
  const inc = () => onChange(value + step);

  return (
    <View
      className="bg-slate-900 rounded-xl border p-3 mb-3 w-full"
      style={{ borderColor: error ? "#f87171" : "#334155" }}
    >
      {/* icon + label + current value */}
      <View className="flex-row items-center mb-2.5">
        <View
          className="rounded-lg p-2 items-center justify-center"
          style={{ backgroundColor: bg }}
        >
          <Feather name={icon} size={14} color={color} />
        </View>
        <Text
          className="text-slate-300 text-sm font-medium ml-2 flex-1"
          numberOfLines={1}
        >
          {label}
        </Text>
        <Text className="text-slate-500 text-xs" numberOfLines={1}>
          {value}
          {suffix ?? ""}
        </Text>
      </View>

      {/* stepper — width flexes with the row, height is fixed so
          buttons stay tap-sized on both a narrow phone and a wide
          web viewport (an aspect-ratio here would blow buttons up
          on wide containers) */}
      <View
        className="flex-row items-center"
        style={{ gap: 8, height: STEP_BTN_HEIGHT }}
      >
        <Pressable
          onPress={dec}
          className="bg-slate-800 rounded-lg items-center justify-center active:opacity-70"
          style={{ flex: 1, height: STEP_BTN_HEIGHT, maxWidth: 56 }}
        >
          <Feather name="minus" size={16} color="#94a3b8" />
        </Pressable>

        <View
          className="bg-slate-950 rounded-lg items-center justify-center"
          style={{ flex: 2, height: STEP_BTN_HEIGHT }}
        >
          <TextInput
            value={String(value)}
            onChangeText={(t) => {
              const n = Number(t.replace(/[^0-9]/g, ""));
              onChange(isNaN(n) ? 0 : n);
            }}
            keyboardType="numeric"
            className="text-slate-100 text-sm text-center font-semibold w-full"
          />
        </View>

        <Pressable
          onPress={inc}
          className="bg-slate-800 rounded-lg items-center justify-center active:opacity-70"
          style={{ flex: 1, height: STEP_BTN_HEIGHT, maxWidth: 56 }}
        >
          <Feather name="plus" size={16} color="#94a3b8" />
        </Pressable>
      </View>

      {error ? (
        <Text className="text-red-400 text-xs mt-1.5 ml-1">{error}</Text>
      ) : null}
    </View>
  );
}

export default function AddNewFloorBtn({ onFloorAdded }: Props) {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const openSheet = useCallback(() => bottomSheetRef.current?.expand(), []);
  const closeSheet = useCallback(() => bottomSheetRef.current?.close(), []);

  const [floorName, setFloorName] = useState<string>("");
  const defaultValues = {
    defaultRent: 10000,
    defaultWater: 100,
    defaultGarbage: 200,
    defaultElectricityUnit: 1,
  };
  const [defaultValErrors, setDefaultValErrors] = useState({
    rentError: "",
    waterError: "",
    garbageError: "",
    electricityRateError: "",
  });
  const [form, setForm] = useState(defaultValues);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fieldErrorKey: Record<FieldKey, keyof typeof defaultValErrors> = {
    defaultRent: "rentError",
    defaultWater: "waterError",
    defaultGarbage: "garbageError",
    defaultElectricityUnit: "electricityRateError",
  };

  const handleChange = (field: FieldKey, val: number) => {
    const errorKey = fieldErrorKey[field];

    if (typeof val === "number" && isNaN(val)) {
      setDefaultValErrors((prev) => ({
        ...prev,
        [errorKey]: "Please Enter Numeric Value",
      }));
      return;
    }

    // valid value — clear any previous error for this field
    setDefaultValErrors((prev) => ({
      ...prev,
      [errorKey]: "",
    }));
    setForm((prev) => ({ ...prev, [field]: val }));
  };

  const handleAdd = async () => {
    if (!floorName.trim()) {
      setError("Floor name is required");
      return;
    }
    setError("");
    setLoading(true);
    const res = await createFloor(floorName, {
      rent: form.defaultRent,
      water: form.defaultWater,
      garbage: form.defaultGarbage,
      electricityRate: form.defaultElectricityUnit,
    });
    setLoading(false);

    if (!res.success) {
      setError(res.error ?? "Something went wrong");
      return;
    }

    setFloorName("");
    closeSheet();
    onFloorAdded();
  };

  return (
    <>
      {/* Floating + button */}
      <Pressable
        onPress={openSheet}
        style={{ backgroundColor: Colors.primary }}
        className="rounded-full p-4 m-2 items-center justify-center absolute bottom-0 right-0"
      >
        <Entypo name="plus" size={30} color="white" />
      </Pressable>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["70%"]}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: "#1e293b" }}
        handleIndicatorStyle={{ backgroundColor: "#475569" }}
      >
        <BottomSheetScrollView
          className="flex-1"
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingTop: 8,
            paddingBottom: 32,
          }}
          showsVerticalScrollIndicator={false}
        >
          {/* Sheet header */}
          <View className="flex-row items-center justify-between gap-2 mb-6">
            <View className="flex-row items-center justify-center gap-2">
              <View className="bg-rose-500/20 rounded-xl p-2">
                <Feather name="layers" size={18} color="#f43f5e" />
              </View>
              <View className="p-2 mb-2">
                <Text className="text-slate-100 font-bold text-base">
                  Add New Floor
                </Text>
                <Text className="text-slate-500 text-xs">
                  Give your floor a unique name
                </Text>
              </View>
            </View>
            <Pressable onPress={closeSheet} className="p-1 text-xl">
              <Feather name="x" size={26} color="#64748b" />
            </Pressable>
          </View>

          {/* Floor name input row */}
          <View className="flex-row gap-2 items-center justify-between mb-6">
            <View
              className="flex-1 flex-row items-center gap-2 bg-slate-900 rounded-xl px-3 border"
              style={{
                height: 48,
                borderColor: error ? "#f87171" : "#334155",
              }}
            >
              <Feather name="home" size={16} color="#64748b" />
              <TextInput
                value={floorName}
                onChangeText={(t) => {
                  setFloorName(t);
                  if (error) setError("");
                }}
                placeholder="e.g. Ground Floor, Floor 2"
                placeholderTextColor="#475569"
                className="flex-1 text-slate-100 text-sm"
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            <Pressable
              onPress={handleAdd}
              disabled={loading}
              className="bg-rose-600 rounded-xl items-center justify-center active:opacity-75 disabled:opacity-50"
              style={{ width: 48, height: 48 }}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Feather name="plus" size={24} color="white" />
              )}
            </Pressable>
          </View>

          {!!error && (
            <Text className="text-red-400 text-xs -mt-4 mb-4 ml-1">
              {error}
            </Text>
          )}

          {/* Default values */}
          <Text className="text-slate-400 text-xs font-semibold uppercase mb-3 ml-1">
            Default Values
          </Text>

          <CounterRow
            label="Rent"
            value={form.defaultRent}
            onChange={(v) => handleChange("defaultRent", v)}
            step={1000}
            icon="home"
            color="#f43f5e"
            bg="rgba(244,63,94,0.15)"
            error={defaultValErrors.rentError}
          />

          <CounterRow
            label="Water"
            value={form.defaultWater}
            onChange={(v) => handleChange("defaultWater", v)}
            step={50}
            icon="droplet"
            color="#38bdf8"
            bg="rgba(56,189,248,0.15)"
            error={defaultValErrors.waterError}
          />

          <CounterRow
            label="Electricity"
            value={form.defaultElectricityUnit}
            onChange={(v) => handleChange("defaultElectricityUnit", v)}
            step={1}
            icon="zap"
            color="#fbbf24"
            bg="rgba(251,191,36,0.15)"
            error={defaultValErrors.electricityRateError}
            suffix="/unit"
          />

          <CounterRow
            label="Garbage"
            value={form.defaultGarbage}
            onChange={(v) => handleChange("defaultGarbage", v)}
            step={50}
            icon="trash-2"
            color="#34d399"
            bg="rgba(52,211,153,0.15)"
            error={defaultValErrors.garbageError}
          />
        </BottomSheetScrollView>
      </BottomSheet>
    </>
  );
}
