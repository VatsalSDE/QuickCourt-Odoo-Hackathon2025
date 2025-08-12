"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart3, Building2, Users, Calendar, TrendingUp, MapPin, Loader2, RefreshCw } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { SimpleChart } from "@/components/ui/simple-chart"

export default function OwnerDashboard() {
  const [dashboardData, setDashboardData] = useState({
    totalBookings: 0,
    activeCourts: 0,
    totalEarnings: 0,
    totalFacilities: 0
  })
  const [recentBookings, setRecentBookings] = useState([])
  const [facilities, setFacilities] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [chartPeriod, setChartPeriod] = useState('weekly')
  const [bookingTrends, setBookingTrends] = useState([])
  const [earningsData, setEarningsData] = useState([])
  const [peakHoursData, setPeakHoursData] = useState([])
  
  const { user } = useAuth()
  const router = useRouter()

  // Fetch dashboard data
  useEffect(() => {
    if (user) {
      fetchDashboardData()
      fetchRecentBookings()
      fetchFacilities()
      fetchChartData()
      
      // Auto-refresh every 5 minutes
      const interval = setInterval(() => {
        fetchDashboardData()
        fetchRecentBookings()
      }, 300000)
      
      return () => clearInterval(interval)
    }
  }, [user, chartPeriod])

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`/api/owner/dashboard?userId=${user?._id || user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setDashboardData(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    }
  }

  const fetchRecentBookings = async () => {
    try {
      const response = await fetch(`/api/owner/recent-bookings?userId=${user?._id || user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setRecentBookings(data.bookings || [])
      }
    } catch (error) {
      console.error('Error fetching recent bookings:', error)
    }
  }

  const fetchFacilities = async () => {
    try {
      const response = await fetch(`/api/owner/facilities?userId=${user?._id || user?.id}`)
      if (response.ok) {
        const data = await response.json()
        setFacilities(data.facilities || [])
      }
    } catch (error) {
      console.error('Error fetching facilities:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchChartData = async () => {
    try {
      const response = await fetch(`/api/owner/chart-data?userId=${user?._id || user?.id}&period=${chartPeriod}`)
      if (response.ok) {
        const data = await response.json()
        setBookingTrends(data.bookingTrends || [])
        setEarningsData(data.earningsData || [])
        setPeakHoursData(data.peakHoursData || [])
      }
    } catch (error) {
      console.error('Error fetching chart data:', error)
    }
  }

  const handleQuickAction = (action) => {
    switch (action) {
      case 'add-facility':
        router.push('/owner/facilities/new')
        break
      case 'manage-courts':
        router.push('/owner/courts')
        break
      case 'view-bookings':
        router.push('/owner/bookings')
        break
      case 'view-analytics':
        // Scroll to charts section
        document.getElementById('analytics-section')?.scrollIntoView({ behavior: 'smooth' })
        break
      default:
        break
    }
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "bg-green-500"
      case "pending":
        return "bg-orange-500"
      case "completed":
        return "bg-blue-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  if (isLoading) {
    return (
      <ProtectedRoute allowedRoles={['facility_owner']}>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-16 w-16 animate-spin text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Dashboard</h2>
            <p className="text-gray-600">Please wait while we fetch your data...</p>
          </div>
        </div>
      </ProtectedRoute>
    )
  }

  return (
    <ProtectedRoute allowedRoles={['facility_owner']}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Facility Owner Dashboard</h1>
              <p className="text-gray-600 mt-2">Manage your sports facilities and courts</p>
            </div>
            <Button 
              onClick={() => {
                fetchDashboardData()
                fetchRecentBookings()
                fetchChartData()
              }}
              variant="outline"
              className="flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Facilities</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.totalFacilities}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">Active</span> facilities
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Courts</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.activeCourts}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">Available</span> for booking
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{dashboardData.totalBookings}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">All time</span> bookings
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(dashboardData.totalEarnings)}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">Lifetime</span> revenue
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => handleQuickAction('add-facility')}
                >
                  <Building2 className="mr-2 h-4 w-4" />
                  Add New Facility
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => handleQuickAction('manage-courts')}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Manage Courts
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => handleQuickAction('view-bookings')}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  View Bookings
                </Button>
                <Button 
                  className="w-full justify-start" 
                  variant="outline"
                  onClick={() => handleQuickAction('view-analytics')}
                >
                  <BarChart3 className="mr-2 h-4 w-4" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentBookings.length === 0 ? (
                    <p className="text-gray-500 text-sm">No recent bookings</p>
                  ) : (
                    recentBookings.slice(0, 5).map((booking, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(booking.status)}`}></div>
                          <span className="text-sm">
                            {booking.courtName || 'Court'} - {booking.startTime}
                          </span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Facility Overview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Facility Overview</CardTitle>
            </CardHeader>
            <CardContent>
              {facilities.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No facilities found. Add your first facility to get started!</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {facilities.map((facility, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2">{facility.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{facility.address || 'Location not specified'}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">{facility.courtCount || 0} Courts</span>
                        <Badge variant="outline" className="text-xs">Active</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Analytics Section */}
          <div id="analytics-section">
            {/* Chart Period Selector */}
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Analytics & Insights</h2>
              <Select value={chartPeriod} onValueChange={setChartPeriod}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Booking Trends Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Booking Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <SimpleChart
                    type="line"
                    data={{
                      labels: bookingTrends.map(item => item.label),
                      datasets: [
                        {
                          label: 'Bookings',
                          data: bookingTrends.map(item => item.value),
                          borderColor: 'rgb(59, 130, 246)',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          tension: 0.4
                        }
                      ]
                    }}
                  />
                </CardContent>
              </Card>

              {/* Earnings Summary Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Earnings Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <SimpleChart
                    type="bar"
                    data={{
                      labels: earningsData.map(item => item.label),
                      datasets: [
                        {
                          label: 'Earnings',
                          data: earningsData.map(item => item.value),
                          backgroundColor: 'rgba(34, 197, 94, 0.8)',
                          borderColor: 'rgb(34, 197, 94)',
                          borderWidth: 1
                        }
                      ]
                    }}
                    options={{
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            callback: function(value) {
                              return '₹' + value.toLocaleString()
                            }
                          }
                        }
                      }
                    }}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Peak Booking Hours Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Peak Booking Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <SimpleChart
                  type="bar"
                  data={{
                    labels: peakHoursData.map(item => item.hour),
                    datasets: [
                      {
                        label: 'Bookings',
                        data: peakHoursData.map(item => item.count),
                        backgroundColor: 'rgba(168, 85, 247, 0.8)',
                        borderColor: 'rgb(168, 85, 247)',
                        borderWidth: 1
                      }
                    ]
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
