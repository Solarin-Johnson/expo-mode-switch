import { View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { SendHorizonal, Smile } from "lucide-react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TextInput } from "react-native-gesture-handler";

export default function MessageBox() {
  const text = useThemeColor({}, "text");

  return (
    <View style={{ backgroundColor: text + "10" }}>
      <SafeAreaView
        edges={["bottom"]}
        style={{
          paddingHorizontal: 20,
          paddingVertical: 16,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Smile color={text} strokeWidth={1.8} />
        <View style={{ flex: 1, marginHorizontal: 8 }}>
          <TextInput
            placeholder="Type a message..."
            placeholderTextColor={text}
            style={{
              color: text,
              padding: 10,
            }}
          />
        </View>
        <SendHorizonal color={text} strokeWidth={1.8} />
      </SafeAreaView>
    </View>
  );
}
