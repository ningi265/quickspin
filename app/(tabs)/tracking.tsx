import { Ionicons } from "@expo/vector-icons"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { Badge } from "../../components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Progress } from "../../components/ui/progress"
import { colors } from "../../constants/theme"

export default function TrackingScreen() {
  const currentOrder = {
    id: "ORD-001",
    status: "In Progress",
    progress: 60,
    estimatedDelivery: "Tomorrow, 2:00 PM",
    items: [
      { name: "White Shirts", quantity: 3 },
      { name: "Jeans", quantity: 2 },
    ],
    timeline: [
      { step: "Order Placed", completed: true, time: "Today, 9:00 AM" },
      { step: "Pickup Scheduled", completed: true, time: "Today, 10:00 AM" },
      { step: "Items Collected", completed: true, time: "Today, 11:30 AM" },
      { step: "In Processing", completed: false, time: "Today, 2:00 PM" },
      { step: "Ready for Delivery", completed: false, time: "Tomorrow, 12:00 PM" },
      { step: "Delivered", completed: false, time: "Tomorrow, 2:00 PM" },
    ],
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Order Tracking</Text>
      </View>

      <Card style={styles.orderCard}>
        <CardHeader>
          <View style={styles.orderHeader}>
            <CardTitle>Order #{currentOrder.id}</CardTitle>
            <Badge variant="warning">{currentOrder.status}</Badge>
          </View>
        </CardHeader>
        <CardContent>
          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Progress value={currentOrder.progress} style={styles.progressBar} />
            <Text style={styles.progressText}>{currentOrder.progress}% Complete</Text>
          </View>

          <View style={styles.deliveryInfo}>
            <Ionicons name="time-outline" size={20} color={colors.primary} />
            <Text style={styles.deliveryText}>Estimated Delivery: {currentOrder.estimatedDelivery}</Text>
          </View>
        </CardContent>
      </Card>

      <Card style={styles.itemsCard}>
        <CardHeader>
          <CardTitle>Items in Order</CardTitle>
        </CardHeader>
        <CardContent>
          {currentOrder.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemQuantity}>x{item.quantity}</Text>
            </View>
          ))}
        </CardContent>
      </Card>

      <Card style={styles.timelineCard}>
        <CardHeader>
          <CardTitle>Order Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          {currentOrder.timeline.map((step, index) => (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.timelineIndicator}>
                <View style={[styles.timelineDot, step.completed && styles.timelineDotCompleted]} />
                {index < currentOrder.timeline.length - 1 && (
                  <View style={[styles.timelineLine, step.completed && styles.timelineLineCompleted]} />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineStep, step.completed && styles.timelineStepCompleted]}>{step.step}</Text>
                <Text style={styles.timelineTime}>{step.time}</Text>
              </View>
            </View>
          ))}
        </CardContent>
      </Card>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  orderCard: {
    margin: 20,
    marginTop: 0,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressSection: {
    marginBottom: 16,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
    marginBottom: 8,
  },
  progressBar: {
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
  },
  deliveryInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  deliveryText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
  itemsCard: {
    margin: 20,
    marginTop: 0,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemName: {
    fontSize: 16,
    color: colors.text,
  },
  itemQuantity: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  timelineCard: {
    margin: 20,
    marginTop: 0,
  },
  timelineItem: {
    flexDirection: "row",
    marginBottom: 16,
  },
  timelineIndicator: {
    alignItems: "center",
    marginRight: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.border,
    borderWidth: 2,
    borderColor: colors.background,
  },
  timelineDotCompleted: {
    backgroundColor: colors.primary,
  },
  timelineLine: {
    width: 2,
    height: 32,
    backgroundColor: colors.border,
    marginTop: 4,
  },
  timelineLineCompleted: {
    backgroundColor: colors.primary,
  },
  timelineContent: {
    flex: 1,
  },
  timelineStep: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.textSecondary,
  },
  timelineStepCompleted: {
    color: colors.text,
  },
  timelineTime: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
})
