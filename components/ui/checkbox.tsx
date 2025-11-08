import { Ionicons } from "@expo/vector-icons"
import { StyleSheet, TouchableOpacity } from "react-native"

interface CheckboxProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
}

export function Checkbox({ checked, onCheckedChange, disabled = false }: CheckboxProps) {
  return (
    <TouchableOpacity
      style={[styles.checkbox, checked && styles.checked, disabled && styles.disabled]}
      onPress={() => !disabled && onCheckedChange(!checked)}
      disabled={disabled}
    >
      {checked && <Ionicons name="checkmark" size={16} color="#ffffff" />}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: "#d1d5db",
    borderRadius: 4,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },
  checked: {
    backgroundColor: "#2563eb",
    borderColor: "#2563eb",
  },
  disabled: {
    opacity: 0.5,
  },
})
