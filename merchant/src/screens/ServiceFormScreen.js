import React, { useState } from "react";
import { Alert, FlatList, StyleSheet, Text, View } from "react-native";
import { createService } from "../api/merchantApi";
import AnimatedCard from "../components/AnimatedCard";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import ScreenContainer from "../components/ScreenContainer";
import SectionHeader from "../components/SectionHeader";

export default function ServiceFormScreen() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);

  const handleAddService = async () => {
    if (!name.trim() || !price.trim() || !duration.trim()) {
      Alert.alert("Missing Details", "Enter service name, price, and duration.");
      return;
    }

    try {
      setLoading(true);
      const payload = {
        name: name.trim(),
        price: Number(price),
        duration: Number(duration),
      };
      const created = await createService(payload);
      setServices((current) => [created || payload, ...current]);
      setName("");
      setPrice("");
      setDuration("");
      Alert.alert("Service Added", "Service saved successfully.");
    } catch (error) {
      Alert.alert(
        "Save Failed",
        error?.response?.data?.message || error.message || "Unable to save service."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <FlatList
        data={services}
        keyExtractor={(item, index) => String(item.id ?? index)}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            <SectionHeader
              title="Add Services"
              subtitle="Create a clear service menu with pricing and duration."
            />

            <AnimatedCard contentStyle={styles.card}>
              <InputField label="Service Name" value={name} onChangeText={setName} placeholder="Haircut" />
              <InputField
                label="Price"
                value={price}
                onChangeText={setPrice}
                placeholder="299"
                keyboardType="number-pad"
              />
              <InputField
                label="Duration"
                value={duration}
                onChangeText={setDuration}
                placeholder="30"
                keyboardType="number-pad"
              />
              <PrimaryButton label="Save Service" onPress={handleAddService} loading={loading} />
            </AnimatedCard>

            <Text style={styles.sectionTitle}>Service Menu</Text>
          </View>
        }
        renderItem={({ item }) => (
          <AnimatedCard contentStyle={styles.serviceCard}>
            <View style={styles.serviceRow}>
              <Text style={styles.serviceName}>{item.name}</Text>
              <Text style={styles.servicePrice}>Rs. {item.price}</Text>
            </View>
            <Text style={styles.serviceMeta}>{item.duration} min</Text>
          </AnimatedCard>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        contentContainerStyle={styles.listContent}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingBottom: 22,
  },
  card: {
    padding: 22,
    marginBottom: 18,
  },
  sectionTitle: {
    color: "#24170f",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
  },
  serviceCard: {
    padding: 18,
  },
  serviceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  serviceName: {
    color: "#24170f",
    fontSize: 18,
    fontWeight: "800",
  },
  servicePrice: {
    color: "#d26e3f",
    fontWeight: "800",
  },
  serviceMeta: {
    color: "#76685f",
  },
});
