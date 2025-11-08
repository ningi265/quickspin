"use client"
import { Switch as RNSwitch, type SwitchProps } from "react-native"

interface CustomSwitchProps extends SwitchProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}

export function Switch({ checked, onCheckedChange, ...props }: CustomSwitchProps) {
  return (
    <RNSwitch
      value={checked}
      onValueChange={onCheckedChange}
      trackColor={{ false: "#f3f4f6", true: "#93c5fd" }}
      thumbColor={checked ? "#2563eb" : "#ffffff"}
      {...props}
    />
  )
}
