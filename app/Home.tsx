import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white px-6 pt-10">
      <Text className="text-center text-4xl font-extrabold text-rose-700">
        Rent Tracker
      </Text>

      <View className="mt-10">
        <Text className="mb-2 p-2 m-2 text-lg font-medium text-gray-700">
          Log in to Your Account
        </Text>

        <View className="flex gap-4 justify-start items-start p-2 m-2">
          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            className="w-full rounded-2xl border border-gray-300 bg-gray-100 px-4 py-4 text-base text-black"
          />

          <TextInput
            placeholder="Enter your password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            autoCorrect={false}
            secureTextEntry={!showPassword}
            className="w-full rounded-2xl border border-gray-300 bg-gray-100 px-4 py-4 text-base text-black"
          />

          <View className="flex justify-between flex-row w-full items-center">
            <Pressable>
              <Text className="text-blue-500 underline underline-offset-1">
                Forgot Password?
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              className="flex-row gap-2 items-center"
            >
              <Ionicons
                name={showPassword ? "checkbox" : "square-outline"}
                color="black"
                size={24}
              />

              <Text>Show Password</Text>
            </Pressable>
          </View>
          <Pressable className=" text-white bg-blue-400 rounded-sm w-full p-5 ">
            <Text
              className="text-center color-white font-bold text-lg
            "
            >
              Log in
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
