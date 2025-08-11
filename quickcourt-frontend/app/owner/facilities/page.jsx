"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { MapPin, Edit, Trash2, Plus, Search, Star, Users, Clock, Wifi, Car, Coffee } from "lucide-react"

export default function FacilitiesPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const facilities = [
    {
      id: 1,
      name: "Elite Sports Complex",
      location: "Downtown, Mumbai",
      description: "Premium sports facility with world-class amenities",
      sports: ["Badminton", "Tennis", "Table Tennis"],
      courts: 8,
      rating: 4.8,
      reviews: 124,
      status: "Active",
      earnings: 25600,
      bookings: 89,
      amenities: ["WiFi", "Parking", "Cafeteria", "Changing Rooms"],
      images: ["/elite-sports-complex.png", "/badminton-courts.png"],
      operatingHours: "06:00 - 23:00",
    },
    {
      id: 2,
      name: "Green Turf Arena",
      location: "North Zone, Mumbai",
      description: "Outdoor sports facility perfect for team sports",
      sports: ["Football", "Cricket"],
      courts: 3,
      rating: 4.6,
      reviews: 67,
      status: "Active",
      earnings: 18400,
      bookings: 45,
      amenities: ["Parking", "Equipment Rental", "First Aid"],
      images: ["/green-turf-ground.png"],
      operatingHours: "06:00 - 22:00",
    },
  ]

  const getAmenityIcon = (amenity) => {
    switch (amenity.toLowerCase()) {
      case "wifi":
        return <Wifi className="h-4 w-4" />
      case "parking":
        return <Car className="h-4 w-4" />
      case "cafeteria":
        return <Coffee className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Facilities</h1>
            <p className="text-gray-600 mt-2">Manage your sports facilities and their details</p>
          </div>
          <Button className="mt-4 md:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            <a href="/owner/facilities/new">Add New Facility</a>
          </Button>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search facilities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {facilities.map((facility) => (
            <Card key={facility.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video relative">
                <img
                  src={facility.images[0] || "/placeholder.svg"}
                  alt={facility.name}
                  className="w-full h-full object-cover"
                />
                <Badge
                  className={`absolute top-4 right-4 ${
                    facility.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}
                >
                  {facility.status}
                </Badge>
              </div>

              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{facility.name}</h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{facility.location}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{facility.description}</p>
                  </div>
                  <div className="flex items-center ml-4">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="ml-1 text-sm font-medium">{facility.rating}</span>
                    <span className="ml-1 text-xs text-gray-500">({facility.reviews})</span>
                  </div>
                </div>

                {/* Sports */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {facility.sports.map((sport) => (
                      <Badge key={sport} variant="secondary" className="text-xs">
                        {sport}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">{facility.courts}</div>
                    <div className="text-xs text-gray-600">Courts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">₹{facility.earnings.toLocaleString()}</div>
                    <div className="text-xs text-gray-600">Earnings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{facility.bookings}</div>
                    <div className="text-xs text-gray-600">Bookings</div>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {facility.amenities.slice(0, 4).map((amenity) => (
                      <div
                        key={amenity}
                        className="flex items-center space-x-1 text-xs text-gray-600 bg-white px-2 py-1 rounded border"
                      >
                        {getAmenityIcon(amenity)}
                        <span>{amenity}</span>
                      </div>
                    ))}
                    {facility.amenities.length > 4 && (
                      <div className="text-xs text-gray-500 px-2 py-1">+{facility.amenities.length - 4} more</div>
                    )}
                  </div>
                </div>

                {/* Operating Hours */}
                <div className="flex items-center text-sm text-gray-600 mb-4">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Operating Hours: {facility.operatingHours}</span>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Edit className="h-4 w-4 mr-2" />
                    <a href={`/owner/facilities/${facility.id}/edit`}>Edit</a>
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <MapPin className="h-4 w-4 mr-2" />
                    <a href={`/owner/facilities/${facility.id}/courts`}>Manage Courts</a>
                  </Button>
                  <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {facilities.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No facilities found</h3>
              <p className="text-gray-600 mb-4">Get started by adding your first sports facility.</p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                <a href="/owner/facilities/new">Add New Facility</a>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
