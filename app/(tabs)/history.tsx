import { Ionicons } from "@expo/vector-icons"
import { Stack, useFocusEffect, useRouter } from "expo-router"
import { useCallback, useState } from "react"
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { colors } from "../../constants/theme"
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
  createdAt: string;
}

export default function OrderHistoryScreen() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
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

  const handleReorder = (order: Order) => {
    // Navigate to schedule screen with order details for reordering
    router.push({
      pathname: "/(tabs)/schedule",
      params: { reorder: JSON.stringify(order) }
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return colors.warning
      case "pickup_scheduled":
        return colors.primary
      case "picked_up":
        return colors.primary
      case "in_progress":
        return colors.warning
      case "ready_for_delivery":
        return colors.success
      case "delivered":
        return colors.success
      case "cancelled":
        return colors.error
      default:
        return colors.textSecondary
    }
  }

  const getStatusText = (status: string) => {
    return status.replace(/_/g, " ").toUpperCase()
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.services.some(service => 
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    
    const matchesFilter = 
      filterStatus === "all" || 
      (filterStatus === "active" && !['delivered', 'cancelled'].includes(order.status)) ||
      (filterStatus === "completed" && ['delivered'].includes(order.status)) ||
      order.status === filterStatus
    
    return matchesSearch && matchesFilter
  })

  const filters = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "completed", label: "Completed" },
    { id: "cancelled", label: "Cancelled" },
  ]

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Order History",
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: "white",
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading order history...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Order History",
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: "white",
        }}
      />
      <SafeAreaView style={styles.container}>
        {/* Search and Filter */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search orders..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textSecondary}
            />
          </View>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={20} color={colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterTabs}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterTabsContent}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[styles.filterTab, filterStatus === filter.id && styles.filterTabActive]}
                onPress={() => setFilterStatus(filter.id)}
              >
                <Text style={[styles.filterTabText, filterStatus === filter.id && styles.filterTabTextActive]}>
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Orders List */}
        <ScrollView style={styles.ordersList} showsVerticalScrollIndicator={false}>
          {filteredOrders.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="cube-outline" size={64} color={colors.textSecondary} />
              <Text style={styles.emptyStateTitle}>
                {searchQuery || filterStatus !== "all" ? "No orders found" : "No orders yet"}
              </Text>
              <Text style={styles.emptyStateSubtitle}>
                {searchQuery ? "Try adjusting your search" : 
                 filterStatus !== "all" ? "No orders match this filter" : 
                 "Your orders will appear here"}
              </Text>
              {!searchQuery && filterStatus === "all" && (
                <TouchableOpacity 
                  style={styles.scheduleButton}
                  onPress={() => router.push("/(tabs)/schedule")}
                >
                  <Text style={styles.scheduleButtonText}>Schedule Your First Order</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
            filteredOrders.map((order) => (
              <TouchableOpacity 
                key={order._id} 
                style={styles.orderCard}
                onPress={() => handleOrderPress(order)}
              >
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.orderId}>Order #{order.orderId}</Text>
                    <View style={styles.orderDate}>
                      <Ionicons name="calendar" size={12} color={colors.textSecondary} />
                      <Text style={styles.orderDateText}>
                        Placed on {formatDate(order.createdAt)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.orderActions}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + "20" }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                        {getStatusText(order.status)}
                      </Text>
                    </View>
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
                    <Text style={[styles.orderDetailValue, { color: colors.primary }]}>
                      MWK {order.totalPrice.toLocaleString()}
                    </Text>
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
                    <Ionicons name="location" size={12} color={colors.textSecondary} />
                    <Text style={styles.orderDetailAddress}>{order.location.address}</Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.orderActionButtons}>
                  {order.status === "delivered" ? (
                    <>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleReorder(order)}
                      >
                        <Text style={styles.actionButtonText}>Reorder</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Rate Service</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity 
                        style={styles.actionButton}
                        onPress={() => handleOrderPress(order)}
                      >
                        <Text style={styles.actionButtonText}>Track Order</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Contact Support</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>

        {/* Summary Stats */}
        {filteredOrders.length > 0 && (
          <View style={styles.summaryStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{filteredOrders.length}</Text>
              <Text style={styles.statLabel}>Total Orders</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.success }]}>
                MWK {filteredOrders.reduce((sum, order) => sum + order.totalPrice, 0).toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: colors.warning }]}>
                {filteredOrders.filter((o) => o.status === "delivered").length}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>
        )}
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  filterTabs: {
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterTabsContent: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: colors.background,
  },
  filterTabActive: {
    backgroundColor: colors.primary,
  },
  filterTabText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  filterTabTextActive: {
    color: "white",
    fontWeight: "600",
  },
  ordersList: {
    flex: 1,
    padding: 20,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 16,
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
  orderCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
    marginBottom: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  orderDate: {
    flexDirection: "row",
    alignItems: "center",
  },
  orderDateText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  orderActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "600",
  },
  orderDetails: {
    gap: 8,
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
  orderActionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 8,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: "600",
  },
  summaryStats: {
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingVertical: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
})