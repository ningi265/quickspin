import type React from "react"
import { StyleSheet, Text, View, type TextStyle, type ViewStyle } from "react-native"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "secondary" | "destructive" | "outline"
  style?: ViewStyle
  textStyle?: TextStyle
}

export function Badge({ children, variant = "default", style, textStyle }: BadgeProps) {
  return (
    <View style={[styles.badge, styles[variant], style]}>
      <Text style={[styles.text, styles[`text_${variant}`], textStyle]}>{children}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  default: {
    backgroundColor: "#111827",
  },
  secondary: {
    backgroundColor: "#f3f4f6",
  },
  destructive: {
    backgroundColor: "#dc2626",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  text: {
    fontSize: 12,
    fontWeight: "500",
  },
  text_default: {
    color: "#ffffff",
  },
  text_secondary: {
    color: "#374151",
  },
  text_destructive: {
    color: "#ffffff",
  },
  text_outline: {
    color: "#374151",
  },
})
