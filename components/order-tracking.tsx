"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, CheckCircle, Clock, MapPin, Package, Phone, Truck } from "lucide-react"

interface OrderTrackingProps {
  orders: any[]
  onBack: () => void
}

export function OrderTracking({ orders, onBack }: OrderTrackingProps) {
  const activeOrder = orders.find((order) => order.status !== "delivered") || orders[0]

  const getStatusProgress = (status: string) => {
    switch (status) {
      case "pending":
        return 25
      case "picked_up":
        return 50
      case "in_progress":
        return 75
      case "delivered":
        return 100
      default:
        return 0
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "picked_up":
        return "bg-blue-500"
      case "in_progress":
        return "bg-orange-500"
      case "delivered":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const trackingSteps = [
    {
      id: "pending",
      title: "Order Confirmed",
      description: "Your order has been received",
      icon: CheckCircle,
      time: "10:00 AM",
    },
    {
      id: "picked_up",
      title: "Picked Up",
      description: "Items collected from your location",
      icon: Package,
      time: "11:30 AM",
    },
    {
      id: "in_progress",
      title: "In Progress",
      description: "Your laundry is being processed",
      icon: Clock,
      time: "2:00 PM",
    },
    {
      id: "delivered",
      title: "Delivered",
      description: "Order delivered to your location",
      icon: Truck,
      time: "Expected 4:00 PM",
    },
  ]

  const getCurrentStepIndex = (status: string) => {
    return trackingSteps.findIndex((step) => step.id === status)
  }

  const currentStepIndex = getCurrentStepIndex(activeOrder?.status || "pending")

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-lg font-semibold ml-4">Track Order</h1>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base">Order #{activeOrder?.id}</CardTitle>
                <CardDescription>{new Date(activeOrder?.pickupTime).toLocaleDateString()}</CardDescription>
              </div>
              <Badge variant="secondary" className={`${getStatusColor(activeOrder?.status)} text-white`}>
                {activeOrder?.status?.replace("_", " ").toUpperCase()}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Services</span>
                <span className="text-sm font-medium">{activeOrder?.services?.join(", ").toUpperCase()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total</span>
                <span className="text-sm font-medium">MWK {activeOrder?.price?.toLocaleString()}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                {activeOrder?.location?.address}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Progress value={getStatusProgress(activeOrder?.status)} className="h-2" />
            </div>

            <div className="space-y-4">
              {trackingSteps.map((step, index) => {
                const IconComponent = step.icon
                const isCompleted = index <= currentStepIndex
                const isCurrent = index === currentStepIndex

                return (
                  <div key={step.id} className="flex items-start space-x-3">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isCompleted ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-400"
                      }`}
                    >
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <p
                            className={`font-medium text-sm ${
                              isCurrent ? "text-blue-600" : isCompleted ? "text-gray-900" : "text-gray-400"
                            }`}
                          >
                            {step.title}
                          </p>
                          <p className="text-xs text-gray-600">{step.description}</p>
                        </div>
                        <span className="text-xs text-gray-500">{step.time}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Delivery Agent */}
        {activeOrder?.status === "picked_up" || activeOrder?.status === "in_progress" ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Delivery Agent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-blue-600">JM</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">James Mwale</p>
                    <p className="text-xs text-gray-600">Delivery Agent</p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  <Phone className="h-4 w-4 mr-2" />
                  Call
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : null}

        {/* Estimated Delivery */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Truck className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-sm">Estimated Delivery</p>
                  <p className="text-xs text-gray-600">
                    {new Date(activeOrder?.deliveryTime).toLocaleDateString()} at 4:00 PM
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Actions */}
      <div className="bg-white border-t p-4">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" size="sm">
            Contact Support
          </Button>
          <Button variant="outline" size="sm">
            Modify Order
          </Button>
        </div>
      </div>
    </div>
  )
}
