import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SectionHeader({ title, subtitle, rightSlot }) {
  return (
    <View style={styles.row}>
      <View style={styles.copy}>
        <Text style={styles.eyebrow}>Book My Salon</Text>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {rightSlot}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },
  copy: {
    flex: 1,
    paddingRight: 14,
  },
  eyebrow: {
    marginBottom: 6,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#c17046",
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#221610",
    lineHeight: 38,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 14,
    color: "#72645b",
    lineHeight: 22,
  },
});
