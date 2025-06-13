import {
  View,
  StyleSheet,
  Pressable,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import {
  DrawerContentComponentProps,
  useDrawerProgress,
} from "@react-navigation/drawer";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { ThemedText, ThemedTextProps } from "../ThemedText";
import {
  ChevronDown,
  CircleUserRound,
  LucideProps,
  Moon,
  Sun,
  UserPlus,
} from "lucide-react-native";
import { ThemedView } from "../ThemedView";
import {
  User,
  Wallet,
  Users,
  Phone,
  Bookmark,
  Settings,
  Star,
} from "lucide-react-native";
import { releaseCapture } from "react-native-view-shot";
import Animated, {
  Easing,
  measure,
  runOnJS,
  runOnUI,
  SharedValue,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import {
  Canvas,
  Group,
  useImage,
  Image as SkiaImage,
  Skia,
} from "@shopify/react-native-skia";
import { useTheme } from "@/context/ThemeContext";

type MenuItem = {
  id: string;
  label: string;
  icon: React.ComponentType<LucideProps>;
};

type DrawerData = {
  name: string;
  email: string;
  buttons: MenuItem[];
  features: MenuItem[];
  extras: MenuItem[];
};

const DATA: DrawerData = {
  name: "Solarin",
  email: "johndoe@example.com",
  buttons: [
    { id: "my-profile", label: "My Profile", icon: CircleUserRound },
    { id: "wallet", label: "Wallet", icon: Wallet },
  ],
  features: [
    { id: "new-group", label: "New Group", icon: Users },
    { id: "contacts", label: "Contacts", icon: User },
    { id: "calls", label: "Calls", icon: Phone },
    { id: "saved-messages", label: "Saved Messages", icon: Bookmark },
    { id: "settings", label: "Settings", icon: Settings },
  ],
  extras: [
    { id: "invite", label: "Invite", icon: UserPlus },
    { id: "features", label: "Features", icon: Star },
  ],
};

const ANIMATION_DURATION = 450;
const beizer = Easing.bezier(0.5, 0.25, 0.25, 1);
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const DrawerContent = memo(
  ({
    navigation,
    underlayUri,
    captureUnderlay,
  }: DrawerContentComponentProps & {
    underlayUri: string | null;
    captureUnderlay?: () => void;
  }) => {
    const text = useThemeColor({}, "barTextColor");
    const bgFade = useThemeColor({}, "bgFade");
    const barColor = useThemeColor({}, "barColor");
    const { colorScheme, toggleColorScheme } = useTheme();
    const [prevUri, setPrevUri] = useState<string | null>(null);
    const pressEv = useSharedValue("");
    const timeoutRef = useRef<number | null>(null);
    const cords = useSharedValue({ x: 0, y: 0 });
    const iconRef = useAnimatedRef<Animated.View>();
    const progress = useDrawerProgress();

    useEffect(() => {
      return () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
    }, []);

    useEffect(() => {
      if (prevUri && underlayUri && underlayUri !== prevUri) {
        releaseCapture(prevUri);
        setPrevUri(underlayUri);
      }
    }, [underlayUri]);

    const isAnimating = useRef(false);

    const handleModeChange = useCallback(() => {
      if (isAnimating.current) return;

      isAnimating.current = true;
      pressEv.value = "press";
      toggleColorScheme();

      timeoutRef.current = setTimeout(() => {
        pressEv.value = "reset";
        setTimeout(() => {
          isAnimating.current = false;
        }, 10);
      }, ANIMATION_DURATION + 100);
    }, [toggleColorScheme, pressEv]);

    const handlePressIn = useCallback(() => {
      runOnUI(() => {
        const measurement = measure(iconRef);
        if (measurement === null) {
          return;
        }
        cords.value = {
          x: measurement.pageX + measurement.width / 2,
          y: measurement.pageY + measurement.height / 2,
        };
      })();
      if (isAnimating.current) return;
      pressEv.value = "in";
    }, [pressEv]);

    useAnimatedReaction(
      () => progress.value,
      (current) => {
        if (current === 1 && captureUnderlay) {
          runOnJS(captureUnderlay)();
        }
      }
    );

    useAnimatedReaction(
      () => pressEv.value,
      (current, prev) => {
        if (
          current === "reset" &&
          progress.value === 1 &&
          captureUnderlay &&
          prev !== current
        ) {
          runOnJS(captureUnderlay)();
        }
      }
    );

    const iconProps: LucideProps = {
      color: text,
      size: 25,
      strokeWidth: 1.9,
    };

    const isLightMode = colorScheme === "light";
    const isDarkMode = colorScheme === "dark";

    const createIconAnimatedStyle = useCallback(
      (
        shouldShow: boolean,
        delay: number = 0,
        duration: number = ANIMATION_DURATION
      ) => {
        return useAnimatedStyle(() => {
          return {
            opacity: withDelay(
              delay,
              withTiming(shouldShow ? 1 : 0, {
                duration,
                easing: beizer,
              })
            ),
            transform: [
              {
                scale: withDelay(
                  delay,
                  withTiming(shouldShow ? 1 : 0, {
                    duration,
                    easing: beizer,
                  })
                ),
              },
            ],
          };
        });
      },
      []
    );

    const sunAnimatedStyle = createIconAnimatedStyle(isDarkMode);
    const moonAnimatedStyle = createIconAnimatedStyle(
      isLightMode,
      isLightMode ? ANIMATION_DURATION * 0.85 : 0,
      isLightMode ? ANIMATION_DURATION : 0
    );

    return (
      <>
        <ThemedView style={{ flex: 1 }}>
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ flexGrow: 1 }}
          >
            <SafeAreaView
              style={{
                flex: 1,
                gap: 12,
                backgroundColor: barColor,
              }}
            >
              <View style={[styles.section, styles.row, styles.header]}>
                <View style={styles.imageContainer}>
                  <Image
                    source={require("@/assets/images/dp.png")}
                    style={styles.image}
                    contentFit="cover"
                  />
                </View>
                <AnimatedPressable
                  onPressIn={handlePressIn}
                  onPress={handleModeChange}
                  ref={iconRef}
                  style={{
                    marginRight: -5,
                    width: 36,
                    aspectRatio: 1,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  android_ripple={{ color: text + "00", radius: 16 }}
                  hitSlop={8}
                >
                  <Animated.View style={[styles.overlay, sunAnimatedStyle]}>
                    <Sun {...iconProps} />
                  </Animated.View>
                  <Animated.View style={[styles.overlay, moonAnimatedStyle]}>
                    <Moon {...iconProps} />
                  </Animated.View>
                </AnimatedPressable>
              </View>
              <View style={[styles.row, styles.section]}>
                <View>
                  <BarText type="defaultSemiBold">{DATA.name}</BarText>
                  <BarText type="subtitle">{DATA.email}</BarText>
                </View>
                <ChevronDown strokeWidth={1.8} color={text} />
              </View>
              <View style={[styles.clusterGroup, { backgroundColor: bgFade }]}>
                {DATA.buttons.map((item) => (
                  <ClusterItem
                    key={item.id}
                    navigation={navigation}
                    {...item}
                  />
                ))}
                <Divider />
                {DATA.features.map((item) => (
                  <ClusterItem
                    key={item.id}
                    navigation={navigation}
                    {...item}
                  />
                ))}
                <Divider />
                {DATA.extras.map((item) => (
                  <ClusterItem
                    key={item.id}
                    navigation={navigation}
                    {...item}
                  />
                ))}
              </View>
            </SafeAreaView>
          </ScrollView>
        </ThemedView>
        <UnderLay underlayUri={underlayUri} pressEv={pressEv} cords={cords} />
      </>
    );
  }
);

interface BarTextProps extends ThemedTextProps {
  children: React.ReactNode;
}

const BarText = memo(({ children, ...otherProps }: BarTextProps) => {
  const text = useThemeColor({}, "barTextColor");
  return (
    <ThemedText style={{ color: text }} {...otherProps}>
      {children}
    </ThemedText>
  );
});

const Divider = memo(() => {
  const { colorScheme } = useTheme();
  return (
    <View
      style={{
        height: 1.5,
        marginVertical: 6,
        backgroundColor: "#000000",
        opacity: colorScheme === "dark" ? 0.3 : 0.05,
      }}
    />
  );
});

const ClusterItem = memo(
  ({ icon: Icon, label, navigation }: MenuItem & { navigation: any }) => {
    const text = useThemeColor({}, "text");

    return (
      <Pressable
        style={[styles.row, styles.section, { height: 55 }]}
        android_ripple={{ color: text + "00" }}
        onPress={() => navigation.closeDrawer()}
      >
        <View style={styles.cluster}>
          <Icon
            size={23}
            strokeWidth={1.8}
            color={text}
            style={{ opacity: 0.8 }}
          />
          <ThemedText style={{ fontSize: 15 }}>{label}</ThemedText>
        </View>
      </Pressable>
    );
  }
);

const UnderLay = ({
  underlayUri,
  pressEv,
  cords,
}: {
  underlayUri: string | null;
  pressEv: SharedValue<string>;
  cords: SharedValue<{ x: number; y: number }>;
}) => {
  const { width, height: windowHeight } = useWindowDimensions();
  const [height, setHeight] = useState(windowHeight);
  const { colorScheme } = useTheme();
  const progress = useDrawerProgress();
  const visible = useSharedValue(true);
  const invertClip = useSharedValue(true);

  useEffect(() => {
    invertClip.value = colorScheme === "light";
  }, [underlayUri]);

  useAnimatedReaction(
    () => progress.value,
    (current) => {
      if (current !== 1) {
        visible.value = false;
        pressEv.value = "";
      }
    }
  );

  const radius = useDerivedValue(() => {
    return withTiming(
      colorScheme === "dark" ? height : 0,
      {
        duration: ANIMATION_DURATION,
        easing: beizer,
      },
      () => {
        visible.value = false;
      }
    );
  });

  const animatedStyle = useAnimatedStyle(() => {
    const condition = pressEv.value === "press" || visible.value;

    return {
      opacity: condition ? 1 : 0,
    };
  });

  const image = useImage(underlayUri);

  const clipPath = useDerivedValue(() => {
    const path = Skia.Path.Make();
    const _cords = cords.value;
    path.addCircle(_cords.x, _cords.y, radius.value);
    return path;
  });

  if (!underlayUri || !image) return null;

  return (
    <Animated.View
      style={[styles.underlay, { width, top: 0, bottom: 0 }, animatedStyle]}
      onLayout={(e) => {
        const { height: layoutHeight } = e.nativeEvent.layout;
        setHeight(layoutHeight);
      }}
    >
      <Canvas style={{ flex: 1 }}>
        <Group clip={clipPath} invertClip={invertClip}>
          <SkiaImage
            image={image}
            x={0}
            y={0}
            width={width}
            height={height}
            fit="fitWidth"
          />
        </Group>
      </Canvas>
    </Animated.View>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  header: {
    alignItems: "center",
    paddingTop: 20,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageContainer: {
    width: 60,
    aspectRatio: 1,
    borderRadius: "50%",
    overflow: "hidden",
  },
  clusterGroup: {
    minHeight: "100%",
  },
  cluster: {
    flexDirection: "row",
    alignItems: "center",
    gap: 26,
  },
  underlay: {
    position: "absolute",
    pointerEvents: "none",
  },

  overlay: {
    position: "absolute",
  },
});
