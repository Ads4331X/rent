import Header from "@/components/layout/Header";
import { Colors } from "@/constants/theme";
import { SafeAreaView } from "react-native-safe-area-context";
import AddNewFloorBtn from "./AddNewFloorBtn";
import FloorOverview from "./FloorsOverview";
import InfoCard from "./InfoCard";
import PropertyFloors from "./PropertyFloors";

export default function Floors() {
  return (
    <SafeAreaView
      className="w-full h-full"
      style={{ backgroundColor: Colors.background }}
    >
      <Header />
      <FloorOverview />

      <PropertyFloors />
      <InfoCard />
      <AddNewFloorBtn />
    </SafeAreaView>
  );
}
