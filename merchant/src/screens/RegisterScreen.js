import React, { useState } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { registerMerchant } from "../api/merchantApi";
import AnimatedCard from "../components/AnimatedCard";
import InputField from "../components/InputField";
import PrimaryButton from "../components/PrimaryButton";
import ScreenContainer from "../components/ScreenContainer";

export default function RegisterScreen({ navigation }) {
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!ownerName.trim() || !email.trim() || !mobile.trim()) {
      Alert.alert("Missing Details", "Please complete all fields.");
      return;
    }

    try {
      setLoading(true);
      const merchant = await registerMerchant({
        ownerName: ownerName.trim(),
        email: email.trim(),
        mobile: mobile.trim(),
      });
      navigation.signIn(merchant);
    } catch (error) {
      Alert.alert("Registration Failed", error.message || "Unable to register.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.container}>
        <Text style={styles.eyebrow}>Merchant Setup</Text>
        <Text style={styles.title}>Create account</Text>
        <AnimatedCard contentStyle={styles.card}>
          <InputField
            label="Owner Name"
            value={ownerName}
            onChangeText={setOwnerName}
            placeholder="Owner name"
          />
          <InputField
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="Business email"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <InputField
            label="Mobile"
            value={mobile}
            onChangeText={setMobile}
            placeholder="10-digit mobile"
            keyboardType="number-pad"
          />
          <PrimaryButton label="Create Account" onPress={handleRegister} loading={loading} />
          <Text style={styles.link} onPress={() => navigation.goBack()}>
            Back to login
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
    fontSize: 34,
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
