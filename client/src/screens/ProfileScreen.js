import React, { useState } from "react";
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import AnimatedCard from "../components/AnimatedCard";
import ScreenContainer from "../components/ScreenContainer";

export default function ProfileScreen({ navigation, route }) {
  const user = route?.params?.currentUser;
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [mobile, setMobile] = useState(user?.mobile || "");

  const saveProfile = () => {
    navigation.updateUser({
      name: name.trim() || user?.name,
      email: email.trim() || user?.email,
      mobile: mobile.trim() || user?.mobile,
    });
    Alert.alert("Profile updated", "Your details are now ready for a smoother booking experience.");
  };

  return (
    <ScreenContainer>
      <View style={styles.hero}>
        <Text style={styles.eyebrow}>Personal details</Text>
        <Text style={styles.title}>Make every booking feel familiar.</Text>
        <Text style={styles.subtitle}>
          Keep your name, email, and mobile number up to date so confirming an appointment takes less effort.
        </Text>
      </View>

      <AnimatedCard contentStyle={styles.profileSummary}>
        <View style={styles.profileBadge}>
          <Text style={styles.profileBadgeText}>
            {(name || "G").slice(0, 2).toUpperCase()}
          </Text>
        </View>
        <View style={styles.profileCopy}>
          <Text style={styles.profileName}>{name || "Guest User"}</Text>
          <Text style={styles.profileMeta}>{email || "guest@bookmysalon.app"}</Text>
        </View>
      </AnimatedCard>

      <AnimatedCard contentStyle={styles.card}>
        <TextInput value={name} onChangeText={setName} placeholder="Full name" style={styles.input} />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email address"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
        <TextInput
          value={mobile}
          onChangeText={setMobile}
          placeholder="Mobile number"
          keyboardType="phone-pad"
          style={styles.input}
        />
        <Pressable style={styles.primaryButton} onPress={saveProfile}>
          <Text style={styles.primaryButtonText}>Save changes</Text>
        </Pressable>
      </AnimatedCard>
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
  profileSummary: {
    padding: 18,
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  profileBadge: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#241711",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  profileBadgeText: {
    color: "#fffaf6",
    fontWeight: "800",
    fontSize: 18,
  },
  profileCopy: {
    flex: 1,
  },
  profileName: {
    color: "#221711",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 4,
  },
  profileMeta: {
    color: "#6c6057",
  },
  card: {
    padding: 24,
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
});
