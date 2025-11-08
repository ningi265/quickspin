"use client"

import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { colors } from "../../constants/theme"
import { useAuth } from "../../contexts/AuthContext"

export default function HomeScreen() {
  const { user } = useAuth()
  const router = useRouter()

  const services = [
    { id: 1, name: "Wash & Fold", price: "MK 2,500", icon: "shirt" },
    { id: 2, name: "Dry Cleaning", price: "MK 5,000", icon: "sparkles" },
    { id: 3, name: "Iron Only", price: "MK 1,500", icon: "flame" },
    { id: 4, name: "Express Service", price: "MK 3,500", icon: "flash" },
  ]

  const recentOrders = [
    { id: 1, status: "In Progress", items: 5, date: "Today" },
    { id: 2, status: "Completed", items: 3, date: "Yesterday" },
  ]

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello, {user?.name?.split(" ")[0]}!</Text>
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
            <Button variant="outline" onPress={() => router.push("/(tabs)/tracking")} style={styles.actionButton}>
              Track Order
            </Button>
          </View>
        </CardContent>
      </Card>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Our Services</Text>
        <View style={styles.servicesGrid}>
          {services.map((service) => (
            <TouchableOpacity key={service.id} style={styles.serviceCard}>
              <View style={styles.serviceIcon}>
                <Ionicons name={service.icon as any} size={24} color={colors.primary} />
              </View>
              <Text style={styles.serviceName}>{service.name}</Text>
              <Text style={styles.servicePrice}>{service.price}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <Card style={styles.recentOrders}>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.map((order) => (
            <View key={order.id} style={styles.orderItem}>
              <View style={styles.orderInfo}>
                <Text style={styles.orderDate}>{order.date}</Text>
                <Text style={styles.orderItems}>{order.items} items</Text>
              </View>
              <Badge variant={order.status === "Completed" ? "success" : "warning"}>{order.status}</Badge>
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
