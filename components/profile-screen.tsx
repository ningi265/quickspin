"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
    ArrowLeft,
    Bell,
    ChevronRight,
    CreditCard,
    Edit,
    HelpCircle,
    LogOut,
    Mail,
    MapPin,
    Phone,
    User,
} from "lucide-react"

interface ProfileScreenProps {
  user: any
  onBack: () => void
  onLogout: () => void
}

export function ProfileScreen({ user, onBack, onLogout }: ProfileScreenProps) {
  const menuItems = [
    {
      icon: CreditCard,
      title: "Payment Methods",
      description: "Manage your payment options",
      action: () => console.log("Payment methods"),
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "SMS and app notifications",
      action: () => console.log("Notifications"),
    },
    {
      icon: HelpCircle,
      title: "Help & Support",
      description: "Get help or contact us",
      action: () => console.log("Help"),
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" onClick={onBack} className="text-white hover:bg-blue-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-lg font-semibold ml-4">Profile</h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
            <User className="h-8 w-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{user?.name}</h2>
            <p className="text-blue-100 text-sm">Member since Jan 2024</p>
          </div>
          <Button variant="ghost" size="sm" className="text-white hover:bg-blue-700">
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-6 -mt-4">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <Phone className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-sm font-medium">Phone Number</p>
                <p className="text-sm text-gray-600">{user?.phoneNumber}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Mail className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-sm font-medium">Email Address</p>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-4 w-4 text-gray-600" />
              <div>
                <p className="text-sm font-medium">Address</p>
                <p className="text-sm text-gray-600">{user?.address}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Account Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-600">12</p>
                <p className="text-xs text-gray-600">Total Orders</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">MWK 28K</p>
                <p className="text-xs text-gray-600">Total Spent</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-600">4.8</p>
                <p className="text-xs text-gray-600">Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <Card>
          <CardContent className="p-0">
            {menuItems.map((item, index) => {
              const IconComponent = item.icon
              return (
                <div key={index}>
                  <button
                    onClick={item.action}
                    className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <IconComponent className="h-5 w-5 text-gray-600" />
                      <div className="text-left">
                        <p className="font-medium text-sm">{item.title}</p>
                        <p className="text-xs text-gray-600">{item.description}</p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </button>
                  {index < menuItems.length - 1 && <Separator />}
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardContent className="p-4">
            <div className="text-center space-y-2">
              <p className="text-sm font-medium">LaundryBT</p>
              <p className="text-xs text-gray-600">Version 1.0.0</p>
              <p className="text-xs text-gray-600">Made with ❤️ in Blantyre, Malawi</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logout Button */}
      <div className="p-4">
        <Button
          onClick={onLogout}
          variant="outline"
          className="w-full text-red-600 border-red-200 hover:bg-red-50 bg-transparent"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
