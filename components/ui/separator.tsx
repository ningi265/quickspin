import { StyleSheet, View, type ViewStyle } from "react-native"

interface SeparatorProps {
  orientation?: "horizontal" | "vertical"
  style?: ViewStyle
}

export function Separator({ orientation = "horizontal", style }: SeparatorProps) {
  return <View style={[styles.separator, orientation === "vertical" ? styles.vertical : styles.horizontal, style]} />
}

const styles = StyleSheet.create({
  separator: {
    backgroundColor: "#e5e7eb",
  },
  horizontal: {
    height: 1,
    width: "100%",
  },
  vertical: {
    width: 1,
    height: "100%",
  },
})
