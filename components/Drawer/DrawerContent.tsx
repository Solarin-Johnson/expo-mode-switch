import { View, Text } from "react-native";
import React from "react";
import {
  DrawerContentComponentProps,
  DrawerItemList,
} from "@react-navigation/drawer";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function DrawerContent(props: DrawerContentComponentProps) {
  const bg = useThemeColor({}, "background");
  return (
    <View
      style={{
        flex: 1,
        padding: 20,
        backgroundColor: bg,
      }}
    >
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          marginBottom: 20,
        }}
      >
        Menu
      </Text>
      <DrawerItemList {...props} />
    </View>
  );
}
