import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import AnimatedCard from "../components/AnimatedCard";
import ScreenContainer from "../components/ScreenContainer";

const shortcuts = [
  {
    key: "book-order",
    title: "Book now",
    subtitle: "Reserve your next appointment in just a few taps.",
    route: "BookOrder",
  },
  {
    key: "salons",
    title: "Nearby salons",
    subtitle: "Explore top-rated salons with services, timing, and distance in one place.",
    route: "Home",
  },
  {
    key: "orders",
    title: "Bookings",
    subtitle: "Track upcoming appointments and stay updated on every status change.",
    route: "Orders",
  },
  {
    key: "profile",
    title: "Your profile",
    subtitle: "Keep your details ready for a faster and smoother checkout experience.",
    route: "Profile",
  },
];

export default function DashboardScreen({ navigation, route }) {
  const currentUser = route?.params?.currentUser;

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <Text style={styles.kicker}>Client App</Text>
        <Text style={styles.title}>
          Welcome back, {currentUser?.name || "there"}.
        </Text>
        <Text style={styles.subtitle}>
          Discover salons, lock in your slot, and manage your appointments with ease.
        </Text>
      </View>

      <AnimatedCard contentStyle={styles.heroCard}>
        <Text style={styles.heroCardTitle}>Your beauty routine, organized beautifully</Text>
        <Text style={styles.heroCardSubtitle}>
          Everything you need is ready from discovery to directions.
        </Text>
      </AnimatedCard>

      <View style={styles.grid}>
        {shortcuts.map((item) => (
          <AnimatedCard key={item.key} contentStyle={styles.shortcutCard}>
            <Text style={styles.shortcutTitle}>{item.title}</Text>
            <Text style={styles.shortcutSubtitle}>{item.subtitle}</Text>
            <Pressable style={styles.shortcutButton} onPress={() => navigation.navigate(item.route)}>
              <Text style={styles.shortcutButtonText}>Open</Text>
            </Pressable>
          </AnimatedCard>
        ))}
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginTop: 10,
    marginBottom: 18,
  },
  kicker: {
    color: "#b8653d",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  title: {
    fontSize: 31,
    lineHeight: 37,
    color: "#221711",
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 10,
    color: "#6c6057",
    lineHeight: 22,
    fontSize: 15,
  },
  heroCard: {
    padding: 22,
    marginBottom: 18,
    backgroundColor: "#1e1511",
    borderColor: "#1e1511",
  },
  heroCardTitle: {
    color: "#fff8f4",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 8,
  },
  heroCardSubtitle: {
    color: "#f1d8c9",
    lineHeight: 21,
  },
  grid: {
    marginTop: 2,
  },
  shortcutCard: {
    padding: 20,
    marginBottom: 14,
  },
  shortcutTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#231710",
    marginBottom: 8,
  },
  shortcutSubtitle: {
    color: "#6c6057",
    lineHeight: 21,
    marginBottom: 16,
  },
  shortcutButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 14,
    backgroundColor: "#f7efe7",
  },
  shortcutButtonText: {
    color: "#231710",
    fontWeight: "800",
  },
});
