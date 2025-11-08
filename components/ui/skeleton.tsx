"use client"

import { useEffect, useRef } from "react"
import { Animated, StyleSheet, type ViewStyle } from "react-native"

interface SkeletonProps {
  style?: ViewStyle
}

export function Skeleton({ style }: SkeletonProps) {
  const opacity = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => animate())
    }
    animate()
  }, [opacity])

  return <Animated.View style={[styles.skeleton, { opacity }, style]} />
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
  },
})
