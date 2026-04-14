import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Audio } from "expo-av";
import {
  Animated,
  FlatList,
  Modal,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  Vibration,
  View,
} from "react-native";
import { getOrders, updateOrderStatus } from "../api/merchantApi";
import AnimatedCard from "../components/AnimatedCard";
import PrimaryButton from "../components/PrimaryButton";
import ScreenContainer from "../components/ScreenContainer";
import SectionHeader from "../components/SectionHeader";
import { EmptyState, ErrorState, LoadingState } from "../components/StateView";

function getOrderId(order, index) {
  return order.id ?? order.orderId ?? `fallback-${index}`;
}

function getStatusTone(status) {
  switch (`${status || "PENDING"}`.toUpperCase()) {
    case "ACCEPTED":
      return styles.acceptedChip;
    case "REJECTED":
      return styles.rejectedChip;
    default:
      return styles.pendingChip;
  }
}

function OrderCard({ order, highlighted, onAccept, onReject }) {
  const status = `${order.status || "PENDING"}`.toUpperCase();

  return (
    <AnimatedCard contentStyle={[styles.orderCard, highlighted ? styles.orderCardHighlight : null]}>
      <View style={styles.orderTopRow}>
        <View style={styles.orderIdentity}>
          <Text style={styles.orderLabel}>Incoming Booking</Text>
          <Text style={styles.orderValue}>{order.customerName || "Guest User"}</Text>
          <Text style={styles.orderId}>Order #{order.id}</Text>
        </View>
        <View style={[styles.statusChip, getStatusTone(status)]}>
          <Text style={styles.statusText}>{status}</Text>
        </View>
      </View>

      <View style={styles.infoGrid}>
        <View style={styles.infoPill}>
          <Text style={styles.infoPillLabel}>Service</Text>
          <Text style={styles.infoPillValue}>{order.serviceName || "Service"}</Text>
        </View>
        <View style={styles.infoPill}>
          <Text style={styles.infoPillLabel}>Slot</Text>
          <Text style={styles.infoPillValue}>{order.timeSlot || "Time slot"}</Text>
        </View>
      </View>

      <View style={styles.customerMetaBlock}>
        <Text style={styles.customerMetaLine}>Contact: {order.mobile || "Mobile not available"}</Text>
      </View>

      {status === "PENDING" ? (
        <View style={styles.actionRow}>
          <PrimaryButton label="Accept Order" onPress={onAccept} style={styles.actionButton} />
          <PrimaryButton label="Reject" onPress={onReject} style={styles.actionButtonSecondary} />
        </View>
      ) : null}
    </AnimatedCard>
  );
}

function NewOrderModal({ order, visible, onAccept, onReject, onClose }) {
  const slide = useRef(new Animated.Value(40)).current;
  const pulse = useRef(new Animated.Value(0.96)).current;

  useEffect(() => {
    if (!visible) {
      pulse.stopAnimation();
      pulse.setValue(0.96);
      return undefined;
    }

    slide.setValue(40);
    Animated.timing(slide, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.04,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0.96,
          duration: 700,
          useNativeDriver: true,
        }),
      ])
    );

    pulseLoop.start();
    return () => pulseLoop.stop();
  }, [pulse, slide, visible]);

  if (!order) {
    return null;
  }

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Animated.View style={[styles.modalPulseHalo, { transform: [{ scale: pulse }] }]} />
        <Animated.View style={[styles.modalCard, { transform: [{ translateY: slide }] }]}>
          <View style={styles.modalHeaderRow}>
            <View>
              <Text style={styles.modalEyebrow}>New Booking Alert</Text>
              <Text style={styles.modalCustomer}>{order.customerName || "Guest User"}</Text>
            </View>
            <View style={styles.modalLiveBadge}>
              <Text style={styles.modalLiveBadgeText}>LIVE</Text>
            </View>
          </View>

          <View style={styles.modalSummaryStrip}>
            <View style={styles.modalSummaryItem}>
              <Text style={styles.modalSummaryLabel}>Service</Text>
              <Text style={styles.modalSummaryValue}>{order.serviceName || "Service"}</Text>
            </View>
            <View style={styles.modalSummaryItem}>
              <Text style={styles.modalSummaryLabel}>Slot</Text>
              <Text style={styles.modalSummaryValue}>{order.timeSlot || "Time slot"}</Text>
            </View>
          </View>

          <Text style={styles.modalMeta}>Mobile: {order.mobile || "Mobile not available"}</Text>
          <Text style={styles.modalMeta}>Order ID: #{order.id}</Text>

          <View style={styles.modalActions}>
            <PrimaryButton label="Accept Booking" onPress={onAccept} style={styles.modalActionButton} />
            <PrimaryButton label="Reject Booking" onPress={onReject} style={styles.modalActionButtonAlt} />
          </View>

          <Pressable onPress={onClose} style={styles.modalDismiss}>
            <Text style={styles.modalDismissText}>Keep in queue</Text>
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

