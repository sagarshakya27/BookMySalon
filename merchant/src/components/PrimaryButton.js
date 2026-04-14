import React, { useRef } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";

export default function PrimaryButton({
  label,
  onPress,
  disabled = false,
  loading = false,
  style,
}) {
  const scale = useRef(new Animated.Value(1)).current;

  const animateTo = (value) => {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  return (
    <Animated.View style={[styles.wrapper, style, { transform: [{ scale }] }]}>
      <TouchableOpacity
        activeOpacity={0.9}
        disabled={disabled || loading}
        onPressIn={() => animateTo(0.985)}
        onPressOut={() => animateTo(1)}
        onPress={onPress}
        style={[styles.button, disabled || loading ? styles.buttonDisabled : null]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.label}>{label}</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 18,
    shadowColor: "#1f140f",
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 16 },
    shadowRadius: 24,
    elevation: 7,
  },
  button: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "#1e1511",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    backgroundColor: "#c4b4a9",
  },
  label: {
    color: "#fffaf7",
    fontSize: 15,
    fontWeight: "800",
    letterSpacing: 0.2,
  },
});
