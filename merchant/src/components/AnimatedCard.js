import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

export default function AnimatedCard({
  children,
  style,
  contentStyle,
  onPress,
  disabled = false,
}) {
  if (onPress) {
    return (
      <View style={[styles.shell, style]}>
        <Pressable
          onPress={onPress}
          disabled={disabled}
          style={({ pressed }) => [
            styles.content,
            contentStyle,
            pressed && !disabled ? styles.pressed : null,
          ]}
        >
          {children}
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[styles.shell, style]}>
      <View style={[styles.content, contentStyle]}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    borderRadius: 30,
    backgroundColor: "#fffdf9",
    shadowColor: "#1f140f",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 18 },
    shadowRadius: 30,
    elevation: 8,
  },
  content: {
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#f3e6db",
    backgroundColor: "#fffdf9",
  },
  pressed: {
    transform: [{ scale: 0.982 }],
    opacity: 0.98,
  },
});
