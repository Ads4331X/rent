import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { Text, TextInput, View } from "react-native";

type Props = {
  floorId: string;
  editable: boolean;
  form: Record<string, string | number>;
  onChange: (key: string, value: string) => void;
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
}: Props) {


  return (
    <View style={{ padding: 16, gap: 12 }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#1e293b",
          borderRadius: 16,
          padding: 16,
          borderLeftWidth: 3,
          borderLeftColor: editable ? "#60a5fa" : "#f43f5e",
          marginBottom: 4,
        }}
      >
        <Text style={{ color: Colors.text, fontSize: 18, fontWeight: "700" }}>
          {editable ? "Edit Floor Details" : "Floor Details"}
        </Text>
        <Text style={{ color: "#475569", fontSize: 12, marginTop: 2 }}>
          Floor ID: {floorId}
        </Text>
      </View>

      {/* Fields */}
      {FIELDS.map((field) => (
        <View
          key={field.key}
          style={{
            backgroundColor: "#1e293b",
            borderRadius: 16,
            padding: 16,
            borderWidth: 1,
            borderColor: editable ? "#334155" : "#1e293b",
            opacity: editable ? 1 : 0.8,
          }}
        >
          {/* Label row */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginBottom: 4,
            }}
          >
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 10,
                backgroundColor: "#f43f5e18",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <IconSymbol size={24} name={field.icon as any} color="#f43f5e" />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: Colors.text,
                  fontSize: 14,
                  fontWeight: "600",
                }}
              >
                {field.label}
              </Text>
              <Text style={{ color: "#475569", fontSize: 11, marginTop: 1 }}>
                {field.description}
              </Text>
            </View>
          </View>

          {/* Input */}
          <View
            style={{
              backgroundColor: "#0f172a",
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 10,
              marginTop: 8,
              borderWidth: 1,
              borderColor: editable ? "#334155" : "transparent",
            }}
          >
            <TextInput
              placeholder={field.placeholder}
              placeholderTextColor="#475569"
              editable={editable}
              value={String(form[field.key] ?? "")}
              onChangeText={(text) => onChange(field.key, text)}
              keyboardType={
                field.keyboard === "numeric" ? "numeric" : "default"
              }
              style={{
                color: editable ? Colors.text : "#94a3b8",
                fontSize: 15,
                fontWeight: "500",
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );
}
