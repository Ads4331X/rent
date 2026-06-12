import { IconSymbol } from "@/components/ui/icon-symbol";
import AntDesign from "@expo/vector-icons/AntDesign";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

type Props = {
  floorId: string;
  editable: boolean;
  form: Record<string, string | number>;
  onChange: (key: string, value: string) => void;
  onSave?: () => void;
  onAddPayment?: (amount: number) => void;
  saving?: boolean;
  month?: string | null;
  totalBilled?: number;
  totalPaid?: number;
};

const FIELDS = [
  {
    key: "floorName",
    label: "Floor Name",
    description: "e.g. Ground Floor, 1st Floor",
    icon: "building.2.fill",
    placeholder: "Enter floor name",
    keyboard: "default",
  },
  {
    key: "rent",
    label: "Rent",
    description: "Monthly rent amount",
    icon: "dollarsign.circle.fill",
    placeholder: "0",
    keyboard: "numeric",
  },
  {
    key: "electricityRate",
    label: "Electricity Rate",
    description: "Rate per unit (NRS)",
    icon: "bolt.fill",
    placeholder: "0",
    keyboard: "numeric",
  },
  {
    key: "electricityUnit",
    label: "Electricity Units",
    description: "Units consumed this month",
    icon: "bolt.fill",
    placeholder: "0",
    keyboard: "numeric",
  },
  {
    key: "water",
    label: "Water",
    description: "Monthly water charge",
    icon: "drop.fill",
    placeholder: "0",
    keyboard: "numeric",
  },
  {
    key: "garbage",
    label: "Garbage Fee",
    description: "Monthly garbage collection fee",
    icon: "trash.fill",
    placeholder: "0",
    keyboard: "numeric",
  },
];

