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
import LoginScreen from "./src/screens/LoginScreen";
import OrdersScreen from "./src/screens/OrdersScreen";
import RegisterScreen from "./src/screens/RegisterScreen";
import SalonFormScreen from "./src/screens/SalonFormScreen";
import ServiceFormScreen from "./src/screens/ServiceFormScreen";

const SCREEN_TITLES = {
  Login: "Merchant Login",
  Register: "Create Merchant Account",
  Dashboard: "Overview",
  SalonForm: "Add Salon",
  ServiceForm: "Add Services",
  Orders: "Live Orders",
};

const DRAWER_ITEMS = [
  { key: "Dashboard", label: "Overview", icon: "O" },
  { key: "SalonForm", label: "Add Salon", icon: "S" },
  { key: "ServiceForm", label: "Services", icon: "S" },
  { key: "Orders", label: "Orders", icon: "L" },
];

const guestMerchant = {
  ownerName: "Salon Owner",
  email: "owner@bookmysalon.app",
  mobile: "9999999999",
};

function Drawer({ currentRoute, merchantUser, onNavigate, onClose, onLogout }) {
  const initials = (merchantUser?.ownerName || "S")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <View style={styles.drawerOverlay}>
      <Pressable style={styles.drawerBackdrop} onPress={onClose} />
      <View style={styles.drawerPanel}>
        <View style={styles.brandCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.brandEyebrow}>Book My Salon</Text>
          <Text style={styles.brandTitle}>{merchantUser?.ownerName || "Salon Owner"}</Text>
          <Text style={styles.brandSubtitle}>{merchantUser?.email || "owner@bookmysalon.app"}</Text>
        </View>

        <View>
          {DRAWER_ITEMS.map((item) => {
            const active = item.key === currentRoute;
            return (
              <Pressable
                key={item.key}
                onPress={() => onNavigate(item.key)}
                style={[styles.drawerItem, active ? styles.drawerItemActive : null]}
              >
                <Text style={[styles.drawerItemIcon, active ? styles.drawerItemIconActive : null]}>
                  {item.icon}
                </Text>
                <Text style={[styles.drawerItemText, active ? styles.drawerItemTextActive : null]}>
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable style={styles.logoutButton} onPress={onLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [merchantUser, setMerchantUser] = useState(guestMerchant);
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
      replace: (name, params = {}) => {
        setDrawerOpen(false);
        setStack((currentStack) => [...currentStack.slice(0, -1), { name, params }]);
      },
      reset: resetStack,
      goBack: () => {
        setDrawerOpen(false);
        setStack((currentStack) =>
          currentStack.length > 1 ? currentStack.slice(0, -1) : currentStack
        );
      },
      signIn: (user) => {
        setMerchantUser(user);
        setIsAuthenticated(true);
        resetStack("Dashboard");
      },
      signOut: () => {
        setMerchantUser(guestMerchant);
        setIsAuthenticated(false);
        setDrawerOpen(false);
        resetStack("Login");
      },
      updateMerchant: (updates) => {
        setMerchantUser((existing) => ({ ...existing, ...updates }));
      },
      toggleDrawer: () => setDrawerOpen((value) => !value),
      closeDrawer: () => setDrawerOpen(false),
    }),
    []
  );

  const route = {
    ...currentRoute,
    params: {
      ...currentRoute.params,
      merchantUser,
      isAuthenticated,
    },
  };

  const screen = (() => {
    switch (currentRoute.name) {
      case "Register":
        return <RegisterScreen navigation={navigation} route={route} />;
      case "Dashboard":
        return <DashboardScreen navigation={navigation} route={route} />;
      case "SalonForm":
        return <SalonFormScreen navigation={navigation} route={route} />;
      case "ServiceForm":
        return <ServiceFormScreen navigation={navigation} route={route} />;
      case "Orders":
        return <OrdersScreen navigation={navigation} route={route} />;
      case "Login":
      default:
        return <LoginScreen navigation={navigation} route={route} />;
    }
  })();

  const showHeader = !["Login", "Register"].includes(currentRoute.name);

  return (
    <SafeAreaView style={styles.app}>
      <StatusBar style="dark" />
      {showHeader ? (
        <View style={styles.header}>
          <Pressable style={styles.headerAction} onPress={navigation.toggleDrawer}>
            <Text style={styles.headerActionText}>Menu</Text>
          </Pressable>
          <View style={styles.headerCenter}>
            <Text style={styles.headerEyebrow}>Merchant Console</Text>
            <Text style={styles.headerTitle}>{SCREEN_TITLES[currentRoute.name]}</Text>
          </View>
          <Pressable style={styles.headerAvatar} onPress={() => navigation.navigate("Dashboard")}>
            <Text style={styles.headerAvatarText}>
              {(merchantUser?.ownerName || "S").slice(0, 1).toUpperCase()}
            </Text>
          </Pressable>
        </View>
      ) : null}
      <View style={styles.content}>{screen}</View>
      {showHeader && drawerOpen ? (
        <Drawer
          currentRoute={currentRoute.name}
          merchantUser={merchantUser}
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
    backgroundColor: "#f6f0ea",
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
  },
  headerAction: {
    width: 82,
    borderRadius: 16,
    backgroundColor: "#f6ede5",
    paddingVertical: 10,
    alignItems: "center",
  },
  headerActionText: {
    color: "#1f1511",
    fontWeight: "800",
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
  },
  headerEyebrow: {
    color: "#b27c5f",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  headerTitle: {
    color: "#1f1511",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
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
    color: "#fffaf6",
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
    width: 300,
    backgroundColor: "#fffdf9",
    paddingHorizontal: 18,
    paddingTop: 28,
    paddingBottom: 20,
    borderLeftWidth: 1,
    borderLeftColor: "#efdfd2",
  },
  brandCard: {
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
    color: "#fffaf6",
    fontWeight: "800",
    fontSize: 20,
  },
  brandEyebrow: {
    color: "#b7653e",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.1,
    marginBottom: 6,
  },
  brandTitle: {
    color: "#241711",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  brandSubtitle: {
    color: "#716359",
    lineHeight: 20,
  },
  drawerItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 18,
    marginBottom: 8,
  },
  drawerItemActive: {
    backgroundColor: "#fff1e7",
  },
  drawerItemIcon: {
    width: 24,
    color: "#b27c5f",
    fontWeight: "800",
    fontSize: 16,
    marginRight: 10,
  },
  drawerItemIconActive: {
    color: "#c46234",
  },
  drawerItemText: {
    color: "#2b2018",
    fontSize: 16,
    fontWeight: "700",
  },
  drawerItemTextActive: {
    color: "#c46234",
  },
  logoutButton: {
    marginTop: "auto",
    borderRadius: 18,
    backgroundColor: "#fff1e7",
    paddingVertical: 14,
    alignItems: "center",
  },
  logoutText: {
    color: "#c46234",
    fontWeight: "800",
    fontSize: 16,
  },
});
