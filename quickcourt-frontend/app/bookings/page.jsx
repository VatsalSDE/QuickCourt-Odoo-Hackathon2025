"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, MapPin, User, Filter, X, Loader2, AlertCircle } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function MyBookingsPage() {
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("all")
  const [bookings, setBookings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCancelling, setIsCancelling] = useState(false)
  const [showStatusUpdate, setShowStatusUpdate] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const router = useRouter()

  // Fetch user's bookings from database
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserBookings()
      
      // Auto-refresh every 30 seconds to keep data real-time
      const interval = setInterval(fetchUserBookings, 30000)
      
      return () => clearInterval(interval)
    } else if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, user])

  const fetchUserBookings = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/bookings?userId=${user?._id || user?.id}`)
      if (response.ok) {
        const data = await response.json()
        const bookings = data.bookings || []
        
        console.log('Fetched bookings:', bookings)
        console.log('User ID:', user?._id || user?.id)
        
        // Update local status for past bookings (for immediate UI update)
        let hasStatusUpdate = false
        const updatedBookings = bookings.map(booking => {
          try {
            if (booking.date && booking.endTime) {
              const bookingDateTime = new Date(`${booking.date}T${booking.endTime}`)
              const now = new Date()
              
              // Check if date is valid
              if (!isNaN(bookingDateTime.getTime()) && (booking.status === 'confirmed' || booking.status === 'pending') && now > bookingDateTime) {
                hasStatusUpdate = true
                return { ...booking, status: 'completed' }
              }
            }
            return booking
          } catch (error) {
            console.error('Error processing booking date:', error, booking)
            return booking
          }
        })
        
        console.log('Updated bookings:', updatedBookings)
        setBookings(updatedBookings)
        
        // Show notification if any statuses were updated
        if (hasStatusUpdate) {
          setShowStatusUpdate(true)
          // Auto-hide after 10 seconds
          setTimeout(() => setShowStatusUpdate(false), 10000)
        }
      } else {
        console.error('Failed to fetch bookings')
        setBookings([])
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setBookings([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!confirm('Are you sure you want to cancel this booking?')) {
      return
    }

    try {
      setIsCancelling(true)
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user?._id || user?.id
        })
      })

      if (response.ok) {
        // Update local state
        setBookings(prev => prev.map(booking => 
          booking._id === bookingId 
            ? { ...booking, status: 'cancelled' }
            : booking
        ))
        alert('Booking cancelled successfully!')
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Failed to cancel booking')
      }
    } catch (error) {
      console.error('Error cancelling booking:', error)
      alert('Failed to cancel booking. Please try again.')
    } finally {
      setIsCancelling(false)
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const canCancelBooking = (booking) => {
    console.log('Checking if booking can be cancelled:', {
      id: booking._id || booking.id,
      status: booking.status,
      date: booking.date,
      startTime: booking.startTime,
      currentStatus: booking.status?.toLowerCase()
    })
    
    if (booking.status?.toLowerCase() !== 'confirmed' && booking.status?.toLowerCase() !== 'pending') {
      console.log('Cannot cancel: status is not pending or confirmed')
      return false
    }
    
    // Check if booking is within cancellation window (2 hours before)
    try {
      // Handle different date formats safely
      let bookingDateTime
      if (booking.date && booking.startTime) {
        // Try to parse the date safely
        const dateStr = `${booking.date}T${booking.startTime}`
        bookingDateTime = new Date(dateStr)
        
        // Check if the date is valid
        if (isNaN(bookingDateTime.getTime())) {
          console.log('Invalid date format, cannot determine cancellation window')
          return false
        }
      } else {
        console.log('Missing date or startTime, cannot determine cancellation window')
        return false
      }
      
      const now = new Date()
      const twoHoursBefore = new Date(bookingDateTime.getTime() - (2 * 60 * 60 * 1000))
      
      const canCancel = now < twoHoursBefore
      console.log('Time check:', {
        bookingDateTime: bookingDateTime.toISOString(),
        now: now.toISOString(),
        twoHoursBefore: twoHoursBefore.toISOString(),
        canCancel
      })
      
      // TEMPORARY: Always allow cancellation for debugging
      console.log('TEMPORARY: Allowing all cancellations for debugging')
      return true
      
      // return canCancel
    } catch (error) {
      console.error('Error checking cancellation window:', error)
      // If there's an error, allow cancellation for debugging
      return true
    }
  }

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB')
  }

  const formatTime = (startTime, endTime) => {
    return `${startTime} - ${endTime}`
  }

  const filteredBookings = bookings.filter((booking) => {
    if (statusFilter !== "all" && booking.status?.toLowerCase() !== statusFilter) {
      return false
    }

    if (dateFilter !== "all") {
      try {
        if (booking.date && booking.startTime) {
          const bookingDate = new Date(`${booking.date}T${booking.startTime}`)
          
          // Check if date is valid
          if (isNaN(bookingDate.getTime())) {
            return false
          }
          
          const today = new Date()
          today.setHours(0, 0, 0, 0)

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
        return false
      } catch (error) {
        console.error('Error filtering by date:', error, booking)
        return false
      }
    }

    return true
  })

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center py-8">
            <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please login to view your bookings.</p>
            <Button onClick={() => router.push('/auth/login')}>
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center py-8">
            <Loader2 className="h-16 w-16 animate-spin text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Bookings</h2>
            <p className="text-gray-600">Please wait while we fetch your bookings...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
            <p className="text-gray-600 mt-2">Manage your court bookings and view booking history</p>
          </div>
          <Button 
            onClick={fetchUserBookings}
            disabled={isLoading}
            variant="outline"
            className="flex items-center"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Refreshing...
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 mr-2" />
                Refresh
              </>
            )}
          </Button>
        </div>

        {/* Status Update Notification */}
        {showStatusUpdate && (
          <Card className="mb-4 border-green-200 bg-green-50">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-green-800 font-medium">
                    Some bookings have been automatically updated to "Completed" status
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowStatusUpdate(false)}
                  className="text-green-600 hover:text-green-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

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
                  <SelectItem value="pending">Pending</SelectItem>
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
                <Button onClick={() => router.push('/venues')}>
                  Browse Venues
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredBookings.map((booking) => (
              <Card key={booking._id || booking.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {booking.venueName || `Venue ${booking.venueId}`}
                          </h3>
                          <div className="flex items-center mt-1">
                            <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-600">
                              {booking.courtType} - {booking.courtName}
                            </span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{formatDate(booking.date)}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>{formatTime(booking.startTime, booking.endTime)}</span>
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2" />
                          <span>Booked on {formatDate(booking.createdAt)}</span>
                        </div>
                      </div>
                      
                      {booking.bookingReference && (
                        <div className="mt-2 text-xs text-gray-500">
                          <strong>Reference:</strong> {booking.bookingReference}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 md:mt-0 md:ml-6 flex flex-col md:items-end">
                      <div className="text-lg font-bold text-gray-900 mb-2">₹{booking.amount}</div>
                      <div className="flex space-x-2">
                        {/* Debug: Always show cancel button for testing */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            console.log('Cancel button clicked for booking:', booking)
                            console.log('Can cancel result:', canCancelBooking(booking))
                          }}
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          Debug Cancel
                        </Button>
                        
                        {/* Actual cancel button */}
                        {canCancelBooking(booking) && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCancelBooking(booking._id || booking.id)}
                            disabled={isCancelling}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            {isCancelling ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Cancelling...
                              </>
                            ) : (
                              'Cancel'
                            )}
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => router.push(`/venues/${booking.venueId}`)}
                        >
                          View Venue
                        </Button>
                        {booking.status?.toLowerCase() === "completed" && (
                          <Button 
                            size="sm"
                            onClick={() => router.push(`/booking?venue=${booking.venueId}`)}
                          >
                            Book Again
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

        {/* Summary Stats */}
        {filteredBookings.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{filteredBookings.length}</div>
                  <div className="text-sm text-gray-600">Total Bookings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {filteredBookings.filter((b) => b.status?.toLowerCase() === "pending").length}
                  </div>
                  <div className="text-sm text-gray-600">Pending</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {filteredBookings.filter((b) => b.status?.toLowerCase() === "confirmed").length}
                  </div>
                  <div className="text-sm text-gray-600">Confirmed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {filteredBookings.filter((b) => b.status?.toLowerCase() === "completed").length}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    ₹{filteredBookings.reduce((sum, booking) => sum + (booking.amount || 0), 0)}
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

