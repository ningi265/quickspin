import { Ionicons } from "@expo/vector-icons"
import { Stack, useFocusEffect, useRouter } from "expo-router"
import { useCallback, useState } from "react"
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { colors } from "../../constants/theme"
import { useAuth } from "../../contexts/AuthContext"
import { apiService } from "../../hooks/services/api"

interface Order {
  _id: string;
  orderId: string;
  services: Array<{
    serviceId: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  status: string;
  totalPrice: number;
  pickupDate: string;
  deliveryDate: string;
  location: {
    address: string;
    latitude?: number;
    longitude?: number;
  };
  items: Array<{
    name: string;
    quantity: number;
    weight: number;
  }>;
  progress: number;
  createdAt: string;
}

export default function OrdersScreen() {
  const router = useRouter()
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      loadOrders()
    }, [])
  )

  const loadOrders = async () => {
    try {
      const ordersData = await apiService.getOrders()
      setOrders(ordersData)
    } catch (error) {
      console.error('Error loading orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleOrderPress = (order: Order) => {
    router.push({
      pathname: "/tracking",
      params: { order: JSON.stringify(order) }
    })
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
      case "cancelled":
        return colors.error
      default:
        return colors.textSecondary
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusText = (status: string) => {
    return status.replace("_", " ").toUpperCase()
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: "My Orders",
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: "white",
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading your orders...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (orders.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: "My Orders",
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: "white",
          }}
        />
        <View style={styles.noOrdersContainer}>
          <Ionicons name="cube-outline" size={64} color={colors.textSecondary} />
          <Text style={styles.noOrdersTitle}>No Orders</Text>
          <Text style={styles.noOrdersText}>You haven't placed any orders yet.</Text>
          <TouchableOpacity 
            style={styles.scheduleButton}
            onPress={() => router.push("/(tabs)/schedule")}
          >
            <Text style={styles.scheduleButtonText}>Schedule a Pickup</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "My Orders",
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: "white",
        }}
      />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Order History</Text>
          
          {orders.map((order) => (
            <TouchableOpacity 
              key={order._id} 
              style={styles.orderCard}
              onPress={() => handleOrderPress(order)}
            >
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderId}>Order #{order.orderId}</Text>
                  <Text style={styles.orderDate}>
                    Placed on {formatDate(order.createdAt)}
                  </Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + "20" }]}>
                  <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                    {getStatusText(order.status)}
                  </Text>
                </View>
              </View>

              <View style={styles.orderDetails}>
                <View style={styles.orderDetailRow}>
                  <Text style={styles.orderDetailLabel}>Services</Text>
                  <Text style={styles.orderDetailValue}>
                    {order.services.map(s => s.name).join(", ")}
                  </Text>
                </View>
                <View style={styles.orderDetailRow}>
                  <Text style={styles.orderDetailLabel}>Total</Text>
                  <Text style={styles.orderDetailValue}>MWK {order.totalPrice.toLocaleString()}</Text>
                </View>
                <View style={styles.orderDetailRow}>
                  <Text style={styles.orderDetailLabel}>Pickup</Text>
                  <Text style={styles.orderDetailValue}>{formatDate(order.pickupDate)}</Text>
                </View>
                <View style={styles.orderDetailRow}>
                  <Text style={styles.orderDetailLabel}>Delivery</Text>
                  <Text style={styles.orderDetailValue}>{formatDate(order.deliveryDate)}</Text>
                </View>
                <View style={styles.locationRow}>
                  <Ionicons name="location" size={16} color={colors.textSecondary} />
                  <Text style={styles.orderDetailAddress}>{order.location.address}</Text>
                </View>
              </View>

              <View style={styles.viewOrderButton}>
                <Text style={styles.viewOrderButtonText}>View Order Details</Text>
                <Ionicons name="chevron-forward" size={16} color={colors.primary} />
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
  noOrdersContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noOrdersTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  noOrdersText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  scheduleButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  scheduleButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  orderCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
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
    marginBottom: 16,
  },
  orderDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  orderDetailLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: "500",
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
    flex: 1,
  },
  viewOrderButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  viewOrderButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
})