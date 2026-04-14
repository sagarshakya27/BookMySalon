import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import AnimatedCard from "../components/AnimatedCard";
import ScreenContainer from "../components/ScreenContainer";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("demo@bookmysalon.app");
  const [password, setPassword] = useState("password123");

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("A few details are missing", "Please enter your email and password to continue.");
      return;
    }

    navigation.signIn({
      name: "Demo User",
      email: email.trim(),
      mobile: "9876543210",
    });
  };

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <Text style={styles.brand}>Book My Salon</Text>
        <Text style={styles.title}>Tap. Book. Get styled.</Text>
      </View>

      <AnimatedCard contentStyle={styles.card}>
        <Text style={styles.cardTitle}>Sign in</Text>
        <Text style={styles.cardSubtitle}>{"Welcome back. Let's get you to your next appointment."}</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email address"
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Password"
          secureTextEntry
          style={styles.input}
        />
        <Pressable style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>Continue</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate("ForgotPassword")}>
          <Text style={styles.link}>Forgot your password?</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => navigation.navigate("Register")}>
          <Text style={styles.secondaryButtonText}>Create a new account</Text>
        </Pressable>
      </AnimatedCard>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  hero: {
    marginTop: 22,
    marginBottom: 24,
  },
  brand: {
    color: "#b8653d",
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontSize: 33,
    lineHeight: 39,
    color: "#221711",
    fontWeight: "800",
  },
  subtitle: {
    marginTop: 10,
    color: "#6c6057",
    lineHeight: 22,
    fontSize: 15,
  },
  card: {
    padding: 24,
  },
  cardTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: "#221711",
    marginBottom: 6,
  },
  cardSubtitle: {
    color: "#75675d",
    lineHeight: 21,
    marginBottom: 18,
  },
  input: {
    height: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ead9ca",
    backgroundColor: "#fffdfb",
    paddingHorizontal: 16,
    marginBottom: 12,
    color: "#2a1f15",
  },
  primaryButton: {
    marginTop: 8,
    height: 54,
    borderRadius: 18,
    backgroundColor: "#241711",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
  link: {
    marginTop: 16,
    textAlign: "center",
    color: "#c26035",
    fontWeight: "700",
  },
  secondaryButton: {
    marginTop: 16,
    height: 50,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ead9ca",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff6ef",
  },
  secondaryButtonText: {
    color: "#2a1f15",
    fontWeight: "700",
  },
});
