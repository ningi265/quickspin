import { Ionicons } from "@expo/vector-icons"
import type React from "react"
import { StyleSheet, Text, View, type ViewStyle } from "react-native"

interface AlertProps {
  children: React.ReactNode
  variant?: "default" | "destructive"
  style?: ViewStyle
}

interface AlertDescriptionProps {
  children: React.ReactNode
}

export function Alert({ children, variant = "default", style }: AlertProps) {
  return (
    <View style={[styles.alert, styles[variant], style]}>
      <Ionicons
        name={variant === "destructive" ? "warning" : "information-circle"}
        size={16}
        color={variant === "destructive" ? "#dc2626" : "#2563eb"}
        style={styles.icon}
      />
      {children}
    </View>
  )
}

export function AlertDescription({ children }: AlertDescriptionProps) {
  return <Text style={styles.description}>{children}</Text>
}

const styles = StyleSheet.create({
  alert: {
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  default: {
    backgroundColor: "#eff6ff",
    borderColor: "#bfdbfe",
  },
  destructive: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
  },
  icon: {
    marginRight: 8,
    marginTop: 2,
  },
  description: {
    fontSize: 14,
    color: "#374151",
    flex: 1,
  },
})
