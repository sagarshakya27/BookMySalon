import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { loginMerchant } from "../api/merchantApi";
import AnimatedCard from "../components/AnimatedCard";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import ScreenContainer from "../components/ScreenContainer";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !ownerName.trim()) {
      Alert.alert("Missing Details", "Enter owner name and email.");
      return;
    }

    try {
      setLoading(true);
      const merchant = await loginMerchant({
        email: email.trim(),
        ownerName: ownerName.trim(),
      });
      navigation.signIn(merchant);
    } catch (error) {
      Alert.alert("Login Failed", error.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>Book My Salon</Text>
        <Text style={styles.title}>Run your salon with confidence</Text>

        <AnimatedCard contentStyle={styles.card}>
          <InputField
            label="Owner Name"
            value={ownerName}
            onChangeText={setOwnerName}
            placeholder="Salon owner name"
          />
          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Business email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <PrimaryButton label="Login" onPress={handleLogin} loading={loading} />
          <Text style={styles.link} onPress={() => navigation.navigate("Register")}>
            Create merchant account
          </Text>
        </AnimatedCard>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  eyebrow: {
    color: "#c96e40",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  title: {
    color: "#24170f",
    fontSize: 32,
    lineHeight: 38,
    fontWeight: "800",
    marginBottom: 18,
  },
  card: {
    padding: 22,
  },
  link: {
    marginTop: 14,
    textAlign: "center",
    color: "#c96e40",
    fontWeight: "800",
  },
});
