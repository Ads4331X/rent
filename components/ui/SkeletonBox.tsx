import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export function SkeletonBox({
  width,
  height,
  marginBottom = 0,
}: {
  width: number;
  height: number;
  marginBottom?: number;
}) {
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  return (
    <Animated.View
      style={{
        width,
        height,
        marginBottom,
        borderRadius: 6,
        backgroundColor: "#334155",
        opacity,
      }}
    />
  );
}
