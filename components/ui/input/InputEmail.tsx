import { Colors, Input } from "@/constants/theme";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Text, TextInput, View } from "react-native";

type Props = { value: string; onChangeText: (text: string) => void };

export function InputEmail({ value, onChangeText }: Props) {
  return (
    <View>
      <Text className={Input.labelStyle}>Email Address</Text>
      <View className={Input.inputContainer}>
        <MaterialIcons name="email" size={20} color={Colors.icon} />
        <TextInput
          placeholder="Enter your email"
          placeholderTextColor={Colors.placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          className={Input.inputStyle}
        />
      </View>
    </View>
  );
}
