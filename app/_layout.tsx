import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Head from "expo-router/head";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import DrawerContent from "@/components/Drawer/DrawerContent";
import { useWindowDimensions } from "react-native";
import { useCallback, useRef, useState } from "react";
import ViewShot from "react-native-view-shot";
import { useTheme, ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout() {
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
        <ThemeProvider>
          <DrawerNavigator />
          <StatusBar style="auto" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function DrawerNavigator() {
  const { width } = useWindowDimensions();
  const { colorScheme } = useTheme();
  const ref = useRef<ViewShot>(null);
  const [underlayUri, setUnderlayUri] = useState<string | null>(null);
  const captureUnderlay = useCallback(() => {
    if (ref.current) {
      ref.current.capture?.().then((uri) => {
        setUnderlayUri(uri);
      });
    }
  }, []);

  return (
    <NavigationThemeProvider
      value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
    >
      <ViewShot
        ref={ref}
        style={{ flex: 1 }}
        options={{
          fileName: "underlayMask",
          format: "jpg",
        }}
      >
        <Drawer
          drawerContent={(props) => (
            <DrawerContent
              underlayUri={underlayUri}
              captureUnderlay={captureUnderlay}
              {...props}
            />
          )}
          screenOptions={{
            headerShown: false,
            drawerType: "front",
            swipeEdgeWidth: width,
            swipeMinDistance: width * 0.3,
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
      </ViewShot>
    </NavigationThemeProvider>
  );
}
