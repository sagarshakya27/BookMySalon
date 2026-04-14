import React, { useCallback, useEffect, useState } from "react";
import {
  FlatList,
  Linking,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getOrders } from "../api/orderApi";
import { subscribeToOrders } from "../api/websocket";
import AnimatedCard from "../components/AnimatedCard";
import ScreenContainer from "../components/ScreenContainer";
import SectionHeader from "../components/SectionHeader";
import { EmptyState, ErrorState, LoadingState } from "../components/StateView";
import { buildGoogleMapsUrl } from "../utils/location";

function OrderCard({ order }) {
  const orderId = order.id ?? order.orderId;
  const normalizedStatus = `${order.status || "PLACED"}`.toUpperCase();
  const canOpenMap = normalizedStatus === "ACCEPTED" || normalizedStatus === "CONFIRMED";

  const handleOpenMap = async () => {
    const mapUrl = buildGoogleMapsUrl(order.salon || order);

    try {
      await Linking.openURL(mapUrl);
    } catch (error) {
      console.log("Unable to open maps:", error?.message || error);
    }
  };

  return (
    <AnimatedCard contentStyle={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.titleWrap}>
          <Text style={styles.overline}>Booking summary</Text>
          <Text style={styles.title}>Order #{orderId ?? "-"}</Text>
        </View>
        <View style={styles.statusChip}>
          <Text style={styles.statusText}>{order.status || "Placed"}</Text>
        </View>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Salon</Text>
        <Text style={styles.detailValue}>
          {order.salonName || order.salon?.name || order.salonId || "N/A"}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Service</Text>
        <Text style={styles.detailValue}>
          {order.serviceName || order.service?.name || order.serviceId || "N/A"}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Customer</Text>
        <Text style={styles.detailValue}>
          {order.customerName || "Guest User"} | {order.mobile || "N/A"}
        </Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Slot</Text>
        <Text style={styles.detailValue}>{order.timeSlot || "Not assigned"}</Text>
      </View>
      {canOpenMap ? (
        <View style={styles.actionRow}>
          <Pressable style={styles.actionButton} onPress={handleOpenMap}>
            <Text style={styles.actionButtonText}>Open In Google Maps</Text>
          </Pressable>
        </View>
      ) : null}
    </AnimatedCard>
  );
}

export default function OrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [liveEnabled, setLiveEnabled] = useState(true);

  const loadOrders = useCallback(async (isRefreshing = false) => {
    try {
      setError("");
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const result = await getOrders();
      setOrders(result);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Unable to fetch orders.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  useEffect(() => {
    const unsubscribe = subscribeToOrders(
      (incomingOrder) => {
        setLiveEnabled(true);
        setOrders((currentOrders) => {
          const currentId = incomingOrder.id ?? incomingOrder.orderId;
          const existingIndex = currentOrders.findIndex(
            (order) => (order.id ?? order.orderId) === currentId
          );

          if (existingIndex === -1) {
            return [incomingOrder, ...currentOrders];
          }

          const nextOrders = [...currentOrders];
          nextOrders[existingIndex] = incomingOrder;
          return nextOrders;
        });
      },
      () => {
        setLiveEnabled(false);
      }
    );

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <ScreenContainer>
        <LoadingState label="Fetching orders..." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <FlatList
        data={orders}
        keyExtractor={(item, index) => String(item.id ?? item.orderId ?? index)}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadOrders(true)}
            tintColor="#d56f3e"
          />
        }
        ListHeaderComponent={
          <View>
            <SectionHeader
              title="Your Orders"
              subtitle="Stay on top of every booking from confirmation to arrival."
              rightSlot={
                <Pressable
                  style={styles.secondaryButton}
                  onPress={() => navigation.navigate("Dashboard")}
                >
                  <Text style={styles.secondaryButtonText}>Dashboard</Text>
                </Pressable>
              }
            />
            <AnimatedCard contentStyle={styles.liveCard}>
              <Text style={styles.liveTitle}>Booking status</Text>
              <Text style={styles.liveText}>
                {liveEnabled
                  ? "Recent status updates appear here automatically as your booking moves forward."
                  : "Refresh to see the latest booking updates."}
              </Text>
            </AnimatedCard>
          </View>
        }
        renderItem={({ item }) => <OrderCard order={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        ListEmptyComponent={
          error ? (
            <ErrorState message={error} />
          ) : (
            <EmptyState
              title="No orders yet"
              subtitle="Book a service from the salon details screen to see it here."
            />
          )
        }
        contentContainerStyle={styles.listContent}
      />
      {error && orders.length > 0 ? <ErrorState message={error} /> : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 24,
  },
  secondaryButton: {
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 16,
    backgroundColor: "#231711",
  },
  secondaryButtonText: {
    color: "#fff",
    fontWeight: "800",
  },
  liveCard: {
    padding: 18,
    marginBottom: 16,
    backgroundColor: "#fff7ef",
  },
  liveTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#24170f",
    marginBottom: 8,
  },
  liveText: {
    color: "#6f6259",
    lineHeight: 21,
  },
  card: {
    padding: 18,
    backgroundColor: "#fffdf9",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  titleWrap: {
    flex: 1,
  },
  overline: {
    marginBottom: 6,
    color: "#c96e40",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  title: {
    flex: 1,
    fontSize: 19,
    fontWeight: "800",
    color: "#2a1f15",
  },
  statusChip: {
    backgroundColor: "#fff1e8",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  statusText: {
    color: "#cb6c3d",
    fontWeight: "800",
    textTransform: "capitalize",
  },
  detailRow: {
    marginBottom: 10,
  },
  detailLabel: {
    marginBottom: 4,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "#b27b5e",
  },
  detailValue: {
    fontSize: 14,
    color: "#655950",
    lineHeight: 20,
  },
  actionRow: {
    flexDirection: "row",
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    height: 46,
    borderRadius: 16,
    backgroundColor: "#24170f",
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "800",
  },
  rejectButton: {
    backgroundColor: "#fff1e8",
    marginLeft: 10,
  },
  rejectButtonText: {
    color: "#c96e40",
  },
});
