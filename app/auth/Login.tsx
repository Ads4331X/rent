import { InputEmail } from "@/components/ui/InputEmail";
import { InputPassword } from "@/components/ui/InputPassword";
import { OtherLoginMethods } from "@/components/ui/OtherLoginMethods";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const [password, setPassword] = useState("");

  const linkStyle = "font-medium text-blue-500";

  return (
    <SafeAreaView className="flex-1 bg-slate-100 px-6 py-2">
      {/* Title */}
      <Text className="text-center text-4xl font-extrabold uppercase text-rose-700">
        Rent Tracker
      </Text>

      {/* Subtitle */}
      <View className="mb-5 p-2">
        <Text className="mt-8 text-center text-2xl font-bold text-gray-700">
          Welcome Back
        </Text>

        <Text className="text-center text-gray-500">
          Manage your property and track rents with ease.
        </Text>
      </View>

      {/* Card */}
      <View className="rounded-3xl bg-white p-5 pt-2 shadow-lg">
        <View className="mt-6 gap-5">
          {/* Email */}
          <InputEmail />

          {/* Password */}
          <InputPassword
            label="Password"
            placeholder="Enter your password"
            icon="lock"
            value={password}
            onChangeText={setPassword}
            secure={true}
            keyboardType={"default"}
          />

          {/* Forgot Password */}
          <Pressable className="self-end">
            <Text className={linkStyle}>Forgot Password?</Text>
          </Pressable>

          {/* Login Button */}
          <Pressable className="mt-2 rounded-2xl bg-blue-500 p-4 active:opacity-80">
            <Text className="text-center text-xl font-bold text-white">
              Log in
            </Text>
          </Pressable>
        </View>

        {/* Divider */}
        <View className="my-7 flex-row items-center">
          <View className="h-[1px] flex-1 bg-gray-300" />

          <Text className="mx-4 text-sm text-gray-500">Or Continue With</Text>

          <View className="h-[1px] flex-1 bg-gray-300" />
        </View>

        <OtherLoginMethods />
      </View>

      {/* Bottom */}
      <View className="flex-1 flex-row items-center justify-center">
        <Text>Don&#39;t have an account? </Text>

        <Pressable>
          <Text className={linkStyle}>Sign up</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
