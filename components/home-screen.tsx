"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, History, AnvilIcon as Iron, MapPin, Package, Package2, Shirt, User, Wind } from "lucide-react"

interface HomeScreenProps {
  user: any
  onNavigate: (screen: string) => void
}

export function HomeScreen({ user, onNavigate }: HomeScreenProps) {
  const services = [
    {
      id: "wash",
      name: "Wash",
      icon: Shirt,
      description: "Professional washing",
      price: "MWK 800/kg",
      color: "bg-blue-100 text-blue-600",
    },
    {
      id: "dry",
      name: "Dry",
      icon: Wind,
      description: "Quick drying service",
      price: "MWK 400/kg",
      color: "bg-green-100 text-green-600",
    },
    {
      id: "iron",
      name: "Iron",
      icon: Iron,
      description: "Professional ironing",
      price: "MWK 600/kg",
      color: "bg-orange-100 text-orange-600",
    },
    {
      id: "fold",
      name: "Fold",
      icon: Package2,
      description: "Neat folding service",
      price: "MWK 200/kg",
      color: "bg-purple-100 text-purple-600",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 pb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-xl font-bold">Hello, {user?.name?.split(" ")[0]}!</h1>
            <div className="flex items-center mt-1 text-blue-100">
              <MapPin className="h-4 w-4 mr-1" />
              <span className="text-sm">{user?.address}</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("profile")}
            className="text-white hover:bg-blue-700"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>

        <div className="bg-white/10 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-blue-100">Next Pickup</p>
              <p className="font-semibold">No scheduled pickups</p>
            </div>
            <Clock className="h-5 w-5 text-blue-200" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="p-4 -mt-3">
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button onClick={() => onNavigate("schedule")} className="h-16 bg-blue-600 hover:bg-blue-700 flex-col">
            <Calendar className="h-5 w-5 mb-1" />
            <span className="text-sm">Schedule Pickup</span>
          </Button>
          <Button onClick={() => onNavigate("tracking")} variant="outline" className="h-16 flex-col">
            <Package className="h-5 w-5 mb-1" />
            <span className="text-sm">Track Order</span>
          </Button>
        </div>

        {/* Services */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Our Services</h2>
          <div className="grid grid-cols-2 gap-3">
            {services.map((service) => {
              const IconComponent = service.icon
              return (
                <Card key={service.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className={`w-10 h-10 rounded-lg ${service.color} flex items-center justify-center mb-3`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold text-sm mb-1">{service.name}</h3>
                    <p className="text-xs text-gray-600 mb-2">{service.description}</p>
                    <Badge variant="secondary" className="text-xs">
                      {service.price}
                    </Badge>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Recent Activity</CardTitle>
            <CardDescription>Your latest orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                    <Package className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Order #ORD002</p>
                    <p className="text-xs text-gray-600">Delivered • Jan 11</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Completed
                </Badge>
              </div>

              <Button variant="ghost" onClick={() => onNavigate("history")} className="w-full text-blue-600">
                <History className="h-4 w-4 mr-2" />
                View All Orders
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
