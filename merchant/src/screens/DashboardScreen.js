import React, { useCallback, useEffect, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { getOrders } from "../api/merchantApi";
import AnimatedCard from "../components/AnimatedCard";
import PrimaryButton from "../components/PrimaryButton";
import ScreenContainer from "../components/ScreenContainer";
import SectionHeader from "../components/SectionHeader";

function StatCard({ label, value, accent }) {
  return (
    <AnimatedCard contentStyle={[styles.statCard, accent ? styles.statCardAccent : null]}>
      <Text style={[styles.statLabel, accent ? styles.statLabelAccent : null]}>{label}</Text>
      <Text style={[styles.statValue, accent ? styles.statValueAccent : null]}>{value}</Text>
    </AnimatedCard>
  );
}

export default function DashboardScreen({ navigation, route }) {
  const merchantUser = route?.params?.merchantUser;
  const [orders, setOrders] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadOrders = useCallback(async () => {
    try {
      setRefreshing(true);
      const result = await getOrders();
      setOrders(result);
    } catch (error) {
      setOrders([]);
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const stats = useMemo(() => {
    const today = new Date().toDateString();
    const pending = orders.filter((order) => `${order.status}`.toUpperCase() === "PENDING").length;
    const todayBookings = orders.filter((order) => {
      const orderDate = order.createdAt ? new Date(order.createdAt).toDateString() : "";
      return orderDate === today;
    }).length;

    return {
      totalOrders: orders.length,
      todayBookings,
      pending,
    };
  }, [orders]);

  return (
    <ScreenContainer>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={loadOrders}
            tintColor="#d56f3e"
          />
        }
      >
        <SectionHeader
          title={`Welcome, ${merchantUser?.ownerName?.split(" ")[0] || "Owner"}`}
          subtitle="Track bookings, manage your salon, and keep operations moving smoothly."
        />

        <AnimatedCard contentStyle={styles.heroCard}>
          <Text style={styles.heroEyebrow}>Today</Text>
          <Text style={styles.heroTitle}>Everything important, in one view</Text>
        </AnimatedCard>

        <View style={styles.statGrid}>
          <StatCard label="Total Orders" value={String(stats.totalOrders)} />
          <StatCard label="Today Bookings" value={String(stats.todayBookings)} />
          <StatCard label="Pending" value={String(stats.pending)} accent />
        </View>

        <AnimatedCard contentStyle={styles.actionCard}>
          <Text style={styles.actionTitle}>Quick Actions</Text>
          <PrimaryButton
            label="Add Salon"
            onPress={() => navigation.navigate("SalonForm")}
            style={styles.buttonSpacing}
          />
          <PrimaryButton
            label="Add Services"
            onPress={() => navigation.navigate("ServiceForm")}
            style={styles.buttonSpacing}
          />
          <PrimaryButton
            label="Open Orders"
            onPress={() => navigation.navigate("Orders")}
            style={styles.buttonSpacing}
          />
        </AnimatedCard>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    padding: 22,
    marginBottom: 16,
    backgroundColor: "#24170f",
    borderColor: "#24170f",
  },
  heroEyebrow: {
    color: "#e9af8b",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  heroTitle: {
    color: "#fffaf6",
    fontSize: 24,
    fontWeight: "800",
  },
  statGrid: {
    marginBottom: 16,
  },
  statCard: {
    padding: 18,
    marginBottom: 12,
  },
  statCardAccent: {
    backgroundColor: "#fff3ea",
  },
  statLabel: {
    color: "#7d7066",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 6,
  },
  statLabelAccent: {
    color: "#bb6a44",
  },
  statValue: {
    color: "#24170f",
    fontSize: 26,
    fontWeight: "800",
  },
  statValueAccent: {
    color: "#bb6a44",
  },
  actionCard: {
    padding: 22,
    marginBottom: 22,
  },
  actionTitle: {
    color: "#24170f",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 4,
  },
  buttonSpacing: {
    marginTop: 12,
  },
});
