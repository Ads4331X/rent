import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView className="flex-1 justify-start bg-slate-100 px-6 py-2">
      <View className="rounded-3xl bg-white px-5 py-8 shadow-lg">
        {/* Title */}
        <Text className="text-center text-4xl font-extrabold text-rose-700">
          Rent Tracker
        </Text>

        {/* Subtitle */}
        <Text className="mt-8 px-1 text-lg font-medium text-gray-700">
          Log in to Your Account
        </Text>

        {/* Form */}
        <View className="mt-6 gap-5">
          {/* Email */}
          <View className="w-full">
            <Text className="mb-2 text-gray-600">Email</Text>

            <View className="flex-row items-center rounded-2xl border border-gray-300 bg-gray-100 px-4">
              <MaterialIcons name="email" size={22} color="#6B7280" />

              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className="flex-1 py-4 pl-3 text-base text-black"
              />
            </View>
          </View>

          {/* Password */}
          <View className="w-full">
            <Text className="mb-2 text-gray-600">Password</Text>

            <View className="flex-row items-center rounded-2xl border border-gray-300 bg-gray-100 px-4">
              <MaterialIcons name="lock" size={22} color="#6B7280" />

              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCorrect={false}
                className="flex-1 py-4 pl-3 text-base text-black"
              />

              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={22}
                  color="#6B7280"
                />
              </Pressable>
            </View>
          </View>

          {/* Forgot Password */}
          <Pressable className="self-end">
            <Text className="font-medium text-blue-500">Forgot Password?</Text>
          </Pressable>

          {/* Login Button */}
          <Pressable className="mt-2 rounded-2xl bg-blue-500 p-4 active:opacity-80">
            <Text className="text-center text-xl font-bold text-white">
              Log in
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
