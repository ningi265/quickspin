"use client"

import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { useState } from "react"
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { colors } from "../../constants/theme"
import { useAuth } from "../../contexts/AuthContext"

export default function RegisterScreen() {
  const [name, setName] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleRegister = async () => {
    if (!name || !phoneNumber || !email || !address || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields")
      return
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
      return
    }

    setLoading(true)
    try {
      const userData = {
        id: `user_${Date.now()}`,
        name,
        phoneNumber,
        email,
        address,
      }

      await login(userData)
    } catch (error) {
      Alert.alert("Error", "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <LinearGradient colors={[colors.primary, colors.secondary]} style={styles.gradient}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="shirt" size={48} color="white" />
            </View>
            <Text style={styles.title}>Dinogorey Laundry</Text>
            <Text style={styles.subtitle}>Create your account</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Get Started</Text>
            <Text style={styles.formSubtitle}>Create your account to continue</Text>

            <Input label="Full Name" placeholder="Enter your full name" value={name} onChangeText={setName} />

            <Input
              label="Phone Number"
              placeholder="+265 888 123 456"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />

            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input label="Address" placeholder="Enter your address" value={address} onChangeText={setAddress} />

            <Input
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <Input
              label="Confirm Password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
            />

            <Button onPress={handleRegister} disabled={loading} style={{ marginBottom: 16 }}>
              {loading ? "Creating Account..." : "Create Account"}
            </Button>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            <Button variant="outline" onPress={() => router.push("/(auth)/login")}>
              Sign In Instead
            </Button>
          </View>
        </ScrollView>
      </LinearGradient>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 80,
    height: 80,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
  },
  formContainer: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.textSecondary,
    fontSize: 14,
  },
})
