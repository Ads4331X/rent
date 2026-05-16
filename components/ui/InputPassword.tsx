import { Colors, Input } from "@/constants/theme";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import {
  KeyboardTypeOptions,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

type Props = {
  label: string;
  placeholder: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  value: string;
  onChangeText: (text: string) => void;
  secure?: boolean;
  keyboardType?: KeyboardTypeOptions;
};

export function InputPassword({
  label,
  placeholder,
  icon,
  value,
  onChangeText,
  secure = false,
  keyboardType = "default",
}: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View>
      <Text className={Input.labelStyle}>{label}</Text>
      <View className={Input.inputContainer}>
        <MaterialIcons name={icon} size={20} color={Colors.icon} />
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={Colors.placeholder}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secure && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoCorrect={false}
          className={Input.inputStyle}
          style={{
            textAlignVertical: "center",
          }}
        />
        {secure && (
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color={Colors.icon}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}
