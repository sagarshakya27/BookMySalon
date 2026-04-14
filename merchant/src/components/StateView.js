import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import AnimatedCard from "./AnimatedCard";

export function LoadingState({ label = "Loading..." }) {
  return (
    <View style={styles.center}>
      <ActivityIndicator size="large" color="#d56f3e" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

export function EmptyState({ title, subtitle }) {
  return (
    <AnimatedCard style={styles.cardShell} contentStyle={styles.card}>
      <View style={styles.dot} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </AnimatedCard>
  );
}

export function ErrorState({ message }) {
  return (
    <AnimatedCard style={styles.cardShell} contentStyle={[styles.card, styles.errorCard]}>
      <View style={[styles.dot, styles.errorDot]} />
      <Text style={styles.title}>Unable to load this section</Text>
      <Text style={styles.subtitle}>{message}</Text>
    </AnimatedCard>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    fontSize: 15,
    color: "#6f6358",
    marginTop: 12,
  },
  card: {
    padding: 22,
    borderRadius: 26,
    backgroundColor: "#fffdf9",
    borderWidth: 1,
    borderColor: "#efe2d7",
  },
  cardShell: {
    marginTop: 24,
  },
  errorCard: {
    borderColor: "#f1d2c2",
    backgroundColor: "#fff7f1",
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#cf7447",
    marginBottom: 12,
  },
  errorDot: {
    backgroundColor: "#d77d58",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#2a1f15",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6f6358",
  },
});
