"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, DollarSign, MapPin, Users, TrendingUp, Clock, BarChart3 } from "lucide-react"

export default function OwnerDashboard() {
  const [timeRange, setTimeRange] = useState("week")

  // Mock data
  const kpis = {
    totalBookings: 156,
    activeCourts: 8,
    earnings: 45600,
    todayBookings: 12,
  }

  const recentBookings = [
    {
      id: 1,
      user: "John Doe",
      court: "Badminton Court A1",
      time: "18:00 - 19:00",
      date: "Today",
      status: "Confirmed",
      amount: 600,
    },
    {
      id: 2,
      user: "Sarah Wilson",
      court: "Tennis Court 1",
      time: "16:00 - 17:00",
      date: "Today",
      status: "Confirmed",
      amount: 800,
    },
    {
      id: 3,
      user: "Mike Johnson",
      court: "Badminton Court B2",
      time: "19:00 - 20:00",
      date: "Tomorrow",
      status: "Confirmed",
      amount: 500,
    },
  ]

  const bookingTrends = [
    { day: "Mon", bookings: 12, earnings: 7200 },
    { day: "Tue", bookings: 15, earnings: 9000 },
    { day: "Wed", bookings: 18, earnings: 10800 },
    { day: "Thu", bookings: 22, earnings: 13200 },
    { day: "Fri", bookings: 28, earnings: 16800 },
    { day: "Sat", bookings: 35, earnings: 21000 },
    { day: "Sun", bookings: 26, earnings: 15600 },
  ]

  const peakHours = [
    { hour: "06:00", bookings: 5 },
    { hour: "07:00", bookings: 8 },
    { hour: "08:00", bookings: 12 },
    { hour: "09:00", bookings: 15 },
    { hour: "10:00", bookings: 18 },
    { hour: "11:00", bookings: 20 },
    { hour: "12:00", bookings: 16 },
    { hour: "13:00", bookings: 14 },
    { hour: "14:00", bookings: 18 },
    { hour: "15:00", bookings: 22 },
    { hour: "16:00", bookings: 28 },
    { hour: "17:00", bookings: 32 },
    { hour: "18:00", bookings: 35 },
    { hour: "19:00", bookings: 30 },
    { hour: "20:00", bookings: 25 },
    { hour: "21:00", bookings: 18 },
  ]

  const maxBookings = Math.max(...peakHours.map((h) => h.bookings))

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's what's happening at your facilities.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">{kpis.totalBookings}</p>
                  <p className="text-sm text-green-600 mt-1">+12% from last week</p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Courts</p>
                  <p className="text-3xl font-bold text-gray-900">{kpis.activeCourts}</p>
                  <p className="text-sm text-gray-500 mt-1">Across 2 facilities</p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                  <p className="text-3xl font-bold text-gray-900">₹{kpis.earnings.toLocaleString()}</p>
                  <p className="text-sm text-green-600 mt-1">+8% from last week</p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">{kpis.todayBookings}</p>
                  <p className="text-sm text-blue-600 mt-1">5 more pending</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Booking Trends Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Weekly Booking Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookingTrends.map((day, index) => (
                  <div key={day.day} className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium text-gray-600">{day.day}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm text-gray-600">{day.bookings} bookings</span>
                        <span className="text-sm font-medium">₹{day.earnings.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${(day.bookings / 35) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Peak Hours Heatmap */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Peak Booking Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-2">
                {peakHours.map((hour) => (
                  <div
                    key={hour.hour}
                    className="p-3 rounded-lg text-center transition-all duration-200 hover:scale-105"
                    style={{
                      backgroundColor: `rgba(37, 99, 235, ${hour.bookings / maxBookings})`,
                      color: hour.bookings / maxBookings > 0.5 ? "white" : "black",
                    }}
                  >
                    <div className="text-xs font-medium">{hour.hour}</div>
                    <div className="text-sm font-bold">{hour.bookings}</div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>Less busy</span>
                <span>More busy</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Bookings */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Bookings</CardTitle>
                <Button variant="outline" size="sm">
                  <a href="/owner/bookings">View All</a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{booking.user}</p>
                          <p className="text-sm text-gray-600">{booking.court}</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{booking.date}</p>
                      <p className="text-sm text-gray-600">{booking.time}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="font-bold text-gray-900">₹{booking.amount}</p>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <MapPin className="h-4 w-4 mr-2" />
                  <a href="/owner/facilities/new">Add New Facility</a>
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Calendar className="h-4 w-4 mr-2" />
                  <a href="/owner/courts/new">Add New Court</a>
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <Clock className="h-4 w-4 mr-2" />
                  <a href="/owner/time-slots">Manage Time Slots</a>
                </Button>
                <Button className="w-full justify-start bg-transparent" variant="outline">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
