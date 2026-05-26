// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolViewProps, SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, StyleProp, TextStyle } from "react-native";

type IconMapping = Partial<
  Record<SymbolViewProps["name"], ComponentProps<typeof MaterialIcons>["name"]>
>;
const MAPPING = {
  // Navigation
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",

  // Actions
  "plus.circle.fill": "add-circle",
  "creditcard.fill": "payments",

  // Money / Rent
  "dollarsign.circle.fill": "attach-money",

  // Building / Floor
  "building.2.fill": "apartment",

  // Utilities (NEW)
  "bolt.fill": "bolt", // Electricity
  "drop.fill": "water-drop", // Water
  "trash.fill": "delete", // Garbage / Maintenance

  // Optional useful ones for your app
  "pencil.circle.fill": "edit",
  "checkmark.circle.fill": "check-circle",
  "xmark.circle.fill": "cancel",
  "info.circle.fill": "info",
  "person.fill": "person",
} as const satisfies IconMapping;

type IconSymbolName = keyof typeof MAPPING;

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  return (
    <MaterialIcons
      name={MAPPING[name] ?? "help-outline"}
      size={size}
      color={color}
      style={style}
    />
  );
}
