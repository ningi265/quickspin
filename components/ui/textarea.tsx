import { StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native"

interface TextareaProps extends TextInputProps {
  label?: string
  error?: string
}

export function Textarea({ label, error, style, ...props }: TextareaProps) {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.textarea, error && styles.textareaError, style]}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        placeholderTextColor="#9ca3af"
        {...props}
      />
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
  textarea: {
    minHeight: 80,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#ffffff",
    color: "#111827",
  },
  textareaError: {
    borderColor: "#dc2626",
  },
  error: {
    fontSize: 12,
    color: "#dc2626",
    marginTop: 4,
  },
})
