import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useColorScheme,
} from "react-native";
import React from "react";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { ThemedText, ThemedTextProps } from "../ThemedText";
import {
  ChevronDown,
  CircleUserRound,
  LucideProps,
  UserPlus,
} from "lucide-react-native";
import { ThemedView } from "../ThemedView";
import { ScrollView } from "react-native-gesture-handler";
import {
  User,
  Wallet,
  Users,
  Phone,
  Bookmark,
  Settings,
  Star,
} from "lucide-react-native";

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

export default function DrawerContent({
  navigation,
}: DrawerContentComponentProps) {
  const text = useThemeColor({}, "barTextColor");
  const bgFade = useThemeColor({}, "bgFade");
  const barColor = useThemeColor({}, "barColor");

  return (
    <ThemedView style={{ flex: 1 }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
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
              <ClusterItem key={item.id} navigation={navigation} {...item} />
            ))}
            <Divider />
            {DATA.features.map((item) => (
              <ClusterItem key={item.id} navigation={navigation} {...item} />
            ))}
            <Divider />
            {DATA.extras.map((item) => (
              <ClusterItem key={item.id} navigation={navigation} {...item} />
            ))}
          </View>
        </SafeAreaView>
      </ScrollView>
    </ThemedView>
  );
}

interface BarTextProps extends ThemedTextProps {
  children: React.ReactNode;
}

const BarText = ({ children, ...otherProps }: BarTextProps) => {
  const text = useThemeColor({}, "barTextColor");
  return (
    <ThemedText style={{ color: text }} {...otherProps}>
      {children}
    </ThemedText>
  );
};

const Divider = () => {
  const theme = useColorScheme();
  return (
    <View
      style={{
        height: 1.5,
        marginVertical: 6,
        backgroundColor: "#000000",
        opacity: theme === "dark" ? 0.3 : 0.05,
      }}
    />
  );
};

const ClusterItem = ({
  icon: Icon,
  label,
  navigation,
}: MenuItem & { navigation: any }) => {
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
};

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
});
