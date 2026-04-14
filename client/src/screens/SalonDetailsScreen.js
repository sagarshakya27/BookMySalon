import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getSalonServices } from "../api/salonApi";
import AnimatedCard from "../components/AnimatedCard";
import PrimaryButton from "../components/PrimaryButton";
import ScreenContainer from "../components/ScreenContainer";
import SectionHeader from "../components/SectionHeader";
import { EmptyState, ErrorState, LoadingState } from "../components/StateView";
import { getSalonDistanceLabel } from "../utils/location";

const DEFAULT_SERVICES = [
  {
    id: "service-haircut",
    name: "Haircut",
    price: 299,
    duration: 30,
  },
  {
    id: "service-spa",
    name: "Hair Spa",
    price: 799,
    duration: 45,
  },
  {
    id: "service-facial",
    name: "Facial",
    price: 999,
    duration: 60,
  },
];

const toCurrency = (value) => {
  const number = Number(value);
  if (Number.isNaN(number)) {
    return "Price on request";
  }

  return `Rs. ${number.toFixed(0)}`;
};

function ServiceCard({ service }) {
  return (
    <AnimatedCard contentStyle={styles.serviceCard}>
      <View style={styles.serviceTopRow}>
        <Text style={styles.serviceName}>{service.name || service.serviceName}</Text>
        <Text style={styles.servicePrice}>{toCurrency(service.price)}</Text>
      </View>
      <Text style={styles.serviceMeta}>
        {service.durationInMinutes || service.duration
          ? `${service.durationInMinutes || service.duration} min`
          : "Quick session"}
      </Text>
    </AnimatedCard>
  );
}

export default function SalonDetailsScreen({ navigation, route }) {
  const { salon, salonId, currentUser } = route.params;
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadServices = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const result = await getSalonServices(salonId);
      setServices(result.length ? result : DEFAULT_SERVICES);
    } catch (err) {
      setServices(DEFAULT_SERVICES);
      setError(err?.response?.data?.message || "Using saved services right now.");
    } finally {
      setLoading(false);
    }
  }, [salonId]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const serviceOptions = useMemo(
    () =>
      services.map((service) => service.name || service.serviceName).filter(Boolean),
    [services]
  );

  if (loading) {
    return (
      <ScreenContainer>
        <LoadingState label="Loading salon..." />
      </ScreenContainer>
    );
  }

  const imageUri = salon?.bannerImage || salon?.imageUrl || salon?.image;
  const distanceLabel = getSalonDistanceLabel(salon);

  return (
    <ScreenContainer>
      <FlatList
        data={services}
        keyExtractor={(item, index) => String(item.id ?? item.serviceId ?? index)}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <SectionHeader
              title={salon?.name || salon?.salonName || "Salon"}
              subtitle={salon?.location || salon?.address || ""}
            />

            <AnimatedCard contentStyle={styles.bannerCard}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={styles.bannerImage} resizeMode="cover" />
              ) : (
                <View style={styles.bannerPlaceholder}>
                  <Text style={styles.bannerPlaceholderText}>
                    {salon?.name || salon?.salonName || "Salon"}
                  </Text>
                </View>
              )}
              <View style={styles.bannerBody}>
                <View style={styles.metaRow}>
                  <Text style={styles.metaPill}>
                    {salon?.rating ? `${salon.rating} rating` : "Top rated"}
                  </Text>
                  <Text style={styles.metaPillSecondary}>
                    {distanceLabel}
                  </Text>
                </View>
                <Text style={styles.addressText}>
                  {salon?.address || salon?.location || "Address not available"}
                </Text>
              </View>
            </AnimatedCard>

            <PrimaryButton
              label="Book Appointment"
              onPress={() =>
                navigation.navigate("BookOrder", {
                  salonId,
                  salon,
                  salonName: salon?.name || salon?.salonName,
                  customerName: currentUser?.name || "",
                  mobile: currentUser?.mobile || "",
                  serviceOptions,
                  serviceName: serviceOptions[0] || "",
                })
              }
              style={styles.bookButton}
            />

            <Text style={styles.sectionTitle}>Services</Text>
            {error ? <ErrorState message={error} /> : null}
          </View>
        }
        renderItem={({ item }) => <ServiceCard service={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={
          <EmptyState title="No Services" subtitle="No services available right now." />
        }
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 26,
  },
  bannerCard: {
    overflow: "hidden",
    padding: 0,
    marginBottom: 16,
  },
  bannerImage: {
    width: "100%",
    height: 210,
    backgroundColor: "#f0e2d7",
  },
  bannerPlaceholder: {
    height: 210,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5e8dd",
  },
  bannerPlaceholderText: {
    color: "#8f6d5c",
    fontSize: 20,
    fontWeight: "800",
  },
  bannerBody: {
    padding: 18,
  },
  metaRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  metaPill: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#24170f",
    color: "#fffaf6",
    fontWeight: "800",
    marginRight: 10,
    marginBottom: 8,
  },
  metaPillSecondary: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#fff2e8",
    color: "#cb6d3d",
    fontWeight: "800",
    marginBottom: 8,
  },
  bookButton: {
    marginBottom: 18,
  },
  addressText: {
    color: "#6f6157",
    lineHeight: 21,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#24170f",
    marginBottom: 12,
  },
  serviceCard: {
    padding: 18,
    backgroundColor: "#fffdf9",
  },
  serviceTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  serviceName: {
    color: "#24170f",
    fontSize: 18,
    fontWeight: "800",
    flex: 1,
    marginRight: 10,
  },
  servicePrice: {
    color: "#d06f3f",
    fontSize: 15,
    fontWeight: "800",
  },
  serviceMeta: {
    color: "#7a6c63",
    fontSize: 13,
  },
});
