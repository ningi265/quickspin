import type React from "react"
import { StyleSheet, Text, View, type TextStyle, type ViewStyle } from "react-native"
import { colors } from "../../constants/theme"

interface AlertProps {
  children: React.ReactNode
  variant?: "default" | "destructive"
  style?: ViewStyle
}

interface AlertTitleProps {
  children: React.ReactNode
  style?: TextStyle
}

interface AlertDescriptionProps {
  children: React.ReactNode
  style?: TextStyle
}

export function Alert({ children, variant = "default", style }: AlertProps) {
  return <View style={[styles.alert, styles[variant], style]}>{children}</View>
}

export function AlertTitle({ children, style }: AlertTitleProps) {
  return <Text style={[styles.title, style]}>{children}</Text>
}

export function AlertDescription({ children, style }: AlertDescriptionProps) {
  return <Text style={[styles.description, style]}>{children}</Text>
}

const styles = StyleSheet.create({
  alert: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 16,
  },
  default: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  destructive: {
    backgroundColor: colors.error + "10",
    borderColor: colors.error + "30",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
  },
})
