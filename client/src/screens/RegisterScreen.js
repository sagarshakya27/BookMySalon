import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import AnimatedCard from "../components/AnimatedCard";
import ScreenContainer from "../components/ScreenContainer";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = () => {
    if (!name.trim() || !email.trim() || !mobile.trim() || !password.trim()) {
      Alert.alert("Incomplete form", "Fill in all fields to create your account.");
      return;
    }

    navigation.signIn({
      name: name.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
    });
  };

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <Text style={styles.title}>Create your salon booking account</Text>
        <Text style={styles.subtitle}>
          Quick onboarding, instant bookings, and a profile that stays ready for checkout.
        </Text>
      </View>

      <AnimatedCard contentStyle={styles.card}>
        <TextInput value={name} onChangeText={setName} placeholder="Full name" style={styles.input} />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          value={mobile}
          onChangeText={setMobile}
          placeholder="Mobile number"
          keyboardType="phone-pad"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          style={styles.input}
        />
        <Pressable style={styles.primaryButton} onPress={handleRegister}>
          <Text style={styles.primaryButtonText}>Register</Text>
        </Pressable>
        <Pressable onPress={() => navigation.replace("Login")}>
          <Text style={styles.link}>Already have an account? Login</Text>
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
