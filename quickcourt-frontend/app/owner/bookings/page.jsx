"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Calendar, Clock, User, MapPin, Phone, Download, Eye, X, Loader2, RefreshCw } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import BookingCalendar from "@/components/BookingCalendar"

export default function BookingOverviewPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [facilityFilter, setFacilityFilter] = useState("all")
  const [viewMode, setViewMode] = useState("list") // "list" or "calendar"
  const [bookings, setBookings] = useState([])
  const [facilities, setFacilities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const { user } = useAuth()

  // Fetch bookings data
  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user, searchQuery, statusFilter, dateFilter, facilityFilter])

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams({
        userId: user?._id || user?.id,
        searchQuery,
        status: statusFilter,
        dateFilter,
        facility: facilityFilter
      })

      const response = await fetch(`/api/owner/bookings?${params}`)
      if (response.ok) {
        const data = await response.json()
        setBookings(data.bookings || [])
        setFacilities(data.facilities || [])
      } else {
        console.error('Failed to fetch bookings')
        setBookings([])
        setFacilities([])
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setBookings([])
      setFacilities([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchBookings()
    setIsRefreshing(false)
  }

  const handleExport = async () => {
    try {
      setIsExporting(true)
      
      const response = await fetch('/api/owner/bookings/export', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?._id || user?.id,
          filters: {
            searchQuery,
            status: statusFilter,
            dateFilter,
            facility: facilityFilter
          }
        })
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `bookings-export-${new Date().toISOString().split('T')[0]}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        alert('Failed to export bookings')
      }
    } catch (error) {
      console.error('Error exporting bookings:', error)
      alert('Failed to export bookings')
    } finally {
      setIsExporting(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "refunded":
        return "bg-blue-100 text-blue-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalRevenue = bookings
    .filter((b) => b.paymentStatus === "paid")
    .reduce((sum, booking) => sum + (booking.amount || 0), 0)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Bookings</h2>
          <p className="text-gray-600">Please wait while we fetch your bookings...</p>
        </div>
      </div>
    )
  }

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
            <Button 
              variant="outline" 
              onClick={handleExport}
              disabled={isExporting}
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Download className="h-4 w-4 mr-2" />
              )}
              {isExporting ? 'Exporting...' : 'Export'}
            </Button>
            <Button 
              variant={viewMode === "calendar" ? "default" : "outline"}
              onClick={() => setViewMode(viewMode === "list" ? "calendar" : "list")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              {viewMode === "list" ? "View Calendar" : "View List"}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleRefresh}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh
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
                  <p className="text-3xl font-bold text-gray-900">{bookings.length}</p>
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
                    {bookings.filter((b) => b.status === "confirmed").length}
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
                    {bookings.filter((b) => b.status === "completed").length}
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
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>

              <Select value={facilityFilter} onValueChange={setFacilityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All Facilities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Facilities</SelectItem>
                  {facilities.map((facility) => (
                    <SelectItem key={facility._id} value={facility._id}>
                      {facility.name}
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

        {/* Content */}
        {viewMode === "calendar" ? (
          <BookingCalendar bookings={bookings} />
        ) : (
          <>
            {/* Bookings List */}
            <div className="space-y-4">
              {bookings.length === 0 ? (
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
                bookings.map((booking) => (
                  <Card key={booking._id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-3 mb-2">
                                <h3 className="text-lg font-semibold text-gray-900">Booking #{booking._id.toString().slice(-6)}</h3>
                                <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                                <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                                  {booking.paymentStatus || 'pending'}
                                </Badge>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <User className="h-4 w-4 mr-2" />
                                  <div>
                                    <p className="font-medium text-gray-900">{booking.userDetails?.name || 'Unknown User'}</p>
                                    <p>{booking.userDetails?.email || 'No email'}</p>
                                  </div>
                                </div>

                                <div className="flex items-center">
                                  <MapPin className="h-4 w-4 mr-2" />
                                  <div>
                                    <p className="font-medium text-gray-900">{booking.courtName || 'Unknown Court'}</p>
                                    <p>{booking.venueName || 'Unknown Facility'}</p>
                                  </div>
                                </div>

                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  <div>
                                    <p className="font-medium text-gray-900">{booking.date}</p>
                                    <p>{booking.startTime} - {booking.endTime}</p>
                                  </div>
                                </div>

                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-2" />
                                  <div>
                                    <p className="font-medium text-gray-900">{booking.sport || 'Unknown Sport'}</p>
                                    <p>Booked on {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'Unknown'}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col lg:items-end">
                          <div className="text-2xl font-bold text-gray-900 mb-2">₹{booking.amount || 0}</div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </Button>
                            <Button variant="outline" size="sm">
                              <Phone className="h-4 w-4 mr-2" />
                              Contact
                            </Button>
                            {booking.status === "confirmed" && (
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
            {bookings.length > 0 && (
              <Card className="mt-8">
                <CardHeader>
                  <CardTitle>Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">{bookings.length}</div>
                      <div className="text-sm text-gray-600">Total Bookings</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {bookings.filter((b) => b.status === "confirmed").length}
                      </div>
                      <div className="text-sm text-gray-600">Confirmed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {bookings.filter((b) => b.status === "completed").length}
                      </div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-red-600">
                        {bookings.filter((b) => b.status === "cancelled").length}
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
          </>
        )}
      </div>
    </div>
  )
}
