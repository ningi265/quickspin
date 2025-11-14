"use client"

import { Ionicons } from "@expo/vector-icons"
import { Redirect, Tabs } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import { colors } from "../../constants/theme"
import { useAuth } from "../../contexts/AuthContext"

export default function TabsLayout() {
  const { user, loading } = useAuth()

  if (loading) {
    return null
  }

  if (!user) {
    return <Redirect href="/(auth)/login" />
  }

  return (
  
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            height: 60,
            paddingBottom: 8,
            paddingTop: 8,
            // Add safe area padding for bottom
            paddingBottom: 20, // Additional padding for navigation bar
          },
          headerShown: false,
        }}
      >
        {/* Your tab screens remain the same */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="schedule"
          options={{
            title: "Schedule",
            tabBarIcon: ({ color, size }) => <Ionicons name="calendar" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="orders"
          options={{
            title: "Orders",
            tabBarIcon: ({ color, size }) => <Ionicons name="list" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="tracking"
          options={{
            title: "Tracking",
            tabBarIcon: ({ color, size }) => <Ionicons name="location" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="history"
          options={{
            title: "History",
            tabBarIcon: ({ color, size }) => <Ionicons name="time-outline" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />,
          }}
        />
      </Tabs>
  
  )
}