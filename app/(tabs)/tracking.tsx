import { Ionicons } from "@expo/vector-icons"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { ScrollView, StyleSheet, Text, View } from "react-native"
import { Badge } from "../../components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Progress } from "../../components/ui/progress"
import { colors } from "../../constants/theme"


export default function TrackingScreen() {
  const params = useLocalSearchParams()
  const [order, setOrder] = useState<any>(null)
  const [tracking, setTracking] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initialOrder = params.order ? JSON.parse(params.order as string) : null
    if (initialOrder) {
      setOrder(initialOrder)
      loadTrackingData(initialOrder._id)
    } else {
      loadActiveOrder()
    }
  }, [params.order])

  const loadTrackingData = async (orderId: string) => {
    try {
      const trackingData = await apiService.getTracking(orderId)
      setTracking(trackingData)
    } catch (error) {
      console.error("Error loading tracking data:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadActiveOrder = async () => {
    setLoading(true)
    try {
      const orders = await apiService.getOrders()
      const activeOrder = orders.find((o: any) => !['delivered', 'cancelled'].includes(o.status))
      if (activeOrder) {
        setOrder(activeOrder)
        await loadTrackingData(activeOrder._id)
      }
    } catch (error) {
      console.error('Error loading active order:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text>Loading tracking information...</Text>
      </View>
    )
  }

  if (!order) {
    return (
      <View style={styles.centered}>
        <Text>No active order to track.</Text>
      </View>
    )
  }

  const getStatusProgress = (status: string) => {
    const progressMap: { [key: string]: number } = {
      "pending": 10,
      "pickup_scheduled": 25,
      "picked_up": 50,
      "in_progress": 75,
      "ready_for_delivery": 90,
      "delivered": 100,
    }
    return progressMap[status] || 0
  }

  const progress = getStatusProgress(order.status)
  const timeline = tracking?.timeline || []

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Order Tracking</Text>
      </View>

      <Card style={styles.orderCard}>
        <CardHeader>
          <View style={styles.orderHeader}>
            <CardTitle>Order #{order.orderId}</CardTitle>
            <Badge variant="default">{order.status.replace("_", " ")}</Badge>
          </View>
        </CardHeader>
        <CardContent>
          <View style={styles.progressSection}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Progress value={progress} style={styles.progressBar} />
            <Text style={styles.progressText}>{progress}% Complete</Text>
          </View>

          <View style={styles.deliveryInfo}>
            <Ionicons name="time-outline" size={20} color={colors.primary} />
            <Text style={styles.deliveryText}>
              Estimated Delivery: {new Date(order.deliveryDate).toLocaleDateString()}
            </Text>
          </View>
        </CardContent>
      </Card>

      <Card style={styles.itemsCard}>
        <CardHeader>
          <CardTitle>Items in Order</CardTitle>
        </CardHeader>
        <CardContent>
          {order.items.map((item: any, index: number) => (
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
          {timeline.map((step: any, index: number) => (
            <View key={index} style={styles.timelineItem}>
              <View style={styles.timelineIndicator}>
                <View style={[styles.timelineDot, step.completed && styles.timelineDotCompleted]} />
                {index < timeline.length - 1 && (
                  <View style={[styles.timelineLine, step.completed && styles.timelineLineCompleted]} />
                )}
              </View>
              <View style={styles.timelineContent}>
                <Text style={[styles.timelineStep, step.completed && styles.timelineStepCompleted]}>{step.step}</Text>
                <Text style={styles.timelineTime}>
                  {step.time ? new Date(step.time).toLocaleString() : ""}
                </Text>
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
