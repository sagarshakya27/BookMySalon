import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

export default function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType,
  multiline = false,
  autoCapitalize = "sentences",
}) {
  return (
    <View style={styles.group}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9f8f84"
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        style={[styles.input, multiline ? styles.textArea : null]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  group: {
    marginBottom: 14,
  },
  label: {
    color: "#a85f3d",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  input: {
    minHeight: 56,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#efdfd1",
    backgroundColor: "#fffefd",
    paddingHorizontal: 16,
    color: "#2b2018",
  },
  textArea: {
    minHeight: 100,
    paddingTop: 16,
    textAlignVertical: "top",
  },
});
