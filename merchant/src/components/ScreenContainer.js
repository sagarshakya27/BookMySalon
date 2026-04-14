import React from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";

export default function ScreenContainer({ children }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topGlow} />
      <View style={styles.sideGlow} />
      <View style={styles.content}>{children}</View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f6efe8",
  },
  topGlow: {
    position: "absolute",
    top: -110,
    right: -20,
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: "#f8d4be",
    opacity: 0.42,
  },
  sideGlow: {
    position: "absolute",
    top: 220,
    left: -60,
    width: 220,
    height: 220,
    borderRadius: 999,
    backgroundColor: "#f0c2b1",
    opacity: 0.18,
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingTop: 16,
    paddingBottom: 12,
  },
});
