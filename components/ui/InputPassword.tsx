import { Input } from "@/constants/theme";
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

type InputFieldProps = {
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
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View>
      <Text className={Input.labelStyle}>{label}</Text>

      <View className={Input.inputContainer}>
        <MaterialIcons name={icon} size={22} color="#6B7280" />

        <TextInput
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secure && !showPassword}
          keyboardType={keyboardType}
          autoCapitalize="none"
          autoCorrect={false}
          className={Input.inputStyle}
        />

        {secure && (
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? "eye" : "eye-off"}
              size={22}
              color="#6B7280"
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}
