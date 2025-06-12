import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useDrawerProgress } from "@react-navigation/drawer";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

export default function Index() {
  const progress = useDrawerProgress();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * 40 }],
  }));
  return (
    <ThemedView style={styles.container}>
      <Animated.View style={animatedStyle}>
        <ThemedText style={styles.text}>We go again!</ThemedText>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});
