"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Calendar, Clock, User, MapPin, Phone, Download, Eye, X } from "lucide-react"

export default function BookingOverviewPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [facilityFilter, setFacilityFilter] = useState("all")

  const bookings = [
    {
      id: "B001",
      user: {
        name: "John Doe",
        email: "john.doe@email.com",
        phone: "+91 98765 43210",
      },
      facility: "Elite Sports Complex",
      court: "Badminton Court A1",
      sport: "Badminton",
      date: "2024-01-20",
      time: "18:00 - 19:00",
      status: "Confirmed",
      amount: 600,
      bookingDate: "2024-01-15",
      paymentStatus: "Paid",
    },
    {
      id: "B002",
      user: {
        name: "Sarah Wilson",
        email: "sarah.wilson@email.com",
        phone: "+91 98765 43211",
      },
      facility: "Elite Sports Complex",
      court: "Badminton Court A2",
      sport: "Badminton",
      date: "2024-01-20",
      time: "19:00 - 20:00",
      status: "Confirmed",
      amount: 600,
      bookingDate: "2024-01-16",
      paymentStatus: "Paid",
    },
    {
      id: "B003",
      user: {
        name: "Mike Johnson",
        email: "mike.johnson@email.com",
        phone: "+91 98765 43212",
      },
      facility: "Green Turf Arena",
      court: "Football Ground 1",
      sport: "Football",
      date: "2024-01-19",
      time: "16:00 - 17:00",
      status: "Completed",
      amount: 1000,
      bookingDate: "2024-01-14",
      paymentStatus: "Paid",
    },
    {
      id: "B004",
      user: {
        name: "Emma Davis",
        email: "emma.davis@email.com",
        phone: "+91 98765 43213",
      },
      facility: "Elite Sports Complex",
      court: "Tennis Court 1",
      sport: "Tennis",
      date: "2024-01-18",
      time: "07:00 - 08:00",
      status: "Completed",
      amount: 800,
      bookingDate: "2024-01-13",
      paymentStatus: "Paid",
    },
    {
      id: "B005",
      user: {
        name: "Alex Brown",
        email: "alex.brown@email.com",
        phone: "+91 98765 43214",
      },
      facility: "Green Turf Arena",
      court: "Cricket Ground 1",
      sport: "Cricket",
      date: "2024-01-17",
      time: "09:00 - 11:00",
      status: "Cancelled",
      amount: 1200,
      bookingDate: "2024-01-12",
      paymentStatus: "Refunded",
    },
  ]

  const facilities = ["Elite Sports Complex", "Green Turf Arena"]

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "Completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Paid":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Refunded":
        return "bg-blue-100 text-blue-800"
      case "Failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.court.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.id.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    const matchesFacility = facilityFilter === "all" || booking.facility === facilityFilter

    const matchesDate =
      dateFilter === "all" ||
      (() => {
        const bookingDate = new Date(booking.date)
        const today = new Date()

        switch (dateFilter) {
          case "today":
            return bookingDate.toDateString() === today.toDateString()
          case "upcoming":
            return bookingDate >= today
          case "past":
            return bookingDate < today
          case "this-week":
            const weekFromNow = new Date()
            weekFromNow.setDate(today.getDate() + 7)
            return bookingDate >= today && bookingDate <= weekFromNow
          default:
            return true
        }
      })()

    return matchesSearch && matchesStatus && matchesFacility && matchesDate
  })

  const totalRevenue = filteredBookings
    .filter((b) => b.paymentStatus === "Paid")
    .reduce((sum, booking) => sum + booking.amount, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Booking Overview</h1>
            <p className="text-gray-600 mt-2">Manage and track all bookings across your facilities</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button>
              <Calendar className="h-4 w-4 mr-2" />
              View Calendar
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">{filteredBookings.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Confirmed</p>
                  <p className="text-3xl font-bold text-green-600">
                    {filteredBookings.filter((b) => b.status === "Confirmed").length}
                  </p>
                </div>
                <User className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {filteredBookings.filter((b) => b.status === "Completed").length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Revenue</p>
                  <p className="text-3xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</p>
                </div>
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search bookings..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Confirmed">Confirmed</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>

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

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Dates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setStatusFilter("all")
                  setFacilityFilter("all")
                  setDateFilter("all")
                }}
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || statusFilter !== "all" || facilityFilter !== "all" || dateFilter !== "all"
                    ? "Try adjusting your filters to see more results."
                    : "No bookings have been made yet."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">Booking #{booking.id}</h3>
                            <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                            <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                              {booking.paymentStatus}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-2" />
                              <div>
                                <p className="font-medium text-gray-900">{booking.user.name}</p>
                                <p>{booking.user.email}</p>
                              </div>
                            </div>

                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 mr-2" />
                              <div>
                                <p className="font-medium text-gray-900">{booking.court}</p>
                                <p>{booking.facility}</p>
                              </div>
                            </div>

                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              <div>
                                <p className="font-medium text-gray-900">{booking.date}</p>
                                <p>{booking.time}</p>
                              </div>
                            </div>

                            <div className="flex items-center">
                              <Clock className="h-4 w-4 mr-2" />
                              <div>
                                <p className="font-medium text-gray-900">{booking.sport}</p>
                                <p>Booked on {booking.bookingDate}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col lg:items-end">
                      <div className="text-2xl font-bold text-gray-900 mb-2">₹{booking.amount}</div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <Phone className="h-4 w-4 mr-2" />
                          Contact
                        </Button>
                        {booking.status === "Confirmed" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 bg-transparent"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary */}
        {filteredBookings.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{filteredBookings.length}</div>
                  <div className="text-sm text-gray-600">Total Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredBookings.filter((b) => b.status === "Confirmed").length}
                  </div>
                  <div className="text-sm text-gray-600">Confirmed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {filteredBookings.filter((b) => b.status === "Completed").length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {filteredBookings.filter((b) => b.status === "Cancelled").length}
                  </div>
                  <div className="text-sm text-gray-600">Cancelled</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">₹{totalRevenue.toLocaleString()}</div>
                  <div className="text-sm text-gray-600">Total Revenue</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
