import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React, { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Reusable styles
  const inputContainer =
    "flex-row items-center rounded-2xl border border-gray-300 bg-gray-100 px-4";

  const inputStyle = "flex-1 py-4 pl-3 text-base text-black";

  const labelStyle = "mb-2 text-gray-600";

  const linkStyle = "font-medium text-blue-500";

  const socialButton = "rounded-full bg-gray-100 p-3";

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
          <View>
            <Text className={labelStyle}>Email Address</Text>

            <View className={inputContainer}>
              <MaterialIcons name="email" size={22} color="#6B7280" />

              <TextInput
                placeholder="Enter your email"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className={inputStyle}
              />
            </View>
          </View>

          {/* Password */}
          <View>
            <Text className={labelStyle}>Password</Text>

            <View className={inputContainer}>
              <MaterialIcons name="lock" size={22} color="#6B7280" />

              <TextInput
                placeholder="Enter your password"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCorrect={false}
                className={inputStyle}
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

        {/* Socials */}
        <View className="flex-row justify-center gap-5">
          <Pressable className={socialButton}>
            <AntDesign name="google" size={24} color="black" />
          </Pressable>

          <Pressable className={socialButton}>
            <Entypo name="facebook" size={24} color="black" />
          </Pressable>

          <Pressable className={socialButton}>
            <AntDesign name="github" size={24} color="black" />
          </Pressable>
        </View>
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
