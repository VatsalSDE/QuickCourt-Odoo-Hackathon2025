"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, CreditCard, CheckCircle } from "lucide-react"

export default function BookingPage() {
  const [selectedCourt, setSelectedCourt] = useState(null)
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedTimeSlot, setSelectedTimeSlot] = useState("")
  const [bookingStep, setBookingStep] = useState(1) // 1: selection, 2: confirmation, 3: payment, 4: success

  const venue = {
    name: "Elite Sports Complex",
    location: "Downtown, Mumbai",
    sport: "Badminton",
  }

  const courts = [
    { id: 1, name: "Court A1", type: "Premium", price: 600, available: true },
    { id: 2, name: "Court A2", type: "Premium", price: 600, available: true },
    { id: 3, name: "Court B1", type: "Standard", price: 500, available: false },
    { id: 4, name: "Court B2", type: "Standard", price: 500, available: true },
    { id: 5, name: "Court C1", type: "Economy", price: 400, available: true },
    { id: 6, name: "Court C2", type: "Economy", price: 400, available: true },
  ]

  const timeSlots = [
    { time: "06:00 - 07:00", available: true },
    { time: "07:00 - 08:00", available: true },
    { time: "08:00 - 09:00", available: false },
    { time: "09:00 - 10:00", available: true },
    { time: "10:00 - 11:00", available: true },
    { time: "11:00 - 12:00", available: false },
    { time: "12:00 - 13:00", available: true },
    { time: "13:00 - 14:00", available: true },
    { time: "14:00 - 15:00", available: true },
    { time: "15:00 - 16:00", available: false },
    { time: "16:00 - 17:00", available: true },
    { time: "17:00 - 18:00", available: true },
    { time: "18:00 - 19:00", available: true },
    { time: "19:00 - 20:00", available: false },
    { time: "20:00 - 21:00", available: true },
    { time: "21:00 - 22:00", available: true },
  ]

  const handleCourtSelect = (court) => {
    setSelectedCourt(court)
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
  }

  const handleTimeSlotSelect = (timeSlot) => {
    setSelectedTimeSlot(timeSlot)
  }

  const handleProceedToConfirmation = () => {
    if (selectedCourt && selectedDate && selectedTimeSlot) {
      setBookingStep(2)
    }
  }

  const handleConfirmBooking = () => {
    setBookingStep(3)
  }

  const handlePayment = () => {
    // Simulate payment processing
    setTimeout(() => {
      setBookingStep(4)
    }, 2000)
  }

  const getTotalPrice = () => {
    return selectedCourt ? selectedCourt.price : 0
  }

  const getTax = () => {
    return Math.round(getTotalPrice() * 0.18)
  }

  const getFinalTotal = () => {
    return getTotalPrice() + getTax()
  }

  // Success Step
  if (bookingStep === 4) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Your court has been successfully booked. You will receive a confirmation email shortly.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2">Booking Details</h3>
              <div className="text-sm space-y-1">
                <p>
                  <strong>Venue:</strong> {venue.name}
                </p>
                <p>
                  <strong>Court:</strong> {selectedCourt?.name}
                </p>
                <p>
                  <strong>Date:</strong> {selectedDate}
                </p>
                <p>
                  <strong>Time:</strong> {selectedTimeSlot}
                </p>
                <p>
                  <strong>Total Paid:</strong> ₹{getFinalTotal()}
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <Button className="w-full" onClick={() => (window.location.href = "/bookings")}>
                View My Bookings
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => (window.location.href = "/")}>
                Back to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Payment Step
  if (bookingStep === 3) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Payment</h1>
            <p className="text-gray-600">Complete your booking payment</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Details
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                        <input
                          type="text"
                          placeholder="MM/YY"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">CVV</label>
                        <input
                          type="text"
                          placeholder="123"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Cardholder Name</label>
                      <input
                        type="text"
                        placeholder="John Doe"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Payment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Court Fee</span>
                      <span>₹{getTotalPrice()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (18%)</span>
                      <span>₹{getTax()}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>₹{getFinalTotal()}</span>
                      </div>
                    </div>
                  </div>
                  <Button className="w-full mt-6" onClick={handlePayment}>
                    Pay Now
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Confirmation Step
  if (bookingStep === 2) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Confirm Booking</h1>
            <p className="text-gray-600">Review your booking details</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <MapPin className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <h3 className="font-semibold">{venue.name}</h3>
                        <p className="text-gray-600">{venue.location}</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Users className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <h3 className="font-semibold">Court Details</h3>
                        <p className="text-gray-600">
                          {selectedCourt?.name} - {selectedCourt?.type} ({venue.sport})
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <Calendar className="h-5 w-5 text-gray-400 mt-1" />
                      <div>
                        <h3 className="font-semibold">Date & Time</h3>
                        <p className="text-gray-600">
                          {selectedDate} at {selectedTimeSlot}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="mt-6">
                <CardHeader>
                  <CardTitle>Cancellation Policy</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-sm text-gray-600 space-y-2">
                    <li>• Free cancellation up to 2 hours before booking time</li>
                    <li>• 50% refund for cancellations between 2-24 hours</li>
                    <li>• No refund for cancellations within 2 hours or no-shows</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Price Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Court Fee (1 hour)</span>
                      <span>₹{getTotalPrice()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax (18%)</span>
                      <span>₹{getTax()}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>₹{getFinalTotal()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    <Button className="w-full" onClick={handleConfirmBooking}>
                      Proceed to Payment
                    </Button>
                    <Button variant="outline" className="w-full bg-transparent" onClick={() => setBookingStep(1)}>
                      Back to Selection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Selection Step (Step 1)
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
              <a href="/bookings" className="text-gray-700 hover:text-blue-600">
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
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <a href="/" className="hover:text-blue-600">
                Home
              </a>
            </li>
            <li>/</li>
            <li>
              <a href="/venues" className="hover:text-blue-600">
                Venues
              </a>
            </li>
            <li>/</li>
            <li>
              <a href="/venues/1" className="hover:text-blue-600">
                {venue.name}
              </a>
            </li>
            <li>/</li>
            <li className="text-gray-900">Book Court</li>
          </ol>
        </nav>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Book Your Court</h1>
          <div className="flex items-center mt-2 text-gray-600">
            <MapPin className="h-4 w-4 mr-1" />
            <span>
              {venue.name} - {venue.location}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Booking Form */}
          <div className="lg:col-span-3 space-y-6">
            {/* Date Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Select Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 14 }, (_, i) => {
                    const date = new Date()
                    date.setDate(date.getDate() + i)
                    const dateStr = date.toLocaleDateString("en-GB")
                    const dayName = date.toLocaleDateString("en-US", { weekday: "short" })

                    return (
                      <button
                        key={i}
                        onClick={() => handleDateSelect(dateStr)}
                        className={`p-3 text-center rounded-lg border transition-colors ${
                          selectedDate === dateStr
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white hover:bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="text-xs text-gray-500">{dayName}</div>
                        <div className="font-medium">{date.getDate()}</div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Court Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Select Court
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {courts.map((court) => (
                    <button
                      key={court.id}
                      onClick={() => court.available && handleCourtSelect(court)}
                      disabled={!court.available}
                      className={`p-4 rounded-lg border text-left transition-colors ${
                        selectedCourt?.id === court.id
                          ? "bg-blue-600 text-white border-blue-600"
                          : court.available
                            ? "bg-white hover:bg-gray-50 border-gray-200"
                            : "bg-gray-100 border-gray-200 cursor-not-allowed opacity-50"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold">{court.name}</h3>
                        <Badge variant={court.available ? "default" : "secondary"}>
                          {court.available ? "Available" : "Booked"}
                        </Badge>
                      </div>
                      <p
                        className={`text-sm mb-2 ${selectedCourt?.id === court.id ? "text-blue-100" : "text-gray-600"}`}
                      >
                        {court.type}
                      </p>
                      <p className={`font-bold ${selectedCourt?.id === court.id ? "text-white" : "text-blue-600"}`}>
                        ₹{court.price}/hour
                      </p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Time Slot Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Select Time Slot
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => slot.available && handleTimeSlotSelect(slot.time)}
                      disabled={!slot.available}
                      className={`p-3 rounded-lg border text-center transition-colors ${
                        selectedTimeSlot === slot.time
                          ? "bg-blue-600 text-white border-blue-600"
                          : slot.available
                            ? "bg-white hover:bg-gray-50 border-gray-200"
                            : "bg-gray-100 border-gray-200 cursor-not-allowed opacity-50"
                      }`}
                    >
                      <div className="text-sm font-medium">{slot.time}</div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-gray-900">Venue</h4>
                    <p className="text-sm text-gray-600">{venue.name}</p>
                    <p className="text-sm text-gray-600">{venue.location}</p>
                  </div>

                  {selectedCourt && (
                    <div>
                      <h4 className="font-medium text-gray-900">Court</h4>
                      <p className="text-sm text-gray-600">
                        {selectedCourt.name} - {selectedCourt.type}
                      </p>
                    </div>
                  )}

                  {selectedDate && (
                    <div>
                      <h4 className="font-medium text-gray-900">Date</h4>
                      <p className="text-sm text-gray-600">{selectedDate}</p>
                    </div>
                  )}

                  {selectedTimeSlot && (
                    <div>
                      <h4 className="font-medium text-gray-900">Time</h4>
                      <p className="text-sm text-gray-600">{selectedTimeSlot}</p>
                    </div>
                  )}

                  {selectedCourt && (
                    <div className="border-t pt-4">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">Total</span>
                        <span className="text-lg font-bold text-blue-600">₹{getTotalPrice()}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">+ taxes will be calculated at checkout</p>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full mt-6"
                  onClick={handleProceedToConfirmation}
                  disabled={!selectedCourt || !selectedDate || !selectedTimeSlot}
                >
                  Proceed to Confirmation
                </Button>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Book in advance for better availability</li>
                  <li>• Premium courts have better lighting</li>
                  <li>• Equipment rental available on-site</li>
                  <li>• Free cancellation up to 2 hours before</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
