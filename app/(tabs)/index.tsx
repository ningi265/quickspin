import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useCallback, useEffect, useState } from "react"
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
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

interface Order {
  _id: string;
  orderId: string;
  status: string;
  items: Array<{ name: string; quantity: number }>;
  createdAt: string;
  totalPrice: number;
}

export default function HomeScreen() {
  const { user } = useAuth()
  const router = useRouter()
  const [services, setServices] = useState<Service[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    try {
      const [servicesData, ordersData] = await Promise.all([
        apiService.getServices(),
        user ? apiService.getOrders().catch(() => []) : Promise.resolve([])
      ])
      
      setServices(servicesData.slice(0, 4))
      setRecentOrders(ordersData.slice(0, 2))
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const onRefresh = useCallback(() => {
    setRefreshing(true)
    loadData()
  }, [])

  const handleOrderPress = (order: Order) => {
    router.push({
      pathname: "/tracking",
      params: { order: JSON.stringify(order) }
    })
  }

  const formatPrice = (price: number) => {
    return `MWK ${price.toLocaleString()}/kg`
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

  const getStatusBadgeVariant = (status: string) => {
    const statusMap: { [key: string]: 'success' | 'warning' | 'error' | 'default' } = {
      'delivered': 'success',
      'completed': 'success',
      'ready_for_delivery': 'success',
      'in_progress': 'warning',
      'pending': 'warning',
      'pickup_scheduled': 'warning',
      'picked_up': 'warning',
      'cancelled': 'error'
    }
    return statusMap[status] || 'default'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    })
  }

  const getStatusText = (status: string) => {
    return status.replace(/_/g, ' ').toUpperCase()
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    )
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.primary}
          colors={[colors.primary]}
        />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(" ")[0] || 'Guest'}! 👋</Text>
          <Text style={styles.subGreeting}>
            {user ? 'What can we help you with today?' : 'Sign in to schedule your laundry'}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => router.push("/(tabs)/orders")}
        >
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
          {recentOrders.some(order => !['delivered', 'cancelled'].includes(order.status)) && (
            <View style={styles.notificationBadge} />
          )}
        </TouchableOpacity>
      </View>

      {/* Quick Actions */}
      <Card style={styles.quickActions}>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <View style={styles.actionButtons}>
            <Button 
              onPress={() => router.push("/(tabs)/schedule")} 
              style={styles.actionButton}
              icon="add-circle"
            >
              Schedule Pickup
            </Button>
            <Button 
              variant="outline" 
              onPress={() => router.push("/(tabs)/orders")} 
              style={styles.actionButton}
              icon="location"
            >
              Track Order
            </Button>
          </View>
        </CardContent>
      </Card>

      {/* Services */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Our Services</Text>
          <TouchableOpacity 
            style={styles.seeAllButton}
            onPress={() => router.push("/(tabs)/schedule")}
          >
            <Text style={styles.seeAllText}>See All</Text>
            <Ionicons name="chevron-forward" size={16} color={colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.servicesGrid}>
          {services.map((service) => (
            <TouchableOpacity 
              key={service._id} 
              style={styles.serviceCard}
              onPress={() => router.push("/(tabs)/schedule")}
            >
              <View style={styles.serviceIcon}>
                <Ionicons name={getServiceIcon(service.name) as any} size={24} color={colors.primary} />
              </View>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.servicePrice}>{formatPrice(service.pricePerKg)}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Recent Orders */}
      {user && (
        <Card style={styles.recentOrders}>
          <CardHeader>
            <View style={styles.sectionHeader}>
              <CardTitle>Recent Orders</CardTitle>
              {recentOrders.length > 0 && (
                <TouchableOpacity 
                  style={styles.seeAllButton}
                  onPress={() => router.push("/(tabs)/history")}
                >
                  <Text style={styles.seeAllText}>View All</Text>
                  <Ionicons name="chevron-forward" size={16} color={colors.primary} />
                </TouchableOpacity>
              )}
            </View>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <View style={styles.emptyOrders}>
                <Ionicons name="cube-outline" size={48} color={colors.textSecondary} />
                <Text style={styles.emptyOrdersTitle}>No orders yet</Text>
                <Text style={styles.emptyOrdersText}>Your recent orders will appear here</Text>
                <Button 
                  onPress={() => router.push("/(tabs)/schedule")}
                  style={styles.scheduleButton}
                  size="sm"
                >
                  Schedule Your First Order
                </Button>
              </View>
            ) : (
              recentOrders.map((order) => (
                <TouchableOpacity 
                  key={order._id} 
                  style={styles.orderItem}
                  onPress={() => handleOrderPress(order)}
                >
                  <View style={styles.orderInfo}>
                    <View style={styles.orderHeader}>
                      <Text style={styles.orderId}>Order #{order.orderId}</Text>
                      <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
                    </View>
                    <Text style={styles.orderItems}>
                      {order.items?.reduce((total, item) => total + item.quantity, 0) || 0} items • MWK {order.totalPrice.toLocaleString()}
                    </Text>
                  </View>
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                </TouchableOpacity>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Welcome Message for Guests */}
      {!user && (
        <Card style={styles.welcomeCard}>
          <CardContent>
            <View style={styles.welcomeContent}>
              <Ionicons name="shirt" size={48} color={colors.primary} />
              <Text style={styles.welcomeTitle}>Welcome to LaundryBT</Text>
              <Text style={styles.welcomeText}>
                Sign in to schedule laundry pickups, track your orders, and manage your laundry needs effortlessly.
              </Text>
              <Button 
                onPress={() => router.push("/auth")}
                style={styles.signInButton}
              >
                Sign In to Get Started
              </Button>
            </View>
          </CardContent>
        </Card>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    paddingTop: 60,
    backgroundColor: colors.background,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
  },
  subGreeting: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  notificationButton: {
    padding: 8,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
  quickActions: {
    margin: 20,
    marginTop: 0,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  section: {
    padding: 20,
    paddingTop: 0,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
  },
  seeAllButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: "500",
    marginRight: 2,
  },
  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  serviceCard: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    backgroundColor: colors.surface,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: "500",
    color: colors.text,
    textAlign: "center",
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  recentOrders: {
    margin: 20,
    marginTop: 0,
  },
  emptyOrders: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptyOrdersTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
    marginBottom: 4,
  },
  emptyOrdersText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  scheduleButton: {
    marginTop: 8,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  orderInfo: {
    flex: 1,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },
  orderDate: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  orderItems: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  welcomeCard: {
    margin: 20,
    marginTop: 0,
  },
  welcomeContent: {
    alignItems: 'center',
    padding: 20,
  },
  welcomeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  signInButton: {
    marginTop: 8,
  },
})