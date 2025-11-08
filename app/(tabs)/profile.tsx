"use client"

import { Ionicons } from "@expo/vector-icons"
import { Stack } from "expo-router"
import { Alert, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { colors } from "../../constants/theme"
import { useAuth } from "../../contexts/AuthContext"

export default function ProfileScreen() {
  const { user, logout } = useAuth()

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
                <Text style={styles.userName}>{user?.name}</Text>
                <Text style={styles.memberSince}>Member since Jan 2024</Text>
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
                  <Text style={styles.infoValue}>{user?.phoneNumber}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="mail" size={20} color={colors.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Email Address</Text>
                  <Text style={styles.infoValue}>{user?.email}</Text>
                </View>
              </View>

              <View style={styles.infoItem}>
                <Ionicons name="location" size={20} color={colors.textSecondary} />
                <View style={styles.infoContent}>
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.infoValue}>{user?.address}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Account Stats */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Summary</Text>
            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Total Orders</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.success }]}>MWK 28K</Text>
                <Text style={styles.statLabel}>Total Spent</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, { color: colors.warning }]}>4.8</Text>
                <Text style={styles.statLabel}>Rating</Text>
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
