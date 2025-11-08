import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native"

interface InputProps extends TextInputProps {
  label?: string
  error?: string
}

export function Input({ label, error, style, ...props }: InputProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput style={[styles.input, error && styles.inputError, style]} placeholderTextColor="#9ca3af" {...props} />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#374151",
    marginBottom: 6,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: "#ffffff",
    color: "#111827",
  },
  inputError: {
    borderColor: "#dc2626",
  },
  error: {
    fontSize: 12,
    color: "#dc2626",
    marginTop: 4,
  },
})
