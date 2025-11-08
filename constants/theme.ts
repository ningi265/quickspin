export const colors = {
  primary: "#2563eb",
  secondary: "#1e40af",
  surface: "#f8fafc",
  background: "#ffffff",
  text: "#1f2937",
  textSecondary: "#6b7280",
  border: "#e5e7eb",
  error: "#ef4444",
  success: "#10b981",
  warning: "#f59e0b",
}

export const theme = {
  colors: {
    ...colors,
    primary: colors.primary,
    accent: colors.secondary,
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
    text: colors.text,
    onSurface: colors.text,
    disabled: colors.textSecondary,
    placeholder: colors.textSecondary,
    backdrop: "rgba(0, 0, 0, 0.5)",
    notification: colors.primary,
  },
  roundness: 12,
}
