import { Colors } from "@/constants/theme";
import { createFloor } from "@/services/floorServices";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function AddNewFloorBtn() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const openSheet = useCallback(() => bottomSheetRef.current?.expand(), []);
  const closeSheet = useCallback(() => bottomSheetRef.current?.close(), []);

  const [floorName, setFloorName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleAdd = async () => {
    if (!floorName.trim()) {
      setError("Floor name is required");
      return;
    }
    setError("");
    setLoading(true);
    // TODO: wire up your floor creation service here
    const res = createFloor(floorName);
    console.log(res);

    if (!(await res).success) {
      setError((await res).error);
      setLoading(false);
      return;
    } else {
      setLoading(false);
      setFloorName("");
      closeSheet();
    }
  };

  return (
    <>
      {/* Floating + button */}
      <Pressable
        onPress={openSheet}
        style={{ backgroundColor: Colors.primary }}
        className="rounded-full p-4 m-2 items-center justify-center absolute bottom-0 right-0"
      >
        <Entypo name="plus" size={30} color="white" />
      </Pressable>

      {/* Bottom Sheet */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["45%"]}
        enablePanDownToClose
        backgroundStyle={{ backgroundColor: "#1e293b" }}
        handleIndicatorStyle={{ backgroundColor: "#475569" }}
      >
        <BottomSheetView className="flex-1 px-6 pt-2 pb-8">
          {/* Sheet header */}
          <View className="flex-row items-center justify-between gap-2 mb-6">
            <View className="flex-row items-center justify-center gap-2">
              <View className="bg-rose-500/20 rounded-xl p-2">
                <Feather name="layers" size={18} color="#f43f5e" />
              </View>
              <View className="p-2 mb-2">
                <Text className="text-slate-100 font-bold text-base">
                  Add New Floor
                </Text>
                <Text className="text-slate-500 text-xs">
                  Give your floor a unique name
                </Text>
              </View>
            </View>
            <Pressable
              onPress={closeSheet}
              className="p-1 text-xl
            "
            >
              <Feather name="x" size={26} color="#64748b" />
            </Pressable>
          </View>

          {/* Input row */}
          <View className="flex-row gap-0 items-center justify-between">
            <View
              className="flex-1 flex-row items-center gap-2 bg-slate-900 rounded-xl px-3 border"
              style={{
                height: 48,
                borderColor: error ? "#f87171" : "#334155",
              }}
            >
              <Feather name="home" size={16} color="#64748b" />
              <TextInput
                value={floorName}
                onChangeText={(t) => {
                  setFloorName(t);
                  if (error) setError("");
                }}
                placeholder="e.g. Ground Floor, Floor 2"
                placeholderTextColor="#475569"
                className="flex-1 text-slate-100 text-sm"
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>

            <Pressable
              onPress={handleAdd}
              disabled={loading}
              className="bg-rose-600 rounded-xl items-center justify-center active:opacity-75 disabled:opacity-50"
              style={{ width: 48, height: 48 }}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Feather name="plus" size={24} color="white" />
              )}
            </Pressable>
          </View>

          {!!error && (
            <Text className="text-red-400 text-xs mt-2 ml-1">{error}</Text>
          )}
        </BottomSheetView>
      </BottomSheet>
    </>
  );
}
