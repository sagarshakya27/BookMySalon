import React, { useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { createSalon } from "../api/merchantApi";
import AnimatedCard from "../components/AnimatedCard";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import ScreenContainer from "../components/ScreenContainer";
import SectionHeader from "../components/SectionHeader";

const MAP_PRESETS = [
  { label: "Downtown", latitude: "28.6139", longitude: "77.2090" },
  { label: "City Center", latitude: "19.0760", longitude: "72.8777" },
  { label: "Market Road", latitude: "12.9716", longitude: "77.5946" },
];

export default function SalonFormScreen({ navigation }) {
  const [name, setName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [mobile, setMobile] = useState("");
  const [address, setAddress] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [openingTime, setOpeningTime] = useState("");
  const [closingTime, setClosingTime] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSaveSalon = async () => {
    if (
      !name.trim() ||
      !ownerName.trim() ||
      !mobile.trim() ||
      !address.trim() ||
      !openingTime.trim() ||
      !closingTime.trim() ||
      !latitude.trim() ||
      !longitude.trim()
    ) {
      Alert.alert("Missing Details", "Complete all salon fields.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: name.trim(),
        ownerName: ownerName.trim(),
        mobile: mobile.trim(),
        address: address.trim(),
        bannerImage: bannerImage.trim(),
        openingTime: openingTime.trim(),
        closingTime: closingTime.trim(),
        latitude: Number(latitude),
        longitude: Number(longitude),
      };
      await createSalon(payload);
      Alert.alert("Salon Saved", "Salon details submitted successfully.");
      navigation.reset("Dashboard");
    } catch (error) {
      Alert.alert(
        "Save Failed",
        error?.response?.data?.message || error.message || "Unable to save salon."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SectionHeader
          title="Add Salon"
          subtitle="Add your salon details, timings, and location for clients to discover."
        />

        <AnimatedCard contentStyle={styles.card}>
          <InputField label="Salon Name" value={name} onChangeText={setName} placeholder="Salon name" />
          <InputField
            label="Owner Name"
            value={ownerName}
            onChangeText={setOwnerName}
            placeholder="Owner name"
          />
          <InputField
            label="Mobile"
            value={mobile}
            onChangeText={setMobile}
            placeholder="Business mobile"
            keyboardType="number-pad"
          />
          <InputField
            label="Address"
            value={address}
            onChangeText={setAddress}
            placeholder="Full address"
            multiline
          />
          <InputField
            label="Banner Image"
            value={bannerImage}
            onChangeText={setBannerImage}
            placeholder="Image URL"
            autoCapitalize="none"
          />
          <InputField
            label="Opening Time"
            value={openingTime}
            onChangeText={setOpeningTime}
            placeholder="9:00 AM"
          />
          <InputField
            label="Closing Time"
            value={closingTime}
            onChangeText={setClosingTime}
            placeholder="9:00 PM"
          />

          <Text style={styles.mapLabel}>Pick Location</Text>
          <View style={styles.mapGrid}>
            {MAP_PRESETS.map((preset) => (
              <Pressable
                key={preset.label}
                style={styles.mapChip}
                onPress={() => {
                  setLatitude(preset.latitude);
                  setLongitude(preset.longitude);
                }}
              >
                <Text style={styles.mapChipText}>{preset.label}</Text>
              </Pressable>
            ))}
          </View>

          <View style={styles.mapPreview}>
            <View style={styles.mapDot} />
            <Text style={styles.mapPreviewText}>
              {latitude && longitude ? `${latitude}, ${longitude}` : "Add your salon coordinates"}
            </Text>
          </View>

          <InputField
            label="Latitude"
            value={latitude}
            onChangeText={setLatitude}
            placeholder="Latitude"
            keyboardType="decimal-pad"
          />
          <InputField
            label="Longitude"
            value={longitude}
            onChangeText={setLongitude}
            placeholder="Longitude"
            keyboardType="decimal-pad"
          />

          <PrimaryButton label="Save Salon" onPress={handleSaveSalon} loading={loading} />
        </AnimatedCard>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 22,
    marginBottom: 22,
  },
  mapLabel: {
    color: "#b3643e",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.9,
    marginBottom: 8,
  },
  mapGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 12,
  },
  mapChip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    backgroundColor: "#fff1e8",
    marginRight: 10,
    marginBottom: 10,
  },
  mapChipText: {
    color: "#c96e40",
    fontWeight: "800",
  },
  mapPreview: {
    height: 160,
    borderRadius: 22,
    backgroundColor: "#f4e8dd",
    borderWidth: 1,
    borderColor: "#efddcf",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  mapDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#d36f3f",
    marginBottom: 12,
  },
  mapPreviewText: {
    color: "#6d6057",
    fontWeight: "700",
  },
});
