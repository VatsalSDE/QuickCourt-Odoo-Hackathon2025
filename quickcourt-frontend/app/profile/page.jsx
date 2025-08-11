"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { User, Phone, MapPin, Edit, Camera, Calendar, Clock, Star } from "lucide-react"

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [userInfo, setUserInfo] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    avatar: "/diverse-user-avatars.png",
  })

  const [editForm, setEditForm] = useState(userInfo)

  const handleInputChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    })
  }

  const handleSave = () => {
    setUserInfo(editForm)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditForm(userInfo)
    setIsEditing(false)
  }

  const recentBookings = [
    {
      id: 1,
      venue: "Elite Sports Complex",
      sport: "Badminton",
      court: "Court A1",
      date: "2024-01-15",
      time: "18:00 - 19:00",
      status: "Completed",
      amount: 600,
    },
    {
      id: 2,
      venue: "Green Turf Ground",
      sport: "Football",
      court: "Field 1",
      date: "2024-01-12",
      time: "16:00 - 17:00",
      status: "Completed",
      amount: 800,
    },
    {
      id: 3,
      venue: "Ace Tennis Club",
      sport: "Tennis",
      court: "Court 2",
      date: "2024-01-10",
      time: "07:00 - 08:00",
      status: "Completed",
      amount: 600,
    },
  ]

  const favoriteVenues = [
    {
      id: 1,
      name: "Elite Sports Complex",
      sport: "Badminton",
      rating: 4.8,
      visits: 12,
    },
    {
      id: 2,
      name: "Ace Tennis Club",
      sport: "Tennis",
      rating: 4.9,
      visits: 8,
    },
    {
      id: 3,
      name: "Metro Badminton Center",
      sport: "Badminton",
      rating: 4.5,
      visits: 5,
    },
  ]

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
              <a href="/profile" className="text-blue-600 font-medium">
                Profile
              </a>
              <a href="/bookings" className="text-gray-700 hover:text-blue-600">
                My Bookings
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="outline">Logout</Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="relative inline-block">
                    <Avatar className="w-24 h-24 mx-auto">
                      <AvatarImage src={userInfo.avatar || "/placeholder.svg"} alt={userInfo.name} />
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
                  <Badge className="mt-2">Active Member</Badge>
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
                      <div className="text-2xl font-bold text-blue-600">25</div>
                      <div className="text-xs text-gray-600">Total Bookings</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-green-600">3</div>
                      <div className="text-xs text-gray-600">Favorite Venues</div>
                    </div>
                  </div>
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
                <TabsTrigger value="favorites">Favorites</TabsTrigger>
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
                            Cancel
                          </Button>
                          <Button onClick={handleSave}>Save Changes</Button>
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
                          />
                        ) : (
                          <div className="mt-1 p-2 bg-gray-50 rounded-md">{userInfo.email}</div>
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
                    <div className="space-y-4">
                      {recentBookings.map((booking) => (
                        <div key={booking.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold">{booking.venue}</h3>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                                <span className="flex items-center">
                                  <User className="h-4 w-4 mr-1" />
                                  {booking.sport} - {booking.court}
                                </span>
                                <span className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {booking.date}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {booking.time}
                                </span>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant="secondary" className="mb-2">
                                {booking.status}
                              </Badge>
                              <div className="font-semibold">₹{booking.amount}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 text-center">
                      <Button variant="outline">
                        <a href="/bookings">View All Bookings</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="favorites">
                <Card>
                  <CardHeader>
                    <CardTitle>Favorite Venues</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {favoriteVenues.map((venue) => (
                        <div key={venue.id} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-semibold">{venue.name}</h3>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="ml-1 text-sm">{venue.rating}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{venue.sport}</p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500">{venue.visits} visits</span>
                            <Button size="sm" variant="outline">
                              Book Again
                            </Button>
                          </div>
                        </div>
                      ))}
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
