import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Head from "expo-router/head";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import DrawerContent from "@/components/Drawer/DrawerContent";
import { useWindowDimensions } from "react-native";

export default function RootLayout() {
  const { width } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    InterMedium: require("../assets/fonts/Inter-Medium.ttf"),
    InterSemiBold: require("../assets/fonts/Inter-SemiBold.ttf"),
  });

  if (!loaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Head>
        <meta name="color-scheme" content="light dark" />
      </Head>
      <SafeAreaProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Drawer
            drawerContent={DrawerContent}
            screenOptions={{
              headerShown: false,
              drawerType: "front",
              swipeEdgeWidth: width,
              swipeMinDistance: width * 0.3,
              drawerStyle: {
                width: "80%",
              },
            }}
          >
            <Drawer.Screen
              name="index"
              options={{
                drawerLabel: "Home",
                title: "overview",
              }}
            />
          </Drawer>
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
