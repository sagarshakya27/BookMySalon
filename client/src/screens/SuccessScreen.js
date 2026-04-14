import React from "react";
import { Linking, StyleSheet, Text, View } from "react-native";
import AnimatedCard from "../components/AnimatedCard";
import PrimaryButton from "../components/PrimaryButton";
import ScreenContainer from "../components/ScreenContainer";
import { buildGoogleMapsUrl } from "../utils/location";

export default function SuccessScreen({ navigation, route }) {
  const salonName = route?.params?.salonName || "Salon";
  const serviceName = route?.params?.serviceName || "Service";
  const timeSlot = route?.params?.timeSlot || "Selected slot";
  const salon = route?.params?.salon;

  const handleOpenMap = async () => {
    const mapUrl = buildGoogleMapsUrl({
      name: salonName,
      address: salon?.address,
      location: salon?.location,
      latitude: salon?.latitude,
      longitude: salon?.longitude,
    });

    try {
      await Linking.openURL(mapUrl);
    } catch (error) {
      console.log("Unable to open maps:", error?.message || error);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <AnimatedCard contentStyle={styles.card}>
          <View style={styles.iconCircle}>
            <Text style={styles.icon}>OK</Text>
          </View>
          <Text style={styles.title}>Booking Confirmed</Text>
          <Text style={styles.subtitle}>{salonName}</Text>
          <Text style={styles.meta}>{serviceName}</Text>
          <Text style={styles.meta}>{timeSlot}</Text>
        </AnimatedCard>

        <PrimaryButton
          label="View Salon Location"
          onPress={handleOpenMap}
          style={styles.button}
        />

        <PrimaryButton
          label="Back To Home"
          onPress={() => navigation.reset("Home")}
          style={styles.secondaryButton}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  card: {
    alignItems: "center",
    padding: 28,
    backgroundColor: "#fffaf6",
  },
  iconCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: "#eaf7ef",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  icon: {
    fontSize: 24,
    fontWeight: "800",
    color: "#31915d",
  },
  title: {
    color: "#24170f",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 10,
  },
  subtitle: {
    color: "#3f3228",
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
  },
  meta: {
    color: "#7b6b60",
    fontSize: 15,
    marginBottom: 4,
  },
  button: {
    marginTop: 18,
  },
  secondaryButton: {
    marginTop: 12,
  },
});
