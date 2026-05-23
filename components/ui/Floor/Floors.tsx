import Header from "@/components/layout/Header";
import { Colors } from "@/constants/theme";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import AddNewFloorBtn from "./AddNewFloorBtn";
import FloorOverview from "./FloorsOverview";
import InfoCard from "./InfoCard";
import PropertyFloors from "./PropertyFloors";

export default function Floors() {
  const [refresh, setRefresh] = useState(0);

  return (
    <SafeAreaView
      className="w-full h-full"
      style={{ backgroundColor: Colors.background }}
    >
      <Header />
      <FloorOverview />
      <PropertyFloors />
      <InfoCard refresh={refresh} />
      <AddNewFloorBtn onFloorAdded={() => setRefresh((r) => r + 1)} />
    </SafeAreaView>
  );
}
