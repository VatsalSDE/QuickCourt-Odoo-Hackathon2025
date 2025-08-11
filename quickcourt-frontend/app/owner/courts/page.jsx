"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Search, Filter, MapPin, Clock, ToggleLeft, ToggleRight } from "lucide-react"

export default function CourtManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [facilityFilter, setFacilityFilter] = useState("all")
  const [sportFilter, setSportFilter] = useState("all")

  const courts = [
    {
      id: 1,
      name: "Badminton Court A1",
      facility: "Elite Sports Complex",
      sport: "Badminton",
      pricePerHour: 600,
      status: "Active",
      operatingHours: "06:00 - 23:00",
      bookingsToday: 8,
      revenue: 4800,
      isActive: true,
    },
    {
      id: 2,
      name: "Badminton Court A2",
      facility: "Elite Sports Complex",
      sport: "Badminton",
      pricePerHour: 600,
      status: "Active",
      operatingHours: "06:00 - 23:00",
      bookingsToday: 6,
      revenue: 3600,
      isActive: true,
    },
    {
      id: 3,
      name: "Tennis Court 1",
      facility: "Elite Sports Complex",
      sport: "Tennis",
      pricePerHour: 800,
      status: "Maintenance",
      operatingHours: "06:00 - 23:00",
      bookingsToday: 0,
      revenue: 0,
      isActive: false,
    },
    {
      id: 4,
      name: "Football Ground 1",
      facility: "Green Turf Arena",
      sport: "Football",
      pricePerHour: 1000,
      status: "Active",
      operatingHours: "06:00 - 22:00",
      bookingsToday: 4,
      revenue: 4000,
      isActive: true,
    },
    {
      id: 5,
      name: "Cricket Ground 1",
      facility: "Green Turf Arena",
      sport: "Cricket",
      pricePerHour: 1200,
      status: "Active",
      operatingHours: "06:00 - 22:00",
      bookingsToday: 3,
      revenue: 3600,
      isActive: true,
    },
  ]

  const facilities = ["Elite Sports Complex", "Green Turf Arena"]
  const sports = ["Badminton", "Tennis", "Football", "Cricket"]

  const filteredCourts = courts.filter((court) => {
    const matchesSearch =
      court.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      court.facility.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFacility = facilityFilter === "all" || court.facility === facilityFilter
    const matchesSport = sportFilter === "all" || court.sport === sportFilter

    return matchesSearch && matchesFacility && matchesSport
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Maintenance":
        return "bg-yellow-100 text-yellow-800"
      case "Inactive":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const toggleCourtStatus = (courtId) => {
    console.log("Toggling court status:", courtId)
    // Handle status toggle
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Court Management</h1>
            <p className="text-gray-600 mt-2">Manage your courts, pricing, and availability</p>
          </div>
          <Button className="mt-4 md:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            <a href="/owner/courts/new">Add New Court</a>
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search courts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={facilityFilter} onValueChange={setFacilityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Facilities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Facilities</SelectItem>
                  {facilities.map((facility) => (
                    <SelectItem key={facility} value={facility}>
                      {facility}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sportFilter} onValueChange={setSportFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Sports" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sports</SelectItem>
                  {sports.map((sport) => (
                    <SelectItem key={sport} value={sport}>
                      {sport}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setFacilityFilter("all")
                  setSportFilter("all")
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Courts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourts.map((court) => (
            <Card key={court.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{court.name}</CardTitle>
                    <p className="text-sm text-gray-600 mt-1">{court.facility}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(court.status)}>{court.status}</Badge>
                    <button onClick={() => toggleCourtStatus(court.id)}>
                      {court.isActive ? (
                        <ToggleRight className="h-5 w-5 text-green-600" />
                      ) : (
                        <ToggleLeft className="h-5 w-5 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="space-y-4">
                  {/* Sport & Pricing */}
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{court.sport}</Badge>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-600">₹{court.pricePerHour}</div>
                      <div className="text-xs text-gray-500">per hour</div>
                    </div>
                  </div>

                  {/* Operating Hours */}
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{court.operatingHours}</span>
                  </div>

                  {/* Today's Stats */}
                  <div className="grid grid-cols-2 gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-lg font-bold text-gray-900">{court.bookingsToday}</div>
                      <div className="text-xs text-gray-600">Today's Bookings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">₹{court.revenue}</div>
                      <div className="text-xs text-gray-600">Today's Revenue</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Edit className="h-4 w-4 mr-2" />
                      <a href={`/owner/courts/${court.id}/edit`}>Edit</a>
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Clock className="h-4 w-4 mr-2" />
                      <a href={`/owner/courts/${court.id}/schedule`}>Schedule</a>
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourts.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No courts found</h3>
              <p className="text-gray-600 mb-4">
                {searchQuery || facilityFilter !== "all" || sportFilter !== "all"
                  ? "Try adjusting your filters to see more results."
                  : "Get started by adding your first court."}
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                <a href="/owner/courts/new">Add New Court</a>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        {filteredCourts.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{filteredCourts.length}</div>
                  <div className="text-sm text-gray-600">Total Courts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredCourts.filter((c) => c.status === "Active").length}
                  </div>
                  <div className="text-sm text-gray-600">Active Courts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {filteredCourts.reduce((sum, court) => sum + court.bookingsToday, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Today's Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ₹{filteredCourts.reduce((sum, court) => sum + court.revenue, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">Today's Revenue</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
