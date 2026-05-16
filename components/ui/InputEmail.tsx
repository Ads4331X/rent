import { Input } from "@/constants/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";
export function InputEmail() {
  const [email, setEmail] = useState("");
  return (
    <View>
      <Text className={Input.labelStyle}>Email Address</Text>

      <View className={Input.inputContainer}>
        <MaterialIcons name="email" size={22} color="#6B7280" />

        <TextInput
          placeholder="Enter your email"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          className={Input.inputStyle}
        />
      </View>
    </View>
  );
}
