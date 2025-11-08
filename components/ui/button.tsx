import type React from "react"
import { StyleSheet, Text, TouchableOpacity, type TextStyle, type ViewStyle } from "react-native"

interface ButtonProps {
  children: React.ReactNode
  onPress?: () => void
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
  disabled?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
}

export function Button({
  children,
  onPress,
  variant = "default",
  size = "default",
  disabled = false,
  style,
  textStyle,
}: ButtonProps) {
  const buttonStyles = [styles.base, styles[variant], styles[`size_${size}`], disabled && styles.disabled, style]

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`textSize_${size}`],
    disabled && styles.disabledText,
    textStyle,
  ]

  return (
    <TouchableOpacity style={buttonStyles} onPress={onPress} disabled={disabled} activeOpacity={0.8}>
      <Text style={textStyles}>{children}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  default: {
    backgroundColor: "#2563eb",
  },
  destructive: {
    backgroundColor: "#dc2626",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#d1d5db",
  },
  secondary: {
    backgroundColor: "#f3f4f6",
  },
  ghost: {
    backgroundColor: "transparent",
  },
  link: {
    backgroundColor: "transparent",
  },
  size_default: {
    height: 40,
    paddingHorizontal: 16,
  },
  size_sm: {
    height: 36,
    paddingHorizontal: 12,
  },
  size_lg: {
    height: 44,
    paddingHorizontal: 20,
  },
  size_icon: {
    height: 40,
    width: 40,
    paddingHorizontal: 0,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
  },
  text_default: {
    color: "#ffffff",
  },
  text_destructive: {
    color: "#ffffff",
  },
  text_outline: {
    color: "#374151",
  },
  text_secondary: {
    color: "#374151",
  },
  text_ghost: {
    color: "#374151",
  },
  text_link: {
    color: "#2563eb",
    textDecorationLine: "underline",
  },
  textSize_default: {
    fontSize: 14,
  },
  textSize_sm: {
    fontSize: 13,
  },
  textSize_lg: {
    fontSize: 16,
  },
  textSize_icon: {
    fontSize: 14,
  },
  disabledText: {
    opacity: 0.5,
  },
})
