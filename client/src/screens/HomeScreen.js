import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { getSalons } from "../api/salonApi";
import AnimatedCard from "../components/AnimatedCard";
import ScreenContainer from "../components/ScreenContainer";
import SectionHeader from "../components/SectionHeader";
import { EmptyState, ErrorState, LoadingState } from "../components/StateView";
import { getSalonDistanceLabel } from "../utils/location";

function SalonCard({ salon, onPress }) {
  const imageUri = salon.bannerImage || salon.imageUrl || salon.image;
  const distanceLabel = getSalonDistanceLabel(salon);

  return (
    <AnimatedCard style={styles.cardShell} contentStyle={styles.card} onPress={onPress}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.cardImage} resizeMode="cover" />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>Salon Preview</Text>
        </View>
      )}
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <View style={styles.cardCopy}>
            <Text style={styles.kicker}>Nearby salon</Text>
            <Text style={styles.cardTitle}>
              {salon.name || salon.salonName || "Unnamed Salon"}
            </Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {salon.rating ? `${salon.rating} rating` : "Open now"}
            </Text>
          </View>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Location</Text>
          <Text style={styles.cardText}>
            {salon.address || salon.location || "Address not available"}
          </Text>
        </View>
        <View style={styles.distanceRow}>
          <Text style={styles.distanceLabel}>Distance</Text>
          <Text style={styles.distanceValue}>{distanceLabel}</Text>
        </View>
        <View style={styles.footerRow}>
          <Text style={styles.footerHint}>View services and book</Text>
          <Text style={styles.footerAction}>View</Text>
        </View>
      </View>
    </AnimatedCard>
  );
}

export default function HomeScreen({ navigation }) {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const loadSalons = useCallback(async (isRefreshing = false) => {
    try {
      setError("");
      if (isRefreshing) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const result = await getSalons();
      setSalons(result);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Unable to fetch salons.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadSalons();
  }, [loadSalons]);

  const filteredSalons = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      return salons;
    }

    return salons.filter((salon) => {
      const name = `${salon.name || salon.salonName || ""}`.toLowerCase();
      const location = `${salon.address || salon.location || ""}`.toLowerCase();
      return name.includes(query) || location.includes(query);
    });
  }, [salons, searchQuery]);

  if (loading) {
    return (
      <ScreenContainer>
        <LoadingState label="Fetching salons..." />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <FlatList
        data={filteredSalons}
        keyExtractor={(item, index) => String(item.id ?? item.salonId ?? index)}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadSalons(true)}
            tintColor="#d56f3e"
          />
        }
        ListHeaderComponent={
          <View>
            <SectionHeader
              title="Nearby Salons"
              subtitle="Discover top salons near you with timings, ratings, and quick booking."
              rightSlot={
                <Pressable
                  style={styles.secondaryButton}
                  onPress={() => navigation.navigate("Dashboard")}
                >
                  <Text style={styles.secondaryButtonText}>Dashboard</Text>
                </Pressable>
              }
            />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by salon name or location"
              style={styles.searchInput}
            />
          </View>
        }
        renderItem={({ item }) => (
          <SalonCard
            salon={item}
            onPress={() =>
              navigation.navigate("SalonDetails", {
                salon: item,
                salonId: item.id ?? item.salonId,
              })
            }
          />
        )}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        ListEmptyComponent={
          error ? (
            <ErrorState message={error} />
          ) : (
            <EmptyState
              title="No salons found"
              subtitle={
                searchQuery
                  ? "Try a different name or location."
                  : "No salons are available right now."
              }
            />
          )
        }
        contentContainerStyle={styles.listContent}
      />
      {error && salons.length > 0 ? <ErrorState message={error} /> : null}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 24,
  },
  searchInput: {
    height: 52,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ead9ca",
    backgroundColor: "#fffaf6",
    paddingHorizontal: 16,
    marginBottom: 16,
    color: "#2a1f15",
  },
  secondaryButton: {
    paddingHorizontal: 15,
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: "#1f1511",
    shadowColor: "#1f1511",
    shadowOpacity: 0.14,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 4,
  },
  secondaryButtonText: {
    color: "#fff",
    fontWeight: "800",
  },
  cardShell: {
    overflow: "hidden",
  },
  card: {
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#efdccc",
    padding: 0,
  },
  cardImage: {
    width: "100%",
    height: 170,
    backgroundColor: "#f0e2d7",
  },
  placeholderImage: {
    width: "100%",
    height: 170,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f6e7db",
  },
  placeholderText: {
    color: "#b27b5e",
    fontWeight: "700",
  },
  cardBody: {
    padding: 18,
  },
  cardCopy: {
    flex: 1,
  },
  kicker: {
    marginBottom: 6,
    color: "#c96e40",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  cardTitle: {
    flex: 1,
    fontSize: 21,
    fontWeight: "800",
    color: "#2a1f15",
  },
  badge: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#1f1511",
  },
  badgeText: {
    color: "#fff6ef",
    fontWeight: "800",
    fontSize: 11,
  },
  metaRow: {
    marginBottom: 10,
  },
  metaLabel: {
    marginBottom: 4,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: "#b27b5e",
  },
  cardText: {
    fontSize: 14,
    color: "#5d5248",
    lineHeight: 20,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "#f0e2d7",
    marginTop: 10,
  },
  distanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  distanceLabel: {
    color: "#b27b5e",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  distanceValue: {
    color: "#24170f",
    fontSize: 14,
    fontWeight: "800",
  },
  footerHint: {
    color: "#7d7066",
    fontSize: 13,
    fontWeight: "600",
  },
  footerAction: {
    color: "#1f1511",
    fontSize: 13,
    fontWeight: "800",
  },
});
