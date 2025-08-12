"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'

export default function BookingCalendar({ bookings = [] }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)

  // Get calendar data for current month
  const getCalendarData = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const calendar = []
    const current = new Date(startDate)
    
    while (current <= lastDay || current.getDay() !== 0) {
      calendar.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return calendar
  }

  // Get bookings for a specific date
  const getBookingsForDate = (date) => {
    const dateString = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
    return bookings.filter(booking => booking.date === dateString)
  }

  // Check if date has bookings
  const hasBookings = (date) => {
    return getBookingsForDate(date).length > 0
  }

  // Get status color for booking
  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-500'
      case 'completed':
        return 'bg-blue-500'
      case 'cancelled':
        return 'bg-red-500'
      case 'pending':
        return 'bg-yellow-500'
      default:
        return 'bg-gray-500'
    }
  }

  const calendarData = getCalendarData()
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isSelected = (date) => {
    return selectedDate && date.toDateString() === selectedDate.toDateString()
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
  }

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const selectedDateBookings = selectedDate ? getBookingsForDate(selectedDate) : []

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={previousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <Button variant="outline" size="sm" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setCurrentDate(new Date())}
        >
          Today
        </Button>
      </div>

      {/* Calendar Grid */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
            
            {/* Calendar days */}
            {calendarData.map((date, index) => (
              <div
                key={index}
                className={`
                  p-2 min-h-[80px] border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors
                  ${!isCurrentMonth(date) ? 'bg-gray-50 text-gray-400' : ''}
                  ${isToday(date) ? 'bg-blue-50 border-blue-300' : ''}
                  ${isSelected(date) ? 'bg-blue-100 border-blue-400' : ''}
                `}
                onClick={() => handleDateClick(date)}
              >
                <div className="text-sm font-medium mb-1">{date.getDate()}</div>
                
                {/* Booking indicators */}
                {isCurrentMonth(date) && hasBookings(date) && (
                  <div className="space-y-1">
                    {getBookingsForDate(date).slice(0, 2).map((booking, bookingIndex) => (
                      <div
                        key={bookingIndex}
                        className={`w-full h-1 rounded-full ${getStatusColor(booking.status)}`}
                        title={`${booking.courtName || 'Court'} - ${booking.status}`}
                      />
                    ))}
                    {getBookingsForDate(date).length > 2 && (
                      <div className="text-xs text-gray-500">
                        +{getBookingsForDate(date).length - 2} more
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Date Bookings */}
      {selectedDate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              Bookings for {selectedDate.toLocaleDateString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDateBookings.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No bookings for this date</p>
            ) : (
              <div className="space-y-3">
                {selectedDateBookings.map((booking) => (
                  <div key={booking._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{booking.courtName || 'Court'}</h4>
                        <Badge className={getStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {booking.userDetails?.name || 'Unknown User'} • {booking.startTime} - {booking.endTime}
                      </p>
                      <p className="text-sm text-gray-500">
                        {booking.venueName || 'Unknown Facility'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">₹{booking.amount || 0}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
