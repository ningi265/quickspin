import type React from "react"
import { Image, StyleSheet, Text, View, type ImageStyle, type TextStyle, type ViewStyle } from "react-native"

interface AvatarProps {
  children: React.ReactNode
  style?: ViewStyle
}

interface AvatarImageProps {
  src: string
  alt?: string
  style?: ImageStyle
}

interface AvatarFallbackProps {
  children: React.ReactNode
  style?: TextStyle
}

export function Avatar({ children, style }: AvatarProps) {
  return <View style={[styles.avatar, style]}>{children}</View>
}

export function AvatarImage({ src, alt, style }: AvatarImageProps) {
  return <Image source={{ uri: src }} style={[styles.image, style]} accessibilityLabel={alt} />
}

export function AvatarFallback({ children, style }: AvatarFallbackProps) {
  return <Text style={[styles.fallback, style]}>{children}</Text>
}

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  fallback: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
  },
})
