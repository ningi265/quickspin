"use client"

import React, { useState } from "react"
import { StyleSheet, Text, TouchableOpacity, View, type ViewStyle } from "react-native"

interface TabsProps {
  defaultValue: string
  children: React.ReactNode
  style?: ViewStyle
}

interface TabsListProps {
  children: React.ReactNode
  style?: ViewStyle
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  style?: ViewStyle
}

interface TabsContentProps {
  value: string
  children: React.ReactNode
  style?: ViewStyle
}

const TabsContext = React.createContext<{
  activeTab: string
  setActiveTab: (value: string) => void
} | null>(null)

export function Tabs({ defaultValue, children, style }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <View style={[styles.tabs, style]}>{children}</View>
    </TabsContext.Provider>
  )
}

export function TabsList({ children, style }: TabsListProps) {
  return <View style={[styles.tabsList, style]}>{children}</View>
}

export function TabsTrigger({ value, children, style }: TabsTriggerProps) {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("TabsTrigger must be used within Tabs")

  const { activeTab, setActiveTab } = context
  const isActive = activeTab === value

  return (
    <TouchableOpacity
      style={[styles.tabsTrigger, isActive && styles.tabsTriggerActive, style]}
      onPress={() => setActiveTab(value)}
    >
      <Text style={[styles.tabsTriggerText, isActive && styles.tabsTriggerTextActive]}>{children}</Text>
    </TouchableOpacity>
  )
}

export function TabsContent({ value, children, style }: TabsContentProps) {
  const context = React.useContext(TabsContext)
  if (!context) throw new Error("TabsContent must be used within Tabs")

  const { activeTab } = context

  if (activeTab !== value) return null

  return <View style={[styles.tabsContent, style]}>{children}</View>
}

const styles = StyleSheet.create({
  tabs: {
    flex: 1,
  },
  tabsList: {
    flexDirection: "row",
    backgroundColor: "#f3f4f6",
    borderRadius: 6,
    padding: 4,
  },
  tabsTrigger: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  tabsTriggerActive: {
    backgroundColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  tabsTriggerText: {
    fontSize: 14,
    color: "#6b7280",
  },
  tabsTriggerTextActive: {
    color: "#111827",
    fontWeight: "500",
  },
  tabsContent: {
    marginTop: 16,
  },
})
