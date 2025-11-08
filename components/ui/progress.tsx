import { StyleSheet, View, type ViewStyle } from "react-native"

interface ProgressProps {
  value: number
  max?: number
  style?: ViewStyle
}

export function Progress({ value, max = 100, style }: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  return (
    <View style={[styles.container, style]}>
      <View style={[styles.progress, { width: `${percentage}%` }]} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    height: 8,
    backgroundColor: "#f3f4f6",
    borderRadius: 4,
    overflow: "hidden",
  },
  progress: {
    height: "100%",
    backgroundColor: "#2563eb",
    borderRadius: 4,
  },
})
