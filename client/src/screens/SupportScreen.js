import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AnimatedCard from "../components/AnimatedCard";
import ScreenContainer from "../components/ScreenContainer";

const supportItems = [
  {
    title: "Booking assistance",
    subtitle: "Need help with a service, salon timing, or a booking update? We are here for it.",
  },
  {
    title: "Payment reassurance",
    subtitle: "Questions around confirmation, charges, or booking status can be resolved quickly.",
  },
  {
    title: "Priority care",
    subtitle: "For urgent support, reach out directly and our team will guide you step by step.",
  },
];

export default function SupportScreen() {
  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Customer Care</Text>
        <Text style={styles.title}>Support that feels personal and quick.</Text>
        <Text style={styles.subtitle}>
          From booking questions to order status updates, we keep your salon experience smooth.
        </Text>
      </View>

      <AnimatedCard contentStyle={styles.contactCard}>
        <Text style={styles.contactTitle}>Get in touch</Text>
        <Text style={styles.contactLine}>support@bookmysalon.app</Text>
        <Text style={styles.contactLine}>+91 98765 43210</Text>
        <Pressable style={styles.contactButton}>
          <Text style={styles.contactButtonText}>Start a support request</Text>
        </Pressable>
      </AnimatedCard>

      <View style={styles.stack}>
        {supportItems.map((item) => (
          <AnimatedCard key={item.title} contentStyle={styles.infoCard}>
            <Text style={styles.infoTitle}>{item.title}</Text>
            <Text style={styles.infoSubtitle}>{item.subtitle}</Text>
          </AnimatedCard>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginTop: 8,
    marginBottom: 18,
  },
  eyebrow: {
    color: "#b8653d",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    color: "#221711",
    fontSize: 30,
    lineHeight: 36,
    fontWeight: "800",
  },
  subtitle: {
    color: "#6b5f57",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
  },
  contactCard: {
    padding: 22,
    marginBottom: 16,
    backgroundColor: "#261912",
    borderColor: "#261912",
  },
  contactTitle: {
    color: "#fff8f4",
    fontSize: 23,
    fontWeight: "800",
    marginBottom: 10,
  },
  contactLine: {
    color: "#f2d9ca",
    marginBottom: 4,
    lineHeight: 21,
  },
  contactButton: {
    marginTop: 14,
    alignSelf: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: "#fff1e8",
  },
  contactButtonText: {
    color: "#c26035",
    fontWeight: "800",
  },
  stack: {
    marginTop: 2,
  },
  infoCard: {
    padding: 18,
    marginBottom: 14,
  },
  infoTitle: {
    color: "#221711",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 8,
  },
  infoSubtitle: {
    color: "#6b5f57",
    lineHeight: 21,
  },
});
