"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Clock, Settings, CheckCircle, XCircle, CalendarIcon, Wrench } from "lucide-react"

export default function TimeSlotsPage() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedCourt, setSelectedCourt] = useState("all")
  const [selectedFacility, setSelectedFacility] = useState("all")

  const courts = [
    { id: 1, name: "Badminton Court A1", facility: "Elite Sports Complex" },
    { id: 2, name: "Badminton Court A2", facility: "Elite Sports Complex" },
    { id: 3, name: "Tennis Court 1", facility: "Elite Sports Complex" },
    { id: 4, name: "Football Ground 1", facility: "Green Turf Arena" },
    { id: 5, name: "Cricket Ground 1", facility: "Green Turf Arena" },
  ]

  const facilities = ["Elite Sports Complex", "Green Turf Arena"]

  const timeSlots = [
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00",
  ]

  // Mock data for time slot availability
  const slotData = {
    1: {
      // Badminton Court A1
      "06:00": { status: "available", booking: null },
      "07:00": { status: "booked", booking: { user: "John Doe", id: "B001" } },
      "08:00": { status: "booked", booking: { user: "Sarah Wilson", id: "B002" } },
      "09:00": { status: "available", booking: null },
      "10:00": { status: "maintenance", booking: null },
      "11:00": { status: "maintenance", booking: null },
      "12:00": { status: "available", booking: null },
      "13:00": { status: "available", booking: null },
      "14:00": { status: "booked", booking: { user: "Mike Johnson", id: "B003" } },
      "15:00": { status: "available", booking: null },
      "16:00": { status: "available", booking: null },
      "17:00": { status: "booked", booking: { user: "Emma Davis", id: "B004" } },
      "18:00": { status: "booked", booking: { user: "Alex Brown", id: "B005" } },
      "19:00": { status: "booked", booking: { user: "Lisa Chen", id: "B006" } },
      "20:00": { status: "available", booking: null },
      "21:00": { status: "available", booking: null },
      "22:00": { status: "available", booking: null },
      "23:00": { status: "available", booking: null },
    },
  }

  const getSlotStatus = (courtId, time) => {
    return slotData[courtId]?.[time] || { status: "available", booking: null }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-100 text-green-800 border-green-200"
      case "booked":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "blocked":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "available":
        return <CheckCircle className="h-4 w-4" />
      case "booked":
        return <CalendarIcon className="h-4 w-4" />
      case "maintenance":
        return <Wrench className="h-4 w-4" />
      case "blocked":
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const toggleSlotStatus = (courtId, time, currentStatus) => {
    console.log("Toggling slot:", courtId, time, currentStatus)
    // Handle status toggle logic
  }

  const filteredCourts = courts.filter((court) => {
    const matchesFacility = selectedFacility === "all" || court.facility === selectedFacility
    const matchesCourt = selectedCourt === "all" || court.id.toString() === selectedCourt
    return matchesFacility && matchesCourt
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Time Slot Management</h1>
          <p className="text-gray-600 mt-2">Manage court availability and maintenance schedules</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Date Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            {/* Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Facility</label>
                  <Select value={selectedFacility} onValueChange={setSelectedFacility}>
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
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Court</label>
                  <Select value={selectedCourt} onValueChange={setSelectedCourt}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Courts" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Courts</SelectItem>
                      {courts.map((court) => (
                        <SelectItem key={court.id} value={court.id.toString()}>
                          {court.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Status Legend</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Available
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-blue-100 text-blue-800 border-blue-200">
                    <CalendarIcon className="h-3 w-3 mr-1" />
                    Booked
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    <Wrench className="h-3 w-3 mr-1" />
                    Maintenance
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    <XCircle className="h-3 w-3 mr-1" />
                    Blocked
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Time Slots for {selectedDate?.toLocaleDateString()}</CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Settings className="h-4 w-4 mr-2" />
                      Bulk Actions
                    </Button>
                    <Button variant="outline" size="sm">
                      <Wrench className="h-4 w-4 mr-2" />
                      Schedule Maintenance
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {filteredCourts.length === 0 ? (
                  <div className="text-center py-8">
                    <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No courts selected</h3>
                    <p className="text-gray-600">Select a facility or court to view time slots.</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredCourts.map((court) => (
                      <div key={court.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">{court.name}</h3>
                            <p className="text-sm text-gray-600">{court.facility}</p>
                          </div>
                          <Button variant="outline" size="sm">
                            <Settings className="h-4 w-4 mr-2" />
                            Configure
                          </Button>
                        </div>

                        <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2">
                          {timeSlots.map((time) => {
                            const slot = getSlotStatus(court.id, time)
                            return (
                              <button
                                key={time}
                                onClick={() => toggleSlotStatus(court.id, time, slot.status)}
                                className={`p-2 rounded-lg border text-xs font-medium transition-all hover:scale-105 ${getStatusColor(slot.status)}`}
                                disabled={slot.status === "booked"}
                              >
                                <div className="flex flex-col items-center space-y-1">
                                  {getStatusIcon(slot.status)}
                                  <span>{time}</span>
                                  {slot.booking && (
                                    <span className="text-xs truncate w-full">{slot.booking.user.split(" ")[0]}</span>
                                  )}
                                </div>
                              </button>
                            )
                          })}
                        </div>

                        {/* Court Summary */}
                        <div className="mt-4 grid grid-cols-4 gap-4 p-3 bg-gray-50 rounded-lg">
                          <div className="text-center">
                            <div className="text-sm font-bold text-green-600">
                              {timeSlots.filter((time) => getSlotStatus(court.id, time).status === "available").length}
                            </div>
                            <div className="text-xs text-gray-600">Available</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-bold text-blue-600">
                              {timeSlots.filter((time) => getSlotStatus(court.id, time).status === "booked").length}
                            </div>
                            <div className="text-xs text-gray-600">Booked</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-bold text-yellow-600">
                              {
                                timeSlots.filter((time) => getSlotStatus(court.id, time).status === "maintenance")
                                  .length
                              }
                            </div>
                            <div className="text-xs text-gray-600">Maintenance</div>
                          </div>
                          <div className="text-center">
                            <div className="text-sm font-bold text-gray-600">
                              {Math.round(
                                (timeSlots.filter((time) => getSlotStatus(court.id, time).status === "booked").length /
                                  timeSlots.length) *
                                  100,
                              )}
                              %
                            </div>
                            <div className="text-xs text-gray-600">Utilization</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
