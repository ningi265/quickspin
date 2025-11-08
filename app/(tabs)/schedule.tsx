"use client"

import { Ionicons } from "@expo/vector-icons"
import { Stack, router } from "expo-router"
import { useState } from "react"
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { colors } from "../../constants/theme"

export default function SchedulePickupScreen() {
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [notes, setNotes] = useState("")

  const services = [
    { id: "wash", name: "Wash", icon: "shirt", price: 800, description: "Professional washing" },
    { id: "dry", name: "Dry", icon: "sunny", price: 400, description: "Quick drying" },
    { id: "iron", name: "Iron", icon: "flame", price: 600, description: "Professional ironing" },
    { id: "fold", name: "Fold", icon: "layers", price: 200, description: "Neat folding" },
  ]

  const timeSlots = ["08:00 - 10:00", "10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00", "16:00 - 18:00"]

  const dates = [
    { date: "2024-01-15", day: "Today", available: true },
    { date: "2024-01-16", day: "Tomorrow", available: true },
    { date: "2024-01-17", day: "Wed", available: true },
    { date: "2024-01-18", day: "Thu", available: false },
    { date: "2024-01-19", day: "Fri", available: true },
  ]

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    )
  }

  const calculateTotal = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find((s) => s.id === serviceId)
      return total + (service?.price || 0)
    }, 0)
  }

  const handleSchedule = () => {
    if (selectedServices.length === 0) {
      Alert.alert("Error", "Please select at least one service")
      return
    }
    if (!selectedDate || !selectedTime) {
      Alert.alert("Error", "Please select date and time")
      return
    }

    Alert.alert("Success", "Your pickup has been scheduled successfully!", [
      { text: "OK", onPress: () => router.push("/(tabs)/tracking") },
    ])
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Schedule Pickup",
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: "white",
        }}
      />
      <View style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Services Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Services</Text>
            <Text style={styles.sectionSubtitle}>Choose the services you need</Text>

            {services.map((service) => {
              const isSelected = selectedServices.includes(service.id)
              return (
                <TouchableOpacity
                  key={service.id}
                  style={[styles.serviceItem, isSelected && styles.serviceItemSelected]}
                  onPress={() => toggleService(service.id)}
                >
                  <View style={styles.serviceCheckbox}>
                    {isSelected && <Ionicons name="checkmark" size={16} color={colors.primary} />}
                  </View>
                  <View style={styles.serviceIcon}>
                    <Ionicons name={service.icon as any} size={20} color={colors.textSecondary} />
                  </View>
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceName}>{service.name}</Text>
                    <Text style={styles.serviceDescription}>{service.description}</Text>
                  </View>
                  <View style={styles.servicePriceContainer}>
                    <Text style={styles.servicePrice}>MWK {service.price}/kg</Text>
                  </View>
                </TouchableOpacity>
              )
            })}
          </View>

          {/* Date Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="calendar" size={20} color={colors.text} /> Select Date
            </Text>
            <View style={styles.dateGrid}>
              {dates.map((dateOption) => (
                <TouchableOpacity
                  key={dateOption.date}
                  style={[
                    styles.dateButton,
                    selectedDate === dateOption.date && styles.dateButtonSelected,
                    !dateOption.available && styles.dateButtonDisabled,
                  ]}
                  onPress={() => dateOption.available && setSelectedDate(dateOption.date)}
                  disabled={!dateOption.available}
                >
                  <Text
                    style={[
                      styles.dateButtonText,
                      selectedDate === dateOption.date && styles.dateButtonTextSelected,
                      !dateOption.available && styles.dateButtonTextDisabled,
                    ]}
                  >
                    {dateOption.day}
                  </Text>
                  <Text
                    style={[
                      styles.dateButtonDate,
                      selectedDate === dateOption.date && styles.dateButtonDateSelected,
                      !dateOption.available && styles.dateButtonDateDisabled,
                    ]}
                  >
                    {new Date(dateOption.date).getDate()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Time Selection */}
          {selectedDate && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Ionicons name="time" size={20} color={colors.text} /> Select Time
              </Text>
              <View style={styles.timeGrid}>
                {timeSlots.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[styles.timeButton, selectedTime === time && styles.timeButtonSelected]}
                    onPress={() => setSelectedTime(time)}
                  >
                    <Text style={[styles.timeButtonText, selectedTime === time && styles.timeButtonTextSelected]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Location */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="location" size={20} color={colors.text} /> Pickup Location
            </Text>
            <View style={styles.locationCard}>
              <Ionicons name="home" size={20} color={colors.textSecondary} />
              <View style={styles.locationInfo}>
                <Text style={styles.locationTitle}>Home Address</Text>
                <Text style={styles.locationAddress}>Namiwawa, Blantyre</Text>
              </View>
            </View>
          </View>

          {/* Special Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Special Instructions</Text>
            <Text style={styles.sectionSubtitle}>Any special requests or notes</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="e.g., Please handle delicate items with care..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </ScrollView>

        {/* Bottom Summary */}
        {selectedServices.length > 0 && (
          <View style={styles.bottomSummary}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Estimate</Text>
              <Text style={styles.summaryPrice}>MWK {calculateTotal().toLocaleString()}/kg</Text>
            </View>
            <TouchableOpacity
              style={[styles.scheduleButton, (!selectedDate || !selectedTime) && styles.scheduleButtonDisabled]}
              onPress={handleSchedule}
              disabled={!selectedDate || !selectedTime}
            >
              <Text style={styles.scheduleButtonText}>Schedule Pickup</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  serviceItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  serviceItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary + "10",
  },
  serviceCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.border,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  serviceIcon: {
    width: 32,
    height: 32,
    backgroundColor: colors.background,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  serviceInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  serviceDescription: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  servicePriceContainer: {
    backgroundColor: colors.background,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  servicePrice: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.text,
  },
  dateGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateButton: {
    flex: 1,
    height: 70,
    backgroundColor: "white",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  dateButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  dateButtonDisabled: {
    backgroundColor: colors.background,
    opacity: 0.5,
  },
  dateButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  dateButtonTextSelected: {
    color: "white",
  },
  dateButtonTextDisabled: {
    color: colors.textSecondary,
  },
  dateButtonDate: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  dateButtonDateSelected: {
    color: "white",
  },
  dateButtonDateDisabled: {
    color: colors.textSecondary,
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  timeButton: {
    width: "48%",
    height: 50,
    backgroundColor: "white",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  timeButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  timeButtonText: {
    fontSize: 14,
    color: colors.text,
  },
  timeButtonTextSelected: {
    color: "white",
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
  },
  locationInfo: {
    marginLeft: 12,
  },
  locationTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  locationAddress: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  notesInput: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 100,
  },
  bottomSummary: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 20,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
  },
  summaryPrice: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
  },
  scheduleButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  scheduleButtonDisabled: {
    opacity: 0.5,
  },
  scheduleButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
})
