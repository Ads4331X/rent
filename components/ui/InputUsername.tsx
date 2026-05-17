import { Colors, Input } from "@/constants/theme";
import Feather from "@expo/vector-icons/Feather";
import { Text, TextInput, View } from "react-native";

type Props = { value: string; onChangeText: (text: string) => void };

export function InputUsername({ value, onChangeText }: Props) {
  return (
    <View>
      <Text className={Input.labelStyle}>Username</Text>
      <View className={Input.inputContainer}>
        <Feather name="user" size={20} color={Colors.icon} />
        <TextInput
          placeholder="Enter your username"
          placeholderTextColor={Colors.placeholder}
          value={value}
          onChangeText={onChangeText}
          keyboardType="default"
          autoCapitalize="none"
          autoCorrect={false}
          className={Input.inputStyle}
        />
      </View>
    </View>
  );
}
