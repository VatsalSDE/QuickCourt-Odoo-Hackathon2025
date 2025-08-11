"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Navigation } from "@/components/navigation"
import {
  Users,
  Building2,
  Calendar,
  MapPin,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Activity,
  BarChart3,
  PieChart,
  Settings,
} from "lucide-react"

export default function AdminDashboard() {
  const [timeRange, setTimeRange] = useState("7d")

  const stats = {
    totalUsers: 12547,
    facilityOwners: 342,
    totalBookings: 8934,
    activeCourts: 1256,
    pendingApprovals: 23,
    totalRevenue: 2847392,
    monthlyGrowth: 12.5,
    activeUsers: 8934,
  }

  const recentActivity = [
    {
      id: 1,
      type: "booking",
      message: "New booking at Elite Sports Complex",
      time: "2 minutes ago",
      severity: "info",
    },
    {
      id: 2,
      type: "approval",
      message: "Facility approval required for Green Valley Courts",
      time: "15 minutes ago",
      severity: "warning",
    },
    {
      id: 3,
      type: "user",
      message: "New facility owner registered",
      time: "1 hour ago",
      severity: "success",
    },
    {
      id: 4,
      type: "report",
      message: "User report submitted for Court Arena",
      time: "2 hours ago",
      severity: "error",
    },
    {
      id: 5,
      type: "booking",
      message: "Booking cancelled at Tennis Club Pro",
      time: "3 hours ago",
      severity: "info",
    },
  ]

  const topSports = [
    { name: "Badminton", bookings: 3245, percentage: 36.3 },
    { name: "Tennis", bookings: 2156, percentage: 24.1 },
    { name: "Football", bookings: 1834, percentage: 20.5 },
    { name: "Cricket", bookings: 1023, percentage: 11.4 },
    { name: "Basketball", bookings: 676, percentage: 7.6 },
  ]

  const bookingTrends = [
    { month: "Jan", bookings: 1200, revenue: 180000 },
    { month: "Feb", bookings: 1350, revenue: 202500 },
    { month: "Mar", bookings: 1100, revenue: 165000 },
    { month: "Apr", bookings: 1450, revenue: 217500 },
    { month: "May", bookings: 1600, revenue: 240000 },
    { month: "Jun", bookings: 1750, revenue: 262500 },
  ]

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "error":
        return "text-red-600 bg-red-50"
      case "warning":
        return "text-yellow-600 bg-yellow-50"
      case "success":
        return "text-green-600 bg-green-50"
      default:
        return "text-blue-600 bg-blue-50"
    }
  }

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case "error":
        return <AlertTriangle className="h-4 w-4" />
      case "warning":
        return <Clock className="h-4 w-4" />
      case "success":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Monitor platform performance and manage operations</p>
        </div>

        {/* Time Range Selector */}
        <div className="mb-6">
          <div className="flex space-x-2">
            {["24h", "7d", "30d", "90d"].map((range) => (
              <Button
                key={range}
                variant={timeRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setTimeRange(range)}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />+{stats.monthlyGrowth}% from last month
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Facility Owners</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.facilityOwners}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +8.2% from last month
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalBookings.toLocaleString()}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +15.3% from last month
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Courts</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.activeCourts.toLocaleString()}</p>
                  <p className="text-sm text-green-600 flex items-center mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +5.7% from last month
                  </p>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Booking Trends Chart */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Booking Activity Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookingTrends.map((data, index) => (
                  <div key={data.month} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium text-gray-600 w-8">{data.month}</span>
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${(data.bookings / 1750) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{data.bookings}</p>
                      <p className="text-xs text-gray-500">₹{data.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Most Active Sports */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2" />
                Most Active Sports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topSports.map((sport, index) => (
                  <div key={sport.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full bg-blue-${600 - index * 100}`}></div>
                      <span className="text-sm font-medium text-gray-900">{sport.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">{sport.bookings}</p>
                      <p className="text-xs text-gray-500">{sport.percentage}%</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Recent Activity
                </div>
                <Button variant="outline" size="sm" onClick={() => (window.location.href = "/admin/reports")}>
                  View All
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50">
                    <div className={`p-2 rounded-full ${getSeverityColor(activity.severity)}`}>
                      {getSeverityIcon(activity.severity)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                  onClick={() => (window.location.href = "/admin/facilities")}
                >
                  <Building2 className="h-6 w-6" />
                  <span className="text-sm">Approve Facilities</span>
                  {stats.pendingApprovals > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {stats.pendingApprovals}
                    </Badge>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                  onClick={() => (window.location.href = "/admin/users")}
                >
                  <Users className="h-6 w-6" />
                  <span className="text-sm">Manage Users</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                  onClick={() => (window.location.href = "/admin/reports")}
                >
                  <AlertTriangle className="h-6 w-6" />
                  <span className="text-sm">View Reports</span>
                </Button>

                <Button
                  variant="outline"
                  className="h-20 flex flex-col items-center justify-center space-y-2 bg-transparent"
                  onClick={() => (window.location.href = "/admin/analytics")}
                >
                  <BarChart3 className="h-6 w-6" />
                  <span className="text-sm">Analytics</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Overview */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2" />
              Revenue Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  ₹{Math.round(stats.totalRevenue / 6).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Monthly Average</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">
                  ₹{Math.round(stats.totalRevenue / stats.totalBookings)}
                </p>
                <p className="text-sm text-gray-600">Per Booking</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">+{stats.monthlyGrowth}%</p>
                <p className="text-sm text-gray-600">Growth Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
