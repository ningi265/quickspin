"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar, Clock, AnvilIcon as Iron, MapPin, Package2, Shirt, Wind } from "lucide-react"
import { useState } from "react"

interface SchedulePickupProps {
  onBack: () => void
  onSchedule: (orderData: any) => void
}

export function SchedulePickup({ onBack, onSchedule }: SchedulePickupProps) {
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTime, setSelectedTime] = useState("")
  const [notes, setNotes] = useState("")

  const services = [
    { id: "wash", name: "Wash", icon: Shirt, price: 800, description: "Professional washing" },
    { id: "dry", name: "Dry", icon: Wind, price: 400, description: "Quick drying" },
    { id: "iron", name: "Iron", icon: Iron, price: 600, description: "Professional ironing" },
    { id: "fold", name: "Fold", icon: Package2, price: 200, description: "Neat folding" },
  ]

  const timeSlots = ["08:00 - 10:00", "10:00 - 12:00", "12:00 - 14:00", "14:00 - 16:00", "16:00 - 18:00"]

  const dates = [
    { date: "2024-01-15", day: "Today", available: true },
    { date: "2024-01-16", day: "Tomorrow", available: true },
    { date: "2024-01-17", day: "Wed", available: true },
    { date: "2024-01-18", day: "Thu", available: false },
    { date: "2024-01-19", day: "Fri", available: true },
  ]

  const toggleService = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId) ? prev.filter((id) => id !== serviceId) : [...prev, serviceId],
    )
  }

  const calculateTotal = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find((s) => s.id === serviceId)
      return total + (service?.price || 0)
    }, 0)
  }

  const handleSchedule = () => {
    const orderData = {
      services: selectedServices,
      pickupTime: `${selectedDate}T${selectedTime.split(" - ")[0]}:00Z`,
      deliveryTime: `${selectedDate}T${selectedTime.split(" - ")[1]}:00Z`,
      price: calculateTotal(),
      notes,
      location: {
        address: "Namiwawa, Blantyre",
        latitude: -15.7861,
        longitude: 35.0058,
      },
    }
    onSchedule(orderData)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-lg font-semibold ml-4">Schedule Pickup</h1>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-6">
        {/* Services Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Select Services</CardTitle>
            <CardDescription>Choose the services you need</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {services.map((service) => {
              const IconComponent = service.icon
              const isSelected = selectedServices.includes(service.id)

              return (
                <div
                  key={service.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    isSelected ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200"
                  }`}
                  onClick={() => toggleService(service.id)}
                >
                  <Checkbox checked={isSelected} onChange={() => toggleService(service.id)} />
                  <div className="flex items-center flex-1">
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                      <IconComponent className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{service.name}</p>
                      <p className="text-xs text-gray-600">{service.description}</p>
                    </div>
                    <Badge variant="secondary">MWK {service.price}/kg</Badge>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Date Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Select Date
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 gap-2">
              {dates.map((dateOption) => (
                <Button
                  key={dateOption.date}
                  variant={selectedDate === dateOption.date ? "default" : "outline"}
                  size="sm"
                  disabled={!dateOption.available}
                  onClick={() => setSelectedDate(dateOption.date)}
                  className="flex-col h-16 text-xs"
                >
                  <span className="font-medium">{dateOption.day}</span>
                  <span className="text-xs opacity-70">{new Date(dateOption.date).getDate()}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Time Selection */}
        {selectedDate && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center">
                <Clock className="h-4 w-4 mr-2" />
                Select Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedTime(time)}
                    className="text-xs"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Pickup Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center p-3 bg-gray-50 rounded-lg">
              <MapPin className="h-4 w-4 text-gray-600 mr-3" />
              <div>
                <p className="font-medium text-sm">Home Address</p>
                <p className="text-xs text-gray-600">Namiwawa, Blantyre</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Instructions */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Special Instructions</CardTitle>
            <CardDescription>Any special requests or notes</CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g., Please handle delicate items with care..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-20"
            />
          </CardContent>
        </Card>
      </div>

      {/* Bottom Summary */}
      {selectedServices.length > 0 && (
        <div className="bg-white border-t p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="font-medium">Total Estimate</span>
            <span className="text-lg font-bold text-blue-600">MWK {calculateTotal().toLocaleString()}/kg</span>
          </div>
          <Button
            onClick={handleSchedule}
            disabled={!selectedDate || !selectedTime}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            Schedule Pickup
          </Button>
        </div>
      )}
    </div>
  )
}
