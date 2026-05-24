import Feather from "@expo/vector-icons/Feather";
import { Modal, Pressable, Text, View } from "react-native";
import { FloorMenuAction } from "./utils/types";

const OPTIONS: {
  label: string;
  action: FloorMenuAction;
  icon: string;
  color: string;
}[] = [
  { label: "View Details", action: "view", icon: "eye", color: "#94a3b8" },
  { label: "Edit Floor", action: "edit", icon: "edit-2", color: "#60a5fa" },
  {
    label: "Delete Floor",
    action: "delete",
    icon: "trash-2",
    color: "#f43f5e",
  },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (action: FloorMenuAction) => void;
}

export default function FloorCardMenu({ visible, onClose, onSelect }: Props) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable className="flex-1 justify-end bg-black/50" onPress={onClose}>
        <Pressable
          className="rounded-t-3xl bg-slate-900"
          onPress={(e) => e.stopPropagation()}
        >
          {/* Handle */}
          <View className="items-center pb-1 pt-3">
            <View className="h-1 w-10 rounded-full bg-slate-700" />
          </View>

          {/* Options */}
          <View className="px-4 pb-10 pt-2">
            {OPTIONS.map(({ label, action, icon, color }, index) => (
              <Pressable
                key={action}
                onPress={() => {
                  onSelect(action);
                  onClose();
                }}
                className={`flex-row items-center gap-4 rounded-2xl px-3 py-4 ${
                  index < OPTIONS.length - 1 ? "border-b border-slate-800" : ""
                }`}
                style={({ pressed }) => ({
                  backgroundColor: pressed ? "#1e293b" : "transparent",
                })}
              >
                <View
                  className="h-9 w-9 items-center justify-center rounded-xl"
                  style={{
                    backgroundColor: `${color}18`,
                  }}
                >
                  <Feather name={icon as any} size={16} color={color} />
                </View>

                <Text className="text-base font-medium" style={{ color }}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
