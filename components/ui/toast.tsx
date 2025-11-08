"use client"

import React, { createContext, useCallback, useContext, useState } from "react"
import { Animated, StyleSheet, Text, View } from "react-native"
import { colors } from "../../constants/theme"

interface Toast {
  id: string
  title: string
  description?: string
  variant?: "default" | "destructive"
}

interface ToastContextType {
  toast: (toast: Omit<Toast, "id">) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((newToast: Omit<Toast, "id">) => {
    const id = Date.now().toString()
    const toastWithId = { ...newToast, id }

    setToasts((prev) => [...prev, toastWithId])

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <View style={styles.container}>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} />
        ))}
      </View>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast }: { toast: Toast }) {
  const opacity = new Animated.Value(0)

  React.useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start()
  }, [])

  return (
    <Animated.View style={[styles.toast, styles[toast.variant || "default"], { opacity }]}>
      <Text style={styles.title}>{toast.title}</Text>
      {toast.description && <Text style={styles.description}>{toast.description}</Text>}
    </Animated.View>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    zIndex: 1000,
  },
  toast: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  default: {
    backgroundColor: "white",
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  destructive: {
    backgroundColor: "#fef2f2",
    borderLeftWidth: 4,
    borderLeftColor: "#ef4444",
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
