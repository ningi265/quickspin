import { Ionicons } from "@expo/vector-icons"
import { Stack } from "expo-router"
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { colors } from "../../constants/theme"

export default function OrdersScreen() {
  // Mock order data
  const activeOrder = {
    id: "ORD001",
    services: ["wash", "iron", "fold"],
    pickupTime: "2024-01-15T10:00:00Z",
    deliveryTime: "2024-01-16T16:00:00Z",
    status: "in_progress",
    price: 2500,
    location: {
      address: "Namiwawa, Blantyre",
      latitude: -15.7861,
      longitude: 35.0058,
    },
  }

  const getStatusProgress = (status: string) => {
    switch (status) {
      case "pending":
        return 25
      case "picked_up":
        return 50
      case "in_progress":
        return 75
      case "delivered":
        return 100
      default:
        return 0
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return colors.warning
      case "picked_up":
        return colors.primary
      case "in_progress":
        return colors.warning
      case "delivered":
        return colors.success
      default:
        return colors.textSecondary
    }
  }

  const trackingSteps = [
    {
      id: "pending",
      title: "Order Confirmed",
      description: "Your order has been received",
      icon: "checkmark-circle",
      time: "10:00 AM",
    },
    {
      id: "picked_up",
      title: "Picked Up",
      description: "Items collected from your location",
      icon: "cube",
      time: "11:30 AM",
    },
    {
      id: "in_progress",
      title: "In Progress",
      description: "Your laundry is being processed",
      icon: "time",
      time: "2:00 PM",
    },
    {
      id: "delivered",
      title: "Delivered",
      description: "Order delivered to your location",
      icon: "car",
      time: "Expected 4:00 PM",
    },
  ]

  const getCurrentStepIndex = (status: string) => {
    return trackingSteps.findIndex((step) => step.id === status)
  }

  const currentStepIndex = getCurrentStepIndex(activeOrder.status)
  const progress = getStatusProgress(activeOrder.status)

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Track Orders",
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: "white",
        }}
      />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Order Summary */}
          <View style={styles.orderSummary}>
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderId}>Order #{activeOrder.id}</Text>
                <Text style={styles.orderDate}>{new Date(activeOrder.pickupTime).toLocaleDateString()}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(activeOrder.status) + "20" }]}>
                <Text style={[styles.statusText, { color: getStatusColor(activeOrder.status) }]}>
                  {activeOrder.status.replace("_", " ").toUpperCase()}
                </Text>
              </View>
            </View>

            <View style={styles.orderDetails}>
              <View style={styles.orderDetailRow}>
                <Text style={styles.orderDetailLabel}>Services</Text>
                <Text style={styles.orderDetailValue}>{activeOrder.services.join(", ").toUpperCase()}</Text>
              </View>
              <View style={styles.orderDetailRow}>
                <Text style={styles.orderDetailLabel}>Total</Text>
                <Text style={styles.orderDetailValue}>MWK {activeOrder.price.toLocaleString()}</Text>
              </View>
              <View style={styles.orderDetailRow}>
                <Ionicons name="location" size={16} color={colors.textSecondary} />
                <Text style={styles.orderDetailAddress}>{activeOrder.location.address}</Text>
              </View>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressSection}>
            <Text style={styles.progressTitle}>Order Progress</Text>
            <View style={styles.progressBarContainer}>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
              </View>
            </View>
          </View>

          {/* Tracking Steps */}
          <View style={styles.trackingSteps}>
            {trackingSteps.map((step, index) => {
              const isCompleted = index <= currentStepIndex
              const isCurrent = index === currentStepIndex

              return (
                <View key={step.id} style={styles.trackingStep}>
                  <View style={styles.stepIconContainer}>
                    <View
                      style={[
                        styles.stepIcon,
                        {
                          backgroundColor: isCompleted ? colors.primary : colors.background,
                          borderColor: isCompleted ? colors.primary : colors.border,
                        },
                      ]}
                    >
                      <Ionicons
                        name={step.icon as any}
                        size={20}
                        color={isCompleted ? "white" : colors.textSecondary}
                      />
                    </View>
                    {index < trackingSteps.length - 1 && (
                      <View
                        style={[
                          styles.stepConnector,
                          { backgroundColor: index < currentStepIndex ? colors.primary : colors.border },
                        ]}
                      />
                    )}
                  </View>
                  <View style={styles.stepContent}>
                    <View style={styles.stepHeader}>
                      <Text
                        style={[
                          styles.stepTitle,
                          {
                            color: isCurrent ? colors.primary : isCompleted ? colors.text : colors.textSecondary,
                          },
                        ]}
                      >
                        {step.title}
                      </Text>
                      <Text style={styles.stepTime}>{step.time}</Text>
                    </View>
                    <Text style={styles.stepDescription}>{step.description}</Text>
                  </View>
                </View>
              )
            })}
          </View>

          {/* Delivery Agent */}
          {(activeOrder.status === "picked_up" || activeOrder.status === "in_progress") && (
            <View style={styles.agentCard}>
              <Text style={styles.agentTitle}>Delivery Agent</Text>
              <View style={styles.agentInfo}>
                <View style={styles.agentAvatar}>
                  <Text style={styles.agentInitials}>JM</Text>
                </View>
                <View style={styles.agentDetails}>
                  <Text style={styles.agentName}>James Mwale</Text>
                  <Text style={styles.agentRole}>Delivery Agent</Text>
                </View>
                <TouchableOpacity style={styles.callButton}>
                  <Ionicons name="call" size={16} color={colors.primary} />
                  <Text style={styles.callButtonText}>Call</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Estimated Delivery */}
          <View style={styles.deliveryCard}>
            <View style={styles.deliveryInfo}>
              <View style={styles.deliveryIcon}>
                <Ionicons name="car" size={24} color={colors.success} />
              </View>
              <View>
                <Text style={styles.deliveryTitle}>Estimated Delivery</Text>
                <Text style={styles.deliveryTime}>
                  {new Date(activeOrder.deliveryTime).toLocaleDateString()} at 4:00 PM
                </Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Contact Support</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionButtonText}>Modify Order</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
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
  orderSummary: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  orderId: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  orderDetails: {
    gap: 12,
  },
  orderDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  orderDetailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  orderDetailValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
  },
  orderDetailAddress: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
  },
  progressSection: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  progressBarContainer: {
    marginBottom: 16,
  },
  progressBarBackground: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  trackingSteps: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  trackingStep: {
    flexDirection: "row",
    marginBottom: 20,
  },
  stepIconContainer: {
    alignItems: "center",
    marginRight: 16,
  },
  stepIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  stepConnector: {
    width: 2,
    height: 20,
    marginTop: 8,
  },
  stepContent: {
    flex: 1,
  },
  stepHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
  },
  stepTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  stepDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  agentCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  agentTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  agentInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  agentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  agentInitials: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.primary,
  },
  agentDetails: {
    flex: 1,
  },
  agentName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  agentRole: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  callButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  callButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "600",
    marginLeft: 4,
  },
  deliveryCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  deliveryInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  deliveryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.success + "20",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  deliveryTime: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  bottomActions: {
    flexDirection: "row",
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 12,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
})
