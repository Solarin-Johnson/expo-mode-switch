import React from "react";
import { StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import { useDrawerProgress } from "@react-navigation/drawer";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import Header from "@/components/ui/Header";
import { ScrollView } from "react-native-gesture-handler";
import MessageBox from "@/components/ui/MessageBox";

export default function Index() {
  const progress = useDrawerProgress();

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: progress.value * 40 }],
  }));

  return (
    <ThemedView style={styles.container}>
      <Animated.View style={[{ flex: 1 }, animatedStyle]}>
        <Header />
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ThemedText style={styles.text} type="defaultSemiBold">
            What can I help with?
          </ThemedText>
        </ScrollView>
        <MessageBox />
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 25,
    // fontWeight: "bold",
  },
});
