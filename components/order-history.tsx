"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Calendar, Filter, MapPin, MoreVertical, Package, Search } from "lucide-react"
import { useState } from "react"

interface OrderHistoryProps {
  orders: any[]
  onBack: () => void
}

export function OrderHistory({ orders, onBack }: OrderHistoryProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "picked_up":
        return "bg-blue-100 text-blue-800"
      case "in_progress":
        return "bg-orange-100 text-orange-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.location.address.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || order.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center mb-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-lg font-semibold ml-4">Order History</h1>
        </div>

        {/* Search and Filter */}
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b px-4 py-2">
        <div className="flex space-x-1">
          {[
            { id: "all", label: "All" },
            { id: "pending", label: "Pending" },
            { id: "in_progress", label: "Active" },
            { id: "delivered", label: "Completed" },
          ].map((filter) => (
            <Button
              key={filter.id}
              variant={filterStatus === filter.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilterStatus(filter.id)}
              className="text-xs"
            >
              {filter.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="flex-1 p-4 space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No orders found</p>
            <p className="text-sm text-gray-500">
              {searchQuery ? "Try adjusting your search" : "Your orders will appear here"}
            </p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-sm">Order #{order.id}</h3>
                    <div className="flex items-center text-xs text-gray-600 mt-1">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(order.pickupTime).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(order.status)}>
                      {order.status.replace("_", " ").toUpperCase()}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Services</span>
                    <span className="font-medium">{order.services.join(", ").toUpperCase()}</span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total</span>
                    <span className="font-medium text-blue-600">MWK {order.price.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="h-3 w-3 mr-1" />
                    {order.location.address}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 mt-4">
                  {order.status === "delivered" ? (
                    <>
                      <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent">
                        Reorder
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent">
                        Rate Service
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent">
                        Track Order
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 text-xs bg-transparent">
                        Contact Support
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      {filteredOrders.length > 0 && (
        <div className="bg-white border-t p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-lg font-bold text-blue-600">{filteredOrders.length}</p>
              <p className="text-xs text-gray-600">Total Orders</p>
            </div>
            <div>
              <p className="text-lg font-bold text-green-600">
                MWK {filteredOrders.reduce((sum, order) => sum + order.price, 0).toLocaleString()}
              </p>
              <p className="text-xs text-gray-600">Total Spent</p>
            </div>
            <div>
              <p className="text-lg font-bold text-orange-600">
                {filteredOrders.filter((o) => o.status === "delivered").length}
              </p>
              <p className="text-xs text-gray-600">Completed</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
