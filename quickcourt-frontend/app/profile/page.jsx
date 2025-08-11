"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Phone, MapPin, Edit, Camera, Calendar, Clock, Star, Loader2, AlertCircle, Save, X } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [userInfo, setUserInfo] = useState(null)
  const [editForm, setEditForm] = useState({})
  const [recentBookings, setRecentBookings] = useState([])
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalSpent: 0,
    favoriteVenues: 0
  })
  
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()

  // Fetch user profile data when component mounts
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserProfile()
      fetchUserBookings()
    } else if (!isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isAuthenticated, user])

  const fetchUserProfile = async () => {
    try {
      setIsLoading(true)
      // For now, we'll use the user data from auth context
      // In a real app, you might want to fetch additional profile data from a separate endpoint
      const profileData = {
        name: user?.fullname || user?.name || 'User',
        email: user?.email || '',
        phone: user?.phone || '+91 98765 43210',
        location: user?.location || 'Mumbai, Maharashtra',
        avatar: user?.avatar || "/placeholder-user.jpg",
        role: user?.role || 'user',
        memberSince: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Recently'
      }
      
      setUserInfo(profileData)
      setEditForm(profileData)
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchUserBookings = async () => {
    try {
      const response = await fetch(`/api/bookings?userId=${user?._id || user?.id}`)
      if (response.ok) {
        const data = await response.json()
        const bookings = data.bookings || []
        
        // Get recent bookings (last 5)
        const recent = bookings.slice(0, 5)
        setRecentBookings(recent)
        
        // Calculate stats
        const totalBookings = bookings.length
        const totalSpent = bookings.reduce((sum, booking) => sum + (booking.amount || 0), 0)
        const favoriteVenues = new Set(bookings.map(b => b.venueId)).size
        
        setStats({
          totalBookings,
          totalSpent,
          favoriteVenues
        })
      }
    } catch (error) {
      console.error('Error fetching user bookings:', error)
    }
  }

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)
      
      // In a real app, you would make an API call to update the profile
      // For now, we'll just update the local state
      setUserInfo(editForm)
      setIsEditing(false)
      
      // Show success message
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      alert('Failed to update profile. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setEditForm(userInfo)
    setIsEditing(false)
  }

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout()
      router.push('/')
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center py-8">
            <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-6">Please login to view your profile.</p>
            <Button onClick={() => router.push('/auth/login')}>
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading || !userInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="text-center py-8">
            <Loader2 className="h-16 w-16 animate-spin text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Profile</h2>
            <p className="text-gray-600">Please wait while we fetch your profile...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { color: "bg-red-100 text-red-800", label: "Administrator" },
      facility_owner: { color: "bg-purple-100 text-purple-800", label: "Facility Owner" },
      user: { color: "bg-blue-100 text-blue-800", label: "Member" }
    }
    
    const config = roleConfig[role] || roleConfig.user
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-GB')
  }

  const formatTime = (startTime, endTime) => {
    if (!startTime || !endTime) return 'N/A'
    return `${startTime} - ${endTime}`
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="relative inline-block">
                    <Avatar className="w-24 h-24 mx-auto">
                      <AvatarImage src={userInfo.avatar} alt={userInfo.name} />
                      <AvatarFallback>
                        {userInfo.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <h2 className="text-xl font-bold mt-4">{userInfo.name}</h2>
                  <p className="text-gray-600">{userInfo.email}</p>
                  <div className="mt-2">
                    {getRoleBadge(userInfo.role)}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Member since {userInfo.memberSince}</p>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{userInfo.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{userInfo.location}</span>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-blue-600">{stats.totalBookings}</div>
                      <div className="text-xs text-gray-600">Total Bookings</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">{stats.favoriteVenues}</div>
                      <div className="text-xs text-gray-600">Venues Visited</div>
                    </div>
                  </div>
                  <div className="mt-4 text-center">
                    <div className="text-lg font-bold text-purple-600">₹{stats.totalSpent}</div>
                    <div className="text-xs text-gray-600">Total Spent</div>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Personal Details</TabsTrigger>
                <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
                <TabsTrigger value="favorites">Activity Summary</TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <Card>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>Personal Information</CardTitle>
                      {!isEditing ? (
                        <Button variant="outline" onClick={() => setIsEditing(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Profile
                        </Button>
                      ) : (
                        <div className="space-x-2">
                          <Button variant="outline" onClick={handleCancel}>
                            <X className="h-4 w-4 mr-2" />
                            Cancel
                          </Button>
                          <Button onClick={handleSave} disabled={isSaving}>
                            {isSaving ? (
                              <>
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Save className="h-4 w-4 mr-2" />
                                Save Changes
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        {isEditing ? (
                          <Input
                            id="name"
                            name="name"
                            value={editForm.name}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                        ) : (
                          <div className="mt-1 p-2 bg-gray-50 rounded-md">{userInfo.name}</div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        {isEditing ? (
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={editForm.email}
                            onChange={handleInputChange}
                            className="mt-1"
                            disabled
                          />
                        ) : (
                          <div className="mt-1 p-2 bg-gray-50 rounded-md">{userInfo.email}</div>
                        )}
                        {isEditing && (
                          <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        {isEditing ? (
                          <Input
                            id="phone"
                            name="phone"
                            value={editForm.phone}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                        ) : (
                          <div className="mt-1 p-2 bg-gray-50 rounded-md">{userInfo.phone}</div>
                        )}
                      </div>

                      <div>
                        <Label htmlFor="location">Location</Label>
                        {isEditing ? (
                          <Input
                            id="location"
                            name="location"
                            value={editForm.location}
                            onChange={handleInputChange}
                            className="mt-1"
                          />
                        ) : (
                          <div className="mt-1 p-2 bg-gray-50 rounded-md">{userInfo.location}</div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="bookings">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {recentBookings.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                        <p className="text-gray-600 mb-4">Start by exploring venues and making your first booking!</p>
                        <Button onClick={() => router.push('/venues')}>
                          Browse Venues
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {recentBookings.map((booking) => (
                          <div key={booking._id || booking.id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h3 className="font-semibold">
                                  {booking.venueName || `Venue ${booking.venueId}`}
                                </h3>
                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                  <span className="flex items-center">
                                    <User className="h-4 w-4 mr-1" />
                                    {booking.courtType} - {booking.courtName}
                                  </span>
                                  <span className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-1" />
                                    {formatDate(booking.date)}
                                  </span>
                                  <span className="flex items-center">
                                    <Clock className="h-4 w-4 mr-1" />
                                    {formatTime(booking.startTime, booking.endTime)}
                                  </span>
                                </div>
                                {booking.bookingReference && (
                                  <div className="mt-2 text-xs text-gray-500">
                                    <strong>Ref:</strong> {booking.bookingReference}
                                  </div>
                                )}
                              </div>
                              <div className="text-right">
                                <Badge className={getStatusColor(booking.status)}>
                                  {booking.status?.charAt(0).toUpperCase() + booking.status?.slice(1)}
                                </Badge>
                                <div className="font-semibold mt-2">₹{booking.amount}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="mt-6 text-center">
                      <Button variant="outline" onClick={() => router.push('/bookings')}>
                        View All Bookings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="favorites">
                <Card>
                  <CardHeader>
                    <CardTitle>Activity Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Booking Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Total Bookings</span>
                              <span className="font-bold text-blue-600">{stats.totalBookings}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Total Spent</span>
                              <span className="font-bold text-green-600">₹{stats.totalSpent}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Venues Visited</span>
                              <span className="font-bold text-purple-600">{stats.favoriteVenues}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Account Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Member Since</span>
                              <span className="font-bold">{userInfo.memberSince}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Account Type</span>
                              <span className="font-bold">{userInfo.role}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-gray-600">Status</span>
                              <Badge className="bg-green-100 text-green-800">Active</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
