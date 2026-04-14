import React, { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { createOrder } from "../api/orderApi";
import AnimatedCard from "../components/AnimatedCard";
import PrimaryButton from "../components/PrimaryButton";
import ScreenContainer from "../components/ScreenContainer";
import SectionHeader from "../components/SectionHeader";

const DEFAULT_SERVICES = [
  "Haircut",
  "Hair Spa",
  "Beard Grooming",
  "Facial",
  "Hair Color",
];

const TIME_SLOT_OPTIONS = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
];

function DropdownModal({ visible, title, options, selectedValue, onSelect, onClose }) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={styles.modalCard}>
          <Text style={styles.modalTitle}>{title}</Text>
          {options.map((option) => {
            const active = option === selectedValue;
            return (
              <Pressable
                key={option}
                style={[styles.modalOption, active ? styles.modalOptionActive : null]}
                onPress={() => onSelect(option)}
              >
                <Text
                  style={[styles.modalOptionText, active ? styles.modalOptionTextActive : null]}
                >
                  {option}
                </Text>
              </Pressable>
            );
          })}
          <Pressable style={styles.modalClose} onPress={onClose}>
            <Text style={styles.modalCloseText}>Close</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

export default function BookOrderScreen({ navigation, route }) {
  const salonId = route?.params?.salonId ?? 1;
  const salonName = route?.params?.salonName || "Salon";
  const services = useMemo(() => {
    if (route?.params?.serviceOptions?.length) {
      return route.params.serviceOptions;
    }
    return DEFAULT_SERVICES;
  }, [route?.params?.serviceOptions]);

  const [customerName, setCustomerName] = useState(route?.params?.customerName || "");
  const [mobile, setMobile] = useState(route?.params?.mobile || "");
  const [serviceName, setServiceName] = useState(route?.params?.serviceName || services[0]);
  const [selectedSlot, setSelectedSlot] = useState(route?.params?.timeSlot || "");
  const [customTime, setCustomTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);

  const finalTimeSlot = customTime.trim() || selectedSlot;

  const validateForm = () => {
    if (!customerName.trim() || !mobile.trim() || !serviceName.trim()) {
      Alert.alert("Missing Details", "All fields are required.");
      return false;
    }

    if (!/^\d{10}$/.test(mobile.trim())) {
      Alert.alert("Invalid Mobile", "Mobile number must be 10 digits.");
      return false;
    }

    if (!finalTimeSlot.trim()) {
      Alert.alert("Select Time", "Please choose a slot or enter custom time.");
      return false;
    }

    if (!Number.isFinite(Number(salonId))) {
      Alert.alert(
        "Booking Unavailable",
        "This salon is not available for bookings right now. Please choose another salon."
      );
      return false;
    }

    return true;
  };

  const handleConfirmBooking = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const payload = {
        customerName: customerName.trim(),
        mobile: mobile.trim(),
        serviceName: serviceName.trim(),
        timeSlot: finalTimeSlot.trim(),
        salon: {
          id: salonId,
        },
      };

      const response = await createOrder(payload);
      console.log("BookOrderScreen response:", response);
      Alert.alert("Success", "Booking confirmed.");
      navigation.replace("Success", {
        salon: route?.params?.salon,
        salonName,
        serviceName: serviceName.trim(),
        timeSlot: finalTimeSlot.trim(),
      });
    } catch (error) {
      console.log("BookOrderScreen error:", error?.response?.data || error.message);
      Alert.alert(
        "Booking Failed",
        error?.response?.data?.message || error.message || "Unable to confirm booking."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <SectionHeader title="Book Appointment" subtitle={salonName} />

          <AnimatedCard contentStyle={styles.card}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Customer Name</Text>
              <TextInput
                value={customerName}
                onChangeText={setCustomerName}
                placeholder="Your name"
                placeholderTextColor="#9a8c81"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mobile Number</Text>
              <TextInput
                value={mobile}
                onChangeText={setMobile}
                keyboardType="number-pad"
                maxLength={10}
                placeholder="10-digit mobile number"
                placeholderTextColor="#9a8c81"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Service</Text>
              <Pressable
                style={styles.dropdownField}
                onPress={() => setServiceModalVisible(true)}
              >
                <Text style={styles.dropdownValue}>{serviceName || "Select service"}</Text>
                <Text style={styles.dropdownIcon}>v</Text>
              </Pressable>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Available Time Slots</Text>
              <View style={styles.slotGrid}>
                {TIME_SLOT_OPTIONS.map((slot) => {
                  const active = !customTime.trim() && selectedSlot === slot;
                  return (
                    <Pressable
                      key={slot}
                      style={[styles.slotChip, active ? styles.slotChipActive : null]}
                      onPress={() => {
                        setSelectedSlot(slot);
                        setCustomTime("");
                      }}
                    >
                      <Text
                        style={[styles.slotChipText, active ? styles.slotChipTextActive : null]}
                      >
                        {slot}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.customTimeLabel}>Or enter custom time</Text>
              <TextInput
                value={customTime}
                onChangeText={setCustomTime}
                placeholder="Example: 2:30 PM"
                placeholderTextColor="#9a8c81"
                style={styles.input}
              />
            </View>

            <View style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Selected Slot</Text>
              <Text style={styles.summaryValue}>{finalTimeSlot || "Not selected"}</Text>
            </View>

            <PrimaryButton
              label="Confirm Booking"
              onPress={handleConfirmBooking}
              loading={loading}
              style={styles.buttonSpacing}
            />
          </AnimatedCard>
        </ScrollView>
      </KeyboardAvoidingView>

      <DropdownModal
        visible={serviceModalVisible}
        title="Select Service"
        options={services}
        selectedValue={serviceName}
        onSelect={(value) => {
          setServiceName(value);
          setServiceModalVisible(false);
        }}
        onClose={() => setServiceModalVisible(false)}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingBottom: 28,
  },
  card: {
    padding: 22,
    backgroundColor: "#fffaf6",
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    color: "#b3643e",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.9,
    marginBottom: 8,
  },
  input: {
    height: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ead8c8",
    backgroundColor: "#fffdfb",
    paddingHorizontal: 16,
    color: "#2b2018",
  },
  dropdownField: {
    height: 54,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#ead8c8",
    backgroundColor: "#fffdfb",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownValue: {
    color: "#2b2018",
    fontSize: 15,
    fontWeight: "600",
  },
  dropdownIcon: {
    color: "#b3643e",
    fontSize: 14,
    fontWeight: "800",
  },
  slotGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  slotChip: {
    width: "31%",
    borderRadius: 16,
    backgroundColor: "#fff2e9",
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  slotChipActive: {
    backgroundColor: "#24170f",
  },
  slotChipText: {
    color: "#c86f41",
    fontSize: 13,
    fontWeight: "700",
  },
  slotChipTextActive: {
    color: "#fff",
  },
  customTimeLabel: {
    color: "#7f6d61",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#fff2e8",
    borderWidth: 1,
    borderColor: "#f0ddd0",
  },
  summaryLabel: {
    color: "#ba6b45",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.9,
    marginBottom: 6,
  },
  summaryValue: {
    color: "#2b2018",
    fontSize: 16,
    fontWeight: "700",
  },
  buttonSpacing: {
    marginTop: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(35, 23, 17, 0.28)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  modalCard: {
    borderRadius: 24,
    backgroundColor: "#fffaf6",
    padding: 20,
    borderWidth: 1,
    borderColor: "#efdfd2",
  },
  modalTitle: {
    color: "#24170f",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 14,
  },
  modalOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: "#fff3ea",
    marginBottom: 10,
  },
  modalOptionActive: {
    backgroundColor: "#24170f",
  },
  modalOptionText: {
    color: "#b3643e",
    fontSize: 15,
    fontWeight: "700",
  },
  modalOptionTextActive: {
    color: "#fffaf5",
  },
  modalClose: {
    alignSelf: "flex-end",
    marginTop: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: "#fff1e8",
  },
  modalCloseText: {
    color: "#c96e40",
    fontWeight: "800",
  },
});
