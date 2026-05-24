import { supabase } from "@/lib/supabase";
import { deleteFloor, getFloorWithBills } from "@/services/floorServices";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import FloorCard from "./FloorCard";
import FloorCardSkeleton from "./FloorCardSkeleton";
import { Floor, FloorMenuAction } from "./utils/types";

export default function InfoCard({ refresh }: { refresh: number }) {
  const [floors, setFloors] = useState<Floor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFloors();

    // Subscribe to realtime changes on floors table
    const channel = supabase
      .channel("floors-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "floors" },
        (payload) => {
          if (payload.eventType === "INSERT") {
            fetchFloors(); // refetch to get transformed data
          }
          if (payload.eventType === "DELETE") {
            setFloors((prev) =>
              prev.filter((f) => f.id !== (payload.old as any).id),
            );
          }
          if (payload.eventType === "UPDATE") {
            fetchFloors();
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [refresh]);

  const fetchFloors = async () => {
    setLoading(true);
    try {
      const res = await getFloorWithBills();
      setFloors(Array.isArray(res.data) ? res.data : []);
    } catch {
      setFloors([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: FloorMenuAction, floorId: number) => {
    if (action === "view") router.push(`/floor/${floorId}` as any);
    if (action === "edit") router.push(`/floor/${floorId}` as any); // same screen, handle edit there
    if (action === "delete") {
      const res = await deleteFloor(floorId);
      console.log(res);

      if (res.success)
        setFloors((prev) => prev.filter((f) => f.id !== floorId));
    }
  };

  if (loading)
    return (
      <View>
        {[1, 2, 3].map((i) => (
          <FloorCardSkeleton key={i} />
        ))}
      </View>
    );

  if (floors.length === 0)
    return (
      <View className="items-center justify-center py-16">
        <Text style={{ color: "#475569" }}>
          No floors yet. Tap + to add one!
        </Text>
      </View>
    );

  return (
    <FlatList
      data={floors}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <FloorCard floor={item} onAction={handleAction} />
      )}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 100 }}
      className="mt-2"
    />
  );
}
