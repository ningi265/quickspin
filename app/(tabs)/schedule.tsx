import { Ionicons } from "@expo/vector-icons"
import { Stack, router } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { colors } from "../../constants/theme"
import { useAuth } from "../../contexts/AuthContext"
import { apiService } from "../../hooks/services/api"

interface Service {
  _id: string;
  name: string;
  description: string;
  pricePerKg: number;
  icon: string;
}

interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  available: boolean;
}

export default function SchedulePickupScreen() {
  const { user } = useAuth()
  const [services, setServices] = useState<Service[]>([])
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)
  const [servicesLoading, setServicesLoading] = useState(true)
  const [availableDates, setAvailableDates] = useState<Array<{date: string, day: string, available: boolean}>>([])
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([])

  useEffect(() => {
    loadServices()
    loadAvailableDates()
  }, [])

  useEffect(() => {
    if (selectedDate) {
      loadAvailableTimeSlots(selectedDate)
    }
  }, [selectedDate])

  const loadServices = async () => {
    try {
      const servicesData = await apiService.getServices()
      setServices(servicesData)
    } catch (error) {
      console.error('Error loading services:', error)
      Alert.alert("Error", "Failed to load services")
    } finally {
      setServicesLoading(false)
    }
  }

  const loadAvailableDates = async () => {
    try {
      // Get dates for the next 7 days
      const dates = []
      const today = new Date()
      
      for (let i = 0; i < 7; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        
        const dateString = date.toISOString().split('T')[0]
        const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const dayName = i === 0 ? 'Today' : i === 1 ? 'Tomorrow' : dayNames[date.getDay()]
        
        // In a real app, you'd check availability with the API
        const available = date.getDay() !== 0 // Not available on Sundays
        
        dates.push({
          date: dateString,
          day: dayName,
          available
        })
      }
      
      setAvailableDates(dates)
    } catch (error) {
      console.error('Error loading available dates:', error)
    }
  }

  const loadAvailableTimeSlots = async (date: string) => {
    try {
      // In a real app, you'd fetch available time slots from the API
      // For now, we'll generate them dynamically
      const timeSlots: TimeSlot[] = [
        { id: '1', startTime: '08:00', endTime: '10:00', available: true },
        { id: '2', startTime: '10:00', endTime: '12:00', available: true },
        { id: '3', startTime: '12:00', endTime: '14:00', available: true },
        { id: '4', startTime: '14:00', endTime: '16:00', available: true },
        { id: '5', startTime: '16:00', endTime: '18:00', available: true },
      ]
      
      setAvailableTimeSlots(timeSlots)
      setSelectedTime("") // Reset selected time when date changes
    } catch (error) {
      console.error('Error loading time slots:', error)
    }
  }

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    )
  }

  const calculateTotal = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find((s) => s._id === serviceId)
      return total + (service?.pricePerKg || 0)
    }, 0)
  }

  const formatTimeSlot = (timeSlot: TimeSlot) => {
    return `${timeSlot.startTime} - ${timeSlot.endTime}`
  }

  const handleSchedule = async () => {
    if (!user) {
      Alert.alert("Error", "Please login to schedule a pickup")
      return
    }

    if (selectedServices.length === 0) {
      Alert.alert("Error", "Please select at least one service")
      return
    }
    if (!selectedDate || !selectedTime) {
      Alert.alert("Error", "Please select date and time")
      return
    }

    setLoading(true)
    try {
      const selectedTimeSlot = availableTimeSlots.find(slot => formatTimeSlot(slot) === selectedTime)
      
      const orderData = {
        services: selectedServices.map(serviceId => {
          const service = services.find(s => s._id === serviceId)
          return {
            serviceId,
            name: service?.name || 'Service',
            price: service?.pricePerKg || 0,
            quantity: 1
          }
        }),
        pickupDate: selectedDate,
        pickupTime: selectedTimeSlot?.startTime || '08:00',
        pickupTimeSlot: selectedTime,
        location: {
          address: user?.address || "Namiwawa, Blantyre",
          latitude: user?.latitude || -15.7861,
          longitude: user?.longitude || 35.0058,
        },
        specialInstructions: notes,
        items: [
          {
            name: "Laundry Items",
            quantity: 1,
            weight: 1.0
          }
        ],
        totalPrice: calculateTotal(),
        status: "pending"
      }

      const newOrder = await apiService.createOrder(orderData)
      
      Alert.alert("Success", "Your pickup has been scheduled successfully!", [
        { 
          text: "Track Order", 
          onPress: () => router.push({
            pathname: "/tracking",
            params: { order: JSON.stringify(newOrder) }
          }) 
        },
        { 
          text: "OK", 
          style: "cancel" 
        }
      ])
      
      // Reset form
      setSelectedServices([])
      setSelectedDate("")
      setSelectedTime("")
      setNotes("")
      
    } catch (error: any) {
      console.error('Schedule error:', error)
      Alert.alert("Error", error.message || "Failed to schedule pickup")
    } finally {
      setLoading(false)
    }
  }

  const getServiceIcon = (serviceName: string) => {
    const iconMap: { [key: string]: string } = {
      'Wash': 'shirt',
      'Dry': 'sunny',
      'Iron': 'flame',
      'Fold': 'layers',
      'Wash & Fold': 'shirt',
      'Dry Cleaning': 'sparkles',
      'Laundry': 'shirt',
      'Cleaning': 'sparkles'
    }
    return iconMap[serviceName] || 'shirt'
  }

  if (servicesLoading) {
    return (
      <View style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Schedule Pickup",
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: "white",
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading services...</Text>
        </View>
      </View>
    )
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

            {services.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="shirt-outline" size={48} color={colors.textSecondary} />
                <Text style={styles.emptyStateText}>No services available</Text>
                <Text style={styles.emptyStateSubtext}>Please try again later</Text>
              </View>
            ) : (
              services.map((service) => {
                const isSelected = selectedServices.includes(service._id)
                return (
                  <TouchableOpacity
                    key={service._id}
                    style={[styles.serviceItem, isSelected && styles.serviceItemSelected]}
                    onPress={() => toggleService(service._id)}
                  >
                    <View style={styles.serviceCheckbox}>
                      {isSelected && <Ionicons name="checkmark" size={16} color={colors.primary} />}
                    </View>
                    <View style={styles.serviceIcon}>
                      <Ionicons name={getServiceIcon(service.name) as any} size={20} color={colors.textSecondary} />
                    </View>
                    <View style={styles.serviceInfo}>
                      <Text style={styles.serviceName}>{service.name}</Text>
                      <Text style={styles.serviceDescription}>{service.description}</Text>
                    </View>
                    <View style={styles.servicePriceContainer}>
                      <Text style={styles.servicePrice}>MWK {service.pricePerKg.toLocaleString()}/kg</Text>
                    </View>
                  </TouchableOpacity>
                )
              })
            )}
          </View>

          {/* Date Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="calendar" size={20} color={colors.text} /> Select Date
            </Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.dateScrollContent}
            >
              <View style={styles.dateGrid}>
                {availableDates.map((dateOption) => (
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
            </ScrollView>
          </View>

          {/* Time Selection */}
          {selectedDate && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                <Ionicons name="time" size={20} color={colors.text} /> Select Time
              </Text>
              {availableTimeSlots.length === 0 ? (
                <View style={styles.emptyTimeSlots}>
                  <Text style={styles.emptyTimeSlotsText}>No time slots available for this date</Text>
                </View>
              ) : (
                <View style={styles.timeGrid}>
                  {availableTimeSlots.map((timeSlot) => (
                    <TouchableOpacity
                      key={timeSlot.id}
                      style={[
                        styles.timeButton, 
                        selectedTime === formatTimeSlot(timeSlot) && styles.timeButtonSelected,
                        !timeSlot.available && styles.timeButtonDisabled
                      ]}
                      onPress={() => timeSlot.available && setSelectedTime(formatTimeSlot(timeSlot))}
                      disabled={!timeSlot.available}
                    >
                      <Text style={[
                        styles.timeButtonText, 
                        selectedTime === formatTimeSlot(timeSlot) && styles.timeButtonTextSelected,
                        !timeSlot.available && styles.timeButtonTextDisabled
                      ]}>
                        {formatTimeSlot(timeSlot)}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
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
                <Text style={styles.locationAddress}>
                  {user?.address || "Please update your address in profile"}
                </Text>
              </View>
              <TouchableOpacity 
                style={styles.changeLocationButton}
                onPress={() => Alert.alert("Info", "Update your address in the profile section")}
              >
                <Text style={styles.changeLocationText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Special Instructions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Special Instructions</Text>
            <Text style={styles.sectionSubtitle}>Any special requests or notes</Text>
            <TextInput
              style={styles.notesInput}
              placeholder="e.g., Please handle delicate items with care, specific detergent preferences, etc."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholderTextColor={colors.textSecondary}
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
            <Text style={styles.summaryNote}>* Final price may vary based on actual weight</Text>
            <TouchableOpacity
              style={[styles.scheduleButton, (!selectedDate || !selectedTime || loading) && styles.scheduleButtonDisabled]}
              onPress={handleSchedule}
              disabled={!selectedDate || !selectedTime || loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.scheduleButtonText}>Schedule Pickup</Text>
              )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
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
  dateScrollContent: {
    paddingHorizontal: 2,
  },
  dateGrid: {
    flexDirection: "row",
    gap: 8,
  },
  dateButton: {
    width: 80,
    height: 70,
    backgroundColor: "white",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
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
  emptyTimeSlots: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  emptyTimeSlotsText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
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
  timeButtonDisabled: {
    backgroundColor: colors.background,
    opacity: 0.5,
  },
  timeButtonText: {
    fontSize: 14,
    color: colors.text,
  },
  timeButtonTextSelected: {
    color: "white",
  },
  timeButtonTextDisabled: {
    color: colors.textSecondary,
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
  },
  locationInfo: {
    flex: 1,
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
  changeLocationButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.background,
    borderRadius: 6,
  },
  changeLocationText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
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
    marginBottom: 8,
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
  summaryNote: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 16,
    textAlign: 'center',
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