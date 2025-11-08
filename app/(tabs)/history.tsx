"use client"

import { Ionicons } from "@expo/vector-icons"
import { Stack } from "expo-router"
import { useState } from "react"
import { SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { colors } from "../../constants/theme"

export default function OrderHistoryScreen() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Mock orders data
  const orders = [
    {
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
    },
    {
      id: "ORD002",
      services: ["wash", "dry"],
      pickupTime: "2024-01-10T14:00:00Z",
      deliveryTime: "2024-01-11T18:00:00Z",
      status: "delivered",
      price: 1800,
      location: {
        address: "Sunnyside, Blantyre",
        latitude: -15.7861,
        longitude: 35.0058,
      },
    },
    {
      id: "ORD003",
      services: ["iron"],
      pickupTime: "2024-01-08T09:00:00Z",
      deliveryTime: "2024-01-08T17:00:00Z",
      status: "delivered",
      price: 1200,
      location: {
        address: "Limbe, Blantyre",
        latitude: -15.7861,
        longitude: 35.0058,
      },
    },
  ]

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

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.location.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || order.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const filters = [
    { id: "all", label: "All" },
    { id: "pending", label: "Pending" },
    { id: "in_progress", label: "Active" },
    { id: "delivered", label: "Completed" },
  ]

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
              <Text style={styles.emptyStateTitle}>No orders found</Text>
              <Text style={styles.emptyStateSubtitle}>
                {searchQuery ? "Try adjusting your search" : "Your orders will appear here"}
              </Text>
            </View>
          ) : (
            filteredOrders.map((order) => (
              <TouchableOpacity key={order.id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View>
                    <Text style={styles.orderId}>Order #{order.id}</Text>
                    <View style={styles.orderDate}>
                      <Ionicons name="calendar" size={12} color={colors.textSecondary} />
                      <Text style={styles.orderDateText}>{new Date(order.pickupTime).toLocaleDateString()}</Text>
                    </View>
                  </View>
                  <View style={styles.orderActions}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + "20" }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                        {order.status.replace("_", " ").toUpperCase()}
                      </Text>
                    </View>
                    <TouchableOpacity style={styles.moreButton}>
                      <Ionicons name="ellipsis-vertical" size={16} color={colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.orderDetails}>
                  <View style={styles.orderDetailRow}>
                    <Text style={styles.orderDetailLabel}>Services</Text>
                    <Text style={styles.orderDetailValue}>{order.services.join(", ").toUpperCase()}</Text>
                  </View>

                  <View style={styles.orderDetailRow}>
                    <Text style={styles.orderDetailLabel}>Total</Text>
                    <Text style={[styles.orderDetailValue, { color: colors.primary }]}>
                      MWK {order.price.toLocaleString()}
                    </Text>
                  </View>

                  <View style={styles.orderDetailRow}>
                    <Ionicons name="location" size={12} color={colors.textSecondary} />
                    <Text style={styles.orderDetailAddress}>{order.location.address}</Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.orderActionButtons}>
                  {order.status === "delivered" ? (
                    <>
                      <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Reorder</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.actionButton}>
                        <Text style={styles.actionButtonText}>Rate Service</Text>
                      </TouchableOpacity>
                    </>
                  ) : (
                    <>
                      <TouchableOpacity style={styles.actionButton}>
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
                MWK {filteredOrders.reduce((sum, order) => sum + order.price, 0).toLocaleString()}
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
  moreButton: {
    padding: 4,
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
