"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, User, Filter, X } from "lucide-react"

export default function MyBookingsPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")

  const bookings = [
    {
      id: 1,
      venue: "Elite Sports Complex",
      sport: "Badminton",
      court: "Court A1",
      date: "2024-01-20",
      time: "18:00 - 19:00",
      status: "Confirmed",
      amount: 600,
      bookingDate: "2024-01-15",
      canCancel: true,
    },
    {
      id: 2,
      venue: "Green Turf Ground",
      sport: "Football",
      court: "Field 1",
      date: "2024-01-18",
      time: "16:00 - 17:00",
      status: "Confirmed",
      amount: 800,
      bookingDate: "2024-01-12",
      canCancel: true,
    },
    {
      id: 3,
      venue: "Ace Tennis Club",
      sport: "Tennis",
      court: "Court 2",
      date: "2024-01-15",
      time: "07:00 - 08:00",
      status: "Completed",
      amount: 600,
      bookingDate: "2024-01-10",
      canCancel: false,
    },
    {
      id: 4,
      venue: "Metro Badminton Center",
      sport: "Badminton",
      court: "Court B1",
      date: "2024-01-12",
      time: "19:00 - 20:00",
      status: "Completed",
      amount: 500,
      bookingDate: "2024-01-08",
      canCancel: false,
    },
    {
      id: 5,
      venue: "Champions Basketball Court",
      sport: "Basketball",
      court: "Court 1",
      date: "2024-01-10",
      time: "17:00 - 18:00",
      status: "Cancelled",
      amount: 700,
      bookingDate: "2024-01-05",
      canCancel: false,
    },
  ]

  const handleCancelBooking = (bookingId) => {
    // Handle booking cancellation
    console.log("Cancelling booking:", bookingId)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-800"
      case "Completed":
        return "bg-blue-100 text-blue-800"
      case "Cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const filteredBookings = bookings.filter((booking) => {
    if (statusFilter !== "all" && booking.status.toLowerCase() !== statusFilter) {
      return false
    }

    if (dateFilter !== "all") {
      const bookingDate = new Date(booking.date)
      const today = new Date()

      switch (dateFilter) {
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
    }

    return true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-blue-600">QuickCourt</h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="/" className="text-gray-700 hover:text-blue-600">
                Home
              </a>
              <a href="/venues" className="text-gray-700 hover:text-blue-600">
                Venues
              </a>
              <a href="/profile" className="text-gray-700 hover:text-blue-600">
                Profile
              </a>
              <a href="/bookings" className="text-blue-600 font-medium">
                My Bookings
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Login</Button>
              <Button>Sign Up</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
          <p className="text-gray-600 mt-2">Manage your court bookings and view booking history</p>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Filters:</span>
              </div>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Filter by date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dates</SelectItem>
                  <SelectItem value="upcoming">Upcoming</SelectItem>
                  <SelectItem value="past">Past</SelectItem>
                  <SelectItem value="this-week">This Week</SelectItem>
                </SelectContent>
              </Select>

              {(statusFilter !== "all" || dateFilter !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setStatusFilter("all")
                    setDateFilter("all")
                  }}
                  className="flex items-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear Filters
                </Button>
              )}
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
                  {statusFilter !== "all" || dateFilter !== "all"
                    ? "Try adjusting your filters or make a new booking."
                    : "You haven't made any bookings yet. Start by exploring venues!"}
                </p>
                <Button>
                  <a href="/venues">Browse Venues</a>
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{booking.venue}</h3>
                          <div className="flex items-center mt-1">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-600">
                              {booking.sport} - {booking.court}
                            </span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{booking.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{booking.time}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          <span>Booked on {booking.bookingDate}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 md:ml-6 flex flex-col md:items-end">
                      <div className="text-lg font-bold text-gray-900 mb-2">₹{booking.amount}</div>
                      <div className="flex space-x-2">
                        {booking.canCancel && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Cancel
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {booking.status === "Completed" && <Button size="sm">Book Again</Button>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary Stats */}
        {filteredBookings.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{filteredBookings.length}</div>
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
                  <div className="text-2xl font-bold text-gray-600">
                    ₹{filteredBookings.reduce((sum, booking) => sum + booking.amount, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Spent</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