export default function FloorDetails({
  floorId,
  editable,
  form,
  onChange,
  onSave,
  onAddPayment,
  saving,
  month,
  totalBilled = 0,
  totalPaid = 0,
}: Props) {
  const [paymentAmount, setPaymentAmount] = useState("");

  const electricityTotal =
    Number(form.electricityRate || 0) * Number(form.electricityUnit || 0);

  const monthlyTotal =
    Number(form.rent || 0) +
    Number(form.water || 0) +
    Number(form.garbage || 0) +
    electricityTotal;

  const remaining = Math.max(totalBilled - totalPaid, 0);
  const isFullyPaid = totalBilled > 0 && totalPaid >= totalBilled;

  const handleAddPayment = () => {
    const amount = Number(paymentAmount);
    if (!amount || amount <= 0) return;
    onAddPayment?.(amount);
    setPaymentAmount("");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        className="flex-1 bg-slate-950"
        contentContainerStyle={{
          padding: 16,
          gap: 16,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => router.push("/")}>
          <AntDesign name="arrow-left" size={24} color="white" />
        </Pressable>

        {/* HEADER */}
        <View
          className={`rounded-3xl p-5 border-l-4 ${
            editable
              ? "bg-slate-800 border-l-blue-400"
              : "bg-slate-800 border-l-rose-500"
          }`}
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white text-2xl font-bold">
                {editable ? "Edit Floor Details" : "Floor Details"}
              </Text>

              <Text className="text-slate-400 text-xs mt-1">
                Floor ID: {floorId}
              </Text>

              <Text className="text-slate-400 text-xs mt-0.5">
                {month
                  ? new Date(month).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : "No bill for this month"}
              </Text>
            </View>

            <View
              className={`px-3 py-1 rounded-full ${
                isFullyPaid ? "bg-emerald-500/15" : "bg-rose-500/15"
              }`}
            >
              <Text
                className={`text-xs font-bold ${
                  isFullyPaid ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {isFullyPaid ? "PAID" : "PENDING"}
              </Text>
            </View>
          </View>
        </View>

        {/* FIELDS */}
        {FIELDS.map((field) => (
          <View
            key={field.key}
            className={`rounded-3xl bg-slate-800 border p-4 ${
              editable ? "border-slate-700" : "border-slate-800 opacity-80"
            }`}
          >
            {/* TOP */}
            <View className="flex-row items-center gap-3 mb-3">
              <View className="w-11 h-11 rounded-2xl bg-rose-500/10 items-center justify-center">
                <IconSymbol
                  size={22}
                  name={field.icon as any}
                  color="#f43f5e"
                />
              </View>

              <View className="flex-1">
                <Text className="text-white text-[15px] font-semibold">
                  {field.label}
                </Text>

                <Text className="text-slate-400 text-xs mt-0.5">
                  {field.description}
                </Text>
              </View>
            </View>

            {/* INPUT */}
            <View
              className={`rounded-2xl px-4 py-1 bg-slate-900 border ${
                editable ? "border-slate-700" : "border-transparent"
              }`}
            >
              <TextInput
                placeholder={field.placeholder}
                placeholderTextColor="#64748b"
                editable={editable}
                value={String(form[field.key] ?? "")}
                onChangeText={(text) => onChange(field.key, text)}
                keyboardType={
                  field.keyboard === "numeric" ? "numeric" : "default"
                }
                className={`text-[15px] py-3 font-medium ${
                  editable ? "text-white" : "text-slate-400"
                }`}
              />
            </View>
          </View>
        ))}

        {/* SUMMARY CARD */}
        <View className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-5">
          <Text className="text-emerald-400 text-sm font-semibold">
            Monthly Summary
          </Text>

          <View className="mt-4 gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-slate-300">Electricity Total</Text>
              <Text className="text-white font-semibold">
                Rs. {electricityTotal}
              </Text>
            </View>

            <View className="h-[1px] bg-emerald-500/10" />

            <View className="flex-row items-center justify-between">
              <Text className="text-slate-300 font-semibold">
                Monthly Total
              </Text>
              <Text className="text-2xl text-white font-bold">
                Rs. {monthlyTotal}
              </Text>
            </View>

            <View className="h-[1px] bg-emerald-500/10" />

            <View className="flex-row items-center justify-between">
              <Text className="text-slate-300">Already Paid</Text>
              <Text className="text-emerald-400 font-semibold">
                Rs. {totalPaid}
              </Text>
            </View>

            <View className="flex-row items-center justify-between">
              <Text className="text-slate-300 font-semibold">Remaining</Text>
              <Text
                className={`text-2xl font-bold ${
                  remaining > 0 ? "text-rose-400" : "text-emerald-400"
                }`}
              >
                Rs. {remaining}
              </Text>
            </View>
          </View>
        </View>

        {/* RECORD PAYMENT */}
        {!isFullyPaid && (
          <View className="rounded-3xl bg-slate-800 border border-slate-700 p-4">
            <Text className="text-white text-[15px] font-semibold mb-3">
              Record Payment
            </Text>

            <View className="flex-row gap-2">
              <View className="flex-1 rounded-2xl px-4 py-1 bg-slate-900 border border-slate-700">
                <TextInput
                  placeholder="Amount received"
                  placeholderTextColor="#64748b"
                  value={paymentAmount}
                  onChangeText={setPaymentAmount}
                  keyboardType="numeric"
                  className="text-[15px] py-3 font-medium text-white"
                />
              </View>

              <Pressable
                onPress={handleAddPayment}
                className="bg-emerald-600 active:bg-emerald-700 rounded-2xl px-5 items-center justify-center"
              >
                <Text className="text-white font-bold text-sm">Add</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* SAVE BUTTON */}
        {editable && (
          <Pressable
            onPress={onSave}
            disabled={saving}
            className="bg-rose-500 active:bg-rose-600 rounded-2xl py-4 items-center justify-center mt-2 disabled:opacity-50"
            android_ripple={{ color: "#ffffff20" }}
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-base">
                Save Floor Details
              </Text>
            )}
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
