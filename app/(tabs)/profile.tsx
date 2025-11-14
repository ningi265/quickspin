import { Ionicons } from "@expo/vector-icons"
import { Stack, useFocusEffect } from "expo-router"
import { useCallback, useState } from "react"
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { colors } from "../../constants/theme"
import { useAuth } from "../../contexts/AuthContext"
import { apiService } from "../../hooks/services/api"

interface Order {
  _id: string;
  orderId: string;
  status: string;
  totalPrice: number;
  createdAt: string;
}

interface UserStats {
  totalOrders: number;
  totalSpent: number;
  completedOrders: number;
  averageRating?: number;
}

export default function ProfileScreen() {
  const { user, logout } = useAuth()
  const [userStats, setUserStats] = useState<UserStats>({
    totalOrders: 0,
    totalSpent: 0,
    completedOrders: 0,
    averageRating: 4.8
  })
  const [loading, setLoading] = useState(true)

  useFocusEffect(
    useCallback(() => {
      loadUserStats()
    }, [])
  )

  const loadUserStats = async () => {
    try {
      const orders = await apiService.getOrders()
      
      const stats: UserStats = {
        totalOrders: orders.length,
        totalSpent: orders.reduce((sum: number, order: Order) => sum + order.totalPrice, 0),
        completedOrders: orders.filter((order: Order) => order.status === 'delivered').length,
        averageRating: 4.8 // You can calculate this from ratings if available
      }
      
      setUserStats(stats)
    } catch (error) {
      console.error('Error loading user stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMemberSince = () => {
    if (!user?.createdAt) return 'Member since 2024'
    
    const joinDate = new Date(user.createdAt)
    return `Member since ${joinDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
  }

  const menuItems = [
    {
      icon: "card",
      title: "Payment Methods",
      description: "Manage your payment options",
      action: () => Alert.alert("Coming Soon", "Payment methods feature coming soon!"),
    },
    {
      icon: "notifications",
      title: "Notifications",
      description: "SMS and app notifications",
      action: () => Alert.alert("Coming Soon", "Notification settings coming soon!"),
    },
    {
      icon: "help-circle",
      title: "Help & Support",
      description: "Get help or contact us",
      action: () => Alert.alert("Support", "Contact us at +265 888 123 456 or laundry@yourstartup.mw"),
    },
  ]

  const handleLogout = () => {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: logout },
    ])
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Profile",
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: "white",
          }}
        />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Profile",
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: "white",
        }}
      />
      <SafeAreaView style={styles.container}>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.profileInfo}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={32} color="white" />
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user?.name || 'User'}</Text>
                <Text style={styles.memberSince}>{getMemberSince()}</Text>
              </View>
              <TouchableOpacity style={styles.editButton}>
                <Ionicons name="create" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Personal Information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoItem}>
                <Ionicons name="call" size={20} color={colors.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Phone Number</Text>
                  <Text style={styles.infoValue}>{user?.phoneNumber || 'Not provided'}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="mail" size={20} color={colors.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email Address</Text>
                  <Text style={styles.infoValue}>{user?.email || 'Not provided'}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="location" size={20} color={colors.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.infoValue}>
                    {user?.address || 'Not provided'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Account Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Summary</Text>
            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{userStats.totalOrders}</Text>
                <Text style={styles.statLabel}>Total Orders</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.success }]}>
                  MWK {userStats.totalSpent.toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>Total Spent</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.warning }]}>
                  {userStats.averageRating}
                </Text>
                <Text style={styles.statLabel}>Rating</Text>
              </View>
            </View>
          </View>

          {/* Detailed Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Order Statistics</Text>
            <View style={styles.detailedStatsCard}>
              <View style={styles.detailedStatItem}>
                <Ionicons name="checkmark-circle" size={24} color={colors.success} />
                <View style={styles.detailedStatContent}>
                  <Text style={styles.detailedStatNumber}>{userStats.completedOrders}</Text>
                  <Text style={styles.detailedStatLabel}>Completed Orders</Text>
                </View>
              </View>
              <View style={styles.detailedStatDivider} />
              <View style={styles.detailedStatItem}>
                <Ionicons name="time" size={24} color={colors.warning} />
                <View style={styles.detailedStatContent}>
                  <Text style={styles.detailedStatNumber}>
                    {userStats.totalOrders - userStats.completedOrders}
                  </Text>
                  <Text style={styles.detailedStatLabel}>Active Orders</Text>
                </View>
              </View>
              <View style={styles.detailedStatDivider} />
              <View style={styles.detailedStatItem}>
                <Ionicons name="trending-up" size={24} color={colors.primary} />
                <View style={styles.detailedStatContent}>
                  <Text style={styles.detailedStatNumber}>
                    {userStats.totalOrders > 0 ? Math.round(userStats.totalSpent / userStats.totalOrders) : 0}
                  </Text>
                  <Text style={styles.detailedStatLabel}>Avg. Order</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Menu Items */}
          <View style={styles.section}>
            <View style={styles.menuCard}>
              {menuItems.map((item, index) => (
                <View key={index}>
                  <TouchableOpacity style={styles.menuItem} onPress={item.action}>
                    <View style={styles.menuItemLeft}>
                      <Ionicons name={item.icon as any} size={24} color={colors.textSecondary} />
                      <View style={styles.menuItemContent}>
                        <Text style={styles.menuItemTitle}>{item.title}</Text>
                        <Text style={styles.menuItemDescription}>{item.description}</Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
                  </TouchableOpacity>
                  {index < menuItems.length - 1 && <View style={styles.menuDivider} />}
                </View>
              ))}
            </View>
          </View>

          {/* App Info */}
          <View style={styles.section}>
            <View style={styles.appInfoCard}>
              <Text style={styles.appName}>LaundryBT</Text>
              <Text style={styles.appVersion}>Version 1.0.0</Text>
              <Text style={styles.appCredit}>Made with ❤️ in Blantyre, Malawi</Text>
            </View>
          </View>
        </ScrollView>

        {/* Logout Button */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out" size={20} color={colors.error} />
            <Text style={styles.logoutText}>Sign Out</Text>
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
  header: {
    backgroundColor: colors.primary,
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  profileInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  section: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  infoContent: {
    marginLeft: 16,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statsCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  detailedStatsCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  detailedStatItem: {
    flex: 1,
    alignItems: "center",
  },
  detailedStatContent: {
    alignItems: "center",
    marginTop: 8,
  },
  detailedStatNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 2,
  },
  detailedStatLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
  },
  detailedStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
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
  menuCard: {
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  menuItemContent: {
    marginLeft: 16,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  menuItemDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  menuDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 60,
  },
  appInfoCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  appName: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  appCredit: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  logoutContainer: {
    padding: 20,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "white",
    borderRadius: 12,
    height: 56,
    borderWidth: 1,
    borderColor: colors.error + "40",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.error,
    marginLeft: 8,
  },
})