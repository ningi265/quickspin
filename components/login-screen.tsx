"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Lock, Phone, Shirt } from "lucide-react"
import { useState } from "react"

interface LoginScreenProps {
  onLogin: (userData: any) => void
  onSwitchToRegister: () => void
}

export function LoginScreen({ onLogin, onSwitchToRegister }: LoginScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [password, setPassword] = useState("")

  const handleLogin = () => {
    // Mock login - in real app, this would call your API
    const userData = {
      id: "user123",
      name: "John Banda",
      phoneNumber: phoneNumber,
      email: "john.banda@email.com",
      address: "Namiwawa, Blantyre",
    }
    onLogin(userData)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="flex-1 flex flex-col justify-center">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-blue-600 p-3 rounded-full">
              <Shirt className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">LaundryBT</h1>
          <p className="text-gray-600">Laundry delivery in Blantyre</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to your account</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+265 888 123 456"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700">
              Sign In
            </Button>

            <div className="text-center">
              <Button variant="link" className="text-sm text-blue-600">
                Forgot Password?
              </Button>
            </div>

            <Separator />

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">{"Don't have an account?"}</p>
              <Button variant="outline" onClick={onSwitchToRegister} className="w-full bg-transparent">
                Create Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
