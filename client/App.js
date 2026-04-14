import React, { useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import DashboardScreen from "./src/screens/DashboardScreen";
import BookOrderScreen from "./src/screens/BookOrderScreen";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen";
import HomeScreen from "./src/screens/HomeScreen";
import LoginScreen from "./src/screens/LoginScreen";
import OrdersScreen from "./src/screens/OrdersScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import SalonDetailsScreen from "./src/screens/SalonDetailsScreen";
import SuccessScreen from "./src/screens/SuccessScreen";
import SupportScreen from "./src/screens/SupportScreen";

const SCREEN_TITLES = {
  Login: "Welcome Back",
  Register: "Create Your Account",
  ForgotPassword: "Reset Password",
  Dashboard: "Discover",
  BookOrder: "Book Appointment",
  Home: "Nearby Salons",
  SalonDetails: "Salon Details",
  Success: "Booking Confirmed",
  Orders: "My Bookings",
  Profile: "Profile",
  Support: "Support",
};

const DRAWER_ITEMS = [
  { key: "Home", label: "Explore", icon: "E" },
  { key: "Orders", label: "Bookings", icon: "B" },
  { key: "Profile", label: "Profile", icon: "P" },
  { key: "Support", label: "Support", icon: "S" },
];

const guestUser = {
  name: "Guest User",
  email: "guest@bookmysalon.app",
  mobile: "9999999999",
};

function Drawer({ currentRoute, currentUser, onNavigate, onClose, onLogout }) {
  const initials = (currentUser?.name || "G")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={styles.drawerOverlay}>
      <Pressable style={styles.drawerBackdrop} onPress={onClose} />
      <View style={styles.drawerPanel}>
        <View style={styles.drawerBrandBlock}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.drawerAppName}>Book My Salon</Text>
          <Text style={styles.drawerUserName}>{currentUser?.name || "Guest User"}</Text>
          <Text style={styles.drawerUserMeta}>{currentUser?.email || "guest@bookmysalon.app"}</Text>
        </View>

        <View style={styles.drawerMenu}>
          {DRAWER_ITEMS.map((item) => {
            const active = currentRoute === item.key;
            return (
              <Pressable
                key={item.key}
                onPress={() => onNavigate(item.key)}
                style={[styles.drawerItem, active ? styles.drawerItemActive : null]}
              >
                <Text style={[styles.drawerIcon, active ? styles.drawerIconActive : null]}>
                  {item.icon}
                </Text>
                <Text style={[styles.drawerLabel, active ? styles.drawerLabelActive : null]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable onPress={onLogout} style={styles.logoutButton}>
          <Text style={styles.logoutIcon}>L</Text>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(guestUser);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [stack, setStack] = useState([{ name: "Login", params: {} }]);

  const currentRoute = stack[stack.length - 1];

  const resetStack = (name, params = {}) => {
    setDrawerOpen(false);
    setStack([{ name, params }]);
  };

  const navigation = useMemo(
    () => ({
      navigate: (name, params = {}) => {
        setDrawerOpen(false);
        setStack((currentStack) => [...currentStack, { name, params }]);
      },
      goBack: () => {
        setDrawerOpen(false);
        setStack((currentStack) =>
          currentStack.length > 1 ? currentStack.slice(0, -1) : currentStack
        );
      },
      replace: (name, params = {}) => {
        setDrawerOpen(false);
        setStack((currentStack) => [...currentStack.slice(0, -1), { name, params }]);
      },
      reset: resetStack,
      signIn: (user) => {
        setCurrentUser(user);
        setIsAuthenticated(true);
        resetStack("Dashboard");
      },
      signOut: () => {
        setCurrentUser(guestUser);
        setIsAuthenticated(false);
        setDrawerOpen(false);
        resetStack("Login");
      },
      updateUser: (updates) => {
        setCurrentUser((existing) => ({ ...existing, ...updates }));
      },
      toggleDrawer: () => {
        setDrawerOpen((open) => !open);
      },
      closeDrawer: () => {
        setDrawerOpen(false);
      },
    }),
    []
  );

  const route = {
    ...currentRoute,
    params: {
      ...currentRoute.params,
      currentUser,
      isAuthenticated,
    },
  };

  const screen = (() => {
    switch (currentRoute.name) {
      case "Register":
        return <RegisterScreen navigation={navigation} route={route} />;
      case "ForgotPassword":
        return <ForgotPasswordScreen navigation={navigation} route={route} />;
      case "Dashboard":
        return <DashboardScreen navigation={navigation} route={route} />;
      case "BookOrder":
        return <BookOrderScreen navigation={navigation} route={route} />;
      case "Home":
        return <HomeScreen navigation={navigation} route={route} />;
      case "SalonDetails":
        return <SalonDetailsScreen navigation={navigation} route={route} />;
      case "Success":
        return <SuccessScreen navigation={navigation} route={route} />;
      case "Orders":
        return <OrdersScreen navigation={navigation} route={route} />;
      case "Profile":
        return <ProfileScreen navigation={navigation} route={route} />;
      case "Support":
        return <SupportScreen navigation={navigation} route={route} />;
      case "Login":
      default:
        return <LoginScreen navigation={navigation} route={route} />;
    }
  })();

  const showHeader = !["Login", "Register", "ForgotPassword"].includes(currentRoute.name);

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar style="dark" />
      {showHeader ? (
        <View style={styles.header}>
          <Pressable style={styles.headerPill} onPress={navigation.toggleDrawer}>
            <Text style={styles.headerPillIcon}>|||</Text>
            <Text style={styles.headerPillText}>Menu</Text>
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerEyebrow}>Book My Salon</Text>
            <Text style={styles.headerTitle}>{SCREEN_TITLES[currentRoute.name]}</Text>
          </View>
          <Pressable
            style={styles.headerAvatar}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text style={styles.headerAvatarText}>
              {(currentUser?.name || "G").slice(0, 1).toUpperCase()}
            </Text>
          </Pressable>
        </View>
      ) : null}
      <View style={styles.content}>{screen}</View>
      {showHeader && drawerOpen ? (
        <Drawer
          currentRoute={currentRoute.name}
          currentUser={currentUser}
          onNavigate={(name) => {
            if (name === currentRoute.name) {
              navigation.closeDrawer();
              return;
            }
            navigation.reset(name);
          }}
          onClose={navigation.closeDrawer}
          onLogout={navigation.signOut}
        />
      ) : null}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: "#f7f3ee",
  },
  header: {
    minHeight: 82,
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: "#fbf6f1",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#f1e4d8",
    shadowColor: "#1f140f",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 4,
  },
  headerPill: {
    width: 82,
    borderRadius: 16,
    backgroundColor: "#f6ede5",
    paddingVertical: 9,
    paddingHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  headerPillIcon: {
    color: "#1f1511",
    fontWeight: "800",
    fontSize: 14,
  },
  headerPillText: {
    color: "#1f1511",
    fontWeight: "800",
    fontSize: 11,
    marginTop: 2,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerEyebrow: {
    color: "#b27655",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  headerTitle: {
    textAlign: "center",
    color: "#1f1511",
    fontWeight: "800",
    fontSize: 20,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1f1511",
    alignItems: "center",
    justifyContent: "center",
  },
  headerAvatarText: {
    color: "#fffaf5",
    fontWeight: "800",
    fontSize: 16,
  },
  content: {
    flex: 1,
  },
  drawerOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: "row",
  },
  drawerBackdrop: {
    flex: 1,
    backgroundColor: "rgba(23, 15, 11, 0.28)",
  },
  drawerPanel: {
    width: 290,
    backgroundColor: "#fffdf9",
    borderRightWidth: 1,
    borderRightColor: "#f0e3d8",
    paddingHorizontal: 18,
    paddingTop: 26,
    paddingBottom: 20,
    shadowColor: "#8b5b40",
    shadowOpacity: 0.14,
    shadowOffset: { width: 10, height: 0 },
    shadowRadius: 24,
    elevation: 12,
  },
  drawerBrandBlock: {
    padding: 18,
    borderRadius: 26,
    backgroundColor: "#f7efe7",
    marginBottom: 24,
  },
  avatarCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#241711",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  avatarText: {
    color: "#fff9f4",
    fontSize: 20,
    fontWeight: "800",
  },
  drawerAppName: {
    color: "#b8653d",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  drawerUserName: {
    color: "#241710",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  drawerUserMeta: {
    color: "#6e6158",
    lineHeight: 20,
  },
  drawerMenu: {
    marginBottom: 8,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    marginBottom: 8,
  },
  drawerItemActive: {
    backgroundColor: "#fff0e6",
  },
  drawerIcon: {
    width: 24,
    color: "#b0704e",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  drawerIconActive: {
    color: "#c26035",
  },
  drawerLabel: {
    color: "#2a1e17",
    fontSize: 16,
    fontWeight: "700",
  },
  drawerLabelActive: {
    color: "#c26035",
  },
  logoutButton: {
    marginTop: "auto",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: "#fff2ea",
  },
  logoutIcon: {
    color: "#c26035",
    fontSize: 16,
    fontWeight: "800",
    marginRight: 12,
  },
  logoutText: {
    color: "#c26035",
    fontSize: 16,
    fontWeight: "800",
  },
});
