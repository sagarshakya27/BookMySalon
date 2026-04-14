import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import AnimatedCard from "../components/AnimatedCard";
import ScreenContainer from "../components/ScreenContainer";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!email.trim()) {
      Alert.alert("Email required", "Enter your email so we can send reset instructions.");
      return;
    }

    Alert.alert("Reset link sent", `Password reset instructions were sent to ${email.trim()}.`);
    navigation.replace("Login");
  };

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <Text style={styles.title}>Forgot your password?</Text>
        <Text style={styles.subtitle}>
          No problem. Enter your email and we will send you a quick reset link.
        </Text>
      </View>
      <AnimatedCard contentStyle={styles.card}>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <Pressable style={styles.primaryButton} onPress={handleSubmit}>
          <Text style={styles.primaryButtonText}>Send reset link</Text>
        </Pressable>
        <Pressable onPress={() => navigation.replace("Login")}>
          <Text style={styles.link}>Back to login</Text>
        </Pressable>
      </AnimatedCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginTop: 28,
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    color: "#24170f",
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 10,
    color: "#6f6259",
    lineHeight: 22,
    fontSize: 15,
  },
  card: {
    padding: 22,
  },
  input: {
    height: 52,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#ead9ca",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    marginBottom: 12,
    color: "#2a1f15",
  },
  primaryButton: {
    marginTop: 6,
    height: 52,
    borderRadius: 18,
    backgroundColor: "#24170f",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
  link: {
    marginTop: 14,
    textAlign: "center",
    color: "#c96e40",
    fontWeight: "700",
  },
});
