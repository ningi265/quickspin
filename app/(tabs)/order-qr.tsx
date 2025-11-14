// app/order-qr.tsx
import { Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View, Share, Alert } from "react-native";
import { colors } from "../../constants/theme";

export default function OrderQRScreen() {
  const params = useLocalSearchParams();
  const order = JSON.parse(params.order as string);
  const qrCodeImage = params.qrCode as string;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Show this QR code to the laundry pickup driver for order ${order.orderId}`,
        url: qrCodeImage // Some platforms support sharing images
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share QR code");
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          title: "Order QR Code",
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: "white",
        }}
      />
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>Show this QR Code to Driver</Text>
          <Text style={styles.subtitle}>Order #{order.orderId}</Text>
          
          {qrCodeImage ? (
            <Image 
              source={{ uri: qrCodeImage }} 
              style={styles.qrCode}
              resizeMode="contain"
            />
          ) : (
            <View style={styles.qrPlaceholder}>
              <Text>QR Code not available</Text>
            </View>
          )}
          
          <Text style={styles.instruction}>
            Present this QR code to the delivery personnel when they arrive for pickup.
            This verifies your order and updates the status automatically.
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={styles.shareButton}
              onPress={handleShare}
            >
              <Ionicons name="share-outline" size={20} color={colors.primary} />
              <Text style={styles.shareButtonText}>Share QR Code</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.trackButton}
              onPress={() => router.push({
                pathname: "/tracking",
                params: { order: JSON.stringify(order) }
              })}
            >
              <Text style={styles.trackButtonText}>Track Order</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  qrCode: {
    width: 250,
    height: 250,
    marginVertical: 20,
  },
  qrPlaceholder: {
    width: 250,
    height: 250,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    borderRadius: 8,
  },
  instruction: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  shareButtonText: {
    color: colors.primary,
    fontWeight: '600',
  },
  trackButton: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  trackButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});