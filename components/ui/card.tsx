import type React from "react"
import { StyleSheet, Text, View, type ViewStyle } from "react-native"

interface CardProps {
  children: React.ReactNode
  style?: ViewStyle
}

interface CardHeaderProps {
  children: React.ReactNode
  style?: ViewStyle
}

interface CardContentProps {
  children: React.ReactNode
  style?: ViewStyle
}

interface CardTitleProps {
  children: React.ReactNode
  style?: ViewStyle
}

interface CardDescriptionProps {
  children: React.ReactNode
  style?: ViewStyle
}

export function Card({ children, style }: CardProps) {
  return <View style={[styles.card, style]}>{children}</View>
}

export function CardHeader({ children, style }: CardHeaderProps) {
  return <View style={[styles.header, style]}>{children}</View>
}

export function CardContent({ children, style }: CardContentProps) {
  return <View style={[styles.content, style]}>{children}</View>
}

export function CardTitle({ children, style }: CardTitleProps) {
  return <Text style={[styles.title, style]}>{children}</Text>
}

export function CardDescription({ children, style }: CardDescriptionProps) {
  return <Text style={[styles.description, style]}>{children}</Text>
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    padding: 16,
    paddingBottom: 0,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#6b7280",
  },
})