export default function OrdersScreen() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [incomingOrder, setIncomingOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [highlightedOrderId, setHighlightedOrderId] = useState(null);
  const seenIdsRef = useRef(new Set());
  const alertSoundRef = useRef(null);

  const stopAlertSound = useCallback(async () => {
    if (!alertSoundRef.current) {
      return;
    }

    try {
      await alertSoundRef.current.stopAsync();
      await alertSoundRef.current.unloadAsync();
    } catch (error) {
      console.log("Unable to stop merchant alert sound:", error?.message || error);
    } finally {
      alertSoundRef.current = null;
    }
  }, []);

  const playAlertSound = useCallback(async () => {
    try {
      await stopAlertSound();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/new-order-alert.wav"),
        {
          shouldPlay: true,
          isLooping: true,
          volume: 1,
        }
      );

      alertSoundRef.current = sound;
    } catch (error) {
      console.log("Unable to play merchant alert sound:", error?.message || error);
    }
  }, [stopAlertSound]);

  const closeIncomingOrder = useCallback(async () => {
    setModalVisible(false);
    await stopAlertSound();
  }, [stopAlertSound]);

  const loadOrders = useCallback(
    async (isRefresh = false) => {
      try {
        setError("");
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        const result = await getOrders();
        const normalized = result.map((order, index) => ({
          ...order,
          id: getOrderId(order, index),
        }));

        const nextPending = normalized.find(
          (order) =>
            !seenIdsRef.current.has(order.id) &&
            `${order.status || "PENDING"}`.toUpperCase() === "PENDING"
        );

        normalized.forEach((order) => {
          if (order.id !== undefined && order.id !== null) {
            seenIdsRef.current.add(order.id);
          }
        });

        if (nextPending) {
          setIncomingOrder(nextPending);
          setHighlightedOrderId(nextPending.id);
          setModalVisible(true);
          Vibration.vibrate([0, 240, 140, 240, 140, 320]);
          playAlertSound();
        }

        setOrders(normalized);
      } catch (loadError) {
        setError(loadError?.response?.data?.message || loadError.message || "Unable to fetch orders.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [playAlertSound]
  );

  useEffect(() => {
    loadOrders();
    const intervalId = setInterval(() => {
      loadOrders(true);
    }, 3000);

    return () => {
      clearInterval(intervalId);
      stopAlertSound();
    };
  }, [loadOrders, stopAlertSound]);

  const handleStatusChange = async (id, status) => {
    if (!id) {
      return;
    }

    try {
      const updated = await updateOrderStatus(id, status);
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === id ? { ...order, ...updated, id: order.id } : order
        )
      );

      if (incomingOrder?.id === id) {
        setIncomingOrder(null);
        await closeIncomingOrder();
      }
    } catch (statusError) {
      setError(
        statusError?.response?.data?.message ||
          statusError.message ||
          "Unable to update order status."
      );
    }
  };

  const sortedOrders = useMemo(
    () =>
      [...orders].sort((left, right) => {
        const leftPending = `${left.status || "PENDING"}`.toUpperCase() === "PENDING" ? 0 : 1;
        const rightPending = `${right.status || "PENDING"}`.toUpperCase() === "PENDING" ? 0 : 1;
        return leftPending - rightPending;
      }),
    [orders]
  );

  const stats = useMemo(() => {
    const pending = orders.filter((order) => `${order.status || "PENDING"}`.toUpperCase() === "PENDING").length;
    const accepted = orders.filter((order) => `${order.status}`.toUpperCase() === "ACCEPTED").length;
    return {
      pending,
      accepted,
      total: orders.length,
    };
  }, [orders]);

  if (loading) {
    return (
      <ScreenContainer>
        <LoadingState label="Loading orders..." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <FlatList
        data={sortedOrders}
        keyExtractor={(item, index) => String(item.id ?? index)}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadOrders(true)}
            tintColor="#d56f3e"
          />
        }
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <SectionHeader
              title="Live Orders"
              subtitle="Respond quickly to every incoming booking from one focused view."
            />
            <View style={styles.liveBoard}>
              <View style={styles.liveBoardPrimary}>
                <Text style={styles.liveBoardEyebrow}>Order Desk</Text>
                <Text style={styles.liveBoardTitle}>Stay ready for the next booking</Text>
                <Text style={styles.liveBoardCopy}>
                  Incoming bookings are highlighted first so your team can act without delay.
                </Text>
              </View>
              <View style={styles.metricRow}>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{stats.pending}</Text>
                  <Text style={styles.metricLabel}>Pending</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{stats.accepted}</Text>
                  <Text style={styles.metricLabel}>Accepted</Text>
                </View>
                <View style={styles.metricCard}>
                  <Text style={styles.metricValue}>{stats.total}</Text>
                  <Text style={styles.metricLabel}>Total</Text>
                </View>
              </View>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <OrderCard
            order={item}
            highlighted={item.id === highlightedOrderId}
            onAccept={() => handleStatusChange(item.id, "ACCEPTED")}
            onReject={() => handleStatusChange(item.id, "REJECTED")}
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          error ? (
            <ErrorState message={error} />
          ) : (
            <EmptyState title="No Orders" subtitle="New customer bookings will appear here." />
          )
        }
      />

      <NewOrderModal
        order={incomingOrder}
        visible={modalVisible}
        onAccept={() => handleStatusChange(incomingOrder?.id, "ACCEPTED")}
        onReject={() => handleStatusChange(incomingOrder?.id, "REJECTED")}
        onClose={closeIncomingOrder}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 26,
  },
  liveBoard: {
    marginBottom: 18,
    borderRadius: 28,
    padding: 20,
    backgroundColor: "#1f1713",
    borderWidth: 1,
    borderColor: "#3b2b24",
  },
  liveBoardPrimary: {
    marginBottom: 16,
  },
  liveBoardEyebrow: {
    color: "#f4b28f",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.1,
    marginBottom: 8,
  },
  liveBoardTitle: {
    color: "#fff8f3",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
  },
  liveBoardCopy: {
    color: "#d7c5ba",
    lineHeight: 21,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  metricCard: {
    flex: 1,
    marginRight: 10,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: "#2c221d",
  },
  metricValue: {
    color: "#fff7f1",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  metricLabel: {
    color: "#c9b4a6",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  orderCard: {
    padding: 18,
  },
  orderCardHighlight: {
    borderColor: "#d36f3f",
    backgroundColor: "#fff5ef",
  },
  orderTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  orderIdentity: {
    flex: 1,
    paddingRight: 12,
  },
  orderLabel: {
    color: "#b26f4c",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.9,
    marginBottom: 4,
  },
  orderValue: {
    color: "#24170f",
    fontSize: 21,
    fontWeight: "800",
    marginBottom: 4,
  },
  orderId: {
    color: "#8d7d73",
    fontSize: 13,
    fontWeight: "700",
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  pendingChip: {
    backgroundColor: "#fff0e5",
  },
  acceptedChip: {
    backgroundColor: "#e4f4e8",
  },
  rejectedChip: {
    backgroundColor: "#f9e2e0",
  },
  statusText: {
    color: "#7d4327",
    fontWeight: "800",
    fontSize: 12,
  },
  infoGrid: {
    flexDirection: "row",
    marginBottom: 14,
  },
  infoPill: {
    flex: 1,
    marginRight: 10,
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#fbf3ec",
    borderWidth: 1,
    borderColor: "#efe1d4",
  },
  infoPillLabel: {
    color: "#b26f4c",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  infoPillValue: {
    color: "#24170f",
    fontSize: 15,
    fontWeight: "700",
  },
  customerMetaBlock: {
    borderTopWidth: 1,
    borderTopColor: "#f0e3d8",
    paddingTop: 12,
  },
  customerMetaLine: {
    color: "#6e6158",
    lineHeight: 21,
  },
  actionRow: {
    flexDirection: "row",
    marginTop: 14,
  },
  actionButton: {
    flex: 1,
    marginRight: 10,
  },
  actionButtonSecondary: {
    flex: 1,
    marginRight: 0,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(23, 16, 12, 0.52)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalPulseHalo: {
    position: "absolute",
    width: 280,
    height: 280,
    borderRadius: 999,
    backgroundColor: "rgba(219, 112, 66, 0.18)",
  },
  modalCard: {
    width: "100%",
    borderRadius: 30,
    backgroundColor: "#fffaf6",
    padding: 24,
    borderWidth: 1,
    borderColor: "#efdfd2",
  },
  modalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  modalEyebrow: {
    color: "#c96e40",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  modalCustomer: {
    color: "#24170f",
    fontSize: 28,
    fontWeight: "800",
  },
  modalLiveBadge: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#1f1713",
  },
  modalLiveBadgeText: {
    color: "#fff7f1",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.9,
  },
  modalSummaryStrip: {
    flexDirection: "row",
    marginBottom: 16,
  },
  modalSummaryItem: {
    flex: 1,
    marginRight: 10,
    padding: 14,
    borderRadius: 20,
    backgroundColor: "#fbf3ec",
  },
  modalSummaryLabel: {
    color: "#b26f4c",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  modalSummaryValue: {
    color: "#24170f",
    fontSize: 16,
    fontWeight: "800",
  },
  modalMeta: {
    color: "#6e6158",
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 4,
  },
  modalActions: {
    marginTop: 18,
  },
  modalActionButton: {
    marginBottom: 12,
  },
  modalActionButtonAlt: {
    marginBottom: 0,
  },
  modalDismiss: {
    alignSelf: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginTop: 8,
  },
  modalDismissText: {
    color: "#b26f4c",
    fontWeight: "800",
  },
});
