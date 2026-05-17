import { InputEmail } from "@/components/ui/InputEmail";
import { InputPassword } from "@/components/ui/InputPassword";
import { OtherLoginMethods } from "@/components/ui/OtherLoginMethods";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = () => {
    // Email Error Handling
    if (!email) {
      // Email Error Handling
      setEmailError("Email is required");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
    } else {
      setEmailError("");
    }

    // Password Error Handling
    if (!password) {
      setPasswordError("Password is required");
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
    } else {
      setPasswordError("");
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900 px-6 py-4">
      {/* Title */}
      <View className="mb-8 mt-4">
        <Text className="text-center text-xs font-bold uppercase tracking-[6px] text-rose-500">
          Rent Tracker
        </Text>
        <Text className="mt-3 text-center text-3xl font-bold text-slate-100">
          Welcome back
        </Text>
        <Text className="mt-1 text-center text-sm text-slate-500">
          Sign in to manage your properties
        </Text>
      </View>

      {/* Card */}
      <View className="rounded-3xl border border-slate-700 bg-slate-800 p-6">
        <View className="gap-5">
          <InputEmail value={email} onChangeText={setEmail} />
          {!!emailError && <Text className="text-red-500">{emailError}</Text>}

          <InputPassword
            label="Password"
            placeholder="Enter your password"
            icon="lock"
            value={password}
            onChangeText={setPassword}
            secure={true}
          />
          {!!passwordError && (
            <Text className="text-red-500">{passwordError}</Text>
          )}

          <Pressable className="self-end">
            <Text className="text-sm font-medium text-rose-400">
              Forgot Password?
            </Text>
          </Pressable>

          <Pressable
            onPress={handleSubmit}
            className="mt-1 rounded-2xl bg-rose-600 p-4 active:opacity-80"
          >
            <Text className="text-center text-base font-bold text-white">
              Log in
            </Text>
          </Pressable>
        </View>

        <View className="my-6 flex-row items-center">
          <View className="h-[1px] flex-1 bg-slate-700" />
          <Text className="mx-4 text-xs text-slate-500">or continue with</Text>
          <View className="h-[1px] flex-1 bg-slate-700" />
        </View>

        <OtherLoginMethods />
      </View>

      <View className="flex-1 flex-row items-center justify-center">
        <Text className="text-slate-500">Don&#39;t have an account? </Text>
        <Pressable onPress={() => router.replace("/auth/Signup")}>
          <Text className="font-semibold text-rose-400">Sign up</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
