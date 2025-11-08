"use client"

import { HomeScreen } from "@/components/home-screen"
import { LoginScreen } from "@/components/login-screen"
import { OrderHistory } from "@/components/order-history"
import { OrderTracking } from "@/components/order-tracking"
import { ProfileScreen } from "@/components/profile-screen"
import { RegisterScreen } from "@/components/register-screen"
import { SchedulePickup } from "@/components/schedule-pickup"
import { useState } from "react"

export default function LaundryApp() {
  const [currentScreen, setCurrentScreen] = useState("login")
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([
    {
      id: "ORD001",
      services: ["wash", "iron", "fold"],
      pickupTime: "2024-01-15T10:00:00Z",
      deliveryTime: "2024-01-16T16:00:00Z",
      status: "in_progress",
      price: 2500,
      location: {
        address: "Namiwawa, Blantyre",
        latitude: -15.7861,
        longitude: 35.0058,
      },
    },
    {
      id: "ORD002",
      services: ["wash", "dry"],
      pickupTime: "2024-01-10T14:00:00Z",
      deliveryTime: "2024-01-11T18:00:00Z",
      status: "delivered",
      price: 1800,
      location: {
        address: "Sunnyside, Blantyre",
        latitude: -15.7861,
        longitude: 35.0058,
      },
    },
  ])

  const handleLogin = (userData) => {
    setUser(userData)
    setCurrentScreen("home")
  }

  const handleRegister = (userData) => {
    setUser(userData)
    setCurrentScreen("home")
  }

  const addOrder = (orderData) => {
    const newOrder = {
      id: `ORD${String(orders.length + 1).padStart(3, "0")}`,
      ...orderData,
      status: "pending",
    }
    setOrders([newOrder, ...orders])
    setCurrentScreen("tracking")
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case "login":
        return <LoginScreen onLogin={handleLogin} onSwitchToRegister={() => setCurrentScreen("register")} />
      case "register":
        return <RegisterScreen onRegister={handleRegister} onSwitchToLogin={() => setCurrentScreen("login")} />
      case "home":
        return <HomeScreen user={user} onNavigate={setCurrentScreen} />
      case "schedule":
        return <SchedulePickup onBack={() => setCurrentScreen("home")} onSchedule={addOrder} />
      case "tracking":
        return <OrderTracking orders={orders} onBack={() => setCurrentScreen("home")} />
      case "profile":
        return (
          <ProfileScreen
            user={user}
            onBack={() => setCurrentScreen("home")}
            onLogout={() => {
              setUser(null)
              setCurrentScreen("login")
            }}
          />
        )
      case "history":
        return <OrderHistory orders={orders} onBack={() => setCurrentScreen("home")} />
      default:
        return <HomeScreen user={user} onNavigate={setCurrentScreen} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen shadow-lg">{renderScreen()}</div>
    </div>
  )
}
