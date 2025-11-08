"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Lock, Mail, MapPin, Phone, User } from "lucide-react"
import { useState } from "react"

interface RegisterScreenProps {
  onRegister: (userData: any) => void
  onSwitchToLogin: () => void
}

export function RegisterScreen({ onRegister, onSwitchToLogin }: RegisterScreenProps) {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: "",
    email: "",
    address: "",
    password: "",
    confirmPassword: "",
  })

  const handleRegister = () => {
    // Mock registration - in real app, this would call your API
    const userData = {
      id: "user" + Date.now(),
      name: formData.name,
      phoneNumber: formData.phoneNumber,
      email: formData.email,
      address: formData.address,
    }
    onRegister(userData)
  }

  const updateFormData = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="flex items-center mb-6 pt-4">
        <Button variant="ghost" size="sm" onClick={onSwitchToLogin}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      <div className="flex-1">
        <Card>
          <CardHeader>
            <CardTitle>Create Account</CardTitle>
            <CardDescription>Join LaundryBT today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  placeholder="John Banda"
                  value={formData.name}
                  onChange={(e) => updateFormData("name", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+265 888 123 456"
                  value={formData.phoneNumber}
                  onChange={(e) => updateFormData("phoneNumber", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="john@email.com"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="address"
                  placeholder="Namiwawa, Blantyre"
                  value={formData.address}
                  onChange={(e) => updateFormData("address", e.target.value)}
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
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateFormData("confirmPassword", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Button onClick={handleRegister} className="w-full bg-blue-600 hover:bg-blue-700">
              Create Account
            </Button>

            <Separator />

            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Already have an account?</p>
              <Button variant="outline" onClick={onSwitchToLogin} className="w-full bg-transparent">
                Sign In
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
