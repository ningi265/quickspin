"use client"

import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { ActivityIndicator, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
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

  useEffect(() => {
    loadData()
  }, [user])

  const loadData = async () => {
    try {
      const servicesData = await apiService.getServices()
      setServices(servicesData.slice(0, 4))
      
      if (user) {
        const ordersData = await apiService.getOrders().catch(() => [])
        setRecentOrders(ordersData.slice(0, 2))
      }
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatPrice = (price: number) => {
    return `MK ${price.toLocaleString()}/kg`
  }

  const getServiceIcon = (serviceName: string) => {
    const iconMap: { [key: string]: string } = {
      'Wash': 'shirt',
      'Dry': 'sunny',
      'Iron': 'flame',
      'Fold': 'layers',
      'Wash & Fold': 'shirt',
      'Dry Cleaning': 'sparkles'
    }
    return iconMap[serviceName] || 'shirt'
  }

  const getStatusBadgeVariant = (status: string) => {
    const statusMap: { [key: string]: 'success' | 'warning' | 'error' } = {
      'delivered': 'success',
      'completed': 'success',
      'in_progress': 'warning',
      'pending': 'warning',
      'cancelled': 'error'
    }
    return statusMap[status] || 'warning'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    if (date.toDateString() === today.toDateString()) return 'Today'
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return date.toLocaleDateString()
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(" ")[0] || 'Guest'}!</Text>
          <Text style={styles.subGreeting}>What can we help you with today?</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <Card style={styles.quickActions}>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <View style={styles.actionButtons}>
            <Button onPress={() => router.push("/(tabs)/schedule")} style={styles.actionButton}>
              Schedule Pickup
            </Button>
            <Button variant="outline" onPress={() => router.push("/(tabs)/orders")} style={styles.actionButton}>
              Track Order
            </Button>
          </View>
        </CardContent>
      </Card>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Services</Text>
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

      {recentOrders.length > 0 && (
        <Card style={styles.recentOrders}>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {recentOrders.map((order) => (
              <TouchableOpacity 
                key={order._id} 
                style={styles.orderItem}
                onPress={() => router.push(`/(tabs)/orders`)}
              >
                <View style={styles.orderInfo}>
                  <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
                  <Text style={styles.orderItems}>
                    {order.items?.reduce((total, item) => total + item.quantity, 0) || 0} items • MK {order.totalPrice.toLocaleString()}
                  </Text>
                </View>
                <Badge variant={getStatusBadgeVariant(order.status)}>
                  {order.status.replace('_', ' ').toUpperCase()}
                </Badge>
              </TouchableOpacity>
            ))}
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
    alignItems: "center",
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 16,
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
  orderDate: {
    fontSize: 16,
    fontWeight: "500",
    color: colors.text,
  },
  orderItems: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
})