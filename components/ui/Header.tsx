import React from "react";
import { ThemedView } from "../ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { Menu, MessageCircle } from "lucide-react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Pressable } from "react-native";
import { useNavigation } from "expo-router";
import { DrawerActions } from "@react-navigation/native";

export default function Header() {
  const text = useThemeColor({}, "text");
  const navigation = useNavigation();
  return (
    <ThemedView>
      <SafeAreaView
        edges={["top"]}
        style={{
          paddingVertical: 6,
          paddingHorizontal: 20,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Menu color={text} />
        </Pressable>
        <MessageCircle color={text} />
      </SafeAreaView>
    </ThemedView>
  );
}
