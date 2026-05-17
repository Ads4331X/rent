import { InputEmail } from "@/components/ui/input/InputEmail";
import { InputPassword } from "@/components/ui/input/InputPassword";
import { InputUsername } from "@/components/ui/input/InputUsername";
import { OtherLoginMethods } from "@/components/ui/OtherLoginMethods";
import { createUserProfile } from "@/services/userServices";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreateAccount = async () => {
    if (loading) return;
    let hasError = false;

    if (!username.trim()) {
      setUsernameError("Username is required");
      hasError = true;
    } else if (username.trim().length < 3) {
      setUsernameError("Username must be at least 3 characters");
      hasError = true;
    } else setUsernameError("");

    if (!email) {
      setEmailError("Email is required");
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      hasError = true;
    } else setEmailError("");

    if (!password) {
      setPasswordError("Password is required");
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      hasError = true;
    } else setPasswordError("");

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      hasError = true;
    } else if (confirmPassword !== password) {
      setConfirmPasswordError("Passwords do not match");
      hasError = true;
    } else setConfirmPasswordError("");

    if (hasError) return;

    setLoading(true);
    setError("");
    const result = await createUserProfile({ username, email, password });
    setLoading(false);

    if (result.error) setError(result.error);
    else router.replace("/auth/Login");
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 16 }}
      >
        <View className="mb-8 mt-4">
          <Text className="text-center text-xs font-bold uppercase tracking-[6px] text-rose-500">
            Rent Tracker
          </Text>
          <Text className="mt-3 text-center text-3xl font-bold text-slate-100">
            Create account
          </Text>
          <Text className="mt-1 text-center text-sm text-slate-500">
            Start tracking your properties today
          </Text>
        </View>

        <View className="rounded-3xl border border-slate-700 bg-slate-800 p-6">
          <View className="gap-5">
            <InputUsername value={username} onChangeText={setUsername} />
            {!!usernameError && (
              <Text className="text-red-500">{usernameError}</Text>
            )}

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

            <InputPassword
              label="Confirm Password"
              placeholder="Confirm your password"
              icon="lock"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secure={true}
            />
            {!!confirmPasswordError && (
              <Text className="text-red-500">{confirmPasswordError}</Text>
            )}

            {!!error && <Text className="text-red-500">{error}</Text>}

            <Pressable
              onPress={handleCreateAccount}
              disabled={loading}
              className="mt-1 rounded-2xl bg-rose-600 p-4 active:opacity-80 disabled:opacity-50"
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-center text-base font-bold text-white">
                  Create Account
                </Text>
              )}
            </Pressable>
          </View>

          <View className="my-6 flex-row items-center">
            <View className="h-[1px] flex-1 bg-slate-700" />
            <Text className="mx-4 text-xs text-slate-500">
              or continue with
            </Text>
            <View className="h-[1px] flex-1 bg-slate-700" />
          </View>

          <OtherLoginMethods />
        </View>

        <View className="flex-row items-center justify-center pt-4">
          <Text className="text-slate-500">Already have an account? </Text>
          <Pressable onPress={() => router.replace("/auth/Login")}>
            <Text className="font-semibold text-rose-400">Log in</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
